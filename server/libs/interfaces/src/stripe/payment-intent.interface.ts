export interface PaymentIntent {
  customerId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}
