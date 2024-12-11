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

        console.log("File is uploaded successfully",response.url);
        return response;
        


    } catch (error) {
        fs.unlinkSync(loacalFilePath)// remove the locally saved temp file(basically which is stored on server)  as the upload operation failed
        return NULL;
        
    }
    
}

export {uploadOnCloudinary}








 

