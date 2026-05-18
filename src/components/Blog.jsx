import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Link,
} from "@mui/material";
import { useBlogsActions } from "../blogStore";
import { useNavigate } from "react-router-dom";
import { useNotificationActions } from "../notificationStore";
import { useUser } from "../userStore";

const Blog = ({ blog }) => {
  const user = useUser();
  const { like, remove } = useBlogsActions();
  const navigate = useNavigate();
  const { showNotification } = useNotificationActions();

  if (!blog) {
    return null;
  }

  const handleLike = async (blogToLike) => {
    try {
      await like(blogToLike.id);
    } catch (err) {
      console.log(err.response.data.error);
    }
  };

  const handleDelete = async (blogToDelete) => {
    if (
      window.confirm(
        `Do you want to delete ${blogToDelete.title} by ${blogToDelete.author} blog?`,
      )
    ) {
      try {
        await remove(blogToDelete.id);

        navigate("/");

        showNotification(
          `Successful delete blog: ${blogToDelete.title} `,
          "success",
        );
      } catch (err) {
        showNotification(err.response.data.error, "error");
      }
    }
  };

  return (
    <div style={{ paddingTop: 10 }}>
      <Card style={{ backgroundColor: "#e8e9e8ff" }}>
        <CardContent>
          <Typography variant="h5">{blog.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            by {blog.author}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Link href={blog.url} target="_blank" rel="noopener">
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Added by {blog.user.name}
          </Typography>
          <Typography sx={{ mt: 1 }}>{blog.likes} likes</Typography>
        </CardContent>
        <CardActions>
          {user && (
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                await handleLike(blog);
              }}
            >
              Like
            </Button>
          )}

          {user && user.username === blog.user.username && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(blog)}
            >
              Remove
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default Blog;
