import NotFound from "@/app/not-found";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("not-found ページ", () => {
  test("見つからないときの案内を出す", () => {
    render(<NotFound />);

    expect(screen.getByTestId("not-found")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ページが見つかりませんでした" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ホームへ戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "検索へ" })).toHaveAttribute("href", "/search");
  });
});
