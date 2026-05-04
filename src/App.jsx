import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
} from "react-router-dom";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import BlogList from "./components/BlogList";
import Login from "./components/Login";
import blogService from "./services/blogs";
import ErrorNotification from "./components/ErrorNotification";
import SuccessNotification from "./components/SuccessNotification";

let timeout = null;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

  const setErrorNotification = (message) => {
    setErrorMessage(message);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const setSuccessNotification = (message) => {
    setSuccessMessage(message);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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
        setSuccessNotification(
          `Added new blog: ${blogCreated.title} by ${blogCreated.author}`,
        );
        setBlogs(blogs.concat(blogCreated));
        navigate("/");
      }
    } catch (err) {
      setErrorNotification(err.response.data.error);
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

        setSuccessNotification(
          `Successful delete blog: ${blogToDelete.title} `,
        );
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      } catch (err) {
        setErrorNotification(err.response.data.error);
      }
    }
  };

  const padding = {
    padding: 5,
  };

  return (
    <>
      <div>
        <Link style={padding} to="/">
          Blogs
        </Link>
        {user && (
          <Link style={padding} to="/createBlog">
            New blog
          </Link>
        )}
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link style={padding} to="/login">
            Login
          </Link>
        )}
      </div>

      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />

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
        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
              setErrorNotification={setErrorNotification}
              setSuccessNotification={setSuccessNotification}
            />
          }
        />
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
    </>
  );
};

export default App;
