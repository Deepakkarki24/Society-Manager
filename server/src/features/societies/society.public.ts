import { Router } from 'express';
import { Society } from '../../models';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.get(
  '/public',
  asyncHandler(async (_req, res) => {
    const societies = await Society.find({ isActive: true })
      .select('name city state _id')
      .sort({ name: 1 });
    res.json({ success: true, data: societies });
  })
);

export default router;
