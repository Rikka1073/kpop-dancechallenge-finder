import Layout from "@/components/layout/Layout";
import { render, screen } from "@testing-library/react";

describe("共通レイアウトのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(
      <Layout>
        <div>テスト</div>
      </Layout>
    );
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
});
