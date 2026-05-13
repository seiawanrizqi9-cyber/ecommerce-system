import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument, OrderStatus } from '@app/shared';

interface CreateOrderJobData {
  orderId: string;
  userId: string;
}

@Processor('order-queue')
export class OrderProcessor extends WorkerHost {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {
    super();
  }

  async process(job: Job<CreateOrderJobData>) {
    try {
      switch (job.name) {
        case 'create-order':
          return await this.handleCreateOrder(job.data);
      }
    } catch (error) {
      console.error('❌ Worker error:', error);

      // ❗ mark order as FAILED kalau error di level global
      await this.orderModel.findByIdAndUpdate(job.data.orderId, {
        status: OrderStatus.FAILED,
      });

      throw error; // penting supaya BullMQ tetap tahu job gagal
    }
  }

  private async handleCreateOrder(data: CreateOrderJobData) {
    const { orderId } = data;

    console.log('🟡 Worker started order:', orderId);

    try {
      // 🔄 STEP 1: set PROCESSING
      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.PROCESSING,
      });

      console.log('🟠 Order set to PROCESSING');

      // simulate heavy process
      await new Promise((r) => setTimeout(r, 1500));

      // 🧠 contoh potensi error (misalnya validasi internal)
      const randomFail = Math.random() < 0.1;
      if (randomFail) {
        throw new Error('Simulasi failure di worker');
      }

      // ✅ STEP 2: COMPLETED
      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.COMPLETED,
      });

      console.log('🟢 Order COMPLETED');

      return {
        success: true,
        orderId,
      };
    } catch (error) {
      console.error('❌ Failed processing order:', orderId, error);

      // ❗ update status FAILED
      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.FAILED,
      });

      throw error; // tetap lempar ke BullMQ
    }
  }
}
