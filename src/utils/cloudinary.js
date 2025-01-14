import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary= async (loacalFilePath) => {
    try {
        if(!loacalFilePath) {
            console.log("LocalFilePAth not found :(");
            return NULL;
            
        }
        //upload file on cloudinary
        const response= await cloudinary.uploader.upload(loacalFilePath,{resource_type:'auto'})

// response object include multiple fields
 /*{
  "public_id": "unique-id-generated-by-cloudinary",
  "url": "https://res.cloudinary.com/.../file-url",
  "secure_url": "https://.../secure-file-url",
  "resource_type": "video",
  "duration": 120.5,
  ...
}
*/

        // console.log("File is uploaded successfully",response.url);
             // THIS IS FOR TESTING PURPOSE

        fs.unlinkSync(loacalFilePath)
        return response;  
        


    } catch (error) {
        fs.unlinkSync(loacalFilePath)// remove the locally saved temp file(basically which is stored on server)  as the upload operation failed
        return NULL;
        
    }
    
}



export {uploadOnCloudinary}








 

