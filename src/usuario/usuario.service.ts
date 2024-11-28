/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) { }

    async createUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.rol === 'Profesor') {
            const validGroups = ['TICSW', 'IMAGINE', 'COMIT'];
            if (!validGroups.includes(usuario.grupo)) {
                throw new BusinessLogicException('Invalid grupo de Investigación for Profesor', BusinessError.PRECONDITION_FAILED);
            }
        } else if (usuario.rol === 'Decana') {
            if (usuario.extension && usuario.extension.toString().length !== 8) {
                throw new BusinessLogicException('Invalid número de extensión for Decana', BusinessError.PRECONDITION_FAILED);
            }
        }
        return await this.usuarioRepository.save(usuario);
    }
    
    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new BusinessLogicException('The usuario with the given id was not found', BusinessError.NOT_FOUND);
        }

        return usuario;
    }

    async eliminarUsuario(id: number) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({ where: { id }, relations: ['bonos'] });
        if (!usuario) {
            throw new BusinessLogicException('The usuario with the given id was not found', BusinessError.NOT_FOUND);
        }

        if (usuario.rol === 'Decana') {
            throw new BusinessLogicException('A usuario with rol Decana cannot be deleted', BusinessError.PRECONDITION_FAILED);
        }

        if (usuario.bonos && usuario.bonos.length > 0) {
            throw new BusinessLogicException('A usuario with associated bonos cannot be deleted', BusinessError.PRECONDITION_FAILED);
        }

        await this.usuarioRepository.remove(usuario);
    }

}

