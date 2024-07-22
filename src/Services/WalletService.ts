import pool from '../Infrastructure/Database';
import { UserEntity } from '../Domain/Entities/UserEntity';
import { UserDTO } from '../Domain/DTO/UserDTO';
import bcrypt from 'bcrypt';
import { WalletDTO } from '../Domain/DTO/WalletDTO';
import { WalletTransactionsDTO } from '../Domain/DTO/WalletTransactionDTO';

export class WalletService{
    async createWallet(wallet: Partial<WalletDTO>): Promise<void>{
        const { userId, balance } = wallet;
    
        await pool.query(
            'INSERT INTO wallet (user_id, balance) VALUES ($1, $2)', 
            [userId, balance]
        );
    }

    async updateWallet(id: bigint, ammout: number): Promise<WalletDTO | null>{
        await pool.query(
            'UPDATE public.wallet balance=$1 WHERE id = $2',
            [ammout, id]   
        );

        return await this.getWallet(id);
    }

    async getWallet(id : bigint): Promise<WalletDTO | null>{
        const result = await pool.query(
            'SELECT * FROM wallet where id = $1',
            [id]
        );

        if(result.rowCount == 0)
            return null;

        const wallet = result.rows[0];

        return {
            id: wallet.id,
            balance: wallet.balance,
            userId: wallet.user_id
        };
    }

    async createTransaction(walletTransaction : Partial<WalletTransactionsDTO>): Promise<void>{
        const { walletId, type, amount } = walletTransaction;

        const key = Date.now.toString();
        const keyHashed = await bcrypt.hash(key, 10)
                .then(hash => {
                    return hash;
                })
                .catch(err => console.error(err.message));

        console.log("keyHashed ", keyHashed);

        await pool.query(
            'INSERT INTO public.wallet_transactions(key, wallet_id, type, amount) VALUES ($1, $2, $3, $4);',
            [keyHashed, walletId, type, amount]
        );
    }
}