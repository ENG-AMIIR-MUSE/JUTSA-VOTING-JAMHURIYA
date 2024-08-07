
import { canidateModel } from "../models/canidate-model.js";
import { User } from "../models/user-model.js";
import { errorHandler } from "../utility/custom-error.js";
export const voteForCandidate = async (req, res, next) => {
    const { candidateId } = req.params;
    
    try {
      // Find the candidate by ID
      const candidate = await canidateModel.findById(candidateId);
  
      // Check if the candidate exists
      if (!candidate) {
        return next(errorHandler(404, "Candidate not found"));
      }
  
      // Check if the user has already voted for this candidate
      const hasVoted = candidate.countedVote.some(vote => vote.votedUser.equals(req.user.id));
      if (hasVoted) {
        return next(errorHandler(400, "You  already voted for this candidate"));
      }
  
      // Add the user's vote to the candidate's votes array
      candidate.countedVote.push({ votedUser: req.user.id });
  
      // Save the updated candidate
      const updatedCandidate = await candidate.save();
  
      // Send the updated candidate data in the response
      return res.status(200).json(updatedCandidate);
    } catch (error) {
      // Handle other errors using the custom error handler
     next(error)
    }
  };
// Controller function to delete a vote for a candidate
export const deleteVoteForCandidate = async (req, res, next) => {
  const { candidateId } = req.params;
  const userId = req.user.id;

  try {
    // Find the candidate by ID
    const candidate = await canidateModel.findById(candidateId);

    // Check if the candidate exists
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found"));
    }

    // Find the index of the vote by the user in the countedVote array
    const voteIndex = candidate.countedVote.findIndex(vote => vote.votedUser.equals(userId));

    // Check if the user has voted for this candidate
    if (voteIndex === -1) {
      return next(errorHandler(400, "You have not voted for this candidate"));
    }

    // Remove the vote from the candidate's votes array
    candidate.countedVote.splice(voteIndex, 1);

    // Save the updated candidate
    const updatedCandidate = await candidate.save();

    // Send the updated candidate data in the response
    return res.status(200).json(updatedCandidate);
  } catch (error) {
    // Handle other errors using the custom error handler
    return next(errorHandler(500, "Internal server error"));
  }
};
export const vote  = async (req, res,next)=>{
  // no admin can vote
  // user can only vote once
  
  console.log('params',req.params)
  let candidateID = req.params.candidateID;
  let userId = req.user.id;

  try{
      // Find the Candidate document with the specified candidateID
      const candidate = await User.findById(candidateID);
      console.log('canidte found',candidate)
      if(!candidate){
          return next(errorHandler(400,"Candidate Not Found"))
      }

      const user = await User.findById(userId);
      if(!user){
          return next(errorHandler(400,"Uer Not Found"))
      }
      if(user.type == 'Admin' || user.type == 'Candidate'){
          return next(errorHandler(400,"Admin Is Not Allowed To Vote"))
      }
      if( user.type == 'Candidate'){
          return next(errorHandler(400,"Candidate Is Not Allowed To Vote"))
      }
      console.log('userId ',userId," CandId",candidateID)
      
      if(userId === candidateID){
        return next(errorHandler(404,"You Are Not Allowed To Vote Your Self"))
      }
      if(user.isVoted){
          return next(errorHandler(400,"Oops You Already Voted!!"))
      }

      // Update the Candidate document to record the vote
      console.log("========")
      console.log(candidate.votes)
      console.log(candidate.voteCount)
      candidate.votes.push({user: userId})
      candidate.voteCount++;
      await candidate.save()
     

      // update the user document
      user.isVoted = true
      console.log('Updated User',user)
      await user.save();

      return res.status(200).json(user);
  }catch(err){
     next(err)
  } 
}

export const getVoters = async (req, res,next) => {
  try {
   
   
    const canidates = await User
      .find({type:"Voter"})
     
      .sort({ createdAt: -1 });
    if (!canidates) return next(errorHandler(200,'There Is No Voters Yet '))

    return res.status(200).json(canidates);
  } catch (error) {
   next(error)
  }
};