import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environment from './environments/environment';
import { LoggerModule } from 'nestjs-rollbar';
import { App, ExpressReceiver } from '@slack/bolt';
import { WorkspaceService } from './modules/workspace/workspace.service';
import { SharedModule } from './shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModule } from './modules/channel/channel.module';
import { SlackController } from './modules/slack/slack.controller';
import { SlackModule } from './modules/slack/slack.module';
import { SlackService } from './modules/slack/slack.service';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accessToken: configService.get('rollbar.accessToken'),
        environment: configService.get('rollbar.environment'),
        captureUncaught: true,
        captureUnhandledRejections: true,
        ignoreDuplicateErrors: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    WorkspaceModule,
    SlackModule,
    SharedModule,
    ChannelModule,
  ],
  controllers: [AppController, SlackController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private _configService: ConfigService,
    private _workspaceService: WorkspaceService,
    private _slackService: SlackService,
  ) {}

  initSlackEvents(receiver: ExpressReceiver) {
    const boltApp = new App({
      signingSecret: this._configService.get('slack.signingSecret'),
      clientId: this._configService.get('slack.clientId'),
      clientSecret: this._configService.get('slack.clientSecret'),
      scopes: '',
      authorize: async ({ teamId, enterpriseId }) => {
        let workspace = await this._workspaceService.findOne({ _id: teamId });
        return {
          botToken: workspace.botAccessToken,
          botId: workspace.botId,
        };
      },
      receiver,
      installerOptions: {
        redirectUriPath: '/slack/add',
      },
    });
    this._slackService.initSlackEvent(boltApp);
    this._slackService.initSlackCommand(boltApp);
    this._slackService.initSlackAction(boltApp);
    this._slackService.initSlackViewSubmission(boltApp);
    this._slackService.initSlackInteraction(boltApp);
  }
}
{}
