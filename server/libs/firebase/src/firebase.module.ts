import { Module } from '@nestjs/common';

import { FirebaseConfigModule } from '@libs/config';

import { FirebaseService } from './firebase.service';

import {UsersModule} from "../../../src/users";

@Module({
  imports: [UsersModule, FirebaseConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
