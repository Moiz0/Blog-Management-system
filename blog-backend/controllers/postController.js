const Post = require("../models/Post");

exports.getAllPosts = async (req, res) => {
  try {
    const { search = "", author } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const postData = {
      title,
      content,
      excerpt,
      status: status || "published",
      author: req.user.id,
    };

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.status = status || post.status;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "name email"
    );

    res.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
