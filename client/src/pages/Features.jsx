import Footer from "../components/Footer";
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
function Features(){
     
    return <>
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

        </div>
      </section>
   
      <Footer/>  
    </>
}

export default Features;