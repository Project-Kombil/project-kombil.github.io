import { useRef } from "react";
import emailjs from '@emailjs/browser';
import "./Contact.scss";

const ContactForm =() => {

    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs
        .sendForm('service_pi0tvte', 'contact_form#1', form.current, {
          publicKey: 'g-XDVTa4LtET-EtIf',
        })
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    };
    
    return(        
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
                    type="text"
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
    )
}

export default ContactForm;