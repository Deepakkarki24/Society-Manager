import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createComplaint: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getComplaints: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getComplaint: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const assignComplaint: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateComplaintStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const reopenComplaint: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getComplaintHistory: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=complaint.controller.d.ts.map