import Footer from "../components/Footer";
function About(){
     
    return <div className="min-h-screen bg-[#18181B] text-[#D4D4D8]">
        {/* About Audit Trail */}
       <div className="min-h-[60vh] flex items-center justify-center px-6 py-20 bg-[#18181B] border-y border-[#3F3F46]">
        <div className="w-full max-w-4xl rounded-2xl border border-[#3F3F46] bg-[#202023] px-8 py-14 md:px-12 md:py-16 text-center shadow-xl">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAFAFA]">
              ABOUT <span className="text-[#3B82F6]">AUDIT TRAIL</span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl font-medium text-[#3B82F6]">
               Making shipment history transparent and reliable
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg leading-8 text-[#A1A1AA]">
                   Audit Trail is an event-driven shipment tracking system
                   that records every important change in a shipment's lifecycle.
            </p>
        
            {/* Small accent */}
            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#3B82F6]" />

         </div>
      </div>
        
         
       {/* Why use Audit Taril*/}
       <div className="border-b border-[#3F3F46] bg-[#18181B]">

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
      </div>
      
      {/*How it works.*/}
       <div className="border-b border-[#3F3F46] bg-[#18181B]">

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
      </div>
    {/*Key principles */}
<div className="min-h-[50vh] bg-[#18181B] px-6 py-20">

    <div className="mx-auto max-w-6xl">

        <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold tracking-tight text-[#FAFAFA]">
            KEY PRINCIPLES
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 transition duration-300 hover:border-[#3B82F6] hover:-translate-y-1">

                <h3 className="text-xl font-semibold text-[#FAFAFA]">
                    Immutable Events
                </h3>

                <p className="mt-4 text-[#A1A1AA] leading-7">
                    Every important shipment operation is stored as an
                    immutable event, preserving the original history.
                </p>

            </div>


            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 transition duration-300 hover:border-[#3B82F6] hover:-translate-y-1">

                <h3 className="text-xl font-semibold text-[#FAFAFA]">
                    Complete History
                </h3>

                <p className="mt-4 text-[#A1A1AA] leading-7">
                    Every stage of a shipment's lifecycle can be traced
                    from its creation to its final delivery.
                </p>

            </div>


            <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 transition duration-300 hover:border-[#3B82F6] hover:-translate-y-1">

                <h3 className="text-xl font-semibold text-[#FAFAFA]">
                    Fast Queries
                </h3>

                <p className="mt-4 text-[#A1A1AA] leading-7">
                    A dedicated read model provides fast access to current
                    shipment information and dashboard queries.
                </p>

            </div>

        </div>

    </div>
    </div>
    <Footer/>
    </div>
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
export default About;