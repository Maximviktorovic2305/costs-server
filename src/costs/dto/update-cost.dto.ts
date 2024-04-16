import { PartialType } from '@nestjs/mapped-types';
import { CreateCostDto } from './create-cost.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCostDto extends PartialType(CreateCostDto) {
    @IsNotEmpty()
    readonly text: string   

    @IsNotEmpty()
    readonly price: number  
    
    @IsNotEmpty()
    readonly date: Date
}
