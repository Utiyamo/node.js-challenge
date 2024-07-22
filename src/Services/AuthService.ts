import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserDTO } from '../Domain/DTO/UserDTO';
import pool from '../Infrastructure/Database';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService{
    async generateToken(user: UserDTO) : Promise<string>{
        const payload = { email: user.email, id: user.id };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h'});
    }

    async verifyToken(token: string): Promise<any>{
        try{
            return jwt.verify(token, JWT_SECRET);
        }
        catch(err){
            throw new Error('Invalid Token');
        }
    }

    async checkPermissions(userId: bigint, requestUrl: string, method: string): Promise<boolean> {
        const result = await pool.query('SELECT * FROM user_access WHERE user_id = $1 AND request_url = $2', [userId, requestUrl]);
        if (result.rowCount === 0) {
          return false;
        }
    
        const access = result.rows[0];
    
        switch (method) {
          case 'GET':
            return access.permit_get;
          case 'POST':
            return access.permit_post;
          case 'PUT':
            return access.permit_put;
          case 'PATCH':
            return access.permit_patch;
          case 'DELETE':
            return access.permit_delete;
          default:
            return false;
        }
      }
}