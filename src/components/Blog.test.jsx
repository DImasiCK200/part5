import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

let likeMockHandler;
let deleteMockHandler;

describe("<Blog />", () => {
  beforeEach(() => {
    const user = {
      name: "TestUser",
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

  test("title and author are visible", () => {
    expect(screen.getByText("Author: Test author")).toBeVisible();
    expect(screen.getByText("Test title")).toBeVisible();
  });

  test("likes and url are not visible", () => {
    expect(screen.getByText("Likes: 100")).not.toBeVisible();
    expect(screen.getByText("Url: http://test.com/")).not.toBeVisible();
  });

  test("after clicking the button, likes and url are visible", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("View");

    await user.click(button);

    expect(screen.getByText("Author: Test author")).toBeVisible();
    expect(screen.getByText("Test title")).toBeVisible();
  });

  test("after clicking the like button twice, it handle twice", async () => {
    const user = userEvent.setup();
    const likeButton = screen.getByText("Like");

    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeMockHandler.mock.calls).toHaveLength(2);
  });
});
