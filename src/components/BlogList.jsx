import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>Blog list</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
