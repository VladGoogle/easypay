import { ReviewAnswer, ReviewStatus } from '../enums';
import { ApplicantStatus } from '@libs/enums/sumsub';
import { ApplicantStatusPayload } from '../interfaces';
import { BadRequestException } from '@nestjs/common';

import * as crypto from 'node:crypto';

export function getApplicantStatus(event: any): ApplicantStatusPayload {
  const { reviewStatus, applicantId } = event;

  const res = {
    applicantId,
  } as ApplicantStatusPayload;

  switch (reviewStatus) {
    case ReviewStatus.INIT:
      res.applicantStatus = ApplicantStatus.DOCUMENTS_REQUESTED;
      break;
    case ReviewStatus.PENDING:
      res.applicantStatus = ApplicantStatus.PENDING;
      break;
    case ReviewStatus.COMPLETED:
      const { reviewResult } = event;

      switch (reviewResult.reviewAnswer) {
        case ReviewAnswer.GREEN:
          res.applicantStatus = ApplicantStatus.APPROVED;
          break;
        case ReviewAnswer.RED:
          if (reviewResult.reviewRejectType === 'FINAL') {
            res.applicantStatus = ApplicantStatus.REJECTED;
          } else {
            res.applicantStatus = ApplicantStatus.RESUBMITTED;
          }

          res.rejectionReason = reviewResult.clientComment;
          break;
      }

      break;

    default:
      throw new BadRequestException('Unhandled Review Status');
  }

  return res;
}

export function createSignature(config, secret: string) {
  console.log('Creating a signature for the request...');

  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', secret);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}
