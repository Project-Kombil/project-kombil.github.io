const CONTACT_WORKER_URL =
  import.meta.env.VITE_CONTACT_WORKER_URL ||
  "https://online-portfolio-contact-form.kombil.workers.dev/";

export const sendContactMessage = ({ formData, turnstileToken, signal }) =>
  fetch(CONTACT_WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      turnstileToken,
    }),
    signal,
  });
