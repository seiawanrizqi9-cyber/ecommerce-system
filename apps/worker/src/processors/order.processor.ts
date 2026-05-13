import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateOrderJobData } from '../jobs/order.job.types';

@Processor('order-queue')
export class OrderProcessor extends WorkerHost {
  async process(job: Job<CreateOrderJobData>): Promise<any> {
    console.log('🔥 Worker received job:', job.name);
    console.log('📦 Data:', job.data);

    switch (job.name) {
      case 'create-order':
        return this.handleCreateOrder(job.data);
    }
  }

  private async handleCreateOrder(data: CreateOrderJobData) {
    const { orderId, userId } = data;

    console.log('🛠 Processing order...');
    console.log('Order ID:', orderId);
    console.log('User ID:', userId);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('✅ Order processed successfully');

    return {
      success: true,
      orderId,
    };
  }
}
