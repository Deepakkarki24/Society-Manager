import { AuthRequest } from '../middleware/auth';
export declare const createAuditLog: (req: AuthRequest, action: string, entity: string, entityId?: string, details?: Record<string, unknown>) => Promise<void>;
//# sourceMappingURL=audit.service.d.ts.map