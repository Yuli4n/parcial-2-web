/* eslint-disable prettier/prettier */

import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsEnum } from 'class-validator';

export class UsuarioDto {
    @IsInt()
    @IsPositive()
    cedula: number;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    grupo: string; 

    @IsInt()
    @IsPositive()
    @IsOptional() 
    extension?: number;

    @IsEnum(['Profesor', 'Decana'])
    rol: string;

    @IsInt()
    @IsOptional()
    jefeId?: number;
}
