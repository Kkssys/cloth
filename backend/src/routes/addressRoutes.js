import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getAddresses)
  .post(addAddress);

router.route('/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.put('/:addressId/default', setDefaultAddress);

export default router;