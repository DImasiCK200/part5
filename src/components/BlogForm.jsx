import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");

  const handleBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: blogTitle,
      url: blogUrl,
      author: blogAuthor,
    };

    const createdBlog = await createBlog(newBlog);

    if (createdBlog) {
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleBlog}>
          <div>
            <label>
              Title
              <input
                type="text"
                value={blogTitle}
                onChange={({ target }) => setBlogTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Author
              <input
                type="text"
                value={blogAuthor}
                onChange={({ target }) => setBlogAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Url
              <input
                type="text"
                value={blogUrl}
                onChange={({ target }) => setBlogUrl(target.value)}
              />
            </label>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
