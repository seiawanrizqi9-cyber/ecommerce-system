import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Product, ProductSchema } from '../products/schemas/product.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Order, OrderSchema, QUEUES } from '@app/shared';
import { OrderQueueService } from './order-queue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),

    BullModule.registerQueue({
      name: QUEUES.ORDER,
    }),
  ],

  controllers: [OrderController],

  providers: [OrderService, JwtAuthGuard, OrderQueueService],

  exports: [OrderQueueService],
})
export class OrderModule {}
