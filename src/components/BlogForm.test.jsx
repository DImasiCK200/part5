import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";
import { expect } from "vitest";

describe("<BlogForm />", () => {
  test("createFn handle correct attributes", async () => {
    const mockCreateBlogHandler = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={mockCreateBlogHandler} />);

    const inputTitle = screen.getByLabelText("Title");
    const inputAuthor = screen.getByLabelText("Author");
    const inputUrl = screen.getByLabelText("Url");

    const createButton = screen.getByText("Create");

    await user.type(inputTitle, "Test Title");
    await user.type(inputAuthor, "Test Author");
    await user.type(inputUrl, "Test Url");

    await user.click(createButton);

    expect(mockCreateBlogHandler).toHaveBeenCalledWith({
      title: "Test Title",
      author: "Test Author",
      url: "Test Url",
    });
  });
});
