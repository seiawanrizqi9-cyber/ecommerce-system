import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔥 CREATE PRODUCT
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new product',
    description: 'Endpoint untuk membuat produk baru (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Produk berhasil dibuat',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin only',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // 🔥 GET ALL PRODUCTS
  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Mengambil semua produk dengan pagination & search',
  })
  @ApiResponse({
    status: 200,
    description: 'List produk berhasil diambil',
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  // 🔥 GET PRODUCT DETAIL
  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
    description: 'Mengambil detail produk berdasarkan ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail produk berhasil diambil',
  })
  @ApiResponse({
    status: 404,
    description: 'Produk tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
