// app/careers/page.tsx
"use client";

import { useRef, useState } from "react";
import { BASE_URL } from "@/app/services/baseUrl";

// the job being applied for — later this can come from your CMS/API
const JOB = {
  title: "Frontend Developer",
  experience: "3+ years experience",
  type: "Full time, Kochi",
  description: [
    "We're looking for a passionate professional to join our team in Kochi. You'll work alongside strategists, engineers and designers to ship intelligent, performance-driven digital solutions.",
    "If you value craft, ownership and continuous learning, we'd love to see your application.",
  ],
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  cv?: string;
};

export default function CareersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = (file: File | undefined | null) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, cv: "Only PDF, DOC, or DOCX files are accepted" }));
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrors((p) => ({ ...p, cv: "CV must be under 20 MB" }));
      return;
    }
    setErrors((p) => ({ ...p, cv: "" }));
    setCvFile(file);
  };

  const validate = () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter your name";
    if (!email.trim()) next.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    if (!phone.trim()) next.phone = "Enter your phone number";
    else if (!/^[+\d][\d\s-]{6,15}$/.test(phone.trim()))
      next.phone = "Enter a valid phone number";
    if (!cvFile) next.cv = "Please upload your CV";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("jobTitle", JOB.title);
    fd.append("cv", cvFile as File);

    try {
      setSending(true);
      const res = await fetch(`${BASE_URL}/careers/apply`, {
        method: "POST",
        body: fd, // no Content-Type header — browser sets the multipart boundary
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setServerError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Failed to submit. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCvFile(null);
    setErrors({});
    setServerError("");
    setSubmitted(false);
  };

  const underlineInput = (error?: string): React.CSSProperties => ({
    width: "100%",
    border: "none",
    borderBottom: `1px solid ${error ? "#d33" : "#cfcfcf"}`,
    outline: "none",
    padding: "8px 0 12px",
    fontSize: "17px",
    fontWeight: 300,
    background: "transparent",
    borderRadius: 0,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
        className="careers-grid"
      >
        {/* ============ LEFT — job description (dark) ============ */}
        <div style={{ color: "#fff", paddingTop: "24px" }}>
          <h1
            style={{
              fontSize: "clamp(40px, 5vw, 60px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: "0 0 24px",
            }}
          >
            {JOB.title}
          </h1>

          <p style={{ color: "#9a9a9a", fontSize: "18px", fontWeight: 300, margin: "0 0 6px" }}>
            {JOB.experience}
          </p>
          <p style={{ color: "#9a9a9a", fontSize: "18px", fontWeight: 300, margin: "0 0 40px" }}>
            {JOB.type}
          </p>

          {JOB.description.map((para, i) => (
            <p
              key={i}
              style={{
                color: "#e4e4e4",
                fontSize: "19px",
                fontWeight: 300,
                lineHeight: 1.65,
                margin: "0 0 24px",
                maxWidth: "560px",
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* ============ RIGHT — application card (white) ============ */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px 44px",
          }}
        >
          {submitted ? (
            /* ---------- success state ---------- */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "40px 0" }} role="status">
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>
                Application submitted
              </h2>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "#555", margin: 0, lineHeight: 1.6 }}>
                Thanks for applying for the {JOB.title} role. We&apos;ve emailed you a
                confirmation and our team will be in touch.
              </p>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  alignSelf: "flex-start",
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
                Submit another application
              </button>
            </div>
          ) : (
            /* ---------- form ---------- */
            <div>
              {serverError && (
                <div
                  role="alert"
                  style={{
                    marginBottom: "28px",
                    padding: "12px 16px",
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
                  { value: name, set: setName, field: "name", label: "Name", type: "text" },
                  { value: email, set: setEmail, field: "email", label: "Email ID", type: "email" },
                  { value: phone, set: setPhone, field: "phone", label: "Phone Number", type: "tel" },
                ] as const
              ).map(({ value, set, field, label, type }) => (
                <div key={field} style={{ marginBottom: "40px" }}>
                  <label
                    htmlFor={field}
                    style={{
                      display: "block",
                      fontSize: "16px",
                      fontWeight: 400,
                      color: errors[field] ? "#b22" : "#333",
                      marginBottom: "4px",
                    }}
                  >
                    {label} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={field}
                    type={type}
                    value={value}
                    disabled={sending}
                    onChange={(e) => {
                      set(e.target.value);
                      if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
                    }}
                    aria-invalid={!!errors[field]}
                    style={underlineInput(errors[field])}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#111")}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = errors[field] ? "#d33" : "#cfcfcf")
                    }
                  />
                  {errors[field] && (
                    <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#b22" }}>
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              {/* ---------- CV dropzone ---------- */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
                style={{
                  border: `1.5px dashed ${errors.cv ? "#d33" : dragOver ? "#111" : "#c4c4c4"}`,
                  borderRadius: "12px",
                  padding: cvFile ? "20px 24px" : "36px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver ? "#f4f4f2" : "transparent",
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = ""; // allow re-selecting the same file
                  }}
                />

                {cvFile ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <span style={{ fontSize: "22px" }} aria-hidden="true">📄</span>
                      <div style={{ textAlign: "left", minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cvFile.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#8a8a8a" }}>
                          {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      aria-label="Remove file"
                      style={{
                        border: "none",
                        background: "#f1f1f1",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#111"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ marginBottom: "8px" }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p style={{ margin: 0, fontSize: "17px", fontWeight: 500, color: "#111" }}>
                      Upload CV
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "15px", color: "#8a8a8a", fontWeight: 300 }}>
                      Click or Drag &amp; drop here
                    </p>
                  </>
                )}
              </div>

              <p style={{ fontSize: "13.5px", color: errors.cv ? "#b22" : "#9a9a9a", margin: "10px 0 28px", fontWeight: 300 }}>
                {errors.cv || "Formats accepted: pdf / doc / docx. Max 20Mb."}
              </p>

              {/* ---------- buttons ---------- */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: "999px",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? "Submitting..." : "Apply Now"}
                  {!sending && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={sending}
                  style={{
                    background: "#fff",
                    color: "#111",
                    border: "1px solid #d5d5d0",
                    borderRadius: "999px",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>

              <p style={{ fontSize: "14px", color: "#555", marginTop: "28px", fontWeight: 300 }}>
                By applying, you agree to our <strong>Terms</strong> and{" "}
                <strong>Privacy Policy</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* responsive: stack on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .careers-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </main>
  );
}