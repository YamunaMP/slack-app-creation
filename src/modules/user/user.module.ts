import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { SharedModule } from 'src/shared/shared.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SlackModule } from '../slack/slack.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'User',
      },
    ]),
    WorkspaceModule,
    forwardRef(() => SlackModule),
    SharedModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
