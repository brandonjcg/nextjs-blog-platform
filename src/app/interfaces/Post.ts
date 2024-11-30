export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}
