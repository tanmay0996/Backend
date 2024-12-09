import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))             //json data ko allow karenge(form bharenge toh data aaega)
app.use(express.urlencoded({extended:true,limit:"16kb"}))           //URL se data le rahe
app.use(express.static("public"))                   //public folder may rakhege
app.use(cookieParser())




export {app}