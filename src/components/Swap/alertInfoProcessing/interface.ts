/* eslint-disable @typescript-eslint/no-explicit-any */
export enum TransactionStatus {
  info = 'info',
  pending = 'loading',
  success = 'success',
  error = 'error',
}

export interface infoTexts {
  success?: string;
  error?: string;
  pending?: string;
  info?: string;
}

export interface WalletTransactionData {
  hash?: string;
  status?: TransactionStatus;
  value?: string;
  network?: any;
  infoTexts?: infoTexts | undefined;
  id: string;
}

export interface IAlertInfoProcess {
  id: string;
  size?: 'l' | 'sm';
  theme?: 'light' | 'dark';
}
