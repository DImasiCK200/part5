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

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import BlogList from "./components/BlogList";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

let timeout = null;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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

  const showNotification = (message, status) => {
    setNotification({ text: message, type: status });

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

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
      const blogCreated = await blogService.create(blogObject);

      if (blogCreated) {
        showNotification(
          `Added new blog: ${blogCreated.title} by ${blogCreated.author}`,
          "success",
        );
        setBlogs(blogs.concat(blogCreated));
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
    </Container>
  );
};

export default App;
