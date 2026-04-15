import express from 'express';
import { submitForm, getAllFormSubmissions, deleteFormSubmission } from '../controller/formController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - submit form
router.post('/submit', submitForm);

// Admin routes - get and delete form submissions
router.get('/admin/all', adminProtect, getAllFormSubmissions);
router.delete('/admin/:id', adminProtect, deleteFormSubmission);

export default router;