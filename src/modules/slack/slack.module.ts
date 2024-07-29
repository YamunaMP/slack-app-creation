import {  forwardRef, Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackController } from './slack.controller';
import { EventService } from './services/event.service';
import { ActionService } from './services/action.service';
import { ViewSubmissionService } from './services/view-submission.service';
import { CommandService } from './services/command.service';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { UserModule } from 'src/modules/user/user.module';
import { ChannelModule } from '../channel/channel.module';



@Module({
  imports: [
    WorkspaceModule,
    forwardRef(() => UserModule),
    ChannelModule,
  ],
  providers: [
    SlackService,
    EventService,
    ActionService,
    ViewSubmissionService,
    CommandService,
  ],
  controllers: [SlackController],
  exports: [
    SlackService,
    EventService,
    ActionService,
    ViewSubmissionService,
    CommandService,
  ],
})
export class SlackModule {

}
