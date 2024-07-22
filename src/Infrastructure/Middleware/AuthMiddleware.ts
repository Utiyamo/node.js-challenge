import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../Services/AuthService';

const authService = new AuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith(`Bearer `))
        return res.status(401).json({message: "No token provided"});

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await authService.verifyToken(token);

        const hasPermission = await authService.checkPermissions(decoded.user.id, req.originalUrl, req.method);
        if(!hasPermission)
            return res.status(403).json({ message: "Forbidden"});

        return next();
    }
    catch(e){
        return res.status(401).json({ message: 'Invalid Token '});
    }
}