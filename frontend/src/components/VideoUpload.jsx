import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const VideoUpload = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // We register the file in our form state
      setValue("videoFile", file);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  const onSubmit = async (data) => {
    // Create FormData instance for file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile); // field name expected by your route
    formData.append("thumbnail", data.thumbnail); // field name expected by your route

    try {
      setUploading(true);
      setMessage("");
      // Adjust the base URL if needed, or use a proxy in your development environment
      const response = await axios.post("http://localhost:8000/api/v1/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // if your API requires cookies (e.g., JWT in cookies)
      });

      setMessage("Video published successfully!");
      // Optionally reset the form and local state
      reset();
      setVideoFile(null);
      setThumbnailPreview(null);
    } catch (error) {
      console.error("Error publishing video:", error);
      setMessage("Failed to publish video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black text-white p-6 w-full max-w-2xl mx-auto rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Video File Upload Section */}
        <div className="border-2 border-dashed border-gray-500 p-6 text-center">
          <p className="mb-2">Drag and drop video files to upload</p>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="videoUpload"
          />
          <label htmlFor="videoUpload" className="bg-purple-600 px-4 py-2 rounded cursor-pointer">
            Select Video
          </label>
          {videoFile && <p className="mt-2 text-sm">{videoFile.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Thumbnail Upload Section */}
          <div>
            <label className="block mb-1">Thumbnail *</label>
            <div className="border border-gray-500 h-32 flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnailUpload"
              />
              <label htmlFor="thumbnailUpload" className="cursor-pointer">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-full object-cover" />
                ) : (
                  "📷"
                )}
              </label>
            </div>
          </div>
          {/* Title and Description */}
          <div>
            <label className="block mb-1">Title *</label>
            <input
              {...register("title", { required: true })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
            <label className="block mt-3 mb-1">Description *</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 px-4 py-2 rounded text-white float-right disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Save"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default VideoUpload;
