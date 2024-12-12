import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser= asyncHandler(async (req,res) => {   
    //get user details from frontend
    //validation-not empty
    //check if user already exist:username,email
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    //create user object-create entry in db
    //remove  password  and referesh token field  from response
    //check for user creation
    //return response

    const {username, email, fullName, password}=req.body
    console.log("email:",email,"username:",username);
    
    if(
        [username,email,fullName,password].some((superfield) =>   //.some() return boolean value
          superfield?.trim()==="")
        )
    {
        throw new ApiError(400,"All fields are required")
    }



    const existedUser=await User.findOne({       //User directly interact with database
        $or:[{username},{email}]
    } )
    
    if(existedUser){
        throw new ApiError(409,"User will email/username already exist")
    }
    
  

    const avatarLocalPath=req.files?.avatar?.[0]?.path;  //yeh abhi server pe hi,cloudinary pe nahi gaya
    const coverImageLocalPath=req.files?.coverImage[0]?.path;  //yeh abhi server pe hi,cloudinary pe nahi gaya

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
        
    }  

   const avatar= await uploadOnCloudinary(avatarLocalPath)
   const coverImage= await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400,"Avatar file is required");
   }
    
   const user=await User.create({            //User hi toh hai joh db se baat kar raha hai
    fullName, //PASSING RAW DATA
    avatar:avatar.url,
    coverImage : coverImage?.url|| "",
    email,
    password,
    username:username.toUpperCase()


   })
//db pe api call mar rahe check karne ke liye ki user create hua yah nahi(full proff hai)
   const createdUser= await User.findById(user._id).select(
    "-password -refereshToken"                    //kya kya nahi chahiye Q ki bydefault sab selected hai
   )
    
   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
   }

  return res.status(201).json(        //this res is only for PostMan.agar yeh nahi likhoge toh bhi data entry store hogi DB pe
    new ApiResponse(200,createdUser,"user registered successfully")
  )

  
}
)
export {registerUser}       // agar export { }ese kar rahe toh imprt bhi { } karna hoga
