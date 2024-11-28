/* eslint-disable prettier/prettier */
import { BonoEntity } from "src/bono/bono.entity/bono.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClaseEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 nombre: string;
 
 @Column()
 codigo: string;

 @Column({type: 'int'})
 creditos: number;

 @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
 usuario: UsuarioEntity;

 @OneToMany(() => BonoEntity, bono => bono.clase)
 bonos: BonoEntity[];
 
}