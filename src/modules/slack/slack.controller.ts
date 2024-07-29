import { Controller, Get, HttpCode, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from '@nestjs/common';
import {
  OauthV2AccessResponse,
  UsersInfoResponse,
} from '@slack/web-api';
import { SlackApiService } from 'src/shared/services/slackapi.service';
import { stringify } from 'querystring';
import { RollbarLogger } from 'nestjs-rollbar';
import { SlackService } from './slack.service';
import { UserService } from 'src/modules/user/user.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';

@Controller('slack')
export class SlackController {
  constructor(
    private _configService: ConfigService,
    private _workspaceService: WorkspaceService,
    private _slackApiService: SlackApiService,
    private _userService: UserService,
    private _rollbarLogger: RollbarLogger,
  ) {}

  @Get('install')
  @Redirect()
  @HttpCode(302)
  async install(@Request() req, @Response() res) {
    const params = {
      client_id: encodeURI(this._configService.get('slack.clientId')),
      scope: encodeURI(this._configService.get('slack.botScopes')),
      user_scope: encodeURI(this._configService.get('slack.userScopes')),
      redirect_uri: encodeURI(
        `${this._configService.get('appUrl')}/slack/oauth_redirect`,
      ),
    };
    return {
      url: `https://slack.com/oauth/v2/authorize?${stringify(params)}`,
    };
  }

  @Get('add')
  @Redirect()
  async add(@Query() query: { code: string }) {
    const appUrl = `${this._configService.get('appUrl')}/slack/add`;
    const data = await this._slackApiService.oauthAccess(query.code, appUrl) as OauthV2AccessResponse;
    
    if (!data.ok) {
      return { url: `https://app.slack.com/client` };
    }
    
    const { access_token, authed_user, bot_user_id, team } = data;
    let workspace: any, user: any, UserInfoRes: UsersInfoResponse | null = null;
  
    try {
      workspace = await this._workspaceService.findOne({ _id: team.id });
      UserInfoRes = await this._slackApiService.usersInfo(access_token, authed_user.id) as UsersInfoResponse;
    } catch (error) {
      console.error(`SlackController: add - ${error}`);
    }
  
    if (!UserInfoRes) {
      return { url: `https://app.slack.com/client` };
    }
  
    const workspaceData = {
      _id: team.id,
      teamName: team.name,
      botAccessToken: access_token,
      botId: bot_user_id,
      installedBy: UserInfoRes.user.id,
    };
  
    const userData = {
      _id: UserInfoRes.user.id,
      name: UserInfoRes.user.real_name,
      workspace: team.id,
      isAuthedUser: true,
      isEmployee: true,
      accessToken: authed_user.access_token,
    };
  
    if (!workspace) {
      // Create workspace and user
      workspace = await this._workspaceService.create(workspaceData);
      user = await this._userService.create(userData);
      await this._sendWelcomeMessage(workspace.botAccessToken, authed_user.id, UserInfoRes.user.id, UserInfoRes.ok);
    } else {
      // Update existing workspace and user
      await this._updateWorkspaceAndUser(workspace, team.id, authed_user.id, userData, authed_user.access_token);
    }
  
    const appId = this._configService.get('slack.appId');
    return {
      url: `https://slack.com/app_redirect?app=${appId}&team=${team.id}`,
    };
  }
  
  private async _sendWelcomeMessage(botAccessToken: string, authedUserId: string, userId: string, userInfoOk: boolean) {
    if (userInfoOk) {
      try {
        await this._slackApiService.postBlockMessage(botAccessToken, authedUserId, `Hi <@${userId}>, Thanks for installing Opus Bot`);
      } catch (error) {
        await this._rollbarLogger.error(error);
      }
    }
  }
  
  private async _updateWorkspaceAndUser(workspace: any, teamId: string, authedUserId: string, userData: any, userAccessToken: string) {
    try {
      workspace = await this._workspaceService.findOne({ _id: teamId });
      let user = await this._userService.findOne({ _id: authedUserId, workspace: workspace._id });
      
      await this._workspaceService.findByIdAndUpdate(teamId, { installedBy: authedUserId });
  
      if (user) {
        await this._userService.findByIdAndUpdate(authedUserId, { accessToken: userAccessToken });
        await this._slackApiService.postBlockMessage(workspace.botAccessToken, authedUserId, `Hi <@${userData._id}>, Thanks for installing Opus Bot`);
      } else {
        await this._userService.create(userData);
      }
    } catch (error) {
      console.error(`Error updating workspace and user: ${error}`);
    }
  }
  
}
