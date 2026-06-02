import mongoose from 'mongoose';
import { AuditLog } from '../models';
import { AuthRequest } from '../middleware/auth';

export const createAuditLog = async (
  req: AuthRequest,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> => {
  if (!req.user) return;

  await AuditLog.create({
    user: req.user._id,
    action,
    entity,
    entityId: entityId ? new mongoose.Types.ObjectId(entityId) : undefined,
    society: req.user.society
      ? new mongoose.Types.ObjectId(req.user.society)
      : details?.societyId
        ? new mongoose.Types.ObjectId(details.societyId as string)
        : undefined,
    details,
    ip: req.ip,
  });
};
