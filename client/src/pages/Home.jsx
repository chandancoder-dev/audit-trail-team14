import { Link } from "react-router-dom";
import Footer from "../components/Footer";
function Home() {
  return (
    <div className="min-h-screen bg-[#18181B] text-[#D4D4D8]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden border-b border-[#3F3F46]">

        {/* Background glow */}
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-[120px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-24 lg:flex-row lg:py-32">

          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">

            <div className="mb-6 inline-flex items-center rounded-full border border-[#3F3F46] bg-[#27272A] px-4 py-2 text-sm text-[#A1A1AA]">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#22C55E]" />
              Event-Driven Shipment Tracking
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#FAFAFA] md:text-6xl">
              Track Every Shipment.
              <span className="block text-[#3B82F6]">
                Trust Every Event.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A1A1AA]">
              Monitor shipments and preserve every state change with a
              reliable event-driven tracking system built for transparency,
              traceability, and fast access to shipment data.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                to={(localStorage.getItem("token") ? "/dashboard" : "/register")}
                className="rounded-lg bg-[#3B82F6] px-6 py-3 font-semibold text-[#FAFAFA] transition duration-200 hover:bg-[#2563EB]"
              >
                Get Started
              </Link>

              <Link
                to="/features"
                className="rounded-lg border border-[#3F3F46] bg-[#27272A] px-6 py-3 font-semibold text-[#D4D4D8] transition duration-200 hover:border-[#3B82F6] hover:text-[#FAFAFA]"
              >
                Explore Features
              </Link>

            </div>
          </div>


          {/* Shipment Preview Card */}
          <div className="w-full max-w-md flex-1">

            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6 shadow-2xl shadow-black/30">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-[#71717A]">
                    Shipment
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-[#FAFAFA]">
                    #AT-10294
                  </h3>
                </div>

                <span className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-sm text-[#3B82F6]">
                  In Transit
                </span>

              </div>

              <div className="my-6 h-px bg-[#3F3F46]" />

              <div className="space-y-5">

                <TimelineItem
                  title="Shipment Created"
                  date="10 Aug, 09:30 AM"
                  completed
                />

                <TimelineItem
                  title="Picked Up"
                  date="10 Aug, 02:15 PM"
                  completed
                />

                <TimelineItem
                  title="In Transit"
                  date="11 Aug, 08:45 AM"
                  completed
                />

                <TimelineItem
                  title="Out for Delivery"
                  date="Expected Today"
                  current
                />

              </div>

              <div className="mt-4 rounded-lg border border-[#3F3F46] bg-[#202023] p-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#71717A]">
                    Route
                  </span>

                  <span className="text-sm font-medium text-[#D4D4D8]">
                    Mumbai → Kolkata
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          WHY AUDIT TRAIL
      ===================================================== */}
      <section className="border-b border-[#3F3F46] bg-[#18181B]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#3B82F6]">
              Why Audit Trail?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#FAFAFA] md:text-4xl">
              Every shipment has a story.
            </h2>

            <p className="mt-5 leading-7 text-[#A1A1AA]">
              Traditional systems often keep only the current state.
              Audit Trail preserves the complete journey of every shipment.
            </p>

          </div>


          <div className="mt-16 grid gap-8 md:grid-cols-2">

            {/* Traditional */}
            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10 text-xl text-[#EF4444]">
                ×
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#FAFAFA]">
                Traditional Tracking
              </h3>

              <div className="mt-6 rounded-lg border border-[#3F3F46] bg-[#202023] p-5">

                <p className="text-sm text-[#71717A]">
                  Current Status
                </p>

                <p className="mt-2 text-lg font-semibold text-[#D4D4D8]">
                  Delivered
                </p>

              </div>

              <p className="mt-5 leading-7 text-[#A1A1AA]">
                Previous shipment states may be overwritten, making it
                difficult to reconstruct the complete journey.
              </p>

            </div>


            {/* Audit Trail */}
            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-xl text-[#22C55E]">
                ✓
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#FAFAFA]">
                Audit Trail
              </h3>

              <div className="mt-6 space-y-3">

                {[
                  "Shipment Created",
                  "Picked Up",
                  "In Transit",
                  "Arrived at Hub",
                  "Delivered",
                ].map((event, index) => (

                  <div
                    key={event}
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B82F6]/10 text-xs font-medium text-[#3B82F6]">
                      {index + 1}
                    </div>

                    <span className="text-sm text-[#D4D4D8]">
                      {event}
                    </span>

                  </div>

                ))}

              </div>

              <p className="mt-5 leading-7 text-[#A1A1AA]">
                Every important state change is preserved as an immutable
                event.
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section className="border-b border-[#3F3F46] bg-[#202023]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#3B82F6]">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#FAFAFA] md:text-4xl">
              Everything you need to track shipments
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#A1A1AA]">
              Powerful tools for monitoring, searching, and understanding
              shipment activity.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon="📦"
              title="Shipment Tracking"
              description="Track the current state and complete journey of every shipment."
            />

            <FeatureCard
              icon="📜"
              title="Complete Audit Trail"
              description="Preserve every state-changing operation as an immutable event."
            />

            <FeatureCard
              icon="⌕"
              title="Fast Search"
              description="Quickly find shipments using identifiers and relevant information."
            />

            <FeatureCard
              icon="⚡"
              title="Fast Queries"
              description="Use optimized read models for responsive dashboard queries."
            />

            <FeatureCard
              icon="▥"
              title="Analytics"
              description="Understand shipment activity through useful summaries and insights."
            />

            <FeatureCard
              icon="🔒"
              title="Secure Authentication"
              description="Protect shipment information with authenticated access."
            />

          </div>


          <div className="mt-12 text-center">

            <Link
              to="/features"
              className="font-semibold text-[#3B82F6] transition hover:text-[#2563EB]"
            >
              View all features →
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="border-b border-[#3F3F46] bg-[#18181B]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-[#3B82F6]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#FAFAFA] md:text-4xl">
              From shipment event to dashboard
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[#A1A1AA]">
              Every state change flows through the event-driven system
              before becoming available for fast dashboard queries.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-5">

            <ProcessCard
              number="01"
              title="Action"
              description="A shipment changes state."
            />

            <ProcessCard
              number="02"
              title="Event"
              description="The state-changing operation becomes an event."
            />

            <ProcessCard
              number="03"
              title="Event Store"
              description="The event is stored permanently."
            />

            <ProcessCard
              number="04"
              title="Projection"
              description="The read model is updated."
            />

            <ProcessCard
              number="05"
              title="Dashboard"
              description="Users query the latest shipment information."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-[#18181B]">

        <div className="mx-auto max-w-5xl px-6 py-24">

          <div className="rounded-3xl border border-[#3F3F46] bg-[#27272A] px-6 py-16 text-center shadow-2xl shadow-black/20">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-2xl text-[#3B82F6]">
              →
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#FAFAFA] md:text-4xl">
              Ready to track every shipment event?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#A1A1AA]">
              Create an account and start exploring your shipment
              tracking dashboard.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block rounded-lg bg-[#3B82F6] px-7 py-3 font-semibold text-[#FAFAFA] transition hover:bg-[#2563EB]"
            >
              Get Started
            </Link>

          </div>

        </div>
      </section>

     <Footer/>
    </div>
  );
}


/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({ title, date, completed, current }) {
  return (
    <div className="flex gap-4">

      <div className="flex flex-col items-center">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
            current
              ? "bg-[#3B82F6] text-[#FAFAFA]"
              : completed
              ? "bg-[#22C55E]/10 text-[#22C55E]"
              : "bg-[#202023] text-[#71717A]"
          }`}
        >
          {completed ? "✓" : "•"}
        </div>

        <div className="mt-2 h-full w-px bg-[#3F3F46]" />

      </div>

      <div className="pb-4">

        <p className="font-medium text-[#FAFAFA]">
          {title}
        </p>

        <p className="mt-1 text-sm text-[#71717A]">
          {date}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/50 hover:shadow-lg hover:shadow-black/20">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#3F3F46] bg-[#202023] text-xl">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-semibold text-[#FAFAFA]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#A1A1AA]">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({ number, title, description }) {
  return (
    <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-6 transition duration-200 hover:border-[#3B82F6]/50">

      <p className="text-sm font-bold text-[#3B82F6]">
        {number}
      </p>

      <h3 className="mt-4 text-lg font-semibold text-[#FAFAFA]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">
        {description}
      </p>

    </div>
  );
}


export default Home;