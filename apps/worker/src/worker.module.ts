import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderProcessor } from './processors/order.processor';
import { Order, OrderSchema } from '@app/shared/schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 🔥 Guard ENV biar tidak undefined
    MongooseModule.forRoot(
      process.env.MONGO_URI ??
        (() => {
          throw new Error('MONGO_URI is not defined');
        })(),
    ),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    // Redis connection
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),

    // Queue name HARDCODE biar aman
    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  providers: [OrderProcessor],
})
export class WorkerModule {}
