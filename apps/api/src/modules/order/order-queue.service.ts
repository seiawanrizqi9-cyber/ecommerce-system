import { QUEUES } from '@app/shared';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class OrderQueueService {
  constructor(@InjectQueue(QUEUES.ORDER) private readonly orderQueue: Queue) {}

  async addCreateOrderJob(data: unknown) {
    await this.orderQueue.add('create-order', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
  }
}
