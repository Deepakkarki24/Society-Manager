import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deactivateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addFamilyMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removeFamilyMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMaintenanceStaff: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map