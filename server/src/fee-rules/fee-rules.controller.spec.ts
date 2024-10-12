import { Test, TestingModule } from '@nestjs/testing';
import { FeeRulesController } from './fee-rules.controller';

describe('FeeRulesController', () => {
  let controller: FeeRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeRulesController],
    }).compile();

    controller = module.get<FeeRulesController>(FeeRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
