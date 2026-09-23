import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About - GetMeAChai',
  description: 'Learn how GetMeAChai helps fans support independent creators.',
}

const About = () => {
  return (
    <main className="min-h-screen px-5 pb-28 pt-12 text-white sm:px-8 sm:pt-16">
      <section className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1.5 text-sm font-medium text-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_12px_#fdba74]" />
            Built for independent creators
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            A little support can keep a big idea moving.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Get-me-chai makes it simple for fans to support the creators they love.
            No complicated memberships, just a warm thank-you that helps creators
            keep making their best work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Start your creator page
              <span aria-hidden="true" className="ml-2 text-lg">-&gt;</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Explore Get-me-chai
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-5 rounded-4xl bg-orange-400/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/70 p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-200/80">The simple idea</p>
                <h2 className="mt-3 text-3xl font-bold">One chai at a time.</h2>
              </div>
              <Image src="/chai.gif" width={64} height={64} alt="A cup of chai" className="rounded-full" />
            </div>
            <div className="mt-8 space-y-5">
              <div className="flex gap-4 border-b border-white/10 pb-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-300/15 text-orange-200">1</span>
                <div><h3 className="font-semibold">Create</h3><p className="mt-1 text-sm leading-6 text-slate-400">Set up your page and share what you make.</p></div>
              </div>
              <div className="flex gap-4 border-b border-white/10 pb-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-300/15 text-sky-200">2</span>
                <div><h3 className="font-semibold">Connect</h3><p className="mt-1 text-sm leading-6 text-slate-400">Let your community find and encourage you.</p></div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">3</span>
                <div><h3 className="font-semibold">Keep creating</h3><p className="mt-1 text-sm leading-6 text-slate-400">Turn small moments of support into more work.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl border-t border-white/10 pt-12">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200/80">Why it matters</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Support should feel personal.</h2>
          <p className="mt-4 leading-7 text-slate-400">Whether you are sharing art, code, music, videos, or ideas, your audience deserves an easy way to say, &quot;Keep going.&quot;</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { image: '/gift.gif', title: 'Fans show up', text: 'Give your community a direct way to celebrate your work.' },
            { image: '/coin.gif', title: 'Small adds up', text: 'Every chai is a meaningful contribution to your next idea.' },
            { image: '/people.gif', title: 'Creators grow', text: 'Build a lasting connection around the work you care about.' },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/4 p-6 transition hover:-translate-y-1 hover:border-orange-200/30 hover:bg-white/[0.07]">
              <Image src={item.image} width={58} height={58} alt="" className="mb-5 rounded-full bg-slate-200/10 p-2" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default About
