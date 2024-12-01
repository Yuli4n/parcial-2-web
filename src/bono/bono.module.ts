/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoController } from './bono.controller';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity])],
  providers: [BonoService],
  exports: [BonoService],
  controllers: [BonoController]
})
export class BonoModule { }
