import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Order, OrderDocument } from './schemas/order.schema';

import { Product, ProductDocument } from '../products/schemas/product.schema';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const orderItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    let totalPrice = 0;

    for (const item of createOrderDto.items) {
      {
        const product = await this.productModel.findById(item.productId);

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        }

        const subtotal = product.price * item.quantity;

        orderItems.push({
          productId: product._id.toString(),
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });

        totalPrice += subtotal;

        product.stock -= item.quantity;

        await product.save();
      }

      const order = await this.orderModel.create({
        user: new Types.ObjectId(userId),
        items: orderItems,
        totalPrice,
      });

      return order;
    }
  }
}
