import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { trackEvent } from "../../utils/analytics";

const CONTACT_WORKER_URL =
  import.meta.env.VITE_CONTACT_WORKER_URL ||
  "https://online-portfolio-contact-form.kombil.workers.dev/";
const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAD-tMwRaBgwd0Ymq";
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise;

const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

    const handleLoad = () => resolve();
    const handleError = () => {
      turnstileScriptPromise = null;
      reject(new Error("Turnstile script could not be loaded"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.body.appendChild(script);
  });

  return turnstileScriptPromise;
};

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
  const turnstileContainer = useRef(null);
  const turnstileWidgetId = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderTurnstile = () => {
      if (!isMounted) return;
      if (!window.turnstile || !turnstileContainer.current) return;
      if (turnstileWidgetId.current !== null) return;

      turnstileWidgetId.current = window.turnstile.render(
        turnstileContainer.current,
        {
          sitekey: TURNSTILE_SITE_KEY,
          callback: setTurnstileToken,
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        }
      );
    };

    loadTurnstile()
      .then(renderTurnstile)
      .catch(() => {
        if (isMounted) {
          setTurnstileError(
            "The security check could not be loaded. Please refresh the page and try again.",
          );
        }
      });

    return () => {
      isMounted = false;
      if (window.turnstile && turnstileWidgetId.current !== null) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (window.turnstile && turnstileWidgetId.current !== null) {
      window.turnstile.reset(turnstileWidgetId.current);
    }
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
      const response = await fetch(CONTACT_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
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
