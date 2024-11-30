/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>
    ) { }
    
    async crearBono(bono: BonoEntity): Promise<BonoEntity> {
        const usuario = await this.bonoRepository.findOne({
            where: { usuario: { id: bono.usuario.id } },
            relations: ['usuario'],
        });
    
        if (!usuario || usuario.usuario.rol !== 'Profesor') {
            throw new BusinessLogicException('The user must have the role of professor', BusinessError.BAD_REQUEST);
        }

        if (!bono.monto || bono.monto <= 0) {
            throw new BusinessLogicException('The amount must be a positive number', BusinessError.BAD_REQUEST);
        }
    
        return await this.bonoRepository.save(bono);
    }
    

    async findBonoByCodigo(cod: string): Promise<BonoEntity> {
        const bono: BonoEntity = await this.bonoRepository.findOne({
            where: { clase: { codigo: cod } },
            relations: ['clase'],
        });
        if (!bono) {
            throw new BusinessLogicException('The bono with the given class code was not found', BusinessError.NOT_FOUND);
        }

        return bono;
    }

    async findAllBonosByUsuario(userID: number): Promise<BonoEntity[]> {
        const bonos: BonoEntity[] = await this.bonoRepository.find({
            where: { usuario: { id: userID } },
            relations: ['usuario'],
        });
        if (bonos.length === 0) {
            throw new BusinessLogicException('The user has no bonos', BusinessError.NOT_FOUND);
        }
        return bonos;
    }

    async deleteBono(id: number) {
        const bono: BonoEntity = await this.bonoRepository.findOne({ where: { id } });
        if (!bono) {
            throw new BusinessLogicException('The bono with the given id was not found', BusinessError.NOT_FOUND);
        }

        if (bono.calificacion>4){
            throw new BusinessLogicException('The bono has a calification greater than 4', BusinessError.PRECONDITION_FAILED);
        }

        await this.bonoRepository.remove(bono);
    }

}

