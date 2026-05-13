import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from '@app/shared';
import { ProductModule } from '../products/products.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '@app/shared';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),

    ProductModule,

    BullModule.registerQueue({
      name: QUEUES.ORDER,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
