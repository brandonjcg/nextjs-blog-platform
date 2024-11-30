"use client";

import { useEffect, useState } from "react";
import { Post } from "@/app/interface/Post";
import { useParams } from "next/navigation";

const PostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const { id } = useParams<{ id: string | undefined }>();

  console.log("id", id);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const response = await fetch(`/api/posts/getPost/${id}`);
      const data = await response.json();
      setPost(data.post);
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By: {post.authorName}</p>
    </div>
  );
};

export default PostPage;
