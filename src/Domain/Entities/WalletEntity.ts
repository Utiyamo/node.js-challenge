export class WalletEntity {
    id: bigint;
    userId: bigint;
    balance: number;
  
    constructor(id: bigint, userId: bigint, balance: number) {
      this.id = id;
      this.userId = userId;
      this.balance = balance;
    }
  }
  