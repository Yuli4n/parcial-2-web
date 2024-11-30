/* eslint-disable prettier/prettier */
import { IsInt, IsPositive, IsNumber, Min, Max, IsNotEmpty, IsString } from 'class-validator';

export class BonoDto {
  @IsInt()
  @IsPositive()
  monto: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  calificacion: number;

  @IsString()
  @IsNotEmpty()
  palabra: string;

  @IsNotEmpty()
  usuarioId: string;

  @IsNotEmpty()
  claseId: string;
}
