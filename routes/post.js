const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  editPost,
  postById,
  deletePost,
  createComment,
  likePost
} = require('../controllers/post');
const { requiredSignin, hasAuthorization } = require('../middlewares/auth');

const router = express.Router();

router.post('/post',requiredSignin, createPost);
router.post('/post/:postId', requiredSignin,editPost);
router.post('/post/comment/:postId', requiredSignin,createComment);
router.post('/post/like/:postId', requiredSignin,likePost);
router.delete('/post/:postId', requiredSignin,hasAuthorization,deletePost);
router.get('/posts',requiredSignin, getPosts);
router.get('/post/:postId',requiredSignin, getPost);

router.param('postId',postById)

module.exports = router;
