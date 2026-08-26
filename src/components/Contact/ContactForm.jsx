import { useRef, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { trackEvent } from "../../utils/analytics";
import { sendContactMessage } from "./contactApi";
import useTurnstile from "./useTurnstile";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAD-tMwRaBgwd0Ymq";

const alertTheme = {
  background: "#0a101e",
  color: "#fdfeff",
  buttonsStyling: false,
  showConfirmButton: false,
  showCloseButton: true,
  customClass: {
    popup: "st-alert-popup",
    htmlContainer: "st-alert-text",
    closeButton: "st-alert-close",
    confirmButton: "st-alert-button",
  },
};

const showContactAlert = (options) => {
  Swal.fire({
    ...alertTheme,
    ...options,
    customClass: {
      ...alertTheme.customClass,
      ...options.customClass,
    },
  });
};

export const ContactForm = () => {
  const form = useRef();
  const {
    containerRef: turnstileContainer,
    token: turnstileToken,
    error: turnstileError,
    reset: resetTurnstile,
  } = useTurnstile(TURNSTILE_SITE_KEY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const currentForm = form.current;
    const formElements = currentForm.elements;

    if (formElements.namedItem("company")?.value) {
      return;
    }

    const formData = {
      name: formElements.namedItem("user_name").value.trim(),
      email: formElements.namedItem("user_email").value.trim(),
      subject: formElements.namedItem("user_subject").value.trim(),
      message: formElements.namedItem("message").value.trim(),
    };

    if (!isValidEmail(formData.email)) {
      showContactAlert({
        icon: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    if (!currentForm.checkValidity()) {
      currentForm.reportValidity();
      return;
    }

    if (!turnstileToken || turnstileError) {
      showContactAlert({
        icon: "error",
        text: "Please complete the security check",
      });
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await sendContactMessage({
        formData,
        turnstileToken,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Contact worker rejected the message");
      }

      showContactAlert({
        icon: "success",
        text: "Message sent",
        timer: 2000,
      });
      trackEvent("contact_form_success", {
        form_name: "contact",
      });
      form.current.reset();
      resetTurnstile();
    } catch (error) {
      showContactAlert({
        icon: "error",
        text:
          error.name === "AbortError"
            ? "The request timed out. Please try again later."
            : "Your message could not be sent at this time. Please try again later",
        timer: 3000,
      });
      trackEvent("contact_form_error", {
        form_name: "contact",
      });
      resetTurnstile();
    } finally {
      window.clearTimeout(requestTimeout);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        ref={form}
        name="contact"
        method="POST"
        className="st-contact-form"
        id="contact-form"
        onSubmit={sendEmail}
        noValidate
        aria-busy={isSubmitting}
      >
        <fieldset className="st-contact-fields" disabled={isSubmitting}>
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              tabIndex="-1"
              autoComplete="off"
            />
          </div>
          <div className="st-form-field">
            <input
              type="text"
              id="name"
              name="user_name"
              placeholder="Your Name"
              required
              minLength="2"
              maxLength="100"
            />
          </div>
          <div className="st-form-field">
            <input
              type="email"
              id="email"
              name="user_email"
              placeholder="Your Email"
              required
              maxLength="254"
            />
          </div>
          <div className="st-form-field">
            <input
              type="text"
              id="subject"
              name="user_subject"
              placeholder="Your Subject"
              required
              minLength="2"
              maxLength="200"
            />
          </div>
          <div className="st-form-field">
            <textarea
              cols="30"
              rows="10"
              id="msg"
              name="message"
              placeholder="Your Message"
              required
              minLength="2"
              maxLength="5000"
            ></textarea>
          </div>
          <div
            className="st-form-field"
            ref={turnstileContainer}
            aria-label="Security check"
          ></div>
          {turnstileError && (
            <p className="st-form-error" role="alert">
              {turnstileError}
            </p>
          )}
          <button
            className="st-btn st-style1 st-color1"
            type="submit"
            id="submit"
            name="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </fieldset>
      </form>
    </>
  );
};

export default ContactForm;
