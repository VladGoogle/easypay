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

  get host(): string {
    return this.config.getOrThrow<string>('db.host');
  }

  get port(): number {
    return parseInt(this.config.getOrThrow<string>('db.port'), 10);
  }

  get username(): string {
    return this.config.getOrThrow<string>('db.username');
  }

  get password(): string {
    return this.config.getOrThrow<string>('db.password');
  }

  get database(): string {
    return this.config.getOrThrow<string>('db.database');
  }

  public get logging(): boolean | undefined {
    return this.config.getOrThrow<boolean>('db.logging');
  }
}
