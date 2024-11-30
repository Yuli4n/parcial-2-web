/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoDto } from './bono.dto/bono.dto';
import { BonoEntity } from './bono.entity/bono.entity';
import { plainToInstance } from 'class-transformer';


@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) { }


    @Post()
    async crearBono(@Body() bonoDto: BonoDto) {
        const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
        return await this.bonoService.crearBono(bono);
    }

    @Get('clase/:cod')
    async findBonoByCodigo(@Param('cod') cod: string) {
        return await this.bonoService.findBonoByCodigo(cod);
    }

    @Get('usuario/:userId')
    async findAllBonosByUsuario(@Param('userId') userId: number) {
        return await this.bonoService.findAllBonosByUsuario(userId);
    }

    @Delete(':bonoId')
    @HttpCode(204)
    async delete(@Param('bonoId') bonoId: number) {
        return await this.bonoService.deleteBono(bonoId);
    }



}


