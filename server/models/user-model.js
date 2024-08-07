import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
  
    password: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Candidate", "Admin", "Voter"],
      default: "Voter", // Default type is Voter
     
    },
    // Additional fields specific to candidates
    bio: { type: String, required: false },
    description: { type: String, required: false },
    photoUrl: { type: String, required: false },
    unHashed:{
      type:String,
      required:false
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        votedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
    },
    isVoted:{
      type:Boolean,
      defualt:false
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (givenPassword) {
  console.log("password", givenPassword);
  return await bcrypt.compare(givenPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
