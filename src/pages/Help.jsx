import React, { useState } from 'react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "How do I claim my 10-year product warranty?", a: "You can submit your original order ID along with photos of the installation through our online Warranty Claim form below." },
    { q: "What is the typical delivery timeframe for custom doors?", a: "Custom engineered doors typically require 14 to 21 business days for precision manufacturing and quality inspection." },
    { q: "Can an expert visit my site for measurements?", a: "Yes! Click the 'Request Expert Call' button above to schedule an architect site visit in eligible metro regions." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-[#b31919] dark:text-red-500 font-bold text-xs uppercase tracking-wider block mb-1">Support Center</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Can We Help You?</h1>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Warranty */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-[#b31919] transition">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold mb-2">Avail Product Warranty</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Register your newly purchased doors or file a protection claim under our 10-year core guarantee.
            </p>
            <button className="w-full bg-[#b31919] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer">
              Register / Claim Warranty
            </button>
          </div>

          {/* Card 2: Callback */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-500 transition">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="text-lg font-bold mb-2">Get Call From Experts</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Unsure about frame sizing or finishing styles? Request a prompt callback from our technical design engineers.
            </p>
            <button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer">
              Request Callback
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center text-left font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:text-[#b31919] transition"
                >
                  <span>{faq.q}</span>
                  <span>{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}