/* eslint-disable @typescript-eslint/no-explicit-any */
export enum TransactionStatus {
  info = 'info',
  pending = 'loading',
  success = 'success',
  error = 'error',
}

export interface infoTexts {
  success: string;
  error: string;
  pending: string;
}

export class WalletTransactionData {
  hash!: string;
  status!: TransactionStatus;
  value!: string;
  network!: any;
  infoTexts!: infoTexts;
  id!: string;
}
