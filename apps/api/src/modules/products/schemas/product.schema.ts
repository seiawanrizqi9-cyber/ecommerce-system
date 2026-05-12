import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    default: '',
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  stock: number;

  @Prop({
    default: '',
  })
  category: string;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
