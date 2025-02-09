import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/comment/video/${videoId}`,
        { withCredentials: true }
      );
      setComments(response.data.data.docs);
    } catch (err) {
      console.error("Error fetching comments", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    try {
      await axios.post(
        `http://localhost:8000/api/v1/comment/video/${videoId}`,
        { content: commentText },
        { withCredentials: true }
      );

      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment", err);
      setError("Failed to add comment.");
    }
  };

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
    <div className="mt-4 p-2 bg-gray-700 text-gray-200 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-bold mb-2">Comments</h2>

      {/* Form for adding a new comment */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 mb-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a public comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="3"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
        >
          Post Comment
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="mb-4 border-b border-gray-700 pb-2">
            <div className="flex items-center mb-1">
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="font-bold">{comment.owner.username}</span>
              <span className="text-gray-400 ml-2 text-sm">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-400 mr-2">
                {comment.likesCount} Likes
              </span>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-500 hover:text-red-400 text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;
