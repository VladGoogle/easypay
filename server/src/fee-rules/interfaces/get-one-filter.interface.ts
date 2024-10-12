import {Currency} from "@libs/enums/card";
import {TransactionType} from "@libs/enums/transaction";

export interface GetOneFilter {
    currency: Currency;
    type: TransactionType;
}