import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

//updateUser Function: Updates user information based on the provided user ID and request body data.
//It uses findByIdAndUpdate method to find and update the user record.
export const updateUser = async (req, res) => {
  // this func will tske the user from req params
  const id = req.params.id;
  // we will update their information with data provided in req.body
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

//deleteUser Function: Deletes a user based on the provided user ID.
export const deleteUser = async (req, res) => {
  // this func will tske the user from req params
  const id = req.params.id;
  // we will update their information with data provided in req.body
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

//getSingleUser Function: Retrieves a single user's information based on the provided user ID.
export const getSingleUser = async (req, res) => {
  // this func will tske the user from req params
  const id = req.params.id;
  // we will update their information with data provided in req.body
  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

//getAllUser Function: Retrieves all users' information.
export const getAllUser = async (req, res) => {
  // we will update their information with data provided in req.body
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

//bascially we arre getting user data form userschema by excluding password with the help of UserId
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//GetMyAppointment - function async its responsibility is retrieve appointment and doctor associated with specific usert
export const getMyAppointments = async (req, res) => {
  try {
    //Step-1 :  retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    //Step - 2 :  extract doctor ids form Appointment booking
    const doctorIds = bookings.map((el) => el.doctor.id);

    //Step - 3 : retrieve doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
