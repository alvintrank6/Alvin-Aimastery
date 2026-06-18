import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly service: DevelopersService) {}

  @Post() create(@Body() data: any) { return this.service.create(data); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
