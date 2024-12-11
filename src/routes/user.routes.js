import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js"
const router=Router()

router.route("/register").post(registerUser)


export default router  // ny default export kar rahe-->import karte samay manchaha name de sakte hai