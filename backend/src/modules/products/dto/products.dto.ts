import {
    IsString,
    IsNumber,
    IsOptional,
    IsEnum,
    IsArray,
    IsBoolean,
    Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    categoryId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    shortDesc?: string;

    @ApiProperty()
    @IsString()
    sku: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    comparePrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    costPrice?: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    weight?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    images?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    video?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty({ enum: ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED'], default: 'DRAFT' })
    @IsOptional()
    @IsEnum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED'])
    status?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}

export class UpdateProductDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    images?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    tags?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'OUT_OF_STOCK', 'DISCONTINUED'])
    status?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
}

export class ProductFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    minPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'OUT_OF_STOCK', 'DISCONTINUED'])
    status?: string;
}
