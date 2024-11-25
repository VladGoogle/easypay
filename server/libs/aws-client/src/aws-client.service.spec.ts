import { Test, TestingModule } from '@nestjs/testing';
import { AwsClientService } from './aws-client.service';

describe('AwsClientService', () => {
  let service: AwsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsClientService],
    }).compile();

    service = module.get<AwsClientService>(AwsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
