import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogDescription from "./components/BlogDescription";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ErrorNotification from "./components/ErrorNotification";
import SuccessNotification from "./components/SuccessNotification";

let timeout = null;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userDb = await loginService.login({ username, password });

      setSuccessNotification("Successful login!");

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(userDb));
      blogService.setToken(userDb.token);

      setUser(userDb);
      setUsername("");
      setPassword("");
    } catch (err) {
      setErrorNotification(err.response.data.error);
    }
  };

  const handleLogout = () => {
    setUser(null);
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
        blogFormRef.current.toggleVisibility();
      }
    } catch (err) {
      setErrorNotification(err.response.data.error);
      if (err.response.status === 401) {
        window.localStorage.removeItem("loggedBlogAppUser");
        setUser(null);
      }
    }
  };

  const blogForm = () => (
    <div>
      <div>
        <h2>Logged in</h2>
        <div>
          {user.name}
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <h2>New blog</h2>
      <Togglable buttonLable={"New blog"} ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
          handleLogout={handleLogout}
          user={user}
        />
      </Togglable>
    </div>
  );

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />

      {!user && loginForm()}
      {user && blogForm()}

      <div>
        <h2>Blog list</h2>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog}>
            {/* <Togglable buttonLable={"View"}>
              <BlogDescription blog={blog} />
            </Togglable> */}
          </Blog>
        ))}
      </div>
    </div>
  );
};

export default App;
