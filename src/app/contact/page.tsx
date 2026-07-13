// app/contact/page.tsx
"use client";

import { useState } from "react";
import { BASE_URL } from "@/app/services/baseUrl";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", phone: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = () => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!form.email.trim()) next.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Enter your phone number";
    else if (!/^[+\d][\d\s-]{6,15}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setSending(true);
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setForm(EMPTY);
      } else {
        setServerError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Failed to send. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#111",
        fontFamily:
          "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 40px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
        }}
        className="contact-grid"
      >
        {/* ================= LEFT — heading + info ================= */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: "clamp(56px, 8vw, 104px)",
              fontWeight: 300,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              margin: "0 0 48px",
            }}
          >
            Get in
            <br />
            touch
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.55,
              fontWeight: 300,
              maxWidth: "420px",
              margin: "0 0 auto",
            }}
          >
            Have a project in mind? Reach out to us, and we&apos;ll discuss the
            best possible way to move forward.
          </p>

          <div style={{ marginTop: "64px" }}>
            <a
              href="tel:+917736078808"
              style={{
                display: "block",
                fontSize: "20px",
                fontWeight: 300,
                color: "#111",
                textDecoration: "none",
                marginBottom: "8px",
              }}
            >
              (+91) 77360 78808
            </a>
            <a
              href="mailto:info@phitany.com"
              style={{
                display: "block",
                fontSize: "24px",
                fontWeight: 600,
                color: "#111",
                textDecoration: "none",
              }}
            >
              info@phitany.com
            </a>
          </div>
        </div>

        {/* ================= RIGHT — form / success ================= */}
        <div>
          {submitted ? (
            /* ---------- success state ---------- */
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "16px",
              }}
              role="status"
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: 300,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Message sent
              </h2>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: 300,
                  color: "#555",
                  margin: 0,
                  maxWidth: "360px",
                  lineHeight: 1.6,
                }}
              >
                Thanks for reaching out. We&apos;ll be in touch soon.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  alignSelf: "flex-start",
                  marginTop: "8px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "15px",
                  color: "#111",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  cursor: "pointer",
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ---------- form ---------- */
            <form onSubmit={handleSubmit} noValidate>
              {serverError && (
                <div
                  role="alert"
                  style={{
                    marginBottom: "32px",
                    padding: "14px 18px",
                    border: "1px solid #d33",
                    color: "#b22",
                    fontSize: "14px",
                    borderRadius: "8px",
                  }}
                >
                  {serverError}
                </div>
              )}

              {(
                [
                  { field: "name", label: "Name", type: "text" },
                  { field: "email", label: "Email ID", type: "email" },
                  { field: "phone", label: "Phone Number", type: "tel" },
                ] as const
              ).map(({ field, label, type }) => (
                <div key={field} style={{ marginBottom: "44px" }}>
                  <label
                    htmlFor={field}
                    style={{
                      display: "block",
                      fontSize: "17px",
                      fontWeight: 300,
                      color: errors[field] ? "#b22" : "#9a9a9a",
                      marginBottom: "6px",
                    }}
                  >
                    {label} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={field}
                    type={type}
                    value={form[field]}
                    onChange={set(field)}
                    disabled={sending}
                    aria-invalid={!!errors[field]}
                    style={{
                      width: "100%",
                      border: "none",
                      borderBottom: `1px solid ${
                        errors[field] ? "#d33" : "#c9c9c9"
                      }`,
                      outline: "none",
                      padding: "8px 0 12px",
                      fontSize: "18px",
                      fontWeight: 300,
                      background: "transparent",
                      borderRadius: 0,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "#111")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = errors[field]
                        ? "#d33"
                        : "#c9c9c9")
                    }
                  />
                  {errors[field] && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "13px",
                        color: "#b22",
                      }}
                    >
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div style={{ marginBottom: "56px" }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontSize: "17px",
                    fontWeight: 300,
                    color: "#9a9a9a",
                    marginBottom: "6px",
                  }}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                  disabled={sending}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #c9c9c9",
                    outline: "none",
                    padding: "8px 0 12px",
                    fontSize: "18px",
                    fontWeight: 300,
                    background: "transparent",
                    resize: "vertical",
                    borderRadius: 0,
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottomColor = "#111")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottomColor = "#c9c9c9")
                  }
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  padding: "20px 40px",
                  fontSize: "17px",
                  fontWeight: 500,
                  cursor: sending ? "wait" : "pointer",
                  opacity: sending ? 0.7 : 1,
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!sending)
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {sending ? "Sending..." : "Send To Us"}
                {!sending && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* responsive: stack columns on mobile */}
      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 80px 24px 60px !important;
          }
        }
      `}</style>
    </main>
  );
}