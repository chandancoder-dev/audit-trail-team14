import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { queryAPI, authAPI } from "../services/api.js";

function Dashboard() {
  const [name, setName] = useState("");
  const [inTransit, setInTransit] = useState(0);
  const [total, setTotal] = useState(0);
  const [arrived, setArrived] = useState(0);
  const [alert, setAlert] = useState(0);
  const [shipments, setShipments] = useState([]);
  const [page , setpage] = useState(1);
  const fetchShipments = async (page = 1 , limit = 10) => {
    try {
      const res = await queryAPI.getShipments({
        page: page,
        limit: limit,
      });

      setShipments(res.shipments || []);
    } catch (error) {
      console.log(error);
    }
  };
  async function fetchback(){
      if(page === 1)
        return;
      const newPage = page-1;
      try{
         setpage(newPage);
         await fetchShipments(newPage);
      }
      catch(e){
        console.log(e);
      }
  }
   
  async function fetchfoward(){
      
      const newPage = page+1;
      try{
         setpage(newPage);
         await fetchShipments(newPage);
      }
      catch(e){
        console.log(e);
      }
  }

  const fetchUserDetails = async () => {
    try {
      const res = await authAPI.getMe();

      setName(res.name);
      setInTransit(res.in_transit || 0);
      setTotal(res.total || 0);
      setArrived(res.arrived || 0);
      setAlert(res.alert || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchShipments();
  }, []);

  return (
    <div className="min-h-screen bg-[#18181B] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* ================= Greeting ================= */}
        <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 md:p-10">
          <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
            Hello, {name} 👋
          </p>

          <p className="mt-3 text-base leading-7 text-[#A1A1AA] md:text-lg">
            Here's what's happening with your shipments.
          </p>
        </div>


        {/* ================= Summary ================= */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Summary
              text="Total Shipments"
              value={total}
            />

            <Summary
              text="In Transit"
              value={inTransit}
            />

            <Summary
              text="Arrived"
              value={arrived}
            />

            <Summary
              text="Alerts"
              value={alert}
            />

          </div>
        </div>


        {/* ================= Recent Shipments ================= */}
        <div className="mt-2">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                Recent Shipments
              </h1>

              <p className="mt-1 text-sm text-[#71717A]">
                Your latest shipment activity
              </p>
            </div>

            
            
            <button
              onClick={fetchback}
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"  
            >
              &larr;
            </button>
            <button
              onClick={fetchfoward} 
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
            >
             &rarr;
            </button>
          </div>


          <div className="overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#27272A]">

            {/* Table Header */}
            <div className="hidden grid-cols-5 border-b border-[#3F3F46] px-5 py-4 md:grid">

              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                Shipment
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                Origin
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                Destination
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                Location
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                Status
              </p>

            </div>


            {/* Shipments */}
            <div className="divide-y divide-[#3F3F46]">

              {shipments.length === 0 ? (

                <div className="p-8 text-center">
                  <p className="text-sm text-[#71717A]">
                    No shipments found.
                  </p>
                </div>

              ) : (

                shipments.map((shipment) => (

                  <Link
                    key={shipment.shipmentId}
                    to={`/shipment/${shipment.shipmentId}`}
                    className="grid grid-cols-1 gap-4 p-5 transition hover:bg-[#202023] md:grid-cols-5 md:items-center"
                  >

                    {/* Shipment */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                        Shipment
                      </p>

                      <p className="mt-1 font-semibold text-[#FAFAFA]">
                        {shipment.shipmentId}
                      </p>
                    </div>


                    {/* Origin */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                        Origin
                      </p>

                      <p className="mt-1 text-sm text-[#D4D4D8]">
                        {shipment.origin || "Not available"}
                      </p>
                    </div>


                    {/* Destination */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                        Destination
                      </p>

                      <p className="mt-1 text-sm text-[#D4D4D8]">
                        {shipment.destination || "Not available"}
                      </p>
                    </div>


                    {/* Current Location */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-[#D4D4D8]">
                        {shipment.currentLocation || "Not available"}
                      </p>
                    </div>


                    {/* Status */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                        Status
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          shipment.status === "in_transit"
                            ? "bg-blue-500/10 text-blue-400"
                            : shipment.status === "arrived"
                            ? "bg-green-500/10 text-green-400"
                            : shipment.status === "alert"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-zinc-500/10 text-zinc-400"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </div>

                  </Link>

                ))

              )}

            </div>

          </div>

        </div>


        {/* ================= Quick Actions ================= */}
        <div className="mt-8">

          <h2 className="mb-4 text-xl font-semibold text-[#FAFAFA]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Shipment Operations */}
            <Link
              to="/shipment-operations"
              className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6 transition hover:-translate-y-1 hover:border-[#3B82F6]"
            >
              <h3 className="text-base font-semibold text-[#FAFAFA]">
                Shipment Operations
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                Create and manage shipment operations.
              </p>
            </Link>


            {/* Alerts */}
            <Link
              to="/alerts"
              className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6 transition hover:-translate-y-1 hover:border-[#EF4444]"
            >
              <h3 className="text-base font-semibold text-[#FAFAFA]">
                Alerts
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                Review shipment alerts and issues.
              </p>
            </Link>


            {/* Analytics */}
            <Link
              to="/shipment/analytics"
              className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6 transition hover:-translate-y-1 hover:border-[#3B82F6]"
            >
              <h3 className="text-base font-semibold text-[#FAFAFA]">
                Analytics
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                View shipment analytics and insights.
              </p>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}


/* ================= Summary Component ================= */

function Summary({ text, value }) {
  return (
    <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6 transition hover:-translate-y-1 hover:border-[#3B82F6]">

      <p className="text-sm font-medium text-[#A1A1AA]">
        {text}
      </p>

      <p className="mt-2 text-3xl font-bold text-[#FAFAFA]">
        {value}
      </p>

    </div>
  );
}

export default Dashboard;
