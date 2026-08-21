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
  const sizes = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  const iconSizes = { sm: "w-7 h-7 min-w-[28px]", md: "w-10 h-10 min-w-[40px]", lg: "w-14 h-14 min-w-[56px]" };
  const pixelSizes = { sm: { width: '28px', height: '28px' }, md: { width: '40px', height: '40px' }, lg: { width: '56px', height: '56px' } };

  return (
    <div className="flex items-center gap-2.5 my-2">
      {/* Red Icon Container with strict dimensions */}
      <div 
        className={`${iconSizes[size]} rounded-xl bg-[#dc2626] flex items-center justify-center shrink-0`} 
        style={{ 
          ...pixelSizes[size], 
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
      <div className={`font-bold tracking-wide ${sizes[size]}`} style={{ fontFamily: "Rajdhani, sans-serif" }}>
        <span style={{ color: '#ffffff' }}>Abhaya</span>
        <span style={{ color: '#dc2626', fontFamily: "Noto Sans Devanagari, sans-serif", fontWeight: 700 }}>पथ</span>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-3 pb-1 text-white text-xs w-full select-none">
      <span style={{ fontFamily: "Poppins, sans-serif", color: "#ffffff" }}>9:41</span>
      <div className="flex gap-2 items-center">
        {/* Signal Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#ffffff' }}>
          <path d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4" />
        </svg>
        {/* Wi-Fi Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#ffffff' }}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        {/* Battery Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '14px', color: '#ffffff' }}>
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
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
    <div className="flex flex-col gap-1.5">
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
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0f2e] gap-6">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      <p className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "Poppins, sans-serif" }}>
        FEARLESS PATH DESIGNED FOR SMART INDIA
      </p>
      <div className="absolute bottom-12 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 20px", justifyContent: "space-between", boxSizing: "border-box", overflowY: "auto" }}>
        
        {/* Top Header Section */}
        <div>
          <Logo size="md" />

          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.45rem", color: "#ffffff", fontWeight: 700, lineHeight: "1.2", margin: 0 }}>
              Fearless Path for<br />
              <span style={{ color: "#dc2626" }}>Smart India Health</span>
            </h1>
            <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 600, marginTop: "4px", marginBottom: 0, letterSpacing: "0.02em" }}>
              #Go With AbhayaPath
            </p>
          </div>

         {/* Compact Feature Cards - Only visible in Sign Up tab */}
{tab === "signup" && (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
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
          border: "1px solid rgba(255, 255, 255, 0.12)", 
          borderRadius: "10px", 
          padding: "8px 12px", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px" 
        }}
      >
        <span style={{ fontSize: "14px" }}>{f.icon}</span>
        <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 500, lineHeight: "1.2" }}>{f.text}</span>
      </div>
    ))}
  </div>
)}

{/* Tab Switcher */}
<div style={{ backgroundColor: "#1e295d", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "10px", padding: "3px", display: "flex", marginBottom: "12px", marginTop: tab === "login" ? "12px" : "0" }}>
  <button
    type="button"
    onClick={() => setTab("signup")}
    style={{
      flex: 1,
      padding: "8px 0",
      borderRadius: "7px",
      fontSize: "12px",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      backgroundColor: tab === "signup" ? "#dc2626" : "transparent",
      color: tab === "signup" ? "#ffffff" : "#9ca3af",
      fontFamily: "Rajdhani, sans-serif",
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
      borderRadius: "7px",
      fontSize: "12px",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      backgroundColor: tab === "login" ? "#dc2626" : "transparent",
      color: tab === "login" ? "#ffffff" : "#9ca3af",
      fontFamily: "Rajdhani, sans-serif",
    }}
  >
    Login
  </button>
</div>

