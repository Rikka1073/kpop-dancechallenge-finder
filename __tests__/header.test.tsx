import Header from "@/components/feature/Header";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe("ヘッダーコンポーネントのテスト", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("正常にレンダリングされること", () => {
    render(<Header />);
    expect(screen.getByTestId("header-main-title")).toBeInTheDocument();
  });

  test("development では管理画面へのリンクを出す", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<Header />);
    const adminLink = screen.getByTestId("header-admin-link");
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute("href", "/admin");
    expect(adminLink).toHaveTextContent("管理");
  });

  test("production では管理画面へのリンクを出さない", () => {
    vi.stubEnv("NODE_ENV", "production");
    render(<Header />);
    expect(screen.queryByTestId("header-admin-link")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "管理" })).not.toBeInTheDocument();
  });
});
