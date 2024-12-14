import {Router} from "express"
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
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

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(verifyJWT,
     logoutUser)

export default router  // by default export kar rahe-->import karte samay manchaha name de sakte hai