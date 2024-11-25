import { Module } from '@nestjs/common';

import { FirebaseConfigModule } from '@libs/config';

import { FirebaseService } from './firebase.service';

import { UsersModule } from '../../../src/users';
import { FirebaseListener } from '@libs/firebase/firebase.listener';

@Module({
  imports: [UsersModule, FirebaseConfigModule],
  providers: [FirebaseService, FirebaseListener],
  exports: [FirebaseService],
})
export class FirebaseModule {}
