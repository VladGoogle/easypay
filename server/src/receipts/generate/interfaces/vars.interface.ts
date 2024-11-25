import { SenderVars } from './sender-vars.interface';
import { ReceiverVars } from './receiver-vars.interface';
import { TransactionDetailsVars } from './transaction-details-vars.interface';

export interface ReceiptVars {
  receiptId: string;
  receiptDate: string;
  logoPath: string;
  sender: SenderVars;
  receiver: ReceiverVars;
  transactionDetails: TransactionDetailsVars;
}
