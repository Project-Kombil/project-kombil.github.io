import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

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
    loader: "st-alert-loader",
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

    loadTurnstile().then(renderTurnstile).catch(() => {});

    return () => {
      isMounted = false;
      if (window.turnstile && turnstileWidgetId.current !== null) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  const sanitizeInput = (input) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerText = input;
    return tempDiv.innerHTML;
  };

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

    const formElements = form.current.elements;

    if (formElements.namedItem("company")?.value) {
      return;
    }

    const sanitizedData = {
      name: sanitizeInput(formElements.namedItem("user_name").value),
      email: sanitizeInput(formElements.namedItem("user_email").value),
      subject: sanitizeInput(formElements.namedItem("user_subject").value),
      message: sanitizeInput(formElements.namedItem("message").value),
    };

    if (!isValidEmail(sanitizedData.email)) {
      showContactAlert({
        icon: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    if (!turnstileToken) {
      showContactAlert({
        icon: "error",
        text: "Please complete the security check",
      });
      return;
    }

    setIsSubmitting(true);
    showContactAlert({
      text: "Sending message...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(CONTACT_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sanitizedData,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact worker rejected the message");
      }

      showContactAlert({
        icon: "success",
        text: "Message sent",
        timer: 2000,
      });
      form.current.reset();
      resetTurnstile();
    } catch (error) {
      showContactAlert({
        icon: "error",
        text: "Your message could not be sent at this time. Please try again later",
        timer: 3000,
      });
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        ref={form}
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="company"
        className="st-contact-form"
        id="contact-form"
        onSubmit={sendEmail}
        noValidate
      >
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
          />
        </div>
        <div className="st-form-field">
          <input
            type="email"
            id="email"
            name="user_email"
            placeholder="Your Email"
            required
          />
        </div>
        <div className="st-form-field">
          <input
            type="text"
            id="subject"
            name="user_subject"
            placeholder="Your Subject"
            required
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
          ></textarea>
        </div>
        <div
          className="st-form-field"
          ref={turnstileContainer}
          aria-label="Security check"
        ></div>
        <input type="hidden" name="contact" value="contact" />
        <button
          className="st-btn st-style1 st-color1"
          type="submit"
          id="submit"
          name="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
