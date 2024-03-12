import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

//get all reviews
//this func wii pass an empty object to it which will instruct
//the system to find all the reviews in our database

//getAllReviews Function: Retrieves all reviews from the database.
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});

    res
      .status(200)
      .json({ success: true, message: "Successful", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

//create review func
//first we will check if the request body contains a doctor field
//if it doesn't we will assign the doctor ID from the the req parameters to the doctor field in the request body
export const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId; //this insure that review is associted with correct doctor
  if (!req.body.user) req.body.user = req.userId; //ensuring that whose user is providing the review

  //once we have necessary data we will create a new review and saveit to the database
  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();
    //after saving the review, we will update doctor's document in doctor collection
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id }, //push Id of saved review into the reviews array of the doctor's document
    }); //this way we populater review info for specfic doctor it establishes a clear relationship b/w doctor and reviews

    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
