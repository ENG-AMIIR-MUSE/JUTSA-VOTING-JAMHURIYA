import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    description: {
      type: String,
    },
    photoUrl: {
      type: String,
      required: true,
    },
   
    countedVote: [
      {
        votedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    type: {
      type: String,
      default: "Canidate",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const canidateModel = mongoose.model("Candidate", candidateSchema);
