import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { NewsController } from './news.controller';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;
  let repository: NewsRepository;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService, 
        { 
          provide: getRepositoryToken(NewsRepository),
          useValue: {
            // save: jest.fn().mockResolvedValue(mockNews),
            // find: jest.fn().mockRejectedValue([mockNews]),
          }
        }
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
