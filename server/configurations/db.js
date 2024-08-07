import chalk from "chalk";
import mongoose from "mongoose";
import { MONGO_URL } from "./Config.js";


export const connectToDb  = async()=>{

    try {
        
        await mongoose.connect(MONGO_URL)
        console.log(`${chalk.yellow.bold("Database has been connected successfully")}`)

    } catch (error) {
        console.log('Error',error)
        process.exit(1)
        
    }
}

