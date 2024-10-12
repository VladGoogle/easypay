import { Test, TestingModule } from '@nestjs/testing';
import { FeeAccountsService } from './fee-accounts.service';

describe('FeeAccountsService', () => {
  let service: FeeAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeAccountsService],
    }).compile();

    service = module.get<FeeAccountsService>(FeeAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
