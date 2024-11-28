/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ) { }

    async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
        if (clase.codigo.length !== 10) {
            throw new BusinessLogicException('The codigo must be exactly 10 characters long', BusinessError.PRECONDITION_FAILED);
        }
        return await this.claseRepository.save(clase);
    }

    async findClaseById(id: number): Promise<ClaseEntity> {
        const clase: ClaseEntity = await this.claseRepository.findOne({ where: { id } });
        if (!clase) {
            throw new BusinessLogicException('The clase with the given id was not found', BusinessError.NOT_FOUND);
        }

        return clase;
    }


}

