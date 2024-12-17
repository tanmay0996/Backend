import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"


const generateAccessandRefrshToken= async (userId)=>{  //web req nahi kar rahe isliye NO asyncHandler
    try {
        const user=await User.findById(userId)       //us id wale user ka instance "user"may store hai i.e-->"user"is a obj contain all property of userSchema
        const accessToken=user.generateAccessToken()  //us user ke data(email,username,etc..)ke hisab se ek costomise token generate kiya
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken  //user ke database may refreshToken de diya
        await user.save({validateBeforeSave:false})    //DB MAY SAVE KARA DIYA

        return {refreshToken,accessToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while generating Access and refresh token")
    }
}




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


//Upar wale jitne checks hai sab Mdb may data push karne se pehle wale hai

    
   const user=await User.create({            //User hi toh hai joh db se baat kar raha hai
    fullName, //pushing data(taken from client) in Mdb. First Mdb verify the data from Schema then make data entry
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



const loginUser= asyncHandler(async (req,res) => {
    //req.body  se data leke aao
    //username or email dalwao
    //check user exit
    //password check
    //give access and generate token to user(how??--> in cookies)

    const{email,password,username}=req.body

    if(!username && !email){
        throw new ApiError(400,"email/username is required")
    }
    const user=await User.findOne({             //us user ka instance "user"may aa gaya hai
        $or:[{username},{email}]
    })
    
    if(!user){
        throw new ApiError(404,"user doesn't exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password is not correct")
    }

    const {refreshToken,accessToken}=  await generateAccessandRefrshToken(user._id)

//optionalStep
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken") 

//Cookies bhejna
    const options={    
        httpOnly:true,     //Bydefault cookies can be modified by frontend
        secure:true        //Enabling these opts: only server can modify cookies
    }

    return res                            // req/res ke pass bhi cookie ka access hai via cookieParser(middleware)
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options) //syntax:("cookie name(by which u want to store)",it's value)
    .json(
        new ApiResponse(
            200,
            {
                //user   sirf user likhne pe user may joh kuch bhi hai(sari prop/schema) chala jaega
                user:loggedInUser,accessToken,refreshToken //be selective :)
            },
            "User logged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async (req,res) => {
    //yaha ane se pehle auth wale middleware se mil ke aaye hai
    //usne req may ek obj(req.user) dal ke diya hai
    //ab req.user may voh user hai joh logout karna chahata hai
    await User.findByIdAndUpdate(
        req.user._id,   
        {
            $set:{               //kya update karna hai voh batao
                refreshToken:undefined
            }
        },
        {
            new:true           //response updated milega
        }
    )
    //ab iske baad refreshToken DB e delete ho gaya
//now clear the cookie
    const options={    
        httpOnly:true,     
        secure:true        
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loggedOut Successfully"))
})

const refreshAccessToken= asyncHandler(async (req,res) => {
    const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken 
    if(!incomingRefreshToken){
        throw new ApiError(401,"refreshToken not received")
    }

    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Refresh token is invalid")
    
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refreshToken expired or used")
    
        }
    //verification done(ab new access token dedo)[anyways new refreshToken bhi dena hota hai so that the cycle continues and user doesn't have to login again ]
        const {refreshToken:newRefreshToken, accessToken}=await generateAccessandRefrshToken(user._id)
    
        const options={
            httpOnly:true,
            secure:true
        }
        
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)  
        .json(new ApiResponse(200,
            {
                accessToken,
                refreshToken:newRefreshToken //in json we are sending the complete object
                //  while in cookie we are sending the value only
            },"accessToken renewed"
        ))
    
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refreshToken")
        
    }

    
})

const changeCurrentPassword=asyncHandler(async (req,res) => {

    const {oldPassword , newPassword}=req.body

    ///agar user password change kar paa raha toh pakka voh login hoga=>authMiddleware chala hoga
    const user=await User.findById(req.user?._id)  //req.user auth middleware se aa raha
        //is user ke pass userSchema ka access hai=>User model ka bhi access hai

    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)          //isPasswordCorrect method user model ka hi part hai

    if(!isPasswordCorrect){
        throw new ApiError(400,"oldPassword is incorrect")
    }

    user.password=newPassword //abhi set kiya hai
    await user.save({validateBeforeSave:false}) //abhi save kiya hai db may==>.pre("save"...)wala HOOK call hoga
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password change successfully"))
    
})

const getCurrentUser=asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(new  ApiResponse(200,req.user,"current user fetched successfully")) //req.user from auth mid
    
})

const updateAccountDetails= asyncHandler(async (req,res) => {
    const {fullName,email}=req.body
    if(!fullName || !email){
        throw new ApiError(400,"All fields are required")
    }
    const user=User.findByIdAndUpdate(
        req.user?._id,//req.user from auth mid
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {new:true}  // updated info return hoti hai



    ).select("-password") 

    return res
    .status(200)
    .json(new ApiResponse(200,user,"account details updated successfully"))
    
})

const updateAvatar=asyncHandler(async (req,res) => {
    const avatarLocalPath=req.file?.path   //server(local) pe chala gaya hai

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"error while uploading on cloudinary")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url   //avatar:avatar ==>avatar ka pura obj le rahe, jo ki nahi karna hai
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar updated successfully")
    )

    
})

const updateCoverImage=asyncHandler(async (req,res) => {
    const coverImageLocalPath=req.files?.path        //server(local) pe aa gaya hai

    if(!coverImageLocalPath){
        throw new ApiError(400,"coverImage file is missing")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)  //cloudinary pe upload

    if(!coverImage.url){
        throw new ApiError(400,"error while uploading on cloudinary")

    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {newLtrue}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"coverImage updated successfully")
    )

    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage}       // agar export { }ese kar rahe toh imprt bhi { } karna hoga

