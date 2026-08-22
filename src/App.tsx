import { useState, useEffect } from "react";


type Screen =
  | "splash"
  | "welcome"
  | "signup"
  | "otp"
  | "vehicle"
  | "vehicle-details"
  | "category"
  | "hospital-details"
  | "map"
  | "profile"
  | "journey-active"
  | "journey-ended"
  | "upload-file"
  | "challan"
  | "verified";

interface UserData {
  name: string;
  phone: string;
  email: string;
  vehicleNumber: string;
  category: "private" | "ambulance" | null;
  hospitalName: string;
  hospitalRefId: string;
  origin: string;
  destination: string;
}

const VEHICLE_DB: Record<string, { owner: string; model: string; registered: string; state: string; ownerPhone: string }> = {
  "HR68BL2731": { owner: "Ramesh Kumar",  model: "Tata Winger Ambulance CNG",    registered: "2022-03-15", state: "Haryana",       ownerPhone: "98XXXX3412" },
  "CH01DC1562": { owner: "Mukesh Sharma", model: "Maruti Suzuki Ertiga CNG",      registered: "2026-03-29", state: "Chandigarh", ownerPhone: "91XXXX7821" },
  "PB65J4068": { owner: "Aakash Singh",  model: "Toyota Innova Crysta 2.4 GX",  registered: "2023-01-10", state: "Punjab", ownerPhone: "70XXXX5509" },
};

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const fontSizes = { sm: "20px", md: "24px", lg: "36px" };
  const pixelSizes = { sm: { width: '28px', height: '28px' }, md: { width: '40px', height: '40px' }, lg: { width: '56px', height: '56px' } };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "8px 0", boxSizing: "border-box" }}>
      {/* Red Icon Container */}
      <div 
        style={{ 
          ...pixelSizes[size], 
          borderRadius: "12px", 
          backgroundColor: "#dc2626", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          flexShrink: 0,
          boxShadow: "0 0 20px rgba(220,38,38,0.4)" 
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          style={{ width: '65%', height: '65%', maxWidth: '100%', maxHeight: '100%' }}
        >
          <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z" fill="rgba(255,255,255,0.15)" />
          <path d="M16 8v10M16 18l-4-4M16 18l4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="22" r="1.5" fill="white" />
        </svg>
      </div>

      {/* Brand Name Text */}
      <div style={{ fontSize: fontSizes[size], fontWeight: 700, fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
        <span style={{ color: '#ffffff' }}>Abhaya</span>
        <span style={{ color: '#dc2626', fontFamily: "Noto Sans Devanagari, sans-serif", fontWeight: 700 }}>पथ</span>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px 4px 20px", color: "#ffffff", fontSize: "12px", width: "100%", boxSizing: "border-box", userSelect: "none" }}>
      <span style={{ fontFamily: "Poppins, sans-serif", color: "#ffffff", fontWeight: 500 }}>9:41</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Signal Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#ffffff' }}>
          <path d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4" />
        </svg>
        {/* Wi-Fi Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#ffffff' }}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        {/* Horizontal Battery Icon (Left-to-Right) */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '12px', color: '#ffffff' }}>
          <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
          <line x1="23" y1="10" x2="23" y2="14" />
          <rect x="3" y="8" width="12" height="8" rx="1" ry="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1 text-white/70 hover:text-white transition-colors">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#dc2626]/60 focus:bg-[#1f2937] transition-all placeholder:text-white/30"
      />
    </div>
  );
}


function PrimaryButton({ label, onClick, disabled, variant = "red" }: {
  label: string; onClick: () => void; disabled?: boolean; variant?: "red" | "navy" | "amber";
}) {
  const colors = {
    red: "bg-[#dc2626] hover:bg-[#b91c1c] shadow-[0_4px_20px_rgba(220,38,38,0.4)]",
    navy: "bg-[#1e3a8a] hover:bg-[#1a2780] shadow-[0_4px_20px_rgba(30,58,138,0.4)]",
    amber: "bg-[#f59e0b] hover:bg-[#d97706] shadow-[0_4px_20px_rgba(245,158,11,0.4)]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl py-4 font-semibold text-white text-base tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${colors[variant]}`}
      style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.05rem", letterSpacing: "0.04em" }}
    >
      {label}
    </button>
  );
}

// ─── SCREENS ────────────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100%", backgroundColor: "#0a0f2e", gap: "20px", boxSizing: "border-box", position: "relative", margin: 0, padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Logo size="lg" />
      </div>
      <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "Poppins, sans-serif", margin: 0, textAlign: "center" }}>
        FEARLESS PATH DESIGNED FOR SMART INDIA(TESTING APP)
      </p>
      <div style={{ position: "absolute", bottom: "48px", display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#dc2626" }} />
        ))}
      </div>
    </div>
  );
}

