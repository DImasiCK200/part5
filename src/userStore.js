import { create } from "zustand";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/persistentUser";

const useUserStore = create((set) => ({
  user: null,
  actions: {
    initialize: () => {
      const user = userService.getUser();

      if (user) {
        blogService.setToken(user.token);

        set(() => ({ user }));
      }
    },
    login: async (username, password) => {
      const user = await loginService.login({ username, password });

      userService.saveUser(user);
      blogService.setToken(user.token);

      set(() => ({ user }));
    },
    logout: () => {
      userService.removeUser();

      set(() => ({ user: null }));
    },
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserActions = () => useUserStore((state) => state.actions);
