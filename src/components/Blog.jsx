import { useState } from "react";
import BlogDescription from "./BlogDescription";

const Blog = ({ blog }) => {
  const style = {
    border: "solid",
    borderWidth: 1,
    margin: "5px",
    padding: "10px",
    backgroundColor: "#4deaff",
    width: "50%",
    borderRadius: "20px"
  };

  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={style}>
      <h3>{blog.title}</h3>
      <div>
        Author: {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      </div>
      <BlogDescription style={showWhenVisible} blog={blog} />
    </div>
  );
};

export default Blog;
