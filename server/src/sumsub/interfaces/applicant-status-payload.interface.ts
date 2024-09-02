import {ApplicantStatus} from "@libs/enums/sumsub";

export interface ApplicantStatusPayload {
    applicantStatus: ApplicantStatus
    rejectionReason?: string
}