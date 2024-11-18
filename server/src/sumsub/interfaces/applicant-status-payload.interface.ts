import { ApplicantStatus } from '@libs/enums/sumsub';

export interface ApplicantStatusPayload {
  applicantId: string;
  applicantStatus: ApplicantStatus;
  rejectionReason?: string;
}
