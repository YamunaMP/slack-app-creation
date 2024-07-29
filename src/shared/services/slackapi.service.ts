import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, WebAPICallResult, ErrorCode, Block } from '@slack/web-api';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class SlackApiService {
  private _clientId: string;
  private _clientSecret: string;
  private _webClient: WebClient;

  constructor(
    private _configService: ConfigService,
    private _rollbarLogger: RollbarLogger,
  ) {
    this._webClient = new WebClient();
    this._clientId = this._configService.get('slack.clientId');
    this._clientSecret = this._configService.get('slack.clientSecret');
  }

  async postBlockMessage(
    token: string,
    channel: string,
    text: string,
    thread_ts?: string,
    blocks?: Block[],
  ): Promise<WebAPICallResult> {
    const data = {
      token,
      channel,
      text,
      thread_ts,
      blocks,
      unfurl_links: false,
    };
    let response;
    try {
      response = await this._webClient.chat.postMessage(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - postBlockMessage`,
          JSON.stringify({ channel, text, blocks }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async addReactions(
    token: string,
    channel: string,
    name: string,
    timestamp: string,
  ): Promise<WebAPICallResult> {
    const data = {
      token,
      channel,
      name,
      timestamp,
    };
    let response;
    try {
      response = await this._webClient.reactions.add(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - addReactions`,
          JSON.stringify({ channel, name }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async archiveChannel(
    token: string,
    channel: string,
  ): Promise<WebAPICallResult> {
    const data = {
      token,
      channel,
    };
    let response;
    try {
      response = await this._webClient.conversations.archive(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - archiveChannel`,
          JSON.stringify({ channel }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async postEphemeralMessage(
    token: string,
    channel: string,
    text: string,
    user: string,
  ): Promise<WebAPICallResult> {
    const data = { token, channel, text, user };
    let response;
    try {
      response = await this._webClient.chat.postEphemeral(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - postEphemeralMessage`,
          JSON.stringify({ channel, text, user }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsCreate(
    token: string,
    name: string,
    is_private: boolean,
  ): Promise<WebAPICallResult> {
    const data = { token, name, is_private };
    let response;
    try {
      response = await this._webClient.conversations.create(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsCreate`,
          JSON.stringify({ name }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }


  async userProfileGet(token:string,user:string){
    const data = { token, user };
    let response;
    try {
      response = await this._webClient.users.profile.get(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - userProfileGet`,
          JSON.stringify({ user }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async getPermalink(
    token: string,
    channel: string,
    ts: string,
  ): Promise<WebAPICallResult> {
    const data = { token, channel, message_ts: ts };
    let response;
    try {
      response = await this._webClient.chat.getPermalink(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - getPermalink`,
          JSON.stringify({ channel, ts }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsOpen(
    token: string,
    users: string,
  ): Promise<WebAPICallResult> {
    const data = { token, users };
    let response;
    try {
      response = await this._webClient.conversations.open(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsOpen`,
          JSON.stringify({ users }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  // async ConversationsOpen(
  //   token: string,
  //   channel: string,
  //   users: string,
  // ): Promise<WebAPICallResult> {
  //   const data = { token, channel, users, };
  //   let response;
  //   try {
  //     response = await this._webClient.conversations.open(data);
  //   } catch (error) {
  //     if (error.code === ErrorCode.PlatformError) {
  //       response = error.data;
  //       this._rollbarLogger.error(
  //         `${this.constructor.name} - ConversationsInvite`,
  //         JSON.stringify({ users }),
  //         error,
  //       );
  //     } else {
  //       throw new Error(error);
  //     }
  //   }

  //   return response;
  // }

  async conversationsMembers(
    token: string,
    channel: string,
  ): Promise<WebAPICallResult> {
    const data = { token, channel };
    let response;
    try {
      response = await this._webClient.conversations.members(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsMembers`,
          JSON.stringify({ channel }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsInfo(
    token: string,
    channel: string,
  ): Promise<WebAPICallResult> {
    const data = { token, channel };
    let response;
    try {
      response = await this._webClient.conversations.info(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsInfo`,
          JSON.stringify({ channel }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async bookmarksAdd(
    token: string,
    channel_id: string,
    title: string,
    type: string,
    link: string,
    emoji? : string
  ): Promise<WebAPICallResult> {
    const data:any = { token, channel_id, title, type, link, emoji };
    let response;
    try {
      response = await this._webClient.bookmarks.add(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - BookmarksAdd`,
          JSON.stringify({ response }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async listBookmarks(
    token: string,
    channel_id: string,
  ): Promise<WebAPICallResult> {
    const data = { token, channel_id};
    let response;
    try {
      response = await this._webClient.bookmarks.list(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - listBookmarks`,
          JSON.stringify({ response }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async EditBookmarks(
    token: string,
    channel_id: string,
    bookmark_id: string,
    title:string
  ): Promise<WebAPICallResult> {
    const data = { token, channel_id,bookmark_id,title};
    let response;
    try {
      response = await this._webClient.bookmarks.edit(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - listBookmarks`,
          JSON.stringify({ response }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async usersInfo(token: string, user: string): Promise<WebAPICallResult> {
    const data = { token, user };
    let response;
    try {
      response = await this._webClient.users.info(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - usersInfo`,
          JSON.stringify({ user }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsInvite(
    token: string,
    channel: string,
    users: string,
    force?:boolean
  ): Promise<WebAPICallResult> {
    const data = { token, channel, users, force };
    let response;
    try {
      response = await this._webClient.conversations.invite(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsInvite`,
          JSON.stringify(data),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsHistory(
    token: string,
    channel: string,
    // oldest?:string,
    // latest?: string,

  ): Promise<WebAPICallResult> {
    const data = { token, channel};
    let response;
    try {
      response = await this._webClient.conversations.history(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsHistory`,
          JSON.stringify(data),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async usersList(
    token: string,
    isAdmin?: boolean,
  ) {
    const data = { token };
    let response;
    try {
      response = await this._webClient.users.list(data);
      let admins = [] 
      if(isAdmin){
        admins = response.members.filter((user) => {
          return user.is_admin
        })
        return admins
      }
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - usersList`,
          JSON.stringify(data),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response.members;
  }

  async teamInfo(token: string, team: string): Promise<WebAPICallResult> {
    const data = { token, team };
    let response;
    try {
      response = await this._webClient.team.info(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - teamInfo`,
          JSON.stringify({ team }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async oauthAccess(
    code: string,
    redirectUri: string,
  ): Promise<WebAPICallResult> {
    const data = {
      code: code,
      client_id: this._clientId,
      client_secret: this._clientSecret,
      redirect_uri: redirectUri,
    };
    let response;
    try {
      response = await this._webClient.oauth.v2.access(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - oauthAccess`,
          JSON.stringify({ clientId: this._clientId, redirectUri }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async postMessage(
    token: string,
    channel: string,
    text: string,
    blocks?: Block[],
  ): Promise<WebAPICallResult> {
    const data = {
      token,
      channel,
      text,
      blocks,
      unfurl_links: false,
    };
    let response;
    try {
      response = await this._webClient.chat.postMessage(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - postMessage`,
          JSON.stringify({ channel, text, blocks }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async userGroupMembers(token:string,usergroup:string){
    const data = { token,usergroup,include_disabled:false };

    let response;
    try {
      response = await this._webClient.usergroups.users.list(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - userGroupMembers`,
          JSON.stringify({ token, usergroup }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response.users;

  }
}
