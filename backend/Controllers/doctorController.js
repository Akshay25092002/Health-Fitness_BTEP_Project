import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

//updateDoctor Function: Updates doctor information based on the provided doctor ID and request body data.
//It uses findByIdAndUpdate method to find and update the doctor record.

export const updateDoctor = async (req, res) => {
  // this func will tske the Doctor from req params
  const id = req.params.id;
  // we will update their information with data provided in req.body
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

//deleteDoctor Function: Deletes a doctor based on the provided doctor ID.
export const deleteDoctor = async (req, res) => {
  // this func will tske the Doctor from req params
  const id = req.params.id;
  // we will delete id
  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

//getSingleUser Function: Retrieves a single user's information based on the provided user ID.
export const getSingleDoctor = async (req, res) => {
  // this func will take the Doctor from req params
  const id = req.params.id;
  // we will Retrieves their information data based on the provided user ID.
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No Doctor found" });
  }
};

//getAllUser Function: Retrieves all users' information.
export const getAllDoctor = async (req, res) => {
  // here we don't have to provide user id or something because we retrieve all users info.
  try {
    const { query } = req.query; //this parameter is used to filter data based on specific criteria
    let doctors; //that will retrieved doctor records

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } }, // to filter doctors by searching name or specilization
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      ); //here admin manually checks and approve the doctor
    }

    res.status(200).json({
      success: true,
      message: "Users found",
      data: doctors,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

//bascially we are getting doctor data form doctorschema by excluding password with the help of DoctorId
//doctor profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    //retrieve appointements from booking for specific doctor by providing requested doctor id
    const appointments = await Booking.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
