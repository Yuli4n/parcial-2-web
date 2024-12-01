/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from './usuario.dto/usuario.dto';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    async crearUsuario(@Body() usuarioDto: UsuarioDto): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.crearUsuario(usuario);
    }

    @Get(':id')
    async findUsuarioById(@Param('id') id: number): Promise<UsuarioEntity> {
        return await this.usuarioService.findUsuarioById(id);
    }

    @Delete(':id')
    async eliminarUsuario(@Param('id') id: number): Promise<void> {
        await this.usuarioService.eliminarUsuario(id);
    }
}
