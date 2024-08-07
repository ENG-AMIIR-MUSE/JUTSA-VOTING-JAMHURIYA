import { User } from "../models/user-model.js";
import { errorHandler } from "../utility/custom-error.js";
import jwt from "jsonwebtoken";
// Function to create a new user
export async function createUser(req, res, next) {
  const { username, email, password, type,unHashed } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return next(errorHandler(400, "All Fields Are Required"));
  }

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ username });
    console.log(existingUser);
    if (existingUser) {
      return next(errorHandler(400, "Email Already Exist"));
    }

    // Create the new user
    const newUser = new User({
      username,
      email,
      password,
      type,
      isVoted: false,
      unHashed
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    console.log("login user", req.body);

    const { username, password } = req.body;
    if (!username || !password)
      return next(errorHandler(400, "all Fields Are Required"));
    // console.log('password',password)
    const validUser = await User.findOne({ username }).select("+password");
    //  console.log(validUser);
    if (!validUser) return next(errorHandler(400, "User Not Found"));
    const isPasswordMatch = await validUser.comparePassword(password);
    console.log("mathed .....", isPasswordMatch);
    if (!isPasswordMatch)
      return next(errorHandler(400, "Password Is In Correct"));
    
    console.log(validUser);
    const expiresIn = 7 * 24 * 60 * 60;
    const token = jwt.sign(
      { id: validUser._id, type: validUser.type },
      process.env.SECRET_KEY,
      { expiresIn }
    );

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: expiresIn * 1000,
      })
      .status(200)
      .json(validUser);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('accessToken')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};


// delte user

export const deleteUser = async (req, res, next) => {
  try {
    console.log(req.params.id)

    const finduser = await User.findByIdAndDelete(req.params.id);
    if (!finduser) return next(errorHandler(400, "Cannot Delete User"));
    return res.status(200).json("User Deleted Success");
  } catch (error) {
    next(error);
  }
};

// check roles