function WelcomeScreen({ onSignup, onLogin }: { onSignup: () => void; onLogin: () => void }) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden" }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px", justifyContent: "space-between", boxSizing: "border-box", overflowY: "auto" }}>
        
        {/* Top Header Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Logo size="md" />

          <div>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.7rem", color: "#ffffff", fontWeight: 700, lineHeight: "1.2", margin: 0 }}>
              Fearless Path for<br />
              <span style={{ color: "#dc2626" }}>Smart India Health</span>
            </h1>
            <p style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600, marginTop: "4px", marginBottom: 0, letterSpacing: "0.03em" }}>
              #Go With AbhayaPath
            </p>
          </div>

          {/* Compact Feature Cards - Only visible in Sign Up tab */}
          {tab === "signup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: "🚑", text: "Real-time ambulance corridor" },
                { icon: "🛡️", text: "AI emergency file verification with TLS MQTT encryption" },
                { icon: "⚡", text: "Instant e-challan for misuse" },
                { icon: "🙋", text: "ONE USER ONE DEVICE" },
              ].map(f => (
                <div 
                  key={f.text} 
                  style={{ 
                    backgroundColor: "#1e295d", 
                    border: "1px solid rgba(255, 255, 255, 0.15)", 
                    borderRadius: "10px", 
                    padding: "8px 12px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px" 
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{f.icon}</span>
                  <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 500, lineHeight: "1.3" }}>{f.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab Switcher */}
          <div style={{ backgroundColor: "#1e295d", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "10px", padding: "3px", display: "flex" }}>
            <button
              type="button"
              onClick={() => setTab("signup")}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: tab === "signup" ? "#dc2626" : "transparent",
                color: tab === "signup" ? "#ffffff" : "#9ca3af",
                fontFamily: "Rajdhani, sans-serif",
                transition: "all 0.2s ease"
              }}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setTab("login")}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: tab === "login" ? "#dc2626" : "transparent",
                color: tab === "login" ? "#ffffff" : "#9ca3af",
                fontFamily: "Rajdhani, sans-serif",
                transition: "all 0.2s ease"
              }}
            >
              Login
            </button>
          </div>

          {/* Dynamic Form Area */}
          {tab === "signup" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <p style={{ color: "#9ca3af", fontSize: "12px", textAlign: "center", margin: 0 }}>Create your AbhayaPath account to get started.</p>
              <button
                type="button"
                onClick={onSignup}
                style={{
                  width: "100%",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  padding: "12px 0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
                  fontFamily: "Rajdhani, sans-serif",
                  letterSpacing: "0.5px"
                }}
              >
                Create New Account
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Mobile Number</label>
                <input
                  value={loginPhone}
                  onChange={e => setLoginPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  type="tel"
                  placeholder="10-digit mobile number"
                  style={{
                    width: "100%",
                    backgroundColor: "#1e295d",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  type="password"
                  placeholder="Your password"
                  style={{
                    width: "100%",
                    backgroundColor: "#1e295d",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={onLogin}
                disabled={loginPhone.length < 10 || loginPass.length < 4}
                style={{
                  width: "100%",
                  backgroundColor: loginPhone.length < 10 || loginPass.length < 4 ? "#374151" : "#dc2626",
                  color: "#ffffff",
                  padding: "12px 0",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                  cursor: loginPhone.length < 10 || loginPass.length < 4 ? "not-allowed" : "pointer",
                  marginTop: "6px",
                  fontFamily: "Rajdhani, sans-serif",
                  letterSpacing: "0.5px"
                }}
              >
                Login →
              </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "10px", textAlign: "center", margin: "10px 0 0 0", lineHeight: "1.3" }}>
          Regulated by MoRTH · Government of India | IDEA BY SIET PANCHKULA(TECH SIRENS)
        </p>

      </div>
    </div>
  );
}
function SignupScreen({ onBack, onNext, user, setUser }: {
  onBack: () => void; onNext: () => void; user: UserData; setUser: (u: UserData) => void;
}) {
  const valid = user.name.length > 2 && user.phone.length === 10 && user.email.includes("@");
  
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0a0f2e" }}>
      <StatusBar />
      {/* Compact padding */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", maxWidth: "420px", margin: "0 auto", padding: "12px 20px 24px 20px", overflowY: "auto", boxSizing: "border-box" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>

        <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, marginBottom: "2px", fontFamily: "Rajdhani, sans-serif" }}>Create Account</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "20px" }}>Register to access AbhayaPath services</p>

        {/* Compact Form Inputs Stack (gap reduced to 10px) */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
          
          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Full Name</label>
            <input
              type="text"
              value={user.name}
              onChange={e => setUser({ ...user, name: e.target.value })}
              placeholder="e.g. Ankit"
              style={{ width: "100%", display: "block", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Mobile Number */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Mobile Number</label>
            <input
              type="tel"
              value={user.phone}
              onChange={e => setUser({ ...user, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="10-digit mobile number"
              style={{ width: "100%", display: "block", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Email Address */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Email Address</label>
            <input
              type="email"
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
              placeholder="you@example.com"
              style={{ width: "100%", display: "block", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password" 
              style={{ width: "100%", display: "block", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Terms Box */}
          <div style={{ backgroundColor: "rgba(26,39,128,0.3)", border: "1px solid rgba(30,58,138,0.4)", borderRadius: "10px", padding: "12px", marginTop: "2px", boxSizing: "border-box" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", lineHeight: "1.4", margin: 0 }}>
              By creating an account you agree to AbhayaPaths's Terms of Service and consent to the processing of vehicle data under MoRTH regulations.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "20px", width: "100%" }}>
          <PrimaryButton label="Continue →" onClick={onNext} disabled={!valid} />
        </div>

      </div>
    </div>
  );
}

function VehicleScreen({ onBack, onNext, user, setUser }: {
  onBack: () => void; onNext: () => void; user: UserData; setUser: (u: UserData) => void;
}) {
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [details, setDetails] = useState<typeof VEHICLE_DB[string] | null>(null);
  const [error, setError] = useState("");

  const lookup = () => {
    const v = VEHICLE_DB[user.vehicleNumber.toUpperCase()];
    if (v) { setDetails(v); setError(""); } else { setDetails(null); setError("Vehicle not found in VAHAN database."); }
  };
  const sendOtp = () => { setSent(true); };
  const maskedOwnerPhone = details ? `+91-${details.ownerPhone}` : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0a0f2e" }}>
      <StatusBar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", maxWidth: "420px", margin: "0 auto", padding: "12px 20px 24px 20px", overflowY: "auto", boxSizing: "border-box" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>

        <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, marginBottom: "2px", fontFamily: "Rajdhani, sans-serif" }}>Vehicle Registration</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "20px" }}>Verify your vehicle via VAHAN database</p>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "4px" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Vehicle Number</label>
            <div style={{ display: "flex", width: "100%", gap: "8px" }}>
              <input
                value={user.vehicleNumber}
                onChange={e => setUser({ ...user, vehicleNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. HR68BL9125"
                style={{ flex: 1, display: "block", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box", letterSpacing: "0.1em" }}
              />
              <button 
                onClick={lookup} 
                style={{ backgroundColor: "#1e3a8a", border: "none", borderRadius: "10px", padding: "0 16px", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Lookup
              </button>
            </div>
            {error && <p style={{ color: "#dc2626", fontSize: "11px", margin: "4px 0 0 0" }}>{error}</p>}
          </div>

          {details && (
            <div style={{ backgroundColor: "#1f2937", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a" }} />
                <span style={{ color: "#16a34a", fontSize: "11px", fontWeight: 600 }}>Verified in VAHAN(MoRTH PORTAL)</span>
              </div>
              {[
                ["Owner", details.owner],
                ["Model", details.model],
                ["Registered On", details.registered],
                ["State", details.state],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>{k}</span>
                  <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500 }}>{v}</span>
                </div>
              ))}

              {!sent ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                  <div style={{ backgroundColor: "rgba(26,39,128,0.3)", border: "1px solid rgba(30,58,138,0.3)", borderRadius: "8px", padding: "10px", boxSizing: "border-box" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: 0, lineHeight: "1.4" }}>OTP will be sent to the vehicle owner's registered mobile: <span style={{ color: "#ffffff", fontWeight: 500 }}>{maskedOwnerPhone}</span></p>
                  </div>
                  <button 
                    onClick={sendOtp} 
                    style={{ width: "100%", backgroundColor: "#dc2626", border: "none", borderRadius: "10px", padding: "10px", color: "#ffffff", fontSize: "12px", fontWeight: 600, cursor: "pointer", boxSizing: "border-box" }}
                  >
                    Send OTP to {maskedOwnerPhone}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                  <div style={{ backgroundColor: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "8px", padding: "10px", boxSizing: "border-box" }}>
                    <p style={{ color: "#16a34a", fontSize: "11px", margin: 0 }}>OTP sent to vehicle owner's number: <span style={{ fontWeight: 500 }}>{maskedOwnerPhone}</span></p>
                  </div>
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    style={{ width: "100%", display: "block", backgroundColor: "#0a0f2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#ffffff", fontSize: "13px", outline: "none", boxSizing: "border-box", letterSpacing: "0.4em", textAlign: "center" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", width: "100%" }}>
          <PrimaryButton label="Continue →" onClick={onNext} disabled={!details || !sent || otp.length < 6} />
        </div>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "11px", margin: "12px 0 0 0" }}>Try: HR68BL2731 · CHO1DC1562 · PB65J4068</p>
      </div>
    </div>
  );
}

function CategoryScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (c: "private" | "ambulance") => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0a0f2e" }}>
      <StatusBar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", maxWidth: "420px", margin: "0 auto", padding: "8px 16px 16px 16px", overflowY: "auto", boxSizing: "border-box" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>

        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "2px", fontFamily: "Rajdhani, sans-serif" }}>Select Vehicle Category</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "12px" }}>Choose the category that applies to your vehicle</p>

        {/* Cards Stack */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "8px" }}>
          
          {/* Card 1: Private Vehicle */}
          <button
            onClick={() => onSelect("private")}
            style={{ 
              backgroundColor: "#1f2937", 
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "12px", 
              padding: "12px", 
              textAlign: "left", 
              cursor: "pointer", 
              display: "flex", 
              flexDirection: "column", 
              gap: "4px",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            <div style={{ fontSize: "20px" }}>🚗</div>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px", fontFamily: "Rajdhani, sans-serif" }}>Private Vehicle</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", lineHeight: "1.3" }}>
              For personal and commercial vehicles using emergency corridors with valid hospital documentation.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#1e3a8a", marginTop: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600 }}>Select this category</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "11px", height: "11px" }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" /></svg>
            </div>
          </button>

          {/* Card 2: Ambulance / Hospital */}
          <button
            onClick={() => onSelect("ambulance")}
            style={{ 
              background: "linear-gradient(to bottom right, rgba(220,38,38,0.2), rgba(153,27,27,0.1))", 
              border: "1px solid rgba(220,38,38,0.4)", 
              borderRadius: "12px", 
              padding: "12px", 
              textAlign: "left", 
              cursor: "pointer", 
              display: "flex", 
              flexDirection: "column", 
              gap: "4px",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            <div style={{ fontSize: "20px" }}>🚑</div>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px", fontFamily: "Rajdhani, sans-serif" }}>Ambulance / Hospital</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", lineHeight: "1.3" }}>
              For registered ambulances operating from verified hospitals. Requires hospital reference ID and 24-48 hour verification.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", marginTop: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600 }}>Select this category</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "11px", height: "11px" }}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" /></svg>
            </div>
          </button>

        </div>

        {/* Warning Box */}
        <div style={{ backgroundColor: "rgba(26,39,128,0.2)", border: "1px solid rgba(30,58,138,0.2)", borderRadius: "10px", padding: "8px 10px", marginTop: "10px", boxSizing: "border-box" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", lineHeight: "1.3", margin: 0 }}>
            ⚠️ Misrepresentation of vehicle category is a punishable offence under Motor Vehicles Act 1988. Automatic e-challans are issued for violations.
          </p>
        </div>

      </div>
    </div>
  );
}

function HospitalDetailsScreen({ onBack, onNext, user, setUser }: {
  onBack: () => void; onNext: () => void; user: UserData; setUser: (u: UserData) => void;
}) {
  const valid = (user.hospitalName || "").length > 3 && (user.hospitalRefId || "").length > 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0a0f2e" }}>
      <StatusBar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%", maxWidth: "420px", margin: "0 auto", padding: "8px 16px 16px 16px", overflowY: "auto", boxSizing: "border-box" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
          <span style={{ fontSize: "20px" }}>🏥</span>
          <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "Rajdhani, sans-serif" }}>Hospital Details</h2>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "12px" }}>Details will be sent for hospital verification within 24-48 hours</p>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
          
          {/* Hospital Name Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Hospital Name</label>
            <input
              type="text"
              value={user.hospitalName || ""}
              onChange={e => setUser({ ...user, hospitalName: e.target.value })}
              placeholder="e.g. AIIMS New Delhi"
              style={{ display: "block", width: "100%", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Hospital Reference ID Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Hospital Reference ID</label>
            <input
              type="text"
              value={user.hospitalRefId || ""}
              onChange={e => setUser({ ...user, hospitalRefId: e.target.value.toUpperCase() })}
              placeholder="e.g. AIIMS-AMB-2024-001"
              style={{ display: "block", width: "100%", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Hospital Address Textarea */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Hospital Address</label>
            <textarea 
              value={user.hospitalAddress || ""}
              onChange={e => setUser({ ...user, hospitalAddress: e.target.value })}
              placeholder="Full hospital address..." 
              rows={2} 
              style={{ display: "block", width: "100%", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 12px", color: "#ffffff", fontSize: "12px", outline: "none", boxSizing: "border-box", resize: "none", fontFamily: "inherit" }} 
            />
          </div>

          {/* Verification Pending Notice */}
          <div style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "10px 12px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#f59e0b", fontSize: "14px" }}>⏳</span>
              <div>
                <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 600, margin: "0 0 2px 0" }}>Verification Pending</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", lineHeight: "1.3", margin: 0 }}>
                  Your details will be cross-verified with the hospital within 24-48 hours. You may proceed to use the app; ambulance corridor access activates post-verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", width: "100%" }}>
          <PrimaryButton label="Submit & Continue →" onClick={onNext} disabled={!valid} variant="red" />
        </div>
      </div>
    </div>
  );
}

function MapScreen({ onBack, onStart, onProfile, user, setUser, isAmbulance }: {
  onBack: () => void; onStart: () => void; onProfile: () => void; user: UserData; setUser: (u: UserData) => void; isAmbulance: boolean;
}) {
  const [searching, setSearching] = useState(false);
  const [routeReady, setRouteReady] = useState(false);

  const findRoute = () => {
    if (!user.origin || !user.destination) return;
    setSearching(true);
    setTimeout(() => { setSearching(false); setRouteReady(true); }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      
      {/* Top Header Bar with Map Back, Logo, and Profile Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 16px", flexShrink: 0, zIndex: 30 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(13,21,69,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "4px 10px", color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "12px", height: "12px" }} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          <span style={{ fontSize: "11px", fontWeight: 500 }}>Back</span>
        </button>
        
        <div style={{ backgroundColor: "rgba(13,21,69,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "4px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Logo size="sm" />
        </div>

        {/* Profile Button Icon */}
        <button 
          onClick={onProfile} 
          style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#dc2626", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ffffff", boxShadow: "0 2px 8px rgba(220,38,38,0.4)" }}
          title="Open Profile"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }} strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      {/* Map Canvas Background */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }} className="map-grid">
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }} viewBox="0 0 390 480" preserveAspectRatio="none">
          <line x1="0" y1="200" x2="390" y2="200" stroke="#3b82f6" strokeWidth="12" />
          <line x1="0" y1="320" x2="390" y2="320" stroke="#3b82f6" strokeWidth="8" />
          <line x1="120" y1="0" x2="120" y2="480" stroke="#3b82f6" strokeWidth="10" />
          <line x1="270" y1="0" x2="270" y2="480" stroke="#3b82f6" strokeWidth="6" />
          {routeReady && (
            <path d="M80 380 Q120 300 180 240 Q240 180 310 100" stroke="#dc2626" strokeWidth="6" fill="none" strokeDasharray="10 4" opacity="0.9" />
          )}
        </svg>
      </div>

      {/* Bottom Sheet Container */}
      <div style={{ backgroundColor: "#111842", borderTop: "1px solid rgba(255,255,255,0.15)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "16px 20px 20px 20px", display: "flex", flexDirection: "column", gap: "12px", zIndex: 30, boxShadow: "0 -10px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ width: "40px", height: "4px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "2px", alignSelf: "center", marginBottom: "2px" }} />
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px", margin: 0, fontFamily: "Rajdhani, sans-serif" }}>
            {isAmbulance ? "🚨 Ambulance Corridor Active" : "Route Planner"}
          </h3>
          <span style={{ fontSize: "10px", color: "#93c5fd", backgroundColor: "rgba(30,58,138,0.8)", border: "1px solid rgba(59,130,246,0.3)", padding: "2px 8px", borderRadius: "10px", fontWeight: 500 }}>
            Live GPS
          </span>
        </div>

        {/* Inputs Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#0a0f2e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "10px", boxSizing: "border-box" }}>
          
          {/* Origin Input with Fixed Circular Green Dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(30,41,93,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#16a34a", flexShrink: 0, boxShadow: "0 0 8px rgba(22,163,74,0.8)" }} />
            <input
              value={user.origin}
              onChange={e => setUser({ ...user, origin: e.target.value })}
              placeholder="Current location / Origin"
              style={{ flex: 1, background: "transparent", border: "none", color: "#ffffff", fontSize: "12px", outline: "none" }}
            />
          </div>

          {/* Destination Input with Circular Red Dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(30,41,93,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#dc2626", flexShrink: 0, boxShadow: "0 0 8px rgba(220,38,38,0.8)" }} />
            <input
              value={user.destination}
              onChange={e => !isAmbulance && setUser({ ...user, destination: e.target.value })}
              placeholder={isAmbulance ? user.hospitalName || "Hospital destination" : "Enter destination"}
              style={{ flex: 1, background: "transparent", border: "none", color: "#ffffff", fontSize: "12px", outline: "none" }}
              readOnly={isAmbulance}
            />
            {isAmbulance && <span style={{ color: "#f87171", fontSize: "9px", fontWeight: 700, backgroundColor: "rgba(127,29,29,0.6)", padding: "2px 6px", borderRadius: "4px" }}>Auto</span>}
          </div>
        </div>

        {!routeReady ? (
          <button
            type="button"
            onClick={findRoute}
            disabled={searching || !user.origin || !user.destination}
            style={{ width: "100%", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", color: "#ffffff", fontWeight: 700, padding: "12px", borderRadius: "12px", fontSize: "13px", border: "none", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", boxShadow: "0 4px 12px rgba(220,38,38,0.3)" }}
          >
            {searching ? "Finding Secure Route..." : "Find Route & Check Corridor"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: "Rajdhani, sans-serif" }}>14.3 km</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase" }}>Distance</div>
              </div>
              <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: "Rajdhani, sans-serif" }}>22 min</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase" }}>ETA</div>
              </div>
              <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px", textAlign: "center" }}>
                <div style={{ color: "#34d399", fontWeight: 700, fontSize: "14px", fontFamily: "Rajdhani, sans-serif" }}>Clear</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase" }}>Traffic</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onStart}
              style={{ width: "10px" /* (ignoring this) */, width: "100%", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", color: "#ffffff", fontWeight: 700, padding: "12px", borderRadius: "12px", fontSize: "13px", border: "none", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", boxShadow: "0 4px 12px rgba(220,38,38,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <span>🚀</span> Start Secure Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function JourneyActiveScreen({ onEnd, user, isAmbulance }: { onEnd: () => void; user: UserData; isAmbulance: boolean }) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      
      {/* Map Canvas Background Container - Forced flex-1 so it takes up maximum space */}
      <div className="map-grid" style={{ position: "relative", flex: 1, width: "100%", minHeight: "220px", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }} viewBox="0 0 390 480" preserveAspectRatio="none">
          <line x1="0" y1="200" x2="390" y2="200" stroke="#3b82f6" strokeWidth="12" />
          <line x1="0" y1="320" x2="390" y2="320" stroke="#3b82f6" strokeWidth="8" />
          <line x1="120" y1="0" x2="120" y2="480" stroke="#3b82f6" strokeWidth="10" />
          <line x1="270" y1="0" x2="270" y2="480" stroke="#3b82f6" strokeWidth="6" />
          <path d="M80 380 Q120 300 180 240 Q240 180 310 100" stroke="#dc2626" strokeWidth="6" fill="none" strokeDasharray="10 4" opacity="0.9" />
        </svg>

        {/* Animated Vehicle */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "32px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))", zIndex: 10 }}>
          {isAmbulance ? "🚑" : "🚗"}
        </div>

        {/* Live Badge */}
        <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#dc2626", borderRadius: "16px", padding: "4px 10px", boxShadow: "0 2px 8px rgba(220,38,38,0.4)", zIndex: 10 }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ffffff" }} />
          <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>LIVE</span>
        </div>

        {/* Journey Time Counter Card */}
        <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "rgba(13,21,69,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "8px 12px", backdropFilter: "blur(4px)", zIndex: 10 }}>
          <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", fontFamily: "Rajdhani, sans-serif" }}>{fmt(elapsed)}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", textTransform: "uppercase" }}>Journey Time</div>
        </div>

        {/* MapmyIndia / ISRO NavIC Attribution pinned inside map */}
        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.45)", fontSize: "9px", fontWeight: 500, letterSpacing: "0.5px", whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none" }}>
          Navigation by MapmyIndia (Mappls) & ISRO NavIC
        </div>
      </div>

      {/* Bottom Sheet Container */}
      <div style={{ backgroundColor: "#111842", borderTop: "1px solid rgba(255,255,255,0.15)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "12px 16px 16px 16px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 30, boxShadow: "0 -10px 30px rgba(0,0,0,0.5)", flexShrink: 0 }}>
        <div style={{ width: "36px", height: "4px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "2px", alignSelf: "center", marginBottom: "0px" }} />
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#dc2626" }} />
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600 }}>Journey in Progress</span>
          {isAmbulance && (
            <span style={{ marginLeft: "auto", backgroundColor: "rgba(220,38,38,0.2)", color: "#f87171", fontSize: "9px", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
              EMERGENCY CORRIDOR ACTIVE
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "6px", textAlign: "center" }}>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px", fontFamily: "Rajdhani, sans-serif" }}>8.7 km</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", textTransform: "uppercase" }}>Remaining</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "6px", textAlign: "center" }}>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px", fontFamily: "Rajdhani, sans-serif" }}>11 min</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", textTransform: "uppercase" }}>ETA</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#1e295d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "6px", textAlign: "center" }}>
            <div style={{ color: "#34d399", fontWeight: 700, fontSize: "13px", fontFamily: "Rajdhani, sans-serif" }}>58 km/h</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", textTransform: "uppercase" }}>Speed</div>
          </div>
        </div>

        {/* Origin & Destination details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#0a0f2e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "8px 10px", fontSize: "11px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Origin</span>
            <span style={{ color: "#ffffff", fontWeight: 500 }}>{user.origin || "Current Location"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Destination</span>
            <span style={{ color: "#ffffff", fontWeight: 500 }}>{user.destination}</span>
          </div>
        </div>

        {/* End Journey Button */}
        <button
          type="button"
          onClick={onEnd}
          style={{ width: "100%", background: "transparent", border: "2px solid rgba(220,38,38,0.6)", color: "#dc2626", fontWeight: 700, padding: "8px", borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", transition: "all 0.2s" }}
        >
          End Journey
        </button>
      </div>
    </div>
  );
}

