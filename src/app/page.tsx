import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              LoL Fantasy League
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create your fantasy team with professional League of Legends players. 
              Compete with friends based on real-world player performance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signin"
                className="btn-primary"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