{/* Dynamic Form Area */}
{tab === "signup" ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <p style={{ color: "#9ca3af", fontSize: "11px", textAlign: "center", margin: 0 }}>Create your AbhayaPath account to get started.</p>
    <button
      type="button"
      onClick={onSignup}
      style={{
        width: "100%",
        backgroundColor: "#dc2626",
        color: "#ffffff",
        padding: "11px 0",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(220, 38, 38, 0.3)"
      }}
    >
      Create New Account
    </button>
  </div>
) : (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ color: "#9ca3af", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Mobile Number</label>
      <input
        value={loginPhone}
        onChange={e => setLoginPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        type="tel"
        placeholder="10-digit mobile number"
        style={{
          width: "100%",
          backgroundColor: "#1e295d",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "10px",
          padding: "8px 12px",
          fontSize: "12px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ color: "#9ca3af", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
      <input
        value={loginPass}
        onChange={e => setLoginPass(e.target.value)}
        type="password"
        placeholder="Your password"
        style={{
          width: "100%",
          backgroundColor: "#1e295d",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "10px",
          padding: "8px 12px",
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
        padding: "10px 0",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 700,
        border: "none",
        cursor: loginPhone.length < 10 || loginPass.length < 4 ? "not-allowed" : "pointer",
        marginTop: "4px"
      }}
    >
      Login →
    </button>
  </div>
          )}
        </div>

        {/* Footer Text */}
        <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "10px", textAlign: "center", margin: "12px 0 0 0", lineHeight: "1.3" }}>
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
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Create Account</h2>
        <p className="text-white/40 text-xs mb-8">Register to access AbhayaPath services</p>

        <div className="flex flex-col gap-4">
          <InputField label="Full Name" value={user.name} onChange={v => setUser({ ...user, name: v })} placeholder="e.g. Ankit" />
          <InputField label="Mobile Number" value={user.phone} onChange={v => setUser({ ...user, phone: v.replace(/\D/g, "").slice(0, 10) })} type="tel" placeholder="10-digit mobile number" />
          <InputField label="Email Address" value={user.email} onChange={v => setUser({ ...user, email: v })} type="email" placeholder="you@example.com" />

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Password</label>
            <input type="password" placeholder="Create a strong password" className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#dc2626]/60 transition-all placeholder:text-white/30" />
          </div>

          <div className="bg-[#1a2780]/30 border border-[#1e3a8a]/40 rounded-xl p-4 mt-1">
            <p className="text-white/60 text-xs leading-relaxed">
              By creating an account you agree to AbhayaPaths's Terms of Service and consent to the processing of vehicle data under MoRTH regulations.
            </p>
          </div>
        </div>

        <div className="mt-8">
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
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Vehicle Registration</h2>
        <p className="text-white/40 text-xs mb-8">Verify your vehicle via VAHAN database</p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Vehicle Number</label>
            <div className="flex gap-2">
              <input
                value={user.vehicleNumber}
                onChange={e => setUser({ ...user, vehicleNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. HR68BL9125"
                className="flex-1 bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#dc2626]/60 transition-all placeholder:text-white/30 tracking-widest"
              />
              <button onClick={lookup} className="bg-[#1e3a8a] rounded-xl px-4 text-white text-sm font-medium hover:bg-[#1a2780] transition-colors">
                Lookup
              </button>
            </div>
            {error && <p className="text-[#dc2626] text-xs">{error}</p>}
          </div>

          {details && (
            <div className="bg-[#1f2937] border border-[#dc2626]/30 rounded-2xl p-4 flex flex-col gap-3 screen-slide-enter">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                <span className="text-[#16a34a] text-xs font-semibold">Verified in VAHAN(MoRTH PORTAL)</span>
              </div>
              {[
                ["Owner", details.owner],
                ["Model", details.model],
                ["Registered On", details.registered],
                ["State", details.state],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40 text-xs">{k}</span>
                  <span className="text-white text-xs font-medium">{v}</span>
                </div>
              ))}

              {!sent ? (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="bg-[#1a2780]/30 border border-[#1e3a8a]/30 rounded-lg px-3 py-2">
                    <p className="text-white/50 text-xs">OTP will be sent to the vehicle owner's registered mobile: <span className="text-white font-medium">{maskedOwnerPhone}</span></p>
                  </div>
                  <button onClick={sendOtp} className="w-full bg-[#dc2626] hover:bg-[#b91c1c] rounded-xl py-2.5 text-white text-sm font-semibold transition-colors">
                    Send OTP to {maskedOwnerPhone}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="bg-[#16a34a]/10 border border-[#16a34a]/30 rounded-lg px-3 py-2">
                    <p className="text-[#16a34a] text-xs">OTP sent to vehicle owner's number: <span className="font-medium">{maskedOwnerPhone}</span></p>
                  </div>
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-[#0a0f2e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#dc2626]/60 transition-all placeholder:text-white/30 tracking-[0.4em] text-center"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <PrimaryButton label="Continue →" onClick={onNext} disabled={!details || !sent || otp.length < 6} />
        </div>
        <p className="text-center text-white/25 text-xs mt-4">Try: HR68BL2731 · CHO1DC1562 · PB65J4068</p>
      </div>
    </div>
  );
}

function CategoryScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (c: "private" | "ambulance") => void }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-4 pb-10">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Select Vehicle Category</h2>
        <p className="text-white/40 text-xs mb-10">Choose the category that applies to your vehicle</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect("private")}
            className="bg-[#1f2937] border border-white/10 hover:border-[#1e3a8a]/60 rounded-2xl p-6 text-left transition-all active:scale-95 group"
          >
            <div className="text-4xl mb-3">🚗</div>
            <div className="text-white font-bold text-xl mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Private Vehicle</div>
            <div className="text-white/50 text-sm leading-relaxed">
              For personal and commercial vehicles using emergency corridors with valid hospital documentation.
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[#1e3a8a] group-hover:text-white/60 transition-colors">
              <span className="text-xs font-medium">Select this category</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" /></svg>
            </div>
          </button>

          <button
            onClick={() => onSelect("ambulance")}
            className="bg-gradient-to-br from-[#dc2626]/20 to-[#991b1b]/10 border border-[#dc2626]/40 hover:border-[#dc2626]/70 rounded-2xl p-6 text-left transition-all active:scale-95 group"
          >
            <div className="text-4xl mb-3">🚑</div>
            <div className="text-white font-bold text-xl mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Ambulance / Hospital</div>
            <div className="text-white/50 text-sm leading-relaxed">
              For registered ambulances operating from verified hospitals. Requires hospital reference ID and 24-48 hour verification.
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[#dc2626] group-hover:text-[#ef4444] transition-colors">
              <span className="text-xs font-medium">Select this category</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" /></svg>
            </div>
          </button>
        </div>

        <div className="mt-auto pt-8 bg-[#1a2780]/20 border border-[#1e3a8a]/20 rounded-xl p-4">
          <p className="text-white/40 text-xs leading-relaxed">
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
  const valid = user.hospitalName.length > 3 && user.hospitalRefId.length > 4;
  return (
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onBack={onBack} />
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏥</span>
          <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif" }}>Hospital Details</h2>
        </div>
        <p className="text-white/40 text-xs mb-8">Details will be sent for hospital verification within 24-48 hours</p>

        <div className="flex flex-col gap-4">
          <InputField label="Hospital Name" value={user.hospitalName} onChange={v => setUser({ ...user, hospitalName: v })} placeholder="e.g. AIIMS New Delhi" />
          <InputField label="Hospital Reference ID" value={user.hospitalRefId} onChange={v => setUser({ ...user, hospitalRefId: v.toUpperCase() })} placeholder="e.g. AIIMS-AMB-2024-001" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Hospital Address</label>
            <textarea placeholder="Full hospital address..." rows={3} className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#dc2626]/60 transition-all placeholder:text-white/30 resize-none" />
          </div>

          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <span className="text-[#f59e0b] text-lg">⏳</span>
              <div>
                <p className="text-[#f59e0b] text-xs font-semibold mb-0.5">Verification Pending</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  Your details will be cross-verified with the hospital within 24-48 hours. You may proceed to use the app; ambulance corridor access activates post-verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
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
    <div className="flex flex-col h-full bg-[#0d1545] screen-slide-enter">
      <StatusBar />
      {/* Map canvas */}
      <div className="relative flex-1 map-grid overflow-hidden">
        {/* Simulated map roads */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 390 480" preserveAspectRatio="none">
          <line x1="0" y1="200" x2="390" y2="200" stroke="#1e3a8a" strokeWidth="12" />
          <line x1="0" y1="320" x2="390" y2="320" stroke="#1e3a8a" strokeWidth="8" />
          <line x1="120" y1="0" x2="120" y2="480" stroke="#1e3a8a" strokeWidth="10" />
          <line x1="270" y1="0" x2="270" y2="480" stroke="#1e3a8a" strokeWidth="6" />
          <line x1="0" y1="120" x2="390" y2="280" stroke="#1e3a8a" strokeWidth="5" />
          {routeReady && (
            <path d="M80 380 Q120 300 180 240 Q240 180 310 100" stroke="#dc2626" strokeWidth="5" fill="none" strokeDasharray="10 4" opacity="0.8" />
          )}
        </svg>

        {/* Origin pin */}
        {routeReady && (
          <div className="absolute bottom-32 left-16 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-[#16a34a] border-2 border-white pulse-dot" />
            <div className="text-white text-[9px] bg-black/60 rounded px-1.5 py-0.5 mt-1 whitespace-nowrap">{user.origin}</div>
          </div>
        )}
        {routeReady && (
          <div className="absolute top-20 right-16 flex flex-col items-center">
            <div className="w-6 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 32" className="w-6 h-8 drop-shadow-lg">
                <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 18 9 18s9-11.25 9-18c0-4.97-4.03-9-9-9z" fill="#dc2626" />
                <circle cx="12" cy="9" r="3.5" fill="white" />
              </svg>
            </div>
            <div className="text-white text-[9px] bg-black/60 rounded px-1.5 py-0.5 mt-0.5 whitespace-nowrap">{user.destination}</div>
          </div>
        )}

        {/* Floating header */}
        <div className="absolute top-2 left-0 right-0 flex items-center gap-3 px-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#0d1545]/90 border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          <div className="flex-1 bg-[#0d1545]/90 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
            <Logo size="sm" />
          </div>
          {isAmbulance && (
            <div className="bg-[#dc2626]/90 rounded-full px-2.5 py-1 text-white text-[10px] font-bold tracking-wide">AMBU</div>
          )}
          <button onClick={onProfile} className="w-9 h-9 rounded-full bg-[#0d1545]/90 border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-[#0a0f2e] border-t border-white/5 px-5 pt-5 pb-8 flex flex-col gap-4">
        <h3 className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          {isAmbulance ? "Ambulance Navigation" : "Route Planner"}
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-[#1f2937] rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a] flex-shrink-0" />
            <input
              value={user.origin}
              onChange={e => setUser({ ...user, origin: e.target.value })}
              placeholder="Current location / Origin"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            />
          </div>
          <div className="flex items-center gap-3 bg-[#1f2937] rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] flex-shrink-0" />
            <input
              value={user.destination}
              onChange={e => !isAmbulance && setUser({ ...user, destination: e.target.value })}
              placeholder={isAmbulance ? user.hospitalName || "Hospital destination" : "Enter destination"}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              readOnly={isAmbulance}
            />
            {isAmbulance && <span className="text-[#dc2626] text-xs font-medium">Auto-set</span>}
          </div>
        </div>

        {!routeReady ? (
          <PrimaryButton
            label={searching ? "Finding Route…" : "Find Route"}
            onClick={findRoute}
            disabled={searching || !user.origin || !user.destination}
            variant="navy"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 text-white/60 text-xs">
              <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>14.3 km</div>
                <div className="text-xs">Distance</div>
              </div>
              <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>22 min</div>
                <div className="text-xs">ETA</div>
              </div>
              <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
                <div className="text-[#16a34a] font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>Clear</div>
                <div className="text-xs">Traffic</div>
              </div>
            </div>
            <PrimaryButton label="🚀  Start Journey" onClick={onStart} variant="red" />
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
    <div className="flex flex-col h-full bg-[#0d1545]">
      <StatusBar />
      <div className="relative flex-1 map-grid overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 390 480" preserveAspectRatio="none">
          <line x1="0" y1="200" x2="390" y2="200" stroke="#1e3a8a" strokeWidth="12" />
          <line x1="0" y1="320" x2="390" y2="320" stroke="#1e3a8a" strokeWidth="8" />
          <line x1="120" y1="0" x2="120" y2="480" stroke="#1e3a8a" strokeWidth="10" />
          <line x1="270" y1="0" x2="270" y2="480" stroke="#1e3a8a" strokeWidth="6" />
          <path d="M80 380 Q120 300 180 240 Q240 180 310 100" stroke="#dc2626" strokeWidth="5" fill="none" opacity="0.8" />
        </svg>

        {/* Animated vehicle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-bounce">
          {isAmbulance ? "🚑" : "🚗"}
        </div>

        {/* Live badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#dc2626] rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
        </div>
        <div className="absolute top-4 left-4 bg-[#0d1545]/90 border border-white/10 rounded-xl px-3 py-2">
          <div className="text-white font-bold text-xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>{fmt(elapsed)}</div>
          <div className="text-white/40 text-xs">Journey Time</div>
        </div>
      </div>

      <div className="bg-[#0a0f2e] border-t border-white/5 px-5 pt-5 pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
          <span className="text-white text-sm font-medium">Journey in Progress</span>
          {isAmbulance && <span className="ml-auto bg-[#dc2626]/20 text-[#dc2626] text-xs px-2 py-0.5 rounded-full font-semibold">EMERGENCY CORRIDOR ACTIVE</span>}
        </div>

        <div className="flex gap-3 text-white/60 text-xs">
          <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>8.7 km</div>
            <div className="text-xs">Remaining</div>
          </div>
          <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>11 min</div>
            <div className="text-xs">ETA</div>
          </div>
          <div className="flex-1 bg-[#1f2937] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>58 km/h</div>
            <div className="text-xs">Speed</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-white/50">
          <div className="flex justify-between"><span>Origin</span><span className="text-white">{user.origin || "Current Location"}</span></div>
          <div className="flex justify-between"><span>Destination</span><span className="text-white">{user.destination}</span></div>
        </div>

        <button
          onClick={onEnd}
          className="w-full border-2 border-[#dc2626]/50 hover:border-[#dc2626] rounded-2xl py-3.5 text-[#dc2626] font-semibold text-sm transition-all active:scale-95"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
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
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-6 pb-10 overflow-y-auto">
        <Logo size="sm" />
        <div className="mt-8 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center mb-4 upload-glow">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Upload Emergency File</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            {isAmbulance
              ? "Upload the emergency authorization file issued by the hospital to complete your journey record."
              : "Upload the hospital-issued emergency file to justify your emergency corridor usage."}
          </p>
        </div>

        {/* Countdown */}
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#f59e0b] text-xs font-semibold uppercase tracking-wide">Time Remaining</span>
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>{fmtTime(timeLeft)}</span>
          </div>
          <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct > 50 ? "#16a34a" : pct > 20 ? "#f59e0b" : "#dc2626" }}
            />
          </div>
          <p className="text-white/30 text-xs mt-2">File must be uploaded within 2 hours of journey end</p>
        </div>

        {/* Upload area */}
        {!uploaded ? (
          <button
            onClick={handleUpload}
            className="w-full bg-[#1f2937] border-2 border-dashed border-white/20 hover:border-[#dc2626]/50 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all active:scale-95"
          >
            <div className="text-4xl">⬆️</div>
            <div className="text-white font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>Tap to Upload File</div>
            <div className="text-white/40 text-xs">PDF, JPG, PNG • Max 10MB</div>
          </button>
        ) : (
          <div className="bg-[#16a34a]/10 border border-[#16a34a]/30 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#16a34a]/20 flex items-center justify-center text-2xl">
              {verifying ? "🔍" : "✅"}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{verifying ? "AI Verifying Document…" : "Document Verified"}</div>
              <div className="text-white/40 text-xs">{verifying ? "Checking authenticity with AI…" : "Emergency file authenticated successfully"}</div>
            </div>
            {verifying && <div className="ml-auto w-5 h-5 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />}
          </div>
        )}

        <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-xl p-4 mt-4">
          <p className="text-[#dc2626] text-xs font-semibold mb-1">⚠️ Important Warning</p>
          <p className="text-white/50 text-xs leading-relaxed">
            Failure to upload within the deadline will trigger an automatic e-challan of ₹10,000. Submitting a fake or altered document attracts penalties under BNS section 336/section 340.
          </p>
        </div>

        <button onClick={onSkip} className="mt-6 text-white/30 hover:text-white/60 text-xs text-center transition-colors">
          I'll upload later (timer continues)
        </button>
      </div>
    </div>
  );
}

function ChallanScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-8 pb-10 items-center justify-center">
        <div className="text-6xl mb-6">🚫</div>
        <div className="bg-[#dc2626]/10 border border-[#dc2626]/40 rounded-2xl p-6 w-full mb-8">
          <div className="text-center mb-4">
            <span className="text-[#dc2626] font-bold text-xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>E-CHALLAN ISSUED</span>
            <div className="text-white/40 text-xs mt-1">Auto-generated · {new Date().toLocaleString("en-IN")}</div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            {[
              ["Violation", "Misuse of Software/Not Uploaded on Time"],
              ["Penalty Amount", "₹10,000"],
              ["Challan No.", "ECH-2024-" + Math.floor(Math.random() * 90000 + 10000)],
              ["Due Date", new Date(Date.now() + 15 * 86400000).toLocaleDateString("en-IN")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/40">{k}</span>
                <span className={`text-white font-medium ${k === "Penalty Amount" ? "text-[#dc2626]" : ""}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs text-center mb-8">Pay the challan at Parivahan portal or your nearest RTO office/regarding the issue go to nearest RTO.</p>
        <PrimaryButton label="Back to Home" onClick={onBack} variant="navy" />
      </div>
    </div>
  );
}

function VerifiedScreen({ onDone, isAmbulance }: { onDone: () => void; isAmbulance: boolean }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      {isAmbulance ? (
        /* Ambulance thank-you screen — no AI verification */
        <div className="flex flex-col flex-1 px-6 pb-10 items-center justify-center gap-7">
          <div className="w-28 h-28 rounded-full bg-[#1e3a8a]/30 border-2 border-[#1e3a8a]/50 flex items-center justify-center text-6xl">
            🚑
          </div>
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-white font-bold text-3xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Thank You!
            </h2>
            <p className="text-white/60 text-sm leading-relaxed px-4">
              Thank you for using AbhayaPath services. Your journey has been recorded safely.
            </p>
            <p className="text-[#f59e0b] text-sm font-bold tracking-wide mt-1">#Go With AbhayaPath</p>
          </div>
          <div className="w-full bg-[#1f2937] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
            {[
              ["Journey ID", "APJ-AMB-" + Math.floor(Math.random() * 90000 + 10000)],
              ["Status", "Completed"],
              ["Service", "Ambulance Corridor"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-white/40 text-xs">{k}</span>
                <span className="text-white text-xs font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="w-full">
            <PrimaryButton label="Start New Journey" onClick={onDone} variant="navy" />
          </div>
        </div>
      ) : (
        /* Private vehicle — AI verified screen */
        <div className="flex flex-col flex-1 px-6 pt-8 pb-10 items-center justify-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#16a34a]/20 border-2 border-[#16a34a]/50 flex items-center justify-center text-5xl">
            ✅
          </div>
          <div className="text-center">
            <h2 className="text-white font-bold text-2xl mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>Journey Complete</h2>
            <p className="text-white/50 text-sm leading-relaxed">Your emergency file has been verified by AI and accepted. Your journey record has been saved successfully.</p>
          </div>
          <div className="w-full bg-[#16a34a]/10 border border-[#16a34a]/30 rounded-2xl p-5">
            {[
              ["Journey ID", "APJ-" + Math.floor(Math.random() * 900000 + 100000)],
              ["Status", "Verified ✓"],
              ["File Authenticity", "Genuine (AI Confirmed)"],
              ["Compliance", "Fully Compliant"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/40 text-xs">{k}</span>
                <span className="text-white text-xs font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="w-full mt-4">
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
    <div className="flex flex-col h-full bg-[#0a0f2e] screen-slide-enter">
      <StatusBar />
      <div className="flex flex-col flex-1 px-6 pt-4 pb-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onMap} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            <span className="text-xs font-medium">Map</span>
          </button>
          <div className="flex-1 flex justify-center">
            <Logo size="sm" />
          </div>
          <div className="w-12" />
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#dc2626] to-[#991b1b] flex items-center justify-center" style={{ boxShadow: "0 0 24px rgba(220,38,38,0.35)" }}>
            <span className="text-white font-bold text-2xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>{initials}</span>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>{user.name || "AbhayaPath User"}</div>
            <div className="text-white/40 text-xs">{user.email || "—"}</div>
          </div>
        </div>

        {/* Info cards */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="text-white/30 text-xs uppercase tracking-widest font-medium mb-1">Account Details</div>

          {[
            {
              icon: "👤",
              label: "Full Name",
              value: user.name || "—",
            },
            {
              icon: user.category === "ambulance" ? "🚑" : "🚗",
              label: "Vehicle Category",
              value: user.category === "ambulance"
                ? "Ambulance / Hospital"
                : user.category === "private"
                  ? "Private Vehicle"
                  : "—",
              badge: user.category === "ambulance" ? "EMERGENCY" : user.category === "private" ? "PRIVATE" : null,
              badgeColor: user.category === "ambulance" ? "text-[#dc2626] bg-[#dc2626]/10" : "text-[#1e3a8a] bg-[#1e3a8a]/20",
            },
            {
              icon: "🔢",
              label: "Vehicle Number",
              value: user.vehicleNumber || "—",
              mono: true,
            },
            {
              icon: "📱",
              label: "Mobile Number",
              value: user.phone ? `+91-${user.phone}` : "—",
            },
          ].map(item => (
            <div key={item.label} className="bg-[#1f2937] border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4">
              <span className="text-xl w-7 text-center">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">{item.label}</div>
                <div className={`text-white text-sm font-medium truncate ${item.mono ? "tracking-widest font-mono" : ""}`}>
                  {item.value}
                </div>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
              )}
            </div>
          ))}

          {user.category === "ambulance" && user.hospitalName && (
            <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-2xl px-5 py-4 flex items-center gap-4">
              <span className="text-xl w-7 text-center">🏥</span>
              <div className="flex-1 min-w-0">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Hospital</div>
                <div className="text-white text-sm font-medium truncate">{user.hospitalName}</div>
                {user.hospitalRefId && (
                  <div className="text-white/40 text-xs font-mono mt-0.5">{user.hospitalRefId}</div>
                )}
              </div>
              <div className="flex items-center gap-1 text-[#f59e0b]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="text-[10px] font-semibold">Pending</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full mt-auto border border-[#dc2626]/40 hover:border-[#dc2626] rounded-2xl py-4 flex items-center justify-center gap-2.5 text-[#dc2626] font-semibold text-sm transition-all active:scale-95"
            style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", letterSpacing: "0.04em" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        ) : (
          <div className="mt-auto bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-white text-sm font-medium text-center">Confirm logout?</p>
            <p className="text-white/40 text-xs text-center">You will be redirected to the welcome screen.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-[#1f2937] rounded-xl py-3 text-white/60 text-sm font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] rounded-xl py-3 text-white text-sm font-semibold transition-colors"
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
    <div className="absolute bottom-6 left-4 right-4 bg-[#1f2937]/95 backdrop-blur border border-white/10 rounded-2xl flex z-40" style={{ backdropFilter: "blur(16px)" }}>
      <button
        onClick={onMap}
        className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-l-2xl transition-all ${active === "map" ? "text-white" : "text-white/35"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === "map" ? 2.5 : 1.5} className="w-5 h-5" strokeLinecap="round">
          <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" /><path d="M9 4v13M15 7v13" />
        </svg>
        <span className="text-[10px] font-medium tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>Navigate</span>
        {active === "map" && <div className="w-1 h-1 rounded-full bg-[#dc2626]" />}
      </button>
      <div className="w-px bg-white/10 my-3" />
      <button
        onClick={onProfile}
        className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-r-2xl transition-all ${active === "profile" ? "text-white" : "text-white/35"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === "profile" ? 2.5 : 1.5} className="w-5 h-5" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-[10px] font-medium tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>Profile</span>
        {active === "profile" && <div className="w-1 h-1 rounded-full bg-[#dc2626]" />}
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

