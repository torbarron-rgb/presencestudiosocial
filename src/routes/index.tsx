import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

const services = [
  {
    title: "Page Setup",
    body: "A polished, on-brand Instagram, Facebook or TikTok page built from scratch — bio, links, highlights, cover art, the lot.",
  },
  {
    title: "Content Creation",
    body: "Original posts, reels and captions designed to make your business look established and trustworthy from day one.",
  },
  {
    title: "Growth & Presence",
    body: "Consistent posting and simple growth tactics so the page keeps working for you long after it goes live.",
  },
];

const process = [
  { step: "01", title: "Quick chat", body: "We talk about your business, your customers, and what you want the page to do." },
  { step: "02", title: "We build", body: "Branding, bio, first wave of posts and reels — everything a new visitor needs to trust you." },
  { step: "03", title: "You go live", body: "We hand it over ready to grow, with a clear plan for what to post next." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Nav */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            Presence<span className="text-accent">.</span>Studio
          </a>
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#process" className="hover:text-foreground transition-colors">Process</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start a page
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Social media, done properly
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Social media pages that make small businesses look established.
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              We build and grow Instagram, Facebook and TikTok pages for businesses that don&rsquo;t
              yet have a presence online — so you can focus on running the business, not the feed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book a free chat
              </a>
              <a
                href="#services"
                className="inline-flex items-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                See what we do
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Services</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Everything your page needs to look the part.
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Three simple offerings, priced clearly. Pick one, or let us handle the whole thing end to end.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-[0_1px_0_0_var(--border),0_20px_40px_-24px_rgba(15,23,42,0.15)]"
              >
                <div>
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
                <div className="mt-10 h-px w-full bg-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            From zero to a page you&rsquo;re proud of, in three steps.
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {process.map((p) => (
            <div key={p.step} className="border-t border-border pt-6">
              <span className="font-display text-sm text-accent">{p.step}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">About</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Built for businesses that don&rsquo;t have time to post.
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-5 text-muted-foreground">
              <p>
                Most small businesses know they should be on social media. Very few have the time,
                the tools, or the taste to make it actually look good.
              </p>
              <p>
                That&rsquo;s where we come in. We handle the whole thing — the branding, the writing,
                the posting — so your business shows up online looking like it&rsquo;s been there for years.
              </p>
              <p className="text-foreground">
                Clear pricing. No jargon. No long contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* Contact */}
<section id="contact" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
  <div className="rounded-3xl border border-border bg-card p-10 md:p-16">
    <div className="grid gap-12 md:grid-cols-12">
      {/* Left side - text */}
      <div className="md:col-span-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Get in touch
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to give your business a proper online presence?
        </h2>
        <p className="mt-5 text-muted-foreground">
          Tell us a little about what you do. We’ll come back within one business day with a plan and a quote — no pressure.
        </p>
      </div>

      {/* Right side - form */}
      <div className="md:col-span-7">
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          className="space-y-5"
        >
          {/* Access Key */}
          <input
            type="hidden"
            name="access_key"
            value="34d00cbd-712e-41a8-85ea-b6ecbaa4769f"
          />

          {/* Honeypot spam protection */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Business name (optional)</label>
            <input
              type="text"
              name="business"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Tell us a bit about your business and what you need..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Presence Studio. All rights reserved.</span>
          <span>Social media, done properly.</span>
        </div>
      </footer>
    </div>
  );
}
