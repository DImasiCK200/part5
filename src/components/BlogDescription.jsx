const BlogDescription = ({ style, blog }) => (
  <div style={style}>
    <div>Url: {blog.url}</div>
    <div>
      Likes: {blog.likes} <button>Like</button>
    </div>
    <div>Created by: {blog.user.name}</div>
  </div>
);

export default BlogDescription;
