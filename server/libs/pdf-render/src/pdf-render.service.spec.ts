import { Test, TestingModule } from '@nestjs/testing';
import { PdfRenderService } from './pdf-render.service';

describe('PdfRenderService', () => {
  let service: PdfRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfRenderService],
    }).compile();

    service = module.get<PdfRenderService>(PdfRenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
