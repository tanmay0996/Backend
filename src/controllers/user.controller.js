import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser= asyncHandler(async (req,res) => {   
    res.status(200).json({
        message:"chai-code"
    })
  
}
)
export {registerUser}       // agar export { }ese kar rahe toh imprt bhi { } karna hoga
