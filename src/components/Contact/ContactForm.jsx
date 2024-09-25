import { useRef } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const ContactForm = () => {
  const form = useRef();

  const sanitizeInput = (input) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerText = input;
    return tempDiv.innerHTML;
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const sanitizedData = {
      name: sanitizeInput(form.current.user_name.value),
      email: sanitizeInput(form.current.user_email.value),
      subject: sanitizeInput(form.current.user_subject.value),
      message: sanitizeInput(form.current.message.value),
    };

    if (!isValidEmail(sanitizedData.email)) {
      Swal.fire({
        icon: "error",
        text: "Please enter a valid email address",
        showConfirmButton: false,
        showCloseButton: true
      });
      return;
    }

    Swal.fire({
      text: "Sending message...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    emailjs
      .send("service_pi0tvte", "contact_form#1", sanitizedData, {
        publicKey: "g-XDVTa4LtET-EtIf",
      })
      .then(
        () => {
          Swal.fire({
            icon: "success",
            text: "Message sent",
            showCloseButton: true,
            showConfirmButton: false,
            background: "#fdfeff",
            timer: 2000
          });
          form.current.reset();
        },
        (error) => {
          Swal.fire({
            icon: "error",
            text: "Your message could not be sent at this time. Please try again later",
            showCloseButton: true,
            showConfirmButton: false,
            background: "#fdfeff",
            timer: 3000
          });
        }
      );
  };

  return (
    <>
      <form
        ref={form}
        name="contact"
        method="POST"
        data-netlify="true"
        className="st-contact-form"
        id="contact-form"
        onSubmit={sendEmail}
      >
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
        <input type="hidden" name="contact" value="contact" />
        <button
          className="st-btn st-style1 st-color1"
          type="submit"
          id="submit"
          name="submit"
        >
          Send Message
        </button>
      </form>
    </>
  );
};

export default ContactForm;
