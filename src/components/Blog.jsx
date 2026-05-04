const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const style = {
    border: "solid",
    borderWidth: 1,
    margin: "5px",
    padding: "10px",
    width: "50%",
    borderRadius: "20px",
  };

  const styleUrl = {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  };

  const deleteButton = () => (
    <div>
      <button onClick={() => handleDelete(blog)}>Delete</button>
    </div>
  );

  return (
    <div style={style}>
      <h3>{blog.title}</h3>
      <div>Author: {blog.author}</div>
      <div>
        <div style={styleUrl}>Url: {blog.url}</div>
        <div>
          Likes: {blog.likes}
          {user && (
            <button
              onClick={async () => {
                await handleLike(blog);
              }}
            >
              Like
            </button>
          )}
        </div>
        <div>Created by: {blog.user.name}</div>
      </div>
      {user && user.username === blog.user.username && deleteButton()}
    </div>
  );
};

export default Blog;
