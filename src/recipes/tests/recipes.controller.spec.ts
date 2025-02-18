import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from '../recipes.controller';
import { RecipesService } from '../recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            search: jest.fn(),
            getById: jest.fn(),
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

});
