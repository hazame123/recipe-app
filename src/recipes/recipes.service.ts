import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { User } from 'src/users/user.entity';
import { Repository, QueryBuilder, Like } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...createRecipeDto,
      ingredients: Array.isArray(createRecipeDto.ingredients)
      ? createRecipeDto.ingredients
      : JSON.parse(createRecipeDto.ingredients),
    });
    return await this.recipeRepository.save(recipe);
  }

  findAll() {
    return this.recipeRepository.find();
  }

  findOne(recipeId: string) {
    return this.recipeRepository.findOne({ where: { recipeId }});
  }

  update(recipeId: string, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates recipe #${recipeId}`;
  }

  async getFavorites(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['favoriteRecipes'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.favoriteRecipes;
  }

  async toggleToFavorites(userId: string, recipeId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['favoriteRecipes'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const recipe = await this.recipeRepository.findOne({ where: { recipeId }});

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Ensure the array exists before pushing
    if (!user.favoriteRecipes) {
      user.favoriteRecipes = [];
    }

    // Check if the recipe exists in the favorites array
    const inFavorite = user.favoriteRecipes.find(r => r.recipeId === recipeId);

    if (inFavorite) {
      user.favoriteRecipes = user.favoriteRecipes.filter(recipe => recipe.recipeId !== recipeId);
    } else {
      user.favoriteRecipes.push(recipe);
    }

    await this.userRepository.save(user);
    return user.favoriteRecipes;
  }

  async searchRecipes(query: string) {
    return this.recipeRepository
      .createQueryBuilder('recipe')
      .where('recipe.title ILIKE :query', { query: `%${query}%` }) // Case-insensitive search in PostgreSQL
      .orWhere("recipe.ingredients::text ILIKE :query", { query: `%${query}%` }) // Search within JSON field
      .getMany();
  }

  async remove(recipeId: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({ where: { recipeId }});
    if (recipe && recipe.userId === userId) return 'remove recipe 200'
    else if (recipe.userId !== userId) return 'not authorized 401'
    else return 'recipe not found 404'
  }

  async findByUserId(userId: string) {
    return this.recipeRepository.find({ where: { userId }});
  }
}
