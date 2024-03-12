import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

//let's also populate the user information of the peroson who provided the review
//this will allow us to display user details in our front-end //
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo", // we can add user info such as name and photo to the review document
  });

  next();
});
//let's now calculate avg rating and total rating to do that we will use a usefull method called Statics in mongodb
//for calculating avg rating and total we will use mongodb aggregation pipeline
//this refers to - current review
//mongodb aggregation pipeline - like set of data processing steps for mongodb database it lets you filter group short and transform your data to get the info you need
//in aggregate function it msg reviews associated with specific doctor
reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]); //now we have to update the specific doctor document with number of ratings and avg rating
  // console.log(stats);
  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

export default mongoose.model("Review", reviewSchema);
