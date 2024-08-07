import express from 'express'
import { authenticate } from '../middleware/authMiddleWare.js';
import { deleteVoteForCandidate, getVoters, vote, voteForCandidate } from '../controller/voting-controller.js';

const router  = express.Router()

router.post('/vote-for-canidate/:candidateID',authenticate ,vote)
router.get('/voters' ,getVoters)
router.delete('/delete-vote-for-canidate/:candidateId',authenticate ,deleteVoteForCandidate)


export default router;