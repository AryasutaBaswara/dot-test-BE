"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postService = require("../services/post.service");
exports.handleCreatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user.id;
        const newPost = await postService.createPost(title, content, authorId);
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.handleGetAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.handleUpdatePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { title, content } = req.body;
        const userId = req.user.id;
        const updatedPost = await postService.updatePost(postId, userId, title, content);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        if (error.message === "Post not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "You are not authorized to edit this post") {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
exports.handleDeletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const deletedPost = await postService.deletePost(postId, userId);
        res
            .status(200)
            .json({ message: "Post deleted successfully", post: deletedPost });
    }
    catch (error) {
        if (error.message === "Post not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "You are not authorized to delete this post") {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
// Pramusaji untuk pesanan "like a post"
exports.handleLikePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user.id; // Ambil ID user dari token
        await postService.likePost(userId, postId);
        res.status(201).json({ message: "Post liked successfully" });
    }
    catch (error) {
        if (error.message === "Post not found") {
            return res.status(404).json({ message: error.message });
        }
        // Gunakan status 409 Conflict jika user sudah pernah like
        if (error.message === "You have already liked this post") {
            return res.status(409).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
// Pramusaji untuk pesanan "unlike a post"
exports.handleUnlikePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user.id; // Ambil ID user dari token
        await postService.unlikePost(userId, postId);
        res.status(200).json({ message: "Post unliked successfully" });
    }
    catch (error) {
        if (error.message === "Post not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "You have not liked this post") {
            return res.status(400).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};
