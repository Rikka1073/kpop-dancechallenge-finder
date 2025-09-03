import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { ClerkProvider } from "@clerk/nextjs";
import RootLayout from "@/app/layout";

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Protect: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("トップページのテスト", () => {
  beforeEach(() => {
    render(
      <ClerkProvider>
        <Home />
      </ClerkProvider>
    );
  });

  test("メインタイトルが表示されること", () => {
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
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

describe("ページコンポーネント", () => {
  test("正常にレンダリングされること", () => {
    render(
      <RootLayout>
        <div>テスト</div>
      </RootLayout>
    );
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
  });
});
