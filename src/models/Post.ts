import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  authorId: mongoose.Schema.Types.ObjectId;
  authorName: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
