import formatViewCount from "@/lib/formatViewCount";
import { describe, expect } from "vitest";

describe("formatViewCount", () => {
  test("100未満の数値はそのまま文字列化される", () => {
    expect(formatViewCount(99)).toBe("99");
  });

  test("1000以上はK表記になる", () => {
    expect(formatViewCount(1500)).toBe("1.5K");
    expect(formatViewCount(1000)).toBe("1.0K");
    expect(formatViewCount(9999)).toBe("10.0K");
  });

  test("100万以上はM表記になる", () => {
    expect(formatViewCount(1000000)).toBe("1.0M");
    expect(formatViewCount(2500000)).toBe("2.5M");
  });
});
