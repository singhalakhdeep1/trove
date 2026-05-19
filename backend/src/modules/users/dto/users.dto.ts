import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateOfBirth?: Date;

    @ApiProperty({ enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], required: false })
    @IsOptional()
    @IsEnum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
    gender?: string;
}

export class CreateAddressDto {
    @ApiProperty({ enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' })
    @IsOptional()
    @IsEnum(['HOME', 'WORK', 'OTHER'])
    type?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    label?: string;

    @ApiProperty()
    @IsString()
    street: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    apartment?: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    state: string;

    @ApiProperty()
    @IsString()
    zipCode: string;

    @ApiProperty({ default: 'USA' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto { }
