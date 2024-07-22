import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../Services/AuthService';
import { UserService } from '../Services/UserService';
import bcrypt from 'bcrypt';

const _authService = new AuthService();
const _userService = new UserService();

export const authController = {
    async login(req: Request, res: Response, next: NextFunction){
        const { email, password } = req.body;

        const user = await _userService.getUserByEmail(email);

        if(!user)
            return res.status(401).json({ message: 'Invalid credentials'});

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid)
            return res.status(401).json({ message: 'Invalid credentials'});

        const token = await _authService.generateToken(user);
        res.json({ isSuccess: true, message: null, data: token });

        return next();
    },
    async signUpNewUser(req: Request, res: Response, next: NextFunction){
        console.warn("Hello signUpNewUser");
        const { name, email, password } = req.body;

        try {
            console.log("Consulta User");
            const existingUser = await _userService.getUserByEmail(email);

            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            console.log("create user IN")
            await _userService.createUser({ name, email, password });
            console.log("create user OUT")
            
            res.status(201).json({ message: 'User created successfully' });
            return next();
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}