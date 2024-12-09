// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"          // we want env variable load as early as possible so we put them in main file(index.js) and at the top position

import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})


connectDB()










/*
import express from "express"
const app=express()

;(async() => {                         //EFFI
    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error) => {
        console.log("Error in conn ExpressApp",error)
        throw error
         
       }
       )
       app.listen(process.env.PORT, () => {
        console.log(`App is listening on port:${process.env.PORT}`)
         
       }
       )
        
    } catch (error) {
        console.error("ERROR:",error)
        throw error
        
    }
  
}
)()                                   //Effi
 */                                  