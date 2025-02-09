// src/components/Comments.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]); // Array to hold comment objects
  const [commentText, setCommentText] = useState(""); // New comment text
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch comments from the backend
  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/comment/video/${videoId}`,
        { withCredentials: true }
      );
      console.log(response)
      // Assuming your response follows the ApiResponse structure and data is in response.data.data
      // setComments(response.data.data);
      setComments(response.data.data.docs);

    } catch (err) {
      console.error("Error fetching comments", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments when the component mounts or when videoId changes
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Handler for submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    try {
      await axios.post(`http://localhost:8000/api/v1/comment/video/${videoId}`, { content: commentText }, { withCredentials: true })

      
      setCommentText("");
      // Re-fetch comments to update the list after a successful post
      fetchComments();
    } catch (err) {
      console.error("Error adding comment", err);
      setError("Failed to add comment.");
    }
  };

  // Handler for deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/comments/${commentId}`,
        { withCredentials: true }
      );
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment", err);
      setError("Failed to delete comment.");
    }
  };

  return (
    <div className="mt-4 p-2">
      <h2 className="text-xl font-bold mb-2">Comments</h2>

      {/* Form for adding a new comment */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-2"
          placeholder="Add a public comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="3"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Post Comment
        </button>
      </form>

      {/* Display loading, error, or list of comments */}
      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="mb-4 border-b pb-2">
            <div className="flex items-center mb-1">
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-bold">{comment.owner.username}</span>
              <span className="text-gray-500 ml-2 text-sm">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p>{comment.content}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-600 mr-2">
                {comment.likesCount} Likes
              </span>
              {/* If needed, conditionally render the Delete button if the current user is the comment owner */}
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default Comments;
