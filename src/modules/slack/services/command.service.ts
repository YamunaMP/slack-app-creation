import { Injectable } from '@nestjs/common';
import { SlackApiService } from 'src/shared/services/slackapi.service';

@Injectable()
export class CommandService {
  constructor(
    private _slackService: SlackApiService,
  ) {}

 
}
