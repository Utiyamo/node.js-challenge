import pool from '../Infrastructure/Database';
import { UserEntity } from '../Domain/Entities/UserEntity';
import { UserDTO } from '../Domain/DTO/UserDTO';
import { WalletService } from './WalletService';
import bcrypt from 'bcrypt';

const _walletService = new WalletService();

export class UserService{
    async getUser(): Promise<UserDTO[]>{
        const result = await pool.query(`SELECT * FROM users`);
        return result.rows;
    }

    async getUserByEmail(email: string): Promise<UserDTO | null>{
        console.log("getUserByEmail IN");
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        console.log(result);

        if (result.rowCount === 0) {
            return null;
        }

        const user = result.rows[0];
        console.log("user " , user);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        };
    }

    async createUser(user: Partial<UserEntity>): Promise<void>{
        console.log(user);

        const { name, email, password } = user;
    
        if(!password || !email)
            throw new Error("Invalid Credentials");

        // Encrypt the user's password
        const hashedPassword = bcrypt.hash(password, 10);

        console.log(hashedPassword);

        // Insert the user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', 
            [name, email, hashedPassword]
        );

        console.log(result);

        await _walletService.createWallet({ userId: result.rows[0].id, balance: 0 });
    }
}