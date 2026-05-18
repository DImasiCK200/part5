import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Fallback from "./components/Fallback";
import { useNotification, useNotificationActions } from "./notificationStore";
import { useBlogs, useBlogsActions } from "./blogStore";

const App = () => {
  const blogs = useBlogs();
  const { initialize, add } = useBlogsActions();
  const [user, setUser] = useState(null);

  const notification = useNotification();
  const { showNotification } = useNotificationActions();

  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (userJSON) {
      const userLs = JSON.parse(userJSON);
      setUser(userLs);
      blogService.setToken(userLs.token);
    }
  }, []);

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const handleLogin = async (username, password) => {
    try {
      const userDb = await loginService.login({ username, password });

      showNotification("Successful login!", "success");

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(userDb));
      blogService.setToken(userDb.token);

      setUser(userDb);
      return "success";
    } catch (err) {
      showNotification(err.response.data.error, "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const addBlog = async (blogObject) => {
    try {
      const blogCreated = await add(blogObject);

      if (blogCreated) {
        showNotification(
          `Added new blog: ${blogCreated.title} by ${blogCreated.author}`,
          "success",
        );
        navigate("/");
      }
    } catch (err) {
      showNotification(err.response.data.error, "error");
      if (err.response.status === 401) {
        window.localStorage.removeItem("loggedBlogAppUser");
        setUser(null);
      }
    }
  };

  const likeBlog = async (blogToLike) => {
    try {
      const editBlog = {
        ...blogToLike,
        user: blogToLike.user.id,
        likes: blogToLike.likes + 1,
      };

      const updatedBlog = await blogService.update(editBlog);

      if (updatedBlog) {
        setBlogs(
          blogs.map((blog) =>
            blog.id === updatedBlog.id
              ? { ...blog, likes: updatedBlog.likes }
              : blog,
          ),
        );
      }
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const deleteBlog = async (blogToDelete) => {
    if (
      window.confirm(
        `Do you want to delete ${blogToDelete.title} by ${blogToDelete.author} blog?`,
      )
    ) {
      try {
        await blogService.remove(blogToDelete.id);

        navigate("/");

        showNotification(
          `Successful delete blog: ${blogToDelete.title} `,
          "success",
        );
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      } catch (err) {
        showNotification(err.response.data.error, "error");
      }
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/createBlog">
              new blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />
      <ErrorBoundary FallbackComponent={Fallback}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            }
          />
          <Route
            path="/createBlog"
            element={<BlogForm createBlog={addBlog} user={user} />}
          />
          <Route path="/login" element={<Login loginUser={handleLogin} />} />
          <Route path="/*" element={<h2>404 - Page not found</h2>} />
          <Route
            path="/"
            element={
              <BlogList
                blogs={blogs}
                user={user}
                handleLike={likeBlog}
                handleDelete={deleteBlog}
              />
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
