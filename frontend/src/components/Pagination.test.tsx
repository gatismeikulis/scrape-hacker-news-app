import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination Component", () => {
  const page = 3;
  const totalPages = 10;
  const onPageChange = vi.fn();

  test("renders pagination with given props", () => {
    render(
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "←" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "→" })).toBeInTheDocument();
  });

  test("clicking the '←' button decrements the page", () => {
    fireEvent.click(screen.getByTestId("pagination-decrement-button"));
    expect(onPageChange).toHaveBeenCalledWith(page - 1);
  });
});
