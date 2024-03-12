import express from "express";
import {
  getAllReviews,
  createReview,
} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "./../auth/verifyToken.js";

// Manages routes related to reviews, including retrieval and creation of reviews associated with specific doctors.
const router = express.Router({ mergeParams: true });
//to enables this access of doc id use merge params in them review router
//we will associated with specific doctor
// doctor/doctorid/reviews

router
  .route("/")
  .get(getAllReviews) //request route to retrieve all reviews.
  .post(authenticate, restrict(["patient"]), createReview); // request route to create a new review.

export default router;
