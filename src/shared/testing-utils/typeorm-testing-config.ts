/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [UsuarioEntity, ClaseEntity, BonoEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UsuarioEntity, ClaseEntity, BonoEntity]),
  ];
  
