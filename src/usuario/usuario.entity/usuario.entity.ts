/* eslint-disable prettier/prettier */
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column({type: 'int'})
 cedula: number;
 
 @Column()
 nombre: string;
 
 @Column()
 grupo: string; 

 @Column({type: 'int'})
 extension: number;

 @Column()
 rol: string;

 @OneToOne(() => UsuarioEntity, { nullable: true })
 @JoinColumn()
 jefe: UsuarioEntity | null;
 
@OneToMany(() => BonoEntity, bono => bono.usuario)
bonos: BonoEntity[];

@OneToMany(() => ClaseEntity, clase => clase.usuario)
clases: ClaseEntity[];
}
