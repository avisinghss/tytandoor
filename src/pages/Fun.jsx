import React, { useState, useEffect } from "react";

export default function FunPrank() {
  const [step, setStep] = useState("ask_due"); // 'ask_due', 'ask_again', 'pay_now'
  const [loopCount, setLoopCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown in seconds

  // Funny response loop messages when they keep pressing "Yes"
  const yesLoopMessages = [
    "Are you absolutely sure? The database record says 0.00 received...",
    "System check failed: Receipt signature not found. Try answering again.",
    "Wait, let me scan again... 🔍 Nope! Still unpaid. Are you lying to an AI?",
    "Nice try! The server doesn't lie. Did you REALLY pay your due amount?",
    "Okay, let's play this game forever. Did you pay your due amount?",
  ];

  // Live 1-hour timer effect when they click "No"
  useEffect(() => {
    let interval = null;
    if (step === "pay_now" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleYes = () => {
    setStep("ask_again");
    setLoopCount((prev) => (prev + 1) % yesLoopMessages.length);
  };

  const handleNo = () => {
    setStep("pay_now");
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white font-mono flex items-center justify-center overflow-hidden select-none">
      {/* Dynamic Inline CSS Keyframe Animations */}
      <style>{`
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.35; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.6; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-float-glow {
          animation: float-glow 6s ease-in-out infinite;
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
      `}</style>

      {/* --- BACKGROUND ANIMATION LAYER --- */}
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      {/* Pulsing Animated Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-float-glow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-float-glow [animation-delay:3s]"></div>

      {/* CRT Monitor Scanline FX */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-20 w-full animate-scanline"></div>

      {/* --- PRANK CONTAINER CARD --- */}
      <div className="relative z-10 max-w-lg w-full mx-4 p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-[0_0_50px_rgba(225,29,72,0.15)] backdrop-blur-md transition-all duration-500">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">
            SYSTEM_VERIFY_v4.0.9
          </span>
        </div>

        {/* --- STATE 1 & 2: THE LOOP QUESTION --- */}
        {(step === "ask_due" || step === "ask_again") && (
          <div className="space-y-6 text-center">
            <div className="inline-flex p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 mb-2">
              <svg className="w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              {step === "ask_due" ? "ACCOUNT VERIFICATION REQUIRED" : "SYSTEM CONTRADICTION DETECTED"}
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed min-h-[48px] flex items-center justify-center">
              {step === "ask_due"
                ? "Did you pay your due amount for this website?"
                : yesLoopMessages[loopCount]}
            </p>

            {/* YES / NO Interactive Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleYes}
                className="flex-1 px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm transition-all border border-zinc-700 active:scale-95 cursor-pointer shadow-lg"
              >
                Yes, I Paid
              </button>
              
              <button
                onClick={handleNo}
                className="flex-1 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] active:scale-95 cursor-pointer"
              >
                No, I Didn't
              </button>
            </div>
          </div>
        )}

        {/* --- STATE 3: LOCKOUT & PAY NOW TIMER --- */}
        {step === "pay_now" && (
          <div className="space-y-6 text-center animate-fade-in">
            {/* Warning Radar Lockout Icon */}
            <div className="relative inline-flex items-center justify-center p-4 rounded-full bg-red-950/60 border border-red-600/50 text-red-500">
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></span>
              <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-red-500 tracking-wider animate-pulse-fast">
                PAGE ACCESS SUSPENDED
              </h2>
              <p className="text-xs text-zinc-400 uppercase tracking-widest">
                Pending Due Amount Detected
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-red-900/60 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Lockout Expiration Timer
              </p>
              <div className="text-4xl sm:text-5xl font-black tracking-widest text-red-500 font-mono drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                {formatTime(timeLeft)}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed px-2">
              Please pay your due amount now to unlock this website. The system will hold this lock status until payment confirmation.
            </p>

            {/* Fake Payment CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => alert("🚨 Payment Gateway Error: Please contact developer to settle your dues! 😉")}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)] active:scale-95 cursor-pointer"
              >
                💳 Pay Now
              </button>
            </div>

            <p className="text-[10px] text-zinc-600 italic">
              *Refresh will not bypass security status.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}