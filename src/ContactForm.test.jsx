import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContactForm } from "./components/Contact/ContactForm";
import Swal from "sweetalert2";

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(), showLoading: vi.fn() },
}));

describe("ContactForm", () => {
  it("validates email before sending", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Subject"), {
      target: { value: "Hello" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), {
      target: { value: "Testing" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Please enter a valid email address",
      })
    );
  });
});
