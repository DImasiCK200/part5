import { useState } from "react";
import BlogDescription from "./BlogDescription";

const Blog = ({ blog, user, handleDelete }) => {
  const style = {
    border: "solid",
    borderWidth: 1,
    margin: "5px",
    padding: "20px",
    borderRadius: "5px",
    width: "30%",
  };

  const [visible, setVisible] = useState(false);

  const showWhenVisible = {
    display: visible ? "" : "none",
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const deleteButton = () => (
    <div>
      <button onClick={() => handleDelete(blog)}>Delete</button>
    </div>
  );

  return (
    <div style={style}>
      <h3>{blog.title}</h3>
      <div>
        Author: {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      </div>
      <BlogDescription style={showWhenVisible} blog={blog} />
      {user && user.username === blog.user.username && deleteButton()}
    </div>
  );
};

export default Blog;
