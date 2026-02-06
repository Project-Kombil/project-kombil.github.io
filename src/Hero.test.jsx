import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./components/Hero/Hero";

describe("Hero", () => {
  it("renders title text and author image", () => {
    const data = {
      title: "Hello <span>World</span>",
      text: "Frontend developer.",
      imgAuthor: "/images/author.jpg",
      bgImgLink: "/images/hero-bg.jpg",
    };

    const { asFragment } = render(<Hero data={data} socialData={[]} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /hello/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText("Author Image")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
