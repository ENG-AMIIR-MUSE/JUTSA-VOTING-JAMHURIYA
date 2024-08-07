import express from 'express'
import { deleteCandidate, getCanidates, getSingleCanidates, insertCandidate, updateCandidate } from '../controller/cani-date-controller.js'
import upload from '../middleware/upload.js';
import { authenticate } from '../middleware/authMiddleWare.js';
import { checkAdminRole } from '../middleware/checkRolesMiddleware.js';
// import { create } from '../models/canidate-model.js'

const router  = express.Router()

router.get('/canidates',authenticate ,getCanidates)
router.post('/singleCandidate',authenticate ,getSingleCanidates)
router.post('/create-canidate',authenticate, upload.single('photoUrl') ,checkAdminRole, insertCandidate)
router.post('/update',authenticate, upload.single('photoUrl') ,updateCandidate)
router.delete('/delete/:id',authenticate ,deleteCandidate)

export default router;