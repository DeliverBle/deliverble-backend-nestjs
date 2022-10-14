import { Test, TestingModule } from '@nestjs/testing';
import { ScriptService } from './script.service';

describe('ScriptService', () => {
  let service: ScriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptService],
    }).compile();

    service = module.get<ScriptService>(ScriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
