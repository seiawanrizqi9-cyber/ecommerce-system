import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { OrderProcessor } from './processors/order.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),

    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  providers: [OrderProcessor],
})
export class WorkerModule {}
