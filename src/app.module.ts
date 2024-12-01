/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ClaseModule } from './clase/clase.module';
import { BonoModule } from './bono/bono.module';
import { UsuarioEntity } from './usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from './clase/clase.entity/clase.entity';
import { BonoEntity } from './bono/bono.entity/bono.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsuarioModule,
    ClaseModule,
    BonoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2db',
      entities: [UsuarioEntity, ClaseEntity, BonoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
