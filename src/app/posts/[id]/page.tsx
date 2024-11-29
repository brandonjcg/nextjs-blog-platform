"use client";

import { useEffect, useState } from "react";
import { Post } from "@/app/interface/Post";
import { useParams } from "next/navigation";

const PostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
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

  useEffect(() => {
    if (!post?.author) return;

    const fetchAuthor = async () => {
      const response = await fetch(`/api/users/getUser/${post.author}`);
      const data = await response.json();

      if (data?.user) {
        setAuthor(data.user.username);
      } else {
        setAuthor("Anonymous");
      }
    };

    fetchAuthor();
  }, [post]);

  if (!post) return <div>Loading...</div>;
  if (!author) return <div>Getting author name...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By: {author}</p>
    </div>
  );
};

export default PostPage;
