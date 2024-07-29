import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { WorkspaceService } from '../workspace/workspace.service';
import { SlackApiService } from 'src/shared/services/slackapi.service';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private _userModel: Model<User>,
    private _workspaceService: WorkspaceService,
    private _slackApiService: SlackApiService,
    private _rollbarLogger: RollbarLogger,
  ) {}

  async create(query): Promise<User> {
    return await this._userModel.create(query);
  }

  async findOne(query): Promise<User> {
    return await this._userModel.findOne(query);
  }

  async findByIdAndUpdate(id: string, query): Promise<User> {
    return await this._userModel.findByIdAndUpdate(id, query);
  }

  async find(query): Promise<User[]> {
    return await this._userModel.find(query);
  }


}
