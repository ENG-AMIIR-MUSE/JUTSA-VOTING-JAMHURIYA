import express from 'express'
import authRoute from './routes/user-route.js'
import candRoute from './routes/canidate-route.js'
import voteRoute from './routes/voting-route.js'
import { connectToDb } from './configurations/db.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
const app  = express()
app.use(express.json())
app.use(cookieParser())



connectToDb()
app.use('/api/auth/',authRoute)
app.use('/api/canidate/',candRoute)
app.use('/api/vote',voteRoute)



app.use(express.json())
app.use((err,req,res,next)=>{
    const statusCode  = err.statusCode || 500
    const message  = err.message || "internal server erro"
    return res.json({
        success:false,
        statusCode:statusCode,
        message:message
    })
})

const PORT =  3000
app.listen(PORT,()=>{
    console.log('app is running on port ' + PORT)
})