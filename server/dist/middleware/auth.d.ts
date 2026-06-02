import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        role: UserRole;
        society?: string;
        name: string;
        email: string;
    };
}
export declare const authenticate: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: UserRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const requireSociety: (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map