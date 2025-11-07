import { Router } from 'express';
import authRoutes from './auth.routes';
import campusRoutes from './campus.routes';
import roomRoutes from './room.routes';
import inventoryRoutes from './inventory.routes';
import reservationRoutes from './reservation.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/campus', campusRoutes);
router.use('/rooms', roomRoutes);
router.use('/inventories', inventoryRoutes);
router.use('/reservations', reservationRoutes);
router.use('/users', userRoutes);

export default router;