function UploadFileScreen({ onUpload, onSkip, isAmbulance }: { onUpload: () => void; onSkip: () => void; isAmbulance: boolean }) {
  const [timeLeft, setTimeLeft] = useState(7200);
  const [uploaded, setUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleUpload = () => {
    setUploaded(true);
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onUpload(); }, 2200);
  };

  const pct = Math.round((timeLeft / 7200) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      
      {/* Added minHeight: 0 to allow proper flex-child scrolling */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, padding: "20px 24px 24px 24px", overflowY: "auto" }}>
        <Logo size="sm" />
        
        <div style={{ marginTop: "20px", marginBottom: "16px", flexShrink: 0 }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
          </div>
          <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "4px", fontFamily: "Rajdhani, sans-serif" }}>Upload Emergency File</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px", lineHeight: "1.4" }}>
            {isAmbulance
              ? "Upload the emergency authorization file issued by the hospital to complete your journey record."
              : "Upload the hospital-issued emergency file to justify your emergency corridor usage."}
          </p>
        </div>

        {/* Countdown Box */}
        <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "14px", padding: "14px", marginBottom: "16px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ color: "#f59e0b", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Time Remaining</span>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "18px", fontFamily: "Rajdhani, sans-serif" }}>{fmtTime(timeLeft)}</span>
          </div>
          <div style={{ height: "6px", backgroundColor: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: "3px",
                width: `${pct}%`,
                backgroundColor: pct > 50 ? "#16a34a" : pct > 20 ? "#f59e0b" : "#dc2626",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "10px", marginTop: "6px" }}>File must be uploaded within 2 hours of journey end</p>
        </div>

        {/* Upload Button or Success View */}
        {!uploaded ? (
          <button
            type="button"
            onClick={handleUpload}
            style={{
              width: "100%",
              backgroundColor: "#1f2937",
              border: "2px dashed rgba(255, 255, 255, 0.2)",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "28px" }}>⬆️</div>
            <div style={{ color: "#ffffff", fontWeight: 600, fontFamily: "Rajdhani, sans-serif", fontSize: "14px" }}>Tap to Upload File</div>
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "10px" }}>PDF, JPG, PNG • Max 10MB</div>
          </button>
        ) : (
          <div style={{ backgroundColor: "rgba(22, 163, 74, 0.1)", border: "1px solid rgba(22, 163, 74, 0.3)", borderRadius: "14px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(22, 163, 74, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              {verifying ? "🔍" : "✅"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "12px" }}>{verifying ? "AI Verifying Document…" : "Document Verified"}</div>
              <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "10px" }}>{verifying ? "Checking authenticity with AI…" : "Emergency file authenticated successfully"}</div>
            </div>
            {verifying && <div style={{ width: "16px", height: "16px", border: "2px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />}
          </div>
        )}

        {/* Warning Box */}
        <div style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "12px", padding: "12px", marginTop: "14px", flexShrink: 0 }}>
          <p style={{ color: "#dc2626", fontSize: "10px", fontWeight: 600, marginBottom: "3px" }}>⚠️ Important Warning</p>
          <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "10px", lineHeight: "1.4" }}>
            Failure to upload within the deadline will trigger an automatic e-challan of ₹10,000. Submitting a fake or altered document attracts penalties under BNS section 336/section 340.
          </p>
        </div>

        {/* Skip button */}
        <button
          type="button"
      onClick={onSkip}
          style={{ marginTop: "16px", marginBottom: "8px", background: "none", border: "none", color: "rgba(255, 255, 255, 0.3)", fontSize: "11px", cursor: "pointer", textAlign: "center", padding: "6px", flexShrink: 0 }}
        >
          I'l upload later (timer continues)
        </button>
      </div>
    </div>
  );
}

function ChallanScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, padding: "24px", alignItems: "center", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🚫</div>
        
        <div style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.4)", borderRadius: "16px", padding: "20px", width: "100%", marginBottom: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span style={{ color: "#dc2626", fontWeight: 700, fontSize: "18px", fontFamily: "Rajdhani, sans-serif" }}>E-CHALLAN ISSUED</span>
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px", marginTop: "4px" }}>Auto-generated · {new Date().toLocaleString("en-IN")}</div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
            {[
              ["Violation", "Misuse of Software/Not Uploaded on Time"],
              ["Penalty Amount", "₹10,000"],
              ["Challan No.", "ECH-2024-" + Math.floor(Math.random() * 90000 + 10000)],
              ["Due Date", new Date(Date.now() + 15 * 86400000).toLocaleDateString("en-IN")],
            ].map(([k, v], idx, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: idx !== arr.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none", paddingBottom: idx !== arr.length - 1 ? "12px" : "0" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{k}</span>
                <span style={{ color: k === "Penalty Amount" ? "#dc2626" : "#ffffff", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px", textAlign: "center", marginBottom: "20px", lineHeight: "1.4" }}>
          Pay the challan at Parivahan portal or your nearest RTO office/regarding the issue go to nearest RTO.
        </p>

        <div style={{ width: "100%" }}>
          <PrimaryButton label="Back to Home" onClick={onBack} variant="navy" />
        </div>
      </div>
    </div>
  );
}

function VerifiedScreen({ onDone, isAmbulance }: { onDone: () => void; isAmbulance: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      
      {isAmbulance ? (
        /* Ambulance thank-you screen — no AI verification */
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, padding: "24px", alignItems: "center", justifyContent: "center", gap: "20px", overflowY: "auto" }}>
          <div style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "rgba(30, 58, 138, 0.3)", border: "2px solid rgba(30, 58, 138, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
            🚑
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "26px", fontFamily: "Rajdhani, sans-serif" }}>
              Thank You!
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", lineHeight: "1.5", padding: "0 16px" }}>
              Thank you for using AbhayaPath services. Your journey has been recorded safely.
            </p>
            <p style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", marginTop: "4px" }}>#Go With AbhayaPath</p>
          </div>

          <div style={{ width: "100%", backgroundColor: "#1f2937", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              ["Journey ID", "APJ-AMB-" + Math.floor(Math.random() * 90000 + 10000)],
              ["Status", "Completed"],
              ["Service", "Ambulance Corridor"],
            ].map(([k, v], idx, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: idx !== arr.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none", paddingBottom: idx !== arr.length - 1 ? "12px" : "0" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px" }}>{k}</span>
                <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ width: "100%" }}>
            <PrimaryButton label="Start New Journey" onClick={onDone} variant="navy" />
          </div>
        </div>
      ) : (
        /* Private vehicle — AI verified screen */
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, padding: "24px", alignItems: "center", justifyContent: "center", gap: "18px", overflowY: "auto" }}>
          <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "rgba(22, 163, 74, 0.2)", border: "2px solid rgba(22, 163, 74, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px" }}>
            ✅
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#ffffff", fontWeight: 700, fontSize: "22px", marginBottom: "6px", fontFamily: "Rajdhani, sans-serif" }}>Journey Complete</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", lineHeight: "1.5" }}>Your emergency file has been verified by AI and accepted. Your journey record has been saved successfully.</p>
          </div>

          <div style={{ width: "100%", backgroundColor: "rgba(22, 163, 74, 0.1)", border: "1px solid rgba(22, 163, 74, 0.3)", borderRadius: "16px", padding: "16px" }}>
            {[
              ["Journey ID", "APJ-" + Math.floor(Math.random() * 900000 + 100000)],
              ["Status", "Verified ✓"],
              ["File Authenticity", "Genuine (AI Confirmed)"],
              ["Compliance", "Fully Compliant"],
            ].map(([k, v], idx, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: idx !== arr.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none" }}>
                <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11px" }}>{k}</span>
                <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ width: "100%", marginTop: "8px" }}>
            <PrimaryButton label="Start New Journey" onClick={onDone} variant="red" />
          </div>
        </div>
      )}
    </div>
  );
}
// ─── PROFILE SCREEN ─────────────────────────────────────────────────────────

