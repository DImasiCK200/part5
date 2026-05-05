import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Link,
} from "@mui/material";

const Blog = ({ blog, user, handleLike, handleDelete }) => {
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
