import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg rounded-4 p-4">
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2">📬 Contact Support</h1>
              <p className="text-muted">Have questions or feedback? Send us a message.</p>
            </div>

            {submitted ? (
              <div className="alert alert-success text-center p-4">
                <h4 className="fw-bold mb-2">Thank you!</h4>
                <p className="mb-0">Your message has been sent successfully. Our support team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Type your message or inquiry here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  ✉️ Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
