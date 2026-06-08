import express from 'express';
import {
  createStockAlert,
  checkAndNotifyBackInStock,
  getProductStockAlerts,
  testWhatsApp,
} from '../controllers/stockAlertController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createStockAlert);
router.post('/check-and-notify', protect, admin, checkAndNotifyBackInStock);
router.get('/product/:productId', protect, admin, getProductStockAlerts);
router.post('/test-whatsapp', testWhatsApp);

export default router;