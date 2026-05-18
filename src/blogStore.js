import { create } from "zustand";
import blogService from "./services/blogs";

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs }));
    },
    add: async (blogObject) => {
      const blogCreated = await blogService.create(blogObject);
      set((state) => ({ blogs: state.blogs.concat(blogCreated) }));
      return blogCreated;
    },
    like: async (id) => {
      const blog = get().blogs.find((b) => b.id === id);

      const updated = await blogService.update({
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      });

      set((state) => ({
        blogs: state.blogs.map((b) =>
          b.id === id ? { ...blog, likes: updated.likes } : b,
        ),
      }));
    },
    remove: async (id) => {
      await blogService.remove(id);
      set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }));
    },
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogsActions = () => useBlogStore((state) => state.actions);

export default useBlogStore;
