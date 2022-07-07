import { ApiGet, ApiPatch, ApiPost } from 'src/common/decorators/api.decorator';

import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { GameDocument } from './game.schema';
import { GameService } from './game.service';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly matchService: GameService) {}

  @ApiGet('', '모든 경기 조회')
  async findAll(): Promise<GameDocument[]> {
    const games = await this.matchService.findAll();

    return games;
  }

  @ApiGet(':id', '특정 경기 조회')
  async findOne(@Param('id') id: string): Promise<GameDocument> {
    const match = await this.matchService.findOne(id);

    return match;
  }

  @ApiPost('', '경기 생성')
  async createOne(
    @Body() createMatchDto: CreateGameDto,
  ): Promise<GameDocument> {
    const match = await this.matchService.createOne(createMatchDto);

    return match;
  }

  @ApiPatch(':id', '특정 경기 수정')
  async updateOne(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateGameDto,
  ): Promise<GameDocument> {
    const match = await this.matchService.updateOne(id, updateMatchDto);

    return match;
  }
}
