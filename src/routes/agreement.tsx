import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/agreement")({
  head: () => ({
    meta: [
      { title: "Service Agreement — Presence Studio" },
      {
        name: "description",
        content:
          "A short, plain-English service agreement for Presence Studio page setup, content creation and growth work.",
      },
      { property: "og:title", content: "Service Agreement — Presence Studio" },
      {
        property: "og:description",
        content:
          "A short, plain-English service agreement covering scope, timeline, fees, revisions, ownership and cancellation.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgreementPage,
});

const clauses = [
  {
    n: "01",
    title: "The parties",
    body: (
      <>
        <p>
          This agreement is between <strong>Presence Studio</strong> (&ldquo;we&rdquo;, the
          provider) and the business named on the signature page (&ldquo;you&rdquo;, the client).
        </p>
        <p>
          It starts on the date both names are signed below and stays in place while we are working
          together.
        </p>
      </>
    ),
  },
  {
    n: "02",
    title: "What we do",
    body: (
      <>
        <p>We provide one or more of the following, as agreed in your written quote:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Page Setup</strong> — building your social media page: profile, bio, links,
            highlights and cover art.
          </li>
          <li>
            <strong>Content Creation</strong> — original posts, reels and captions written and
            designed for your business.
          </li>
          <li>
            <strong>Growth &amp; Presence</strong> — regular posting and simple growth work to keep
            the page active.
          </li>
        </ul>
        <p>
          Anything not listed in your quote isn&rsquo;t included. If you&rsquo;d like to add
          something, we&rsquo;ll quote it separately and you approve it in writing first.
        </p>
      </>
    ),
  },
  {
    n: "03",
    title: "What we need from you",
    body: (
      <p>
        To keep things moving, please give us the basics — your logo, photos, product details and
        page access — and reply to approval requests within five working days. If we&rsquo;re waiting
        on you, the timeline moves by the same amount of time.
      </p>
    ),
  },
  {
    n: "04",
    title: "Timeline",
    body: (
      <>
        <p>
          Start and delivery dates are set out in your quote. As a guide, a new page setup is
          normally ready within two weeks of receiving everything we need, and ongoing content runs
          month to month.
        </p>
        <p>If something is going to be late, we&rsquo;ll tell you before the date, not after.</p>
      </>
    ),
  },
  {
    n: "05",
    title: "Fees and payment",
    body: (
      <>
        <p>
          Fees are <strong>to be confirmed in writing</strong> in the quote we send you before work
          begins. No work starts until you&rsquo;ve accepted that quote in writing.
        </p>
        <p>
          Invoices are due within 14 days. Ongoing monthly work is invoiced at the start of each
          month. If an invoice goes unpaid for more than 14 days, we may pause work until it&rsquo;s
          settled.
        </p>
      </>
    ),
  },
  {
    n: "06",
    title: "Revisions",
    body: (
      <p>
        Each piece of work includes <strong>two rounds of changes</strong> at no extra cost. Further
        changes, or a request to start again in a new direction, are quoted separately and agreed in
        writing first.
      </p>
    ),
  },
  {
    n: "07",
    title: "Ownership of the work",
    body: (
      <>
        <p>
          Once your invoice is paid, the finished posts, images and captions we made for you are
          yours to keep and use. Your page and account always belong to you.
        </p>
        <p>
          We keep ownership of our own templates, presets and working files, and we may show the
          finished work in our portfolio unless you ask us in writing not to.
        </p>
      </>
    ),
  },
  {
    n: "08",
    title: "Confidentiality",
    body: (
      <p>
        Anything private you share with us — passwords, pricing, plans, customer details — stays
        private. We only use it to do the work, we don&rsquo;t pass it on, and we delete or return
        access when we finish.
      </p>
    ),
  },
  {
    n: "09",
    title: "Referral links",
    body: (
      <p>
        Where agreed, we may include a tracked referral link in the page bio. Any commission
        arrangement on sales made through that link is set out in writing in your quote, and either
        of us can end it with 30 days&rsquo; notice.
      </p>
    ),
  },
  {
    n: "10",
    title: "Ending the agreement",
    body: (
      <>
        <p>
          Either of us can end this agreement with <strong>14 days&rsquo; written notice</strong>{" "}
          (email is fine). You pay for work completed up to that date; we hand over everything
          finished and paid for.
        </p>
        <p>
          If either side seriously breaks this agreement and doesn&rsquo;t fix it within 14 days of
          being told, the other can end it immediately.
        </p>
      </>
    ),
  },
  {
    n: "11",
    title: "Fair limits",
    body: (
      <p>
        We&rsquo;ll do our work with care, but we can&rsquo;t promise particular follower numbers,
        sales or results, and we aren&rsquo;t responsible for decisions the social platforms make
        about your account. Our responsibility is limited to the fees you&rsquo;ve paid us for the
        work in question.
      </p>
    ),
  },
];

function AgreementPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border/60 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Presence<span className="text-accent">.</span>Studio
          </Link>
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start a page
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Service agreement
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          A short contract for the work.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Plain English, one page, no jargon. This is what we agree to before any work starts, so
          both of us know exactly where we stand.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Print / save as PDF
          </button>
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Ask a question
          </Link>
        </div>

        <div className="mt-14 space-y-12">
          {clauses.map((c) => (
            <section key={c.n} className="border-t border-border pt-6">
              <span className="font-display text-sm text-accent">{c.n}</span>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">{c.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </div>
            </section>
          ))}
        </div>

        {/* Signatures */}
        <section className="mt-16 rounded-3xl border border-border bg-card p-8 md:p-10">
          <h2 className="font-display text-xl font-semibold tracking-tight">Signatures</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Signing below means we both agree to everything above, along with the fees set out in
            the written quote.
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {[
              { role: "The client", name: "Business name", who: "Name and position" },
              { role: "Presence Studio", name: "Presence Studio", who: "Name and position" },
            ].map((p) => (
              <div key={p.role} className="space-y-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {p.role}
                </p>
                <SignLine label={p.name} />
                <SignLine label={p.who} />
                <SignLine label="Signature" />
                <SignLine label="Date" />
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          This is a plain-English summary of how we work together, not legal advice. If your
          business needs specific legal wording, please have it reviewed before signing.
        </p>
      </main>

      <footer className="border-t border-border/60 print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Presence Studio. All rights reserved.</span>
          <Link to="/" className="hover:text-foreground">
            Back to the site
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SignLine({ label }: { label: string }) {
  return (
    <div>
      <div className="h-8 border-b border-border" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
