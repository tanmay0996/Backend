1)frontend se endpoint pe req bhej rahe hai
https://viewtube-backend-onnr.onrender.com/api/v1/endpoint


2)backend pe cross origin allow: https://viewtube-frontend.onrender.com


3)before testing
deploy both frontend and backend so that both become https
(localhost is http)

 const options = {
      httpOnly: true,    //http ke liye
      secure: true,     //https ke liye
      sameSite: "None"   // @IMP   without this access token will not be stored in cookies=>  
                                    can't  access secured route without this           
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)        // cookies may access token bhej rahe
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken, //in json we are sending the complete object
            //  while in cookie we are sending the value only
          },
          "accessToken renewed"
        )
      );

4)both frontend(static) and backend(webservises) r deployed separately

5)in this folder structure
   frontend root dir=> frontend(folder)
   backend root dir=> emplty(becoz backend root is this repo only)

6) ALL the  Build and deploy cmds(which are asked after making a new service)
  is present in  ViewTube_Backend=> settings
                 ViewTube_Frontend=>settings


