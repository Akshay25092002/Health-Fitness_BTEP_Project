import express from "express";
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
} from "../Controllers/doctorController.js";
//Manages routes related to doctor entities, including CRUD operations and nested routes for doctor reviews.
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js ";
//reviewRouter curr don't have access to doc's id, to enables this access of doc id
const router = express.Router();

//config nested route //doc reviews are nester under specific doctor's id
router.use("/:doctorId/reviews", reviewRouter);

//dynamic route for getting a Doctor by ID
router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile); // that will give doctor data with appointments data in the profile

export default router;
