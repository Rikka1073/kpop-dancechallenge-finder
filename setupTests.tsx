import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ className: "geist-sans", variable: "geist-sans-variable" }),
  Geist_Mono: () => ({ className: "geist-mono", variable: "geist-mono-variable" }),
}));
