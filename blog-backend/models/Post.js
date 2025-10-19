const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt = plainText.substring(0, 150) + "...";
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
