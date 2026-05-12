import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search = '' } = query;

    const skip = (page - 1) * limit;

    const filter = search
      ? {
          name: {
            $regex: search,
            $options: 'i',
          },
        }
      : {};

    const products = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.productModel.countDocuments(filter);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createProductDto: CreateProductDto) {
    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existingProduct = await this.productModel.findOne({
      slug,
    });

    if (existingProduct) {
      throw new ConflictException('Product slug already exists');
    }

    const product = await this.productModel.create({
      ...createProductDto,
      slug,
    });

    return product;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product id');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
