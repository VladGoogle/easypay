import { Test, TestingModule } from '@nestjs/testing';
import { FeeAccountsController } from './fee-accounts.controller';

describe('FeeAccountsController', () => {
  let controller: FeeAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeAccountsController],
    }).compile();

    controller = module.get<FeeAccountsController>(FeeAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
