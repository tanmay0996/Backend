// src/components/Comments.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Comments = ({ videoId }) => {
  const { user } = useContext(AuthContext);
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/comment/video/${videoId}`,
        { withCredentials: true }
      );
      const fetchedComments = response.data.data.docs || [];
      console.log("=== Frontend Comment Debug ===");
      console.log("Current user:", user);
      console.log("Fetched comments:", fetchedComments);
      if (fetchedComments.length > 0) {
        console.log("First comment details:", {
          commentId: fetchedComments[0]._id,
          ownerId: fetchedComments[0].owner._id,
          ownerObjectId: fetchedComments[0].ownerObjectId,
          isOwner: fetchedComments[0].isOwner,
          content: fetchedComments[0].content
        });
      }
      setComments(fetchedComments);
      setError("");
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/comment/video/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/comment/${commentId}`,
        { withCredentials: true }
      );
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert("Please sign in to like comments");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/likes/toggle/c/${commentId}`,
        {},
        { withCredentials: true }
      );
      fetchComments(); // Refresh comments to get updated like status
    } catch (err) {
      console.error("Error toggling comment like:", err);
      alert("Failed to toggle like. Please try again.");
    }
  };

  if (loading) return <div style={{ color: '#666666', fontFamily: 'Inter, sans-serif' }}>Loading comments...</div>;
  if (error) return <div className="text-red-500" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</div>;

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}>
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex items-start space-x-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#F5F5DC', color: '#333333', border: '1px solid #A0522D', fontFamily: 'Inter, sans-serif' }}
                rows="3"
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewComment("")}
                  className="px-4 py-2"
                  style={{ color: '#666666', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: newComment.trim() && !isSubmitting ? '#E35336' : '#cccccc',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF8DC', border: '1px solid #E35336' }}>
          <p style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>
            <Link to="/register" style={{ color: '#E35336', textDecoration: 'underline', fontWeight: 600 }}>
              Sign in
            </Link>{" "}
            to add a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#666666', fontFamily: 'Inter, sans-serif' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="rounded-lg p-3" style={{ backgroundColor: '#F5F5DC', border: '1px solid #e0e0e0' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold" style={{ color: '#333333', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {comment.owner.username}
                    </span>
                    <span className="text-xs" style={{ color: '#666666', fontFamily: 'Inter, sans-serif' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: '#333333', fontFamily: 'Inter, sans-serif' }}>{comment.content}</p>
                </div>
                
                {/* Comment Actions */}
                <div className="flex items-center space-x-4 mt-2 ml-3">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center space-x-1 text-sm"
                    style={{
                      color: user ? (comment.isLiked ? '#E35336' : '#666666') : '#cccccc',
                      fontFamily: 'Inter, sans-serif',
                      cursor: user ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!user}
                  >
                    <span>{comment.isLiked ? "👍" : "👍"}</span>
                    <span>{comment.likesCount}</span>
                  </button>

                  {/* Only show delete button if user is the comment owner */}
                  {(() => {
                    const shouldShowDelete = user && comment.isOwner;
                    console.log(`Comment ${comment._id} - User exists: ${!!user}, isOwner: ${comment.isOwner}, Show delete: ${shouldShowDelete}`);
                    return shouldShowDelete ? (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm"
                        style={{ color: '#E35336', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                      >
                        Delete
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;