import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./components/Header/Header";

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Creations")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
