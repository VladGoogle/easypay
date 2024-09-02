import { Test, TestingModule } from '@nestjs/testing';
import { SumsubController } from './sumsub.controller';

describe('SumsubController', () => {
  let controller: SumsubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SumsubController],
    }).compile();

    controller = module.get<SumsubController>(SumsubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
