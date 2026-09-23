import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#18181B] text-[#D4D4D8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-bold text-[#3B82F6]">404</p>

        <h1 className="mt-4 text-2xl font-bold text-[#FAFAFA]">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">
          The page you're looking for doesn't exist or may have been moved.
          Check the URL, or head back to your dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="rounded-lg bg-[#3B82F6] px-6 py-3 font-semibold text-white transition hover:bg-[#2563EB]"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-6 py-3 font-medium text-[#D4D4D8] transition hover:border-[#52525B] hover:bg-[#3F3F46]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
