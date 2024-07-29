import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Workspace extends Document {
  @Prop()
  _id: string;

  @Prop()
  teamName: string;

  @Prop()
  botId: string;

  @Prop()
  botAccessToken: string;

  @Prop({
    ref: User.name,
    default: null,
  })
  installedBy: Types.ObjectId;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
