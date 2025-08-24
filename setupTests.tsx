import { vi } from "vitest";

vi.mock("@clerk/nextjs", () => {
  return {
    ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Protect: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useUser: () => ({
      isSignedIn: true,
      user: { id: "user_123", fullName: "Test User" },
    }),
  };
});
