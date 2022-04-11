const { responseObject } = require("../helpers");
const {
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_FORBIDDEN,
} = require("../helpers/httpCodes");
const db = require("../models");
const Post = db.posts;
const Comment = db.comments;
const User = db.users;
const Like = db.likes;
//const { sendQueue } = require('../queues/index');

exports.createPost = async (req, res) => {
  console.log("dsdv",req.body)
  const { content, title } = req.body;

  console.log("userid", req.auth);
  // const files = req.files;

  try {
    if (!content) {
      return responseObject(
        res,
        HTTP_FORBIDDEN,
        "error",
        null,
        "Please provide content"
      );
    }

    if (!title) {
      return responseObject(
        res,
        HTTP_FORBIDDEN,
        "error",
        null,
        "Please provide title"
      );
    }

    let post = await Post.create({ content, title, userId: req.auth.id });
    return responseObject(res, HTTP_CREATED, "success", post, "");

    //   }
    // );
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: "user", attributes: ["name", "username","id"] },
        {model:Comment,as:"comments",include:{
          model: User, as: "user", attributes: ["name", "username","id"]
        }},
        {model:Like,as:"likes",include:{
          model: User, as: "user", attributes: ["name", "username","id"]
        }},
      ]
      ,order: [
        ['id', 'DESC']
      ]
    });
    return responseObject(res, HTTP_OK, "success", posts, "");
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.postById },
    });
    return responseObject(res, HTTP_OK, "success", comments, "");
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.getLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: { postId: req.postById },
    });
    return responseObject(res, HTTP_OK, "success", likes.length, "");
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findOne({
      where: { id },
      include: [
        { model: User, as: "user", attributes: ["name", "username","id"] },
        {model:Comment,as:"comments",include:{
          model: User, as: "user", attributes: ["name", "username","id"]
        }},
        {model:Like,as:"likes",include:{
          model: User, as: "user", attributes: ["name", "username","id"]
        }},
      ],
    });

    if (!post) {
      return responseObject(
        res,
        HTTP_NOT_FOUND,
        "error",
        null,
        "Post not found"
      );
    }

    req.post = post;
    next();
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.getPost = async (req, res) => {
  //add comments
  return responseObject(res, HTTP_OK, "success", req.post, "");
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content)
      return responseObject(
        res,
        HTTP_BAD_REQUEST,
        "error",
        post,
        "Field cannot be empty"
      );

    let post = await Posts.findOneAndUpdate(
      { _id: id },
      {
        content: content,
      },
      {
        new: true,
      }
    );
    return responseObject(
      res,
      HTTP_CREATED,
      "success",
      post,
      "Updated Successfuly"
    );
  } catch (err) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.createComment = async (req, res) => {
  console.log("dsd",req.body)
  const { content } = req.body;

  console.log("userid", req.auth);
  // const files = req.files;

  try {
    if (!content) {
      return responseObject(
        res,
        HTTP_FORBIDDEN,
        "error",
        null,
        "Please provide content"
      );
    }

    let comment = await Comment.create({
      content,
      postId: req.params.postId,
      userId: req.auth.id,
    });

    const comments = await Comment.findAll({
      where: { postId: req.params.postId},
      include: [
        { model: User, as: "user", attributes: ["name", "username","id"] },
        // {model:Comment,as:"comments",include:{
        //   model: User, as: "user", attributes: ["name", "username","id"]
        // }},
        // {model:Like,as:"likes",include:{
        //   model: User, as: "user", attributes: ["name", "username","id"]
        // }},
      ],
      order: [
        ['id', 'DESC']
      ]
    });

    return responseObject(res, HTTP_CREATED, "success", comments, "");

    //   }
    // );
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.likePost = async (req, res) => {
  const { content } = req.body;

  console.log("userid", req.auth);
  // const files = req.files;

  try {
    const likedPost = await Like.findOne({
      where: { postId: req.params.postId, userId: req.auth.id },
    });
    let text="";

    if (likedPost) {
      await Like.destroy({
        where: { postId: req.params.postId, userId: req.auth.id },
      });
      text="Unlike successfully";
     
    } else {
      await Like.create({ postId: req.params.postId, userId: req.auth.id });
      text="Like successfully"
      
    }

    const likes = await Like.findAll({
      where: { postId: req.params.postId},
      include: [
        { model: User, as: "user", attributes: ["name", "username","id"] },
        // {model:Comment,as:"comments",include:{
        //   model: User, as: "user", attributes: ["name", "username","id"]
        // }},
        // {model:Like,as:"likes",include:{
        //   model: User, as: "user", attributes: ["name", "username","id"]
        // }},
      ],
      
    });

    return responseObject(
      res,
      HTTP_CREATED,
      "success",
      likes,
      text
    );

    //   }
    // );
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Post.destroy({ where: { id } });
    return responseObject(res, HTTP_OK, "success", "", "Post Deleted");
  } catch (error) {
    console.log("error",error)
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};
