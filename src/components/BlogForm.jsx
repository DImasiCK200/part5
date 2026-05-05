import { useState } from "react";
import { TextField, Button } from "@mui/material";

const BlogForm = ({ user, createBlog }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");

  const handleBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: blogTitle,
      url: blogUrl,
      author: blogAuthor,
    };

    const createdBlog = await createBlog(newBlog);

    if (createdBlog) {
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
    }
  };

  const style = { paddingTop: 10 };

  const blogForm = () => (
    <div>
      <div>
        <h2>Create new blog</h2>
        <form onSubmit={handleBlog}>
          <div style={style}>
            <TextField
              label="Title"
              value={blogTitle}
              onChange={({ target }) => setBlogTitle(target.value)}
            />
          </div>
          <div style={style}>
            <TextField
              label="Author"
              value={blogAuthor}
              onChange={({ target }) => setBlogAuthor(target.value)}
            />
          </div>
          <div style={style}>
            <TextField
              label="URL"
              value={blogUrl}
              onChange={({ target }) => setBlogUrl(target.value)}
            />
          </div>
          <div>
            <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return <>{user ? blogForm() : "You must be authorize"}</>;
};

export default BlogForm;
