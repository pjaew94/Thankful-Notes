import express from "express";
import { postValidation } from "../middleware/validation";
const pool = require("../db");
const authorization = require("../middleware/authorization");
const router = express.Router();

// Create Post - FINISH
router.post("/", authorization, async (req, res) => {
  const user = await pool.query("SELECT group_id FROM users WHERE id = $1", [
    req.user,
  ]);
  const userGroupId = user.rows[0].group_id;
  const {
    verse_of_the_day,
    verse_book,
    verse_verse,
    thought_on_verse1,
    thought_on_verse2,
    thought_on_verse3,
    thought_on_verse4,
    thought_on_verse5,
    show_thanks1,
    show_thanks2,
    show_thanks3,
    is_private,
  } = req.body;

  const data = {
    user_id: req.user,
    group_id: userGroupId,
    verse_of_the_day,
    verse_book,
    verse_verse,
    thought_on_verse1,
    thought_on_verse2,
    thought_on_verse3,
    thought_on_verse4,
    thought_on_verse5,
    show_thanks1,
    show_thanks2,
    show_thanks3,
    is_private,
  };
  const { error } = postValidation(data);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    try {
      const newPost = await pool.query(
        "INSERT INTO posts(user_id, group_id, verse_of_the_day, verse_book, verse_verse, thought_on_verse1,thought_on_verse2,thought_on_verse3,thought_on_verse4,thought_on_verse5, show_thanks1,show_thanks2,show_thanks3, is_private) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
        [
          req.user,
          userGroupId,
          verse_of_the_day,
          verse_book,
          verse_verse,
          thought_on_verse1,
          thought_on_verse2,
          thought_on_verse3,
          thought_on_verse4,
          thought_on_verse5,
          show_thanks1,
          show_thanks2,
          show_thanks3,
          is_private,
        ]
      );

      return res.status(200).send(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
});

// Get Post If User's or Groups's Post
router.get("/", authorization, async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);
    const postInfo = post.rows[0];

    const user = await pool.query("SELECT group_id FROM users WHERE id = $1", [
      req.user,
    ]);
    const userGroupId = user.rows[0].group_id;

    if (
      (postInfo.user_id !== req.user && postInfo.group_id !== userGroupId) ||
      (postInfo.user_id !== req.user && postInfo.is_private)
    ) {
      return res
        .status(401)
        .json("You do not have permission to view this post");
    } else {
      return res.status(200).send(postInfo);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete Post If Owner
router.delete("/", authorization, async (req, res) => {
  const { postId } = req.body;

  const post = await pool.query("SELECT user_id FROM posts WHERE id = $1", [
    postId,
  ]);
  const postUserId = post.rows[0].user_id;

  try {
      if(postUserId !== req.user) {
        return res.status(401).json("You do not have permission to delete this post")
    } else {
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
        return res.status(200).send("The post has been successfully deleted");
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
