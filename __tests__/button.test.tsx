import Register from "@/app/register/page";
import Button from "@/components/ui/Button";
import { render, screen } from "@testing-library/react";

describe("ボタンコンポーネントのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(
      <Button id="test-button" name="test" onClick={() => {}} className="extra-class">
        Click Me
      </Button>
    );
    expect(screen.getByTestId("button-component")).toBeInTheDocument();
  });
});
