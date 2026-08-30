import { Link } from "react-router-dom"
function Footer(){

    return (
        <>
            
      <div className="border-t border-[#3F3F46] bg-[#18181B]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between">

          <div>

            <h3 className="text-lg font-bold text-[#FAFAFA]">
              Audit<span className="text-[#3B82F6]">Trail</span>
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              Event-driven shipment tracking.
            </p>

          </div>


          <div className="flex gap-6 text-sm">

            <Link
              to="/"
              className="text-[#A1A1AA] transition hover:text-[#FAFAFA]"
            >
              Home
            </Link>

            <Link
              to="/features"
              className="text-[#A1A1AA] transition hover:text-[#FAFAFA]"
            >
              Features
            </Link>

            <Link
              to="/about"
              className="text-[#A1A1AA] transition hover:text-[#FAFAFA]"
            >
              About
            </Link>

          </div>


          <p className="text-sm text-[#71717A]">
            © 2026 AuditTrail
          </p>

        </div>

      </div>
        </>
    )
}

export default Footer;