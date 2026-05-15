import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument, OrderStatus } from '@app/shared';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { OrderQueueService } from './order-queue.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    private readonly orderQueueService: OrderQueueService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Ambil semua product yang dibutuhkan
    const productIds = dto.items.map((item) => item.productId);

    const products = await this.productModel
      .find({ _id: { $in: productIds } })
      .lean(); // 🔥 biar ringan + avoid mongoose weird typing

    // 2. Hitung total harga dari DB (AMAN & REALISTIC)
    const totalPrice = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p._id.toString() === item.productId);

      if (!product) return sum;

      return sum + product.price * item.quantity;
    }, 0);

    // 3. Siapkan items dengan detail produk
    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    // 4. Simpan order ke DB
    const order = await this.orderModel.create({
      user: userId,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    // 4. Kirim ke queue (async processing)
    await this.orderQueueService.addCreateOrderJob({
      orderId: order._id.toString(),
      userId,
    });

    // 5. Response cepat ke user
    return {
      message: 'Order created successfully',
      orderId: order._id,
      status: order.status,
    };
  }

  async getMyOrders(userId: string) {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getOrderDetail(userId: string, orderId: string) {
    return this.orderModel.findOne({ _id: orderId, user: userId });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
  }
}
