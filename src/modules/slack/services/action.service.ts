import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RollbarLogger } from 'nestjs-rollbar';


@Injectable()
export class ActionService {
  constructor(
    private _rollbarLogger: RollbarLogger,
    private _configService: ConfigService,
  ) {}

 
}
