import { useState } from "react";
import blogService from "../services/blogs";

const BlogDescription = ({ style, blog }) => {
  const styleUrl = {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  };

  const [likes, setLikes] = useState(blog.likes);

  const handleLike = async (blog) => {
    try {
      const editBlog = { ...blog, user: blog.user.id, likes: likes + 1 };

      const updatedBlog = await blogService.update(editBlog);

      if (updatedBlog) {
        setLikes(updatedBlog.likes);
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  return (
    <div style={style}>
      <div style={styleUrl}>Url: {blog.url}</div>
      <div>
        Likes: {likes}
        <button
          onClick={async () => {
            await handleLike(blog);
            setLikes(likes + 1);
          }}
        >
          Like
        </button>
      </div>
      <div>Created by: {blog.user.name}</div>
    </div>
  );
};

export default BlogDescription;
