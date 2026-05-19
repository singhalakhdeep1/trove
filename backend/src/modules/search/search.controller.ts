import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Get all search' })
  findAll(@Query() filters: any) {
    return this.searchService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get search by id' })
  findOne(@Param('id') id: string) {
    return this.searchService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create search' })
  create(@Body() dto: any) {
    return this.searchService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update search' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.searchService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete search' })
  remove(@Param('id') id: string) {
    return this.searchService.remove(id);
  }

  // Feature-specific endpoints

  @Post('search-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchProducts' })
  async searchProducts(@Body() dto: any) {
    return this.searchService.searchProducts(dto);
  }

  @Post('search-services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchServices' })
  async searchServices(@Body() dto: any) {
    return this.searchService.searchServices(dto);
  }

  @Post('search-restaurants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchRestaurants' })
  async searchRestaurants(@Body() dto: any) {
    return this.searchService.searchRestaurants(dto);
  }

  @Post('search-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchUsers' })
  async searchUsers(@Body() dto: any) {
    return this.searchService.searchUsers(dto);
  }

  @Post('advanced-search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'advancedSearch' })
  async advancedSearch(@Body() dto: any) {
    return this.searchService.advancedSearch(dto);
  }

  @Post('faceted-search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'facetedSearch' })
  async facetedSearch(@Body() dto: any) {
    return this.searchService.facetedSearch(dto);
  }

  @Post('autocomplete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'autocomplete' })
  async autocomplete(@Body() dto: any) {
    return this.searchService.autocomplete(dto);
  }

  @Post('search-suggestions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchSuggestions' })
  async searchSuggestions(@Body() dto: any) {
    return this.searchService.searchSuggestions(dto);
  }

  @Post('recent-searches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'recentSearches' })
  async recentSearches(@Body() dto: any) {
    return this.searchService.recentSearches(dto);
  }

  @Post('popular-searches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'popularSearches' })
  async popularSearches(@Body() dto: any) {
    return this.searchService.popularSearches(dto);
  }
}
