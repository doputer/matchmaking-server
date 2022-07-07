import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { Game, GameDocument } from './game.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private matchModel: Model<GameDocument>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<GameDocument[]> {
    const games = await this.matchModel.find();

    return games;
  }

  async findOne(id: string): Promise<GameDocument> {
    const match = await this.matchModel.findById(id);

    return match;
  }

  async createOne(createMatchDto: CreateGameDto): Promise<GameDocument> {
    let match = new Game();
    match = {
      ...match,
      ...createMatchDto,
    };

    const createdMatch = await this.matchModel.create(match);

    return createdMatch;
  }

  async updateOne(
    id: string,
    updateMatchDto: UpdateGameDto,
  ): Promise<GameDocument> {
    let match = new Game();
    match = {
      ...match,
      ...updateMatchDto,
    };

    const updatedMatch = await this.matchModel.findOneAndUpdate(
      { _id: id },
      match,
      { new: true },
    );

    /**
     * MMR 갱신
     */
    const { winner, loser } = updateMatchDto;

    const winUser = await this.userService.findOne(winner.toString());
    const loseUser = await this.userService.findOne(loser.toString());

    await this.userService.updateOne(winUser._id, {
      mmr: winUser.mmr + 30,
    });

    await this.userService.updateOne(loseUser._id, {
      mmr: loseUser.mmr - 10,
    });

    return updatedMatch;
  }
}
