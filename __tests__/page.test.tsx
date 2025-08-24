import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { ClerkProvider } from "@clerk/nextjs";

test("Home", () => {
  render(
    <ClerkProvider>
      <Home />
    </ClerkProvider>
  );
  expect(screen.getByTestId("home-title"));
});
