import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cost } from 'src/schemas/costs.schema';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';

@Injectable()
export class CostsService {
  constructor(@InjectModel(Cost.name) private costsModel: Model<Cost>) {}

  async findAll(): Promise<Cost[]> {
    return this.costsModel.find();
  }

  async createCost(createCostDto: CreateCostDto): Promise<Cost> {
    const createdCost = new this.costsModel(createCostDto);

    return createdCost.save();
  }

  async updateCost(updateCostDto: UpdateCostDto, id: string): Promise<Cost> {
    await this.costsModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...updateCostDto,
        },
      },
    );
    return this.findOne(id);
  }

  async findOne(id: string): Promise<Cost> {
    return this.costsModel.findOne({ _id: id });
  }

  async deleteCost(id: string): Promise<void> {
    await this.costsModel.deleteOne({ _id: id });
  }
}
