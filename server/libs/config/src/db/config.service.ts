import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type DbType =
  | 'mysql'
  | 'mariadb'
  | 'mongodb'
  | 'postgres'
  | 'sqlite'
  | 'better-sqlite3';

@Injectable()
export class DbConfigService {
  constructor(private readonly config: ConfigService) {}

  public get type(): DbType {
    return this.config.getOrThrow<DbType>('db.type');
  }

  public get url(): string {
    return this.config.getOrThrow<string>('db.url');
  }

  public get logging(): boolean | undefined {
    return this.config.get<boolean>('db.logging');
  }
}
