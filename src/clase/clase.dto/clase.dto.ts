/* eslint-disable prettier/prettier */

import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class ClaseDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @Length(10, 10)
    codigo: string;

    @IsInt()
    @IsNotEmpty()
    creditos: number;
}
