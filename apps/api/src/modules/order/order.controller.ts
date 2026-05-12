import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestUser } from '../../common/interfaces/request-user.interface';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create new order',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  async createOrder(
    @Req()
    req: Request & {
      user: RequestUser;
    },
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get my orders',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user orders',
  })
  async getMyOrders(
    @Req()
    req: Request & {
      user: RequestUser;
    },
  ) {
    return this.orderService.getMyOrders(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get order detail',
  })
  @ApiResponse({
    status: 200,
    description: 'Order detail',
  })
  async getOrderDetail(
    @Req()
    req: Request & {
      user: RequestUser;
    },
    @Param('id') orderId: string,
  ) {
    return this.orderService.getOrderDetail(req.user.id, orderId);
  }
}
