import { Test, TestingModule } from '@nestjs/testing';
import { FeeRulesService } from './fee-rules.service';

describe('FeeRulesService', () => {
  let service: FeeRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeRulesService],
    }).compile();

    service = module.get<FeeRulesService>(FeeRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
