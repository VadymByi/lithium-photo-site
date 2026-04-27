export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* LEFT SECTION: HEADING AND CONTACT INFO */}
          <div className="md:col-span-5 space-y-8">
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none text-zinc-900">
              Get in <br /> Touch
            </h1>

            {/* LOCATION BLOCK */}
            <div className="pt-10 space-y-4">
              <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                Location
              </p>
              <p className="text-xl font-light italic">
                Kyiv, Ukraine / Available Worldwide
              </p>
            </div>
          </div>

          {/* RIGHT SECTION: CONTACT FORM */}
          <div className="md:col-span-7 border-l border-zinc-100 md:pl-12 pt-4">
            <form className="space-y-12">
              {/* EMAIL INPUT FIELD */}
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-2 block">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border-b border-zinc-200 py-4 outline-none focus:border-black transition-colors text-xl font-light"
                />
              </div>

              {/* MESSAGE TEXTAREA FIELD */}
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-2 block">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-transparent border-b border-zinc-200 py-4 outline-none focus:border-black transition-colors text-xl font-light resize-none"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button className="group flex items-center gap-4 text-sm uppercase tracking-[0.3em] font-bold">
                <span>Send Message</span>
                <div className="w-12 h-px bg-black group-hover:w-20 transition-all"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
