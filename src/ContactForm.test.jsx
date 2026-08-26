import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ContactForm } from "./components/Contact/ContactForm";
import Swal from "sweetalert2";

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(), showLoading: vi.fn() },
}));

vi.mock("./utils/analytics", () => ({
  trackEvent: vi.fn(),
}));

const turnstileToken = "test-turnstile-token";

const fillContactForm = (container, { email = "test@example.com" } = {}) => {
  container.querySelector('[name="user_name"]').value = "Test User";
  container.querySelector('[name="user_email"]').value = email;
  container.querySelector('[name="user_subject"]').value = "Hello";
  container.querySelector('[name="message"]').value = "Testing";
};

describe("ContactForm", () => {
  afterEach(() => {
    cleanup();
    delete window.turnstile;
    delete global.fetch;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    window.turnstile = {
      render: vi.fn((_container, options) => {
        options.callback(turnstileToken);
        return "widget-id";
      }),
      remove: vi.fn(),
      reset: vi.fn(),
    };
  });

  it("validates email before sending", () => {
    const { container } = render(<ContactForm />);

    fillContactForm(container, { email: "not-an-email" });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Please enter a valid email address",
      })
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires a Turnstile token before sending", () => {
    window.turnstile.render.mockImplementation(() => "widget-id");
    const { container } = render(<ContactForm />);

    fillContactForm(container);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Please complete the security check",
      })
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses native validation for required form fields", () => {
    const reportValidity = vi
      .spyOn(HTMLFormElement.prototype, "reportValidity")
      .mockReturnValue(false);
    const { container } = render(<ContactForm />);

    fillContactForm(container);
    container.querySelector('[name="user_subject"]').value = "";

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(reportValidity).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends contact form data with the Turnstile token", async () => {
    fetch.mockResolvedValue({ ok: true });
    const { container } = render(<ContactForm />);

    await waitFor(() => {
      expect(window.turnstile.render).toHaveBeenCalled();
    });

    fillContactForm(container);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://online-portfolio-contact-form.kombil.workers.dev/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            subject: "Hello",
            message: "Testing",
            turnstileToken,
          }),
        })
      );
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "Message sent",
      })
    );
  });

  it("shows an error and resets Turnstile when the Worker rejects a message", async () => {
    fetch.mockResolvedValue({ ok: false });
    const { container } = render(<ContactForm />);

    await waitFor(() => {
      expect(window.turnstile.render).toHaveBeenCalled();
    });

    fillContactForm(container);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Your message could not be sent at this time. Please try again later",
        })
      );
      expect(window.turnstile.reset).toHaveBeenCalledWith("widget-id");
    });
  });

  it("preserves message text while trimming leading and trailing whitespace", async () => {
    fetch.mockResolvedValue({ ok: true });
    const { container } = render(<ContactForm />);

    await waitFor(() => {
      expect(window.turnstile.render).toHaveBeenCalled();
    });

    fillContactForm(container);
    container.querySelector('[name="user_name"]').value = "  A & B  ";
    container.querySelector('[name="message"]').value = "  Hello & welcome  ";

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://online-portfolio-contact-form.kombil.workers.dev/",
        expect.objectContaining({
          body: JSON.stringify({
            name: "A & B",
            email: "test@example.com",
            subject: "Hello",
            message: "Hello & welcome",
            turnstileToken,
          }),
        })
      );
    });
  });
});
