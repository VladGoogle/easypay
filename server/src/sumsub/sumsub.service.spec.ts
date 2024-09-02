import { Test, TestingModule } from '@nestjs/testing';
import { SumsubService } from './sumsub.service';

describe('SumsubService', () => {
  let service: SumsubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SumsubService],
    }).compile();

    service = module.get<SumsubService>(SumsubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
