import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CostsDocument = HydratedDocument<Cost>;

@Schema()
export class Cost {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop({ required: true, default: '1' })
  userId: string;
}

export const CostsSchema = SchemaFactory.createForClass(Cost);
