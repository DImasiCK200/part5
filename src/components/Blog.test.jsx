import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";

import Blog from "./Blog";
import { describe } from "vitest";

let likeMockHandler;
let deleteMockHandler;

describe("<Blog />", () => {
  describe("When user not authorized", () => {
    beforeEach(() => {
      const user = null;

      const blog = {
        title: "Test title",
        author: "Test author",
        likes: 100,
        url: "http://test.com/",
        user: { username: "Test user" },
      };

      likeMockHandler = vi.fn();
      deleteMockHandler = vi.fn();

      render(
        <Blog
          blog={blog}
          user={user}
          handleLike={likeMockHandler}
          handleDelete={deleteMockHandler}
        />,
      );
    });

    test.only("likes are visible, but button isnt", () => {
      expect(screen.getByText("Likes: 100")).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Like" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("When user authorized", () => {
    beforeEach(() => {
      const user = {
        name: "Test user #1",
      };

      const blog = {
        title: "Test title",
        author: "Test author",
        likes: 100,
        url: "http://test.com/",
        user: { username: "Test user #2" },
      };

      likeMockHandler = vi.fn();
      deleteMockHandler = vi.fn();

      render(
        <Blog
          blog={blog}
          user={user}
          handleLike={likeMockHandler}
          handleDelete={deleteMockHandler}
        />,
      );
    });

    test.only("likes and button are visible", () => {
      expect(screen.getByText("Likes: 100")).toBeVisible();
      expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Delete" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("When user is creator of blog", () => {
    beforeEach(() => {
      const user = {
        name: "Test user #1",
      };

      const blog = {
        title: "Test title",
        author: "Test author",
        likes: 100,
        url: "http://test.com/",
        user,
      };

      likeMockHandler = vi.fn();
      deleteMockHandler = vi.fn();

      render(
        <Blog
          blog={blog}
          user={user}
          handleLike={likeMockHandler}
          handleDelete={deleteMockHandler}
        />,
      );
    });

    test.only("likes are visible, but button isnt", () => {
      expect(screen.getByText("Likes: 100")).toBeVisible();
      expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    });
  });
});
