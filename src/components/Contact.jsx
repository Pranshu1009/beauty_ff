import { useState } from "react";
import { CONTACT, IMAGES } from "../data";
import "./Contact.css";

const initial = {
  name: "",
  email: "",
  phone: "",
  event: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm(initial);
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-layout">
        <div className="contact-info">
          <h2>
            Let’s Create
            <br />
            Something Beautiful
          </h2>
          <p className="lead">
            Share your date, location, and vision — Roshani will get back with availability and a
            tailored glam plan.
          </p>

          <ul className="details">
            <li>
              <strong>Location</strong>
              <span>Mumbai, India · Travel worldwide</span>
            </li>
            <li>
              <strong>Phone</strong>
              <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <strong>Email</strong>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <strong>Instagram</strong>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                @{CONTACT.instagramHandle}
              </a>
            </li>
          </ul>

          <a href="#contact-form" className="btn btn-solid">
            Book Appointment
          </a>
        </div>

        <div className="contact-panel">
          <form id="contact-form" className="contact-form" onSubmit={onSubmit}>
            <h3>Send a Message</h3>
            <div className="field-row">
              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="you@email.com"
                />
              </label>
            </div>
            <div className="field-row">
              <label>
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                  placeholder="+91 ..."
                />
              </label>
              <label>
                Event / Requirement
                <input
                  name="event"
                  value={form.event}
                  onChange={onChange}
                  required
                  placeholder="Bridal / TV / Editorial"
                />
              </label>
            </div>
            <label>
              Message
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={onChange}
                required
                placeholder="Tell us about your date, look, and location"
              />
            </label>
            <button type="submit" className="btn btn-solid">
              Send Message
            </button>
            {sent && (
              <p className="success" role="status">
                Thank you! Your message has been received.
              </p>
            )}
          </form>

          <div className="contact-portrait">
            <img src={IMAGES.contact} alt="Makeup brushes and beauty setup" />
          </div>
        </div>
      </div>
    </section>
  );
}
