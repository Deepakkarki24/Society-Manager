import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUsers: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deactivateUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addFamilyMember: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const removeFamilyMember: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMaintenanceStaff: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map