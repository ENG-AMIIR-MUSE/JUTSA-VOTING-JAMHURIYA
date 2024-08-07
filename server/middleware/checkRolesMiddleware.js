import { User } from "../models/user-model.js";
import { errorHandler } from "../utility/custom-error.js";

export const checkAdminRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("user info", user);
    if (user.type === "Admin") {
      console.log("if");
      return next();
    } else {
      console.log("else");
      return next(errorHandler(404, "Only Admin is allowed"));
    }
  } catch (error) {
    next(error);
  }
};
l