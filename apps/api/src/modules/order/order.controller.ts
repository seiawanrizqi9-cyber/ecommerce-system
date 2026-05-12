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

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update order status',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
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
