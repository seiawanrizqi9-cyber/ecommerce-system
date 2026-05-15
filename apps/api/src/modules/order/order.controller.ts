import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Role } from '../auth/enums/role.enum';

import { Roles } from '../../common/decorators/roles.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';

import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 🔥 CREATE ORDER
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create new order',
    description: 'Membuat order baru dari cart items user',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
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

  // 🔥 GET MY ORDERS
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get my orders',
    description: 'Mengambil semua order milik user login',
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

  // 🔥 GET ORDER DETAIL
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get order detail',
    description: 'Mengambil detail order berdasarkan ID',
  })
  @ApiParam({
    name: 'id',
    example: '6821f2d8e9a1b4f3c2a11111',
  })
  @ApiResponse({
    status: 200,
    description: 'Order detail',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
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

  // 🔥 UPDATE ORDER STATUS (ADMIN)
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update status order (Admin only)',
  })
  @ApiParam({
    name: 'id',
    example: '6821f2d8e9a1b4f3c2a11111',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin only',
  })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body()
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(
      orderId,
      updateOrderStatusDto.status,
    );
  }
}
