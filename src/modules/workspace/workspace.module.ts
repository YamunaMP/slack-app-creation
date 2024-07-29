import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceSchema } from './workspace.schema';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Workspace',
        schema: WorkspaceSchema,
        collection: 'Workspace',
      },
    ]),
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
