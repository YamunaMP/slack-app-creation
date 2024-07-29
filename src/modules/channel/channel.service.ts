import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from './channel.schema';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Channel')
    private _channelModel: Model<Channel>,
    private _rollbarLogger: RollbarLogger,
  ) {}

  async create(query): Promise<Channel> {
    try{
    return await this._channelModel.create(query);
    }catch(error){
      this._rollbarLogger.error(`ChannelService - create \n Error: ${error}`)
    }
  }

  async findOne(query): Promise<Channel> {
   try{
    return await this._channelModel.findOne(query);
   }catch(error){
    this._rollbarLogger.error(`ChannelService - findOne \n Error: ${error}`)
   }
  }

  async findByIdAndUpdate(id: string, query): Promise<Channel> {
  try{
    return await this._channelModel.findByIdAndUpdate(id, query);
  }catch(error){
    this._rollbarLogger.error(`ChannelService - findByIdAndUpdate \n Error: ${error}`)
   }
  }

  async find(query): Promise<Channel[]> {
  try{
    return await this._channelModel.find(query);
  }catch(error){
    this._rollbarLogger.error(`ChannelService - find \n Error: ${error}`)
   }
  }

  async unmapChannel(channelId: string, query): Promise<Channel> {
    try {
      return await this._channelModel.findByIdAndUpdate(channelId, query);
    } catch (err) {
      this._rollbarLogger.error(
        `UnmapChannel - ChannelService | unmapChannel: ${channelId} data: ${JSON.stringify(
          query,
        )} error:${err}`,
      );
    }
  }

  async updateMany(query, update): Promise<any> {
  try{
    return await this._channelModel.updateMany(query, update);
  }catch(error){
    this._rollbarLogger.error(`ChannelService - updateMany \n Error: ${error}`)
   }
  }
  
}
