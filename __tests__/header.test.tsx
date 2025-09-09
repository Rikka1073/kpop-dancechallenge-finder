import Header from "@/components/feature/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Protect: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ヘッダーコンポーネントのテスト", () => {
  test("正常にレンダリングされること", () => {
    render(
      <ClerkProvider>
        <Header />
      </ClerkProvider>
    );
    screen.debug();
    expect(screen.getByTestId("header-main-title")).toBeInTheDocument();
  });
});
