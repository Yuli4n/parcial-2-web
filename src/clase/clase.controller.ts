/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseDto } from './clase.dto/clase.dto';
import { plainToInstance } from 'class-transformer';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

    @Post()
    async crearClase(@Body() claseDto: ClaseDto): Promise<ClaseEntity> {
        const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
        return await this.claseService.crearClase(clase);
    }

    @Get(':id')
    async findClaseById(@Param('id') id: number): Promise<ClaseEntity> {
        return await this.claseService.findClaseById(id);
    }
}
