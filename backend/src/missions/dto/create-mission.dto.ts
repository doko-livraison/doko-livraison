import {
  IsEnum, IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsArray,
} from 'class-validator';
import { DeliveryType } from '../mission.entity';

export class CreateMissionDto {
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @IsString()
  pickupAddress: string;

  @IsString()
  deliveryAddress: string;

  @IsOptional()
  @IsNumber()
  estimatedWeightKg?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  photoUrls?: string[];

  @IsOptional()
  @IsBoolean()
  needsHandling?: boolean;

  @IsOptional()
  @IsBoolean()
  hasStairs?: boolean;

  @IsOptional()
  @IsBoolean()
  noElevator?: boolean;

  @IsOptional()
  @IsBoolean()
  fragile?: boolean;

  @IsOptional()
  @IsNumber()
  floorNumber?: number;

  @IsOptional()
  @IsBoolean()
  multipleHelpers?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
