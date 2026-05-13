import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '@app/shared';
import { OrderStatus } from '@app/shared';

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
    switch (job.name) {
      case 'create-order':
        return this.handleCreateOrder(job.data);
    }
  }

  private async handleCreateOrder(data: CreateOrderJobData) {
    const { orderId } = data;

    console.log('🟡 Worker started order:', orderId);

    // 🔄 step 1: processing
    await this.orderModel.findByIdAndUpdate(orderId, {
      status: OrderStatus.PROCESSING,
    });

    console.log('🟠 Order set to PROCESSING');

    // simulate heavy work
    await new Promise((r) => setTimeout(r, 1500));

    // ✅ step 2: completed
    await this.orderModel.findByIdAndUpdate(orderId, {
      status: OrderStatus.COMPLETED,
    });

    console.log('🟢 Order COMPLETED');

    return {
      success: true,
      orderId,
    };
  }
}
