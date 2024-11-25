import { Process, Processor } from '@nestjs/bull';
import { Name } from '@libs/enums/queue';
import { Job } from 'bull';
import { FirebaseService } from '@libs/firebase/firebase.service';

@Processor(Name.MessagingHub)
export class FirebaseListener {
  constructor(private readonly service: FirebaseService) {}

  @Process('firebase.send')
  async send(job: Job) {
    const { data } = job.data;

    return this.service.send(data);
  }
}
