import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

//next- pass control to the next middleware
export const authenticate = async (req, res, next) => {
  //get token from auth  headers in req object
  const authToken = req.headers.authorization;

  //check token is exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    //now extract actual token value we will split the token from bearer part to obtain actual token value
    const token = authToken.split(" ")[1];

    //verify token //verify func(decoded) decodes the splitted token key is in a secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //THEN we extract payload which contains the user ID and role
    req.userId = decoded.id;
    req.role = decoded.role;

    //then must call the next function
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;
  //this helps us to identify whether user id doctor or patient
  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    // if this roles array doesn't include any of the role
    return res
      .status(401)
      .json({ success: false, message: "You aren't authorized" });
  }
  next();
};
