import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create category (Admin only)' })
    create(@Body() data: any) {
        return this.categoriesService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get('top-level')
    @ApiOperation({ summary: 'Get top level categories' })
    getTopLevel() {
        return this.categoriesService.getTopLevel();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get category by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update category (Admin only)' })
    update(@Param('id') id: string, @Body() data: any) {
        return this.categoriesService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete category (Admin only)' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
