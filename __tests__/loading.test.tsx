import Loading from "@/components/feature/loading";
import { render, screen } from "@testing-library/react";

describe("共通レイアウトのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(<Loading />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
