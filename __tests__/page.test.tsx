import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import RootLayout from "@/app/layout";

describe("トップページのテスト", () => {
  beforeEach(() => {
    render(<Home />);
  });

  test("メインタイトルが表示されること", () => {
    expect(screen.getByRole("heading", { name: "SeeKPOP", level: 1 })).toBeInTheDocument();
  });
  test("最初のサブタイトルが表示されること", () => {
    expect(screen.getByTestId("first-subTitle")).toBeInTheDocument();
  });
  test("第二のサブタイトルが表示されること", () => {
    expect(screen.getByTestId("second-subTitle")).toBeInTheDocument();
  });
  test("第三のサブタイトルが表示されること", () => {
    expect(screen.getByTestId("third-subTitle")).toBeInTheDocument();
  });
  test("第四のサブタイトルが表示されること", () => {
    expect(screen.getByTestId("fourth-subTitle")).toBeInTheDocument();
  });
});

describe("ページコンポーネントのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(
      <RootLayout>
        <div>テスト</div>
      </RootLayout>
    );
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
  });
});
