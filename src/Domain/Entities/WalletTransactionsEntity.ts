export class WalletTransactionsEntity {
    id: bigint;
    key: string;
    walletId: bigint;
    type: string;
    amount: number;
  
    constructor(id: bigint, key: string, walletId: bigint, type: string, amount: number) {
      this.id = id;
      this.key = key;
      this.walletId = walletId;
      this.type = type;
      this.amount = amount;
    }
  }
  