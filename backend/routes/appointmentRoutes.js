import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByUser,
  cancelAppointment,
  updateAppointmentMeetingLink,
  getAppointmentStats,
  submitAppointmentFeedback,
  getUpcomingAppointments,
  getBuilderEnquiries,
  getBuilderStats
} from "../controller/appointmentController.js";


const router = express.Router();

// User routes — guest booking supported (no protect), auth booking also supported
router.post("/schedule", scheduleViewing);              // Guest booking (no auth required)
router.post("/schedule/auth", protect, scheduleViewing); // Authenticated booking
router.get("/user", getAppointmentsByUser);
router.put("/cancel/:id", cancelAppointment);
router.put("/feedback/:id", submitAppointmentFeedback);
router.get("/upcoming", getUpcomingAppointments);

// Builder/Lister routes (authenticated)
router.get("/builder/enquiries", protect, getBuilderEnquiries);  // Get builder's property enquiries
router.get("/builder/stats", protect, getBuilderStats);          // Get builder dashboard stats

// Admin routes
router.get("/all", protect, getAllAppointments);  // Protected: filters by role
router.get("/stats", getAppointmentStats);
router.put("/status", updateAppointmentStatus);
router.put("/update-meeting", updateAppointmentMeetingLink);

export default router;