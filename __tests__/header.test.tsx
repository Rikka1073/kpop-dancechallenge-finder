import Header from "@/components/feature/Header";
import { render, screen } from "@testing-library/react";

describe("ヘッダーコンポーネントのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(<Header />);
    screen.debug();
    expect(screen.getByTestId("header-main-title")).toBeInTheDocument();
  });
});
