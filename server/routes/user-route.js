import express from 'express'
import { createUser, deleteUser, login, signout } from '../controller/user-controller.js'
// import { create } from '../models/canidate-model.js'

const router  = express.Router()

router.post('/register',createUser)
router.post('/login',login)
router.post('/logout',signout)
router.delete('/delete-user/:id',deleteUser)


export default router;