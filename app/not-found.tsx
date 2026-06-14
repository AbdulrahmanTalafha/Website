import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold text-secondary-500 mb-3">404</p>
        <h1 className="text-3xl font-black text-primary-500 mb-3">Page not found</h1>
        <p className="text-neutral-600 mb-6">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/ar"
          className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  )
}