function ProfileScreen({ user, onLogout, onMap }: { user: UserData; onLogout: () => void; onMap: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const initials = user.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "AP";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#0a0f2e", boxSizing: "border-box", overflow: "hidden" }}>
      <StatusBar />
      
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "8px 16px 12px 16px", overflowY: "auto", boxSizing: "border-box", gap: "10px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexShrink: 0 }}>
          <button onClick={onMap} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(13,21,69,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "4px 10px", color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "12px", height: "12px" }} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>Map</span>
          </button>
          
          <div style={{ backgroundColor: "rgba(13,21,69,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "4px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Logo size="sm" />
          </div>

          <div style={{ width: "50px" }} />
        </div>

        {/* Avatar Mini */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px 14px", flexShrink: 0 }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: "Rajdhani, sans-serif" }}>{initials}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", fontFamily: "Rajdhani, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name || "AbhayaPath User"}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email || "—"}</div>
          </div>
        </div>

        {/* Info list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 500 }}>Details</div>

          {[
            { label: "Name", value: user.name || "—" },
            { label: "Category", value: user.category === "ambulance" ? "Ambulance" : "Private" },
            { label: "Vehicle No", value: user.vehicleNumber || "—" },
            { label: "Mobile", value: user.phone ? `+91-${user.phone}` : "—" },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase" }}>{item.label}</span>
              <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}

          {user.category === "ambulance" && user.hospitalName && (
            <div style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase" }}>Hospital / Status</span>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: "10px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                  <span style={{ color: "#f59e0b", fontSize: "10px", fontWeight: 600 }}>Approval Pending</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600 }}>{user.hospitalName}</span>
                {user.hospitalRefId && (
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontFamily: "monospace" }}>{user.hospitalRefId}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{ width: "100%", marginTop: "auto", border: "1px solid rgba(220,38,38,0.4)", borderRadius: "10px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#dc2626", fontWeight: 600, fontSize: "13px", backgroundColor: "transparent", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", flexShrink: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "12px", height: "12px" }} strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        ) : (
          <div style={{ marginTop: "auto", backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", boxSizing: "border-box", flexShrink: 0 }}>
            <p style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500, textAlign: "center", margin: 0 }}>Confirm logout?</p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, backgroundColor: "#1f2937", borderRadius: "6px", padding: "6px", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 500, border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                style={{ flex: 1, backgroundColor: "#dc2626", borderRadius: "6px", padding: "6px", color: "#ffffff", fontSize: "11px", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ─── BOTTOM NAV ─────────────────────────────────────────────────────────────

function BottomNav({ active, onMap, onProfile }: { active: "map" | "profile"; onMap: () => void; onProfile: () => void }) {
  return (
    <div style={{ position: "absolute", bottom: "24px", left: "16px", right: "16px", backgroundColor: "rgba(31, 41, 55, 0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", display: "flex", zIndex: 40, boxSizing: "border-box" }}>
      
      {/* Map / Navigate Button */}
      <button
        onClick={onMap}
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "14px 0", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: active === "map" ? "#ffffff" : "rgba(255, 255, 255, 0.35)", transition: "all 0.2s" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === "map" ? 2.5 : 1.5} style={{ width: "20px", height: "20px" }} strokeLinecap="round">
          <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" /><path d="M9 4v13M15 7v13" />
        </svg>
        <span style={{ fontSize: "10px", fontWeight: 500, fontFamily: "Poppins, sans-serif", letterSpacing: "0.5px" }}>Navigate</span>
        {active === "map" && <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#dc2626" }} />}
      </button>

      {/* Divider */}
      <div style={{ width: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", margin: "12px 0" }} />

      {/* Profile Button */}
      <button
        onClick={onProfile}
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "14px 0", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: active === "profile" ? "#ffffff" : "rgba(255, 255, 255, 0.35)", transition: "all 0.2s" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === "profile" ? 2.5 : 1.5} style={{ width: "20px", height: "20px" }} strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        <span style={{ fontSize: "10px", fontWeight: 500, fontFamily: "Poppins, sans-serif", letterSpacing: "0.5px" }}>Profile</span>
        {active === "profile" && <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#dc2626" }} />}
      </button>

    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [user, setUser] = useState<UserData>({
    name: "", phone: "", email: "",
    vehicleNumber: "", category: null,
    hospitalName: "", hospitalRefId: "",
    origin: "", destination: "",
  });

  return (
    {/* ADD max-w-md mx-auto w-full to this main outer div */}
    <div className="max-w-md mx-auto w-full min-h-screen bg-slate-950 text-white relative shadow-2xl overflow-hidden">
      {/* All your screens and components go here */}
    </div>
  );
}
  const go = (s: Screen) => setScreen(s);

  const isAmbulance = user.category === "ambulance";

  const logout = () => {
    setUser({ name: "", phone: "", email: "", vehicleNumber: "", category: null, hospitalName: "", hospitalRefId: "", origin: "", destination: "" });
    go("welcome");
  };

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onDone={() => go("welcome")} />;
      case "welcome":
        return <WelcomeScreen onSignup={() => go("signup")} onLogin={() => go("vehicle")} />;
      case "signup":
        return <SignupScreen onBack={() => go("welcome")} onNext={() => go("vehicle")} user={user} setUser={setUser} />;
      case "vehicle":
        return <VehicleScreen onBack={() => go("signup")} onNext={() => go("category")} user={user} setUser={setUser} />;
      case "category":
        return (
          <CategoryScreen
            onBack={() => go("vehicle")}
            onSelect={c => {
              setUser(u => ({
                ...u,
                category: c,
                destination: c === "ambulance" ? u.hospitalName || "" : u.destination,
              }));
              go(c === "ambulance" ? "hospital-details" : "map");
            }}
          />
        );
      case "hospital-details":
        return (
          <HospitalDetailsScreen
            onBack={() => go("category")}
            onNext={() => {
              setUser(u => ({ ...u, destination: u.hospitalName }));
              go("map");
            }}
            user={user}
            setUser={setUser}
          />
        );
      case "map":
        return (
          <MapScreen
            onBack={() => go(isAmbulance ? "hospital-details" : "category")}
            onStart={() => go("journey-active")}
            onProfile={() => go("profile")}
            user={user}
            setUser={setUser}
            isAmbulance={isAmbulance}
          />
        );
      case "profile":
        return <ProfileScreen user={user} onLogout={logout} onMap={() => go("map")} />;
      case "journey-active":
        return (
          <JourneyActiveScreen
            onEnd={() => go(isAmbulance ? "verified" : "upload-file")}
            user={user}
            isAmbulance={isAmbulance}
          />
        );
      case "upload-file":
        return (
          <UploadFileScreen
            onUpload={() => go("verified")}
            onSkip={() => go("challan")}
            isAmbulance={isAmbulance}
          />
        );
      case "challan":
        return <ChallanScreen onBack={() => { setUser(u => ({ ...u, origin: "", destination: "" })); go("map"); }} />;
      case "verified":
        return <VerifiedScreen onDone={() => { setUser(u => ({ ...u, origin: "", destination: "" })); go("map"); }} isAmbulance={isAmbulance} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff' }} className="flex items-center justify-center min-h-screen w-full bg-black p-0 sm:p-4 select-none">
      {/* Responsive Phone Frame */}
      <div
        className="relative bg-[#0a0f2e] text-white overflow-hidden flex flex-col w-full sm:max-w-[390px] h-screen sm:h-[844px] sm:max-h-[90vh] rounded-none sm:rounded-[44px] border-0 sm:border-4 border-slate-800 shadow-2xl"
        style={{
          backgroundColor: "#0a0f2e",
          color: "#ffffff",
          boxShadow: "0 0 0 2px #1f2937, 0 0 0 4px #0d1545, 0 40px 80px rgba(0,0,0,0.9)",
        }}
      >
        {/* Notch - hidden on mobile screens, visible in desktop frame */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-50 pointer-events-none" />

        {/* Screen Viewport with internal scrolling */}
        <div className="flex flex-col h-full w-full pt-4 pb-6 overflow-y-auto overflow-x-hidden relative z-10">
          {renderScreen()}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}

