import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Channel } from '../channel/channel.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({
    ref: 'Workspace',
    index: true,
  })
  workspace: Types.ObjectId;

  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  accessToken: string;

  @Prop({ default: false })
  isAuthedUser: boolean;

  @Prop()
  botConversationId: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
