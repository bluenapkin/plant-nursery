import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ── Mock the logo image so it doesn't fail in test environment ──
vi.mock("../src/img/logo.png", () => ({ default: "logo.png" }));

import About from "../src/Components/About";

describe("About", () => {

  it("should have the developer name", () => {
  render(<About />);
  const devName = screen.getByText(/Nawaf/i);
  expect(devName).toBeInTheDocument();
  });

  it("should render the About component", () => {
    render(<About />);
    const aboutElement = screen.getByRole("heading", { level: 1 });
    expect(aboutElement).toBeInTheDocument();
  });

  it("should have the text Ghars", () => {
    render(<About />);
    const text = screen.queryByText(/ghars/i);
    expect(text).toBeInTheDocument();
  });

  it("should have the logo image", () => {
    render(<About />);
    const image = screen.getByAltText("gharslogo");
    expect(image).toHaveClass("about-logo");
  });

  it("should have a contact button", () => {
    render(<About />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should have correct button text", () => {
    render(<About />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/Contact Developer/i);
  });

});