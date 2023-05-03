export enum TransactionStatus {
  PENDING = 'processing',
  CONFIRMED = 'confirmed',
  RESUME = 'pending',
}

export enum TransactionEventType {
  CREATE = 'create',
  ADD_POOL = 'add pool',
  TRANSFER = 'transfer',
  MINT = 'mint',
  NONE = 'none',
}
