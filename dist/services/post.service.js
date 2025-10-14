"use strict";
// src/services/post.service.ts
const postRepository = require("../repositories/post.repository");
// Business logic to create a new post
exports.createPost = async (title, content, authorId) => {
    // The chef's instruction is simple: tell the repository to create a post
    return postRepository.createPost(title, content, authorId);
};
// Business logic to get all posts
exports.getAllPosts = async () => {
    return postRepository.findAllPosts();
};
// Business logic to update a post
exports.updatePost = async (postId, userId, title, content) => {
    // 1. First, find the post that needs to be updated
    const post = await postRepository.findPostById(postId);
    // 2. If the post doesn't exist, throw an error
    if (!post) {
        throw new Error("Post not found");
    }
    // 3. IMPORTANT: Check if the user trying to update is the original author
    if (post.authorId !== userId) {
        throw new Error("You are not authorized to edit this post");
    }
    // 4. If everything is okay, proceed with the update
    return postRepository.updatePost(postId, title, content);
};
// Business logic to delete a post
exports.deletePost = async (postId, userId) => {
    // 1. Find the post to be deleted
    const post = await postRepository.findPostById(postId);
    // 2. If the post doesn't exist, throw an error
    if (!post) {
        throw new Error("Post not found");
    }
    // 3. IMPORTANT: Verify that the user attempting to delete is the author
    if (post.authorId !== userId) {
        throw new Error("You are not authorized to delete this post");
    }
    // 4. If the check passes, delete the post
    return postRepository.deletePost(postId);
};
