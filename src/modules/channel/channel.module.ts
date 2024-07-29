import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelService } from './channel.service';
import { ChannelSchema } from './channel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Channel',
        schema: ChannelSchema,
        collection: 'Channel',
      },
    ]),
  ],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
