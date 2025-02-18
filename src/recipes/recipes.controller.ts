import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Put, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import { getSynonyms, testOpenAI } from 'src/utils/openai';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PassportJwtAuthGuard)
  @Post()
  create(@Request() request, @Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create({ ...createRecipeDto, userId: request.user.userId });
  }

  // Get all recipes
  @HttpCode(HttpStatus.FOUND)
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  // Get my recipes
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(PassportJwtAuthGuard)
  @Get('me')
  getMyRecipes(@Request() request) {
    return this.recipesService.findByUserId(request.user.userId);
  }

  // Get favourites
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(PassportJwtAuthGuard)
  @Get('favorites')
  getFavorites(@Request() request) {
    return this.recipesService.getFavorites(request.user.userId);
  }

  // Search Recipes
  @HttpCode(HttpStatus.FOUND)
  @Get('search')
  searchRecipes(@Query('query') query: string) {
    return this.recipesService.searchRecipes(query);
  }

  // AI Synonyms
  @HttpCode(HttpStatus.OK)
  @Get('synonyms/:keyword')
  async aiSynonyms(@Param('keyword') keyword: string) {
    return this.recipesService.aiSynonyms(keyword);
  }

  // Get recipe by ID
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  // Update recipe by ID
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  // Delete recipe by ID
  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportJwtAuthGuard)
  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    return this.recipesService.remove(id, request.user.userId);
  }

  // Toggle add to favorites
  @HttpCode(HttpStatus.OK)
  @UseGuards(PassportJwtAuthGuard)
  @Post(':recipeId/favorite')
  addToFavorite(@Request() request, @Param('recipeId') recipeId: string) {
    return this.recipesService.toggleToFavorites(request.user.userId, recipeId);
  }

  // Get recipes by UserID
  @HttpCode(HttpStatus.FOUND)
  @Get('user/:userID')
  getByUserId(@Param('userID') userId: string) {
    return this.recipesService.findByUserId(userId);
  }
}
