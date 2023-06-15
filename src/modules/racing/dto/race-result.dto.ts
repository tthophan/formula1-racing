import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RaceResult } from '../entities';

type SortType = { [k in keyof Partial<RaceResult>]: 'ASC' | 'DESC' };

export class RaceResultQueryParam {
  @IsOptional()
  @IsString()
  position: string;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  driverId: number;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  raceGrandId: number;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  teamId: number;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  points: number;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  year: number;

  @IsOptional()
  sort: SortType;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @Transform((input) => parseInt(input.value))
  @IsNumber()
  pageNumber: number;
}
