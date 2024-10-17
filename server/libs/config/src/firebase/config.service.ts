import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfigService {
  constructor(private readonly config: ConfigService) {}

  public get projectId(): string {
    return this.config.getOrThrow<string>('firebase.projectId');
  }

  public get privateKey(): string {
    return this.config.getOrThrow<string>('firebase.privateKey');
  }

  public get clientEmail(): string {
    return this.config.getOrThrow<string>('firebase.clientEmail');
  }
}
