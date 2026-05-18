import { useEffect } from "react";
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
import Notification from "./components/Notification";
import Fallback from "./components/Fallback";
import { useNotification } from "./notificationStore";
import { useBlogs, useBlogsActions } from "./blogStore";
import { useUser, useUserActions } from "./userStore";

const App = () => {
  const blogs = useBlogs();
  const { initialize: initBlogs } = useBlogsActions();
  const user = useUser();
  const { initialize: initUser, logout } = useUserActions();

  const notification = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    initBlogs();
  }, [initBlogs]);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const handleLogout = () => {
    logout();
    navigate("/");
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
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route path="/createBlog" element={<BlogForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<h2>404 - Page not found</h2>} />
          <Route path="/" element={<BlogList />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
