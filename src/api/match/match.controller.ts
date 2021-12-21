import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPost } from 'src/common/decorators/api.decorator';

import { MatchService } from './match.service';

@ApiTags('matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @ApiPost('', '매치 대기열 등록')
  async createOne() {
    await this.matchService.addJob();

    return;
  }
}
