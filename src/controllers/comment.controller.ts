// src/controllers/comment.controller.ts
import express = require("express");
const commentService = require("../services/comment.service");

// Interface untuk request yang sudah diautentikasi
interface AuthenticatedRequest extends express.Request {
  user?: any;
}

// Menangani permintaan untuk membuat komentar baru
exports.handleCreateComment = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const { text } = req.body;
    const authorId = req.user.id; // Ambil ID user dari token
    const postId = parseInt(req.params.postId, 10); // Ambil ID post dari URL

    const newComment = await commentService.createComment(
      text,
      authorId,
      postId
    );
    res.status(201).json(newComment);
  } catch (error: any) {
    if (error.message === "Post not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

// Menangani permintaan untuk melihat semua komentar di sebuah post
exports.handleGetCommentsByPostId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Menangani permintaan untuk mengedit komentar
exports.handleUpdateComment = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId, 10);

    const updatedComment = await commentService.updateComment(
      commentId,
      userId,
      text
    );
    res.status(200).json(updatedComment);
  } catch (error: any) {
    if (error.message === "Comment not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "You are not authorized to edit this comment") {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

// Menangani permintaan untuk menghapus komentar
exports.handleDeleteComment = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId, 10);

    const deletedComment = await commentService.deleteComment(
      commentId,
      userId
    );
    res
      .status(200)
      .json({
        message: "Comment deleted successfully",
        comment: deletedComment,
      });
  } catch (error: any) {
    if (error.message === "Comment not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "You are not authorized to delete this comment") {
      return res.status(403).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};
