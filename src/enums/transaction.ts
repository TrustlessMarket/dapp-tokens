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
  CREATE_LAUNCHPAD = 'create launchpad',
  DEPOSIT_LAUNCHPAD = 'deposit launchpad pool',
  END_LAUNCHPAD = 'end launchpad',
  REDEEM_LAUNCHPAD = 'redeem launchpad',
  CANCEL_LAUNCHPAD = 'cancel launchpad',
  VOTE_RELEASE_LAUNCHPAD = 'vote release launchpad',
  VOTE_LAUNCHPAD = 'vote launchpad',
  VOTE_PROPOSAL = 'vote proposal',
}
