import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Channel extends Document {
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
  type: string;

}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
