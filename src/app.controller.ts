import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  Public,
  Resource,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { BaseGuard } from './guard/base.auth.guard';

export class Product {
  code: string;
}

@Controller()
@Resource(Product.name)
@UseGuards(BaseGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public')
  @Public()
  getPublic(): string {
    return 'get public';
  }

  @Get('/user')
  getUser(): string {
    return 'get user';
  }

  @Get('/admin')
  @Roles({ roles: ['admin'], mode: RoleMatchingMode.ALL })
  getAdmin(): string {
    return `get admin`;
  }

  @Get('/all')
  getAll(): string {
    return `get all`;
  }
}
