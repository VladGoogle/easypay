import {ReviewAnswer, ReviewStatus} from "../enums";
import {ApplicantStatus} from "@libs/enums/sumsub";
import {ApplicantStatusPayload} from "../interfaces";
import {BadRequestException} from "@nestjs/common";

export function getApplicantStatus(event: any): ApplicantStatusPayload {
    const {reviewStatus} = event;

    const res = {} as ApplicantStatusPayload

    switch (reviewStatus) {
        case ReviewStatus.INIT:
            res.applicantStatus = ApplicantStatus.DOCUMENTS_REQUESTED
            break
        case ReviewStatus.PENDING:
            res.applicantStatus =  ApplicantStatus.PENDING
            break
        case ReviewStatus.COMPLETED:

            const {reviewResult} = event

            switch (reviewResult.reviewAnswer) {

                case ReviewAnswer.GREEN:
                    res.applicantStatus = ApplicantStatus.APPROVED
                    break;
                case ReviewAnswer.RED:
                    if(reviewResult.reviewRejectType === 'FINAL') {
                        res.applicantStatus = ApplicantStatus.REJECTED
                    } else {
                        res.applicantStatus = ApplicantStatus.RESUBMITTED
                    }

                    res.rejectionReason = reviewResult.clientComment
                    break;
            }

        break;

        default:
            throw new BadRequestException('Unhandled Review Status')
    }

    return res
}