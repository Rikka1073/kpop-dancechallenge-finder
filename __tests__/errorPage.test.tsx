import ErrorPage from "@/app/error";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

describe("error ページ", () => {
  test("やり直すと reset する", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "エラーが起きました" })).toBeInTheDocument();
    screen.getByRole("button", { name: "やり直す" }).click();
    expect(reset).toHaveBeenCalled();
  });
});
