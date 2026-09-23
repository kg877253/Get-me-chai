import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
    title: 'Page not found - GetMeAChai',
    description: 'The page you are looking for could not be found on GetMeAChai.',
}

const Notfoundpage = () => {
    return (
        <main className="relative flex min-h-[calc(100vh-145px)] items-center justify-center overflow-hidden px-5 py-16 text-white sm:px-8">
            <div className="pointer-events-none absolute -left-24 top-1/4 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <section className="relative w-full max-w-2xl text-center">
                <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-orange-300/20 bg-orange-300/10 shadow-[0_0_80px_rgba(251,146,60,0.14)] sm:h-32 sm:w-32">
                    <Image
                        src="/chai.gif"
                        alt="A steaming cup of chai"
                        width={76}
                        height={76}
                        className="h-16 w-16 object-contain sm:h-[76px] sm:w-[76px]"
                    />
                </div>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">404 error</p>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">This page took a chai break.</h2>
                <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                    The page you are looking for does not exist or may have moved. Let&apos;s get you back to a place worth supporting.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
                    >
                        <span aria-hidden="true">←</span>
                        Back to home
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
                    >
                        Support a creator
                    </Link>
                </div>

                <p className="mt-8 text-xs text-slate-500">Try checking the address, or use one of the links above.</p>
            </section>
        </main>
    )
}

export default Notfoundpage
