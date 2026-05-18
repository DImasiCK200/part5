import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useUser, useUserActions } from "../userStore";
import { useNotificationActions } from "../notificationStore";
import { useNavigate } from "react-router-dom";
import { useBlogsActions } from "../blogStore";

const BlogForm = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");

  const user = useUser();
  const { logout } = useUserActions();
  const { showNotification } = useNotificationActions();
  const { add } = useBlogsActions();
  const navigate = useNavigate();

  const handleBlog = async (event) => {
    try {
      event.preventDefault();

      const newBlog = {
        title: blogTitle,
        url: blogUrl,
        author: blogAuthor,
      };

      const blogCreated = await add(newBlog);

      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");

      showNotification(
        `Added new blog: ${blogCreated.title} by ${blogCreated.author}`,
        "success",
      );

      navigate("/");
    } catch (err) {
      showNotification(err.response.data.error, "error");
      if (err.response.status === 401) {
        logout();
      }
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
