import { canidateModel } from "../models/canidate-model.js";
import { errorHandler } from "../utility/custom-error.js";
import cloudinary from '../configurations/cloud.js'
import { User } from "../models/user-model.js";
// Function to insert a new candidate
export async function insertCandidate(req, res, next) {
  const { bio, description ,username,password  } = req.body;
 

  try {
    console.log(req.user)
    console.log(req.body)
    // Check if required fields are provided
    if (!bio || !description || !username  || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    let result;

    if (req.file) {
      let encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString(
        "base64"
      )}`;
      result = await cloudinary.uploader.upload(encodedImage, {
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        encoding: "base64",
      });
    }
    // Create the new candidate
    const newCandidate = new User({
      username,
      
      password,
      bio,
      description,
      photoUrl: result?.url || null,
      type:"Candidate"
    
    });
    await newCandidate.save();

    res.status(201).json(newCandidate);
  } catch (error) {
    console.log('error',error)
    next(error)
  }
}

// Update Canidate 
// Update candidate
export const updateCandidate = async (req, res,next) => {
const {candidateId} = req.body
    console.log( 'req',candidateId)
    
    try {
      // Construct updated fields
      let updatedFields = {
        bio: req.body.bio,
        description: req.body.description,
        username:req.body.username,
    

      };
  
      // Check if an image file is provided
      if (req.file) {
        let encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;
        let result = await cloudinary.uploader.upload(encodedImage, {
          resource_type: "image",
          transformation: [{ width: 500, height: 500, crop: "limit" }],
          encoding: "base64",
        });
        updatedFields.photoUrl = result.url;
      }
  
      // Update candidate in the database
      const updatedCandidate = await User.findByIdAndUpdate({_id :candidateId}, updatedFields, { new: true });
      console.log('Updated ',updateCandidate)
      
      // Check if the candidate was found and updated
      if (!updatedCandidate) {
        return res.status(404).send("Candidate not found");
      }
  
      // Send the updated candidate data in the response
      return res.status(200).json(updatedCandidate);
    } catch (error) {
     next(error)
    }
  };
  
// Delete candidate
export const deleteCandidate = async (req, res,next) => {
  console.log('delete')
    const {id} = req.params;
    console.log('params',req.params)
    console.log('id',id)
    
    try {
      // Find candidate by ID and delete
      const deletedCandidate = await User.findByIdAndDelete(id);
      console.log(deletedCandidate)
      
      // Check if the candidate was found and deleted
      if (!deletedCandidate) {
        return res.status(404).send("Candidate not found");
      }
  
      // Send a success message in the response
      return res.status(200).json(deletedCandidate);
    } catch (error) {
      next(error)
      console.log(error);
      return res.status(500).json(error);
    }
  };
  

  
export const getCanidates = async (req, res,next) => {
    try {
     
     
      const canidates = await User
        .find({type:"Candidate"})
       
        .sort({ createdAt: -1 });
      if (!canidates) return next(errorHandler(200,'There Is No Canidates Yet '))
  
      return res.status(200).json(canidates);
    } catch (error) {
     next(error)
    }
  };
  export const getSingleCanidates = async (req, res,next) => {
    try {
      const {canId}  = req.body
     
      const canidates = await User
        .find({$and:[{type:"Candidate"},{_id:canId}]})
       
    
      if (!canidates) return next(errorHandler(200,'Candidate Not Found '))
  
      return res.status(200).json(canidates);
    } catch (error) {
     next(error)
    }
  };