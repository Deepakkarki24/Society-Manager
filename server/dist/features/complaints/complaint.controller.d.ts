import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const createComplaint: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getComplaints: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getComplaint: (req: AuthRequest, res: Response) => Promise<void>;
export declare const assignComplaint: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateComplaintStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const reopenComplaint: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getComplaintHistory: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=complaint.controller.d.ts.map