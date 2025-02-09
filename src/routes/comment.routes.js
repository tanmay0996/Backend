import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

// Apply the verifyJWT middleware and configure multer (for non-file requests)
router.use(verifyJWT, upload.none());

// Routes for fetching and adding comments for a specific video
router.route("/video/:videoId")
    .get(getVideoComments)  // GET /api/v1/comment/video/:videoId - Fetch comments for a video
    .post(addComment);      // POST /api/v1comment/video/:videoId - Add a new comment to a video

// Routes for updating and deleting a specific comment
router.route("/:commentId")
    .patch(updateComment)   // PATCH /api/comments/:commentId - Update a comment
    .delete(deleteComment); // DELETE /api/comments/:commentId - Delete a comment

export default router;
