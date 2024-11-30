import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  postId: mongoose.Schema.Types.ObjectId;
  content: string;
  username: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: { type: String, required: true },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
