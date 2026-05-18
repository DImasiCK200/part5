import { create } from "zustand";
import blogService from "./services/blogs";

const useBlogStore = create((set) => ({
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
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogsActions = () => useBlogStore((state) => state.actions);

export default useBlogStore;
