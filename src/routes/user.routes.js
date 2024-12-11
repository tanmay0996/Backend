import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
const router=Router()

router.route("/register").post(      //jesehi /register pe jae toh registerUser controller pe jane se pehle upload(multer) wale middleware se mil ke jae, yeh file handle karega
    
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]), 
    registerUser)


export default router  // by default export kar rahe-->import karte samay manchaha name de sakte hai