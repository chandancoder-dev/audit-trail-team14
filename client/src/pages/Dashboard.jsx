import {Link} from "react-router-dom";
import { useEffect ,useState } from "react";
import {queryAPI, authAPI} from "../services/api.js"

function Dashboard(){
    
      const [name, setname] = useState("");
      const [inTransit , setInTransit] = useState(0);
      const [total , setTotal] = useState(0);
      const [arrived , setArrived] = useState(0);
      const [alert , setAlert] = useState(0);
      const [shipments, setShipments] = useState([]);
      const [shipmentId , setShipmentId] = useState("");
      const [shipment, setShipment] = useState({});
      const [dipslay , setDisplay] = useState(false);

      const fetchShipments = async () => {
      try {
        const res = await queryAPI.getShipments({
          page: 1,
          limit: 10,
        });

      setShipments(res.shipments);
    } catch (error) {
      console.log(error);
    }
  };
    async function fetchShipment(){
        try{
            const res = await queryAPI.getShipment(shipmentId);
            setShipment(res);
            console.log(shipment);
        }
        catch(e){
             console.log(e);
        } 

    }
    useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await authAPI.getMe();

        setInTransit(res.in_transit);
        setTotal(res.total);
        setArrived(res.arrived);
        setAlert(res.alert);

        setname(res.name);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserDetails();
    fetchShipments();
  }, []);
    return(
       <div className="min-h-screen bg-[#18181B] px-6 py-10">
         <div className="mx-auto max-w-6xl">

           {/* Greeting */}
         <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 md:p-10">
           <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
            Hello, {name} 👋
           </p>

         <p className="mt-3 text-base leading-7 text-[#A1A1AA] md:text-lg">
            Here's what's happening with your shipments.
        </p>
      </div>


    {/* Summary */}
    <div className="py-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Summary
          text={"Total Shipments"}
          value={total}
        />

        <Summary
          text={"In Transit"}
          value={inTransit}
        />

        <Summary
          text={"Arrived"}
          value={arrived}
        />

        <Summary
          text={"Alert"}
          value={alert}
        />
      </div>
    </div>


    {/* Recent Shipments */}
    <div className="mt-2">

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[#FAFAFA]">
          Recent Shipments
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#27272A]">

        {/* Table Header */}
        <div className="hidden grid-cols-4 border-b border-[#3F3F46] px-5 py-4 md:grid">
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
            Status
          </p>
        </div>


        {/* Shipments */}
        <div className="divide-y divide-[#3F3F46]">
          {shipments.map((shipment) => (
            <div
              key={shipment.shipmentId}
              className="grid grid-cols-1 gap-4 p-5 transition hover:bg-[#202023] md:grid-cols-4 md:items-center"
            >

              {/* Shipment ID */}
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
                  {shipment.origin}
                </p>
              </div>


              {/* Destination */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#71717A] md:hidden">
                  Destination
                </p>

                <p className="mt-1 text-sm text-[#D4D4D8]">
                  {shipment.destination}
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

            </div>
          ))}
           </div>

          </div>
         </div>
             
      <div className="mt-8">

  {/* Search */}
  <div className="flex w-full flex-col gap-3 sm:flex-row">
    <input
      type="text"
      placeholder="Enter Shipment ID"
      value={shipmentId}
      onChange={(e) => setShipmentId(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          fetchShipment();
        }
      }}
      className="w-full rounded-xl border border-[#3F3F46] bg-[#27272A] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 sm:max-w-md"
    />

    <button
      onClick={()=>{
          setDisplay(!dipslay);

          if(display){
             fetchShipment();
          }
      }}
      className="rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB] active:scale-[0.98]"
    >
      Search
    </button>
  </div>


  {/* Shipment Details */}
  {shipment && (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#27272A]">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#3F3F46] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
            Shipment
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#FAFAFA]">
            {shipment.shipmentId}
          </h2>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
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


      {/* Main Details */}
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

        {/* Origin */}
        <div>
          <p className="text-sm text-[#71717A]">
            Origin
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.origin}
          </p>
        </div>


        {/* Destination */}
        <div>
          <p className="text-sm text-[#71717A]">
            Destination
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.destination}
          </p>
        </div>


        {/* Current Location */}
        <div>
          <p className="text-sm text-[#71717A]">
            Current Location
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.currentLocation || "Not available"}
          </p>
        </div>


        {/* Vessel */}
        <div>
          <p className="text-sm text-[#71717A]">
            Vessel
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.vessel || "Not available"}
          </p>
        </div>


        {/* Port */}
        <div>
          <p className="text-sm text-[#71717A]">
            Port
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.port || "Not available"}
          </p>
        </div>


        {/* Last Event */}
        <div>
          <p className="text-sm text-[#71717A]">
            Last Event
          </p>

          <p className="mt-1 text-base font-medium text-[#FAFAFA]">
            {shipment.lastEventType || "Not available"}
          </p>
        </div>

      </div>


      {/* Footer Information */}
      <div className="grid grid-cols-1 gap-4 border-t border-[#3F3F46] bg-[#202023] p-6 sm:grid-cols-3">

        <div>
          <p className="text-xs text-[#71717A]">
            Events
          </p>

          <p className="mt-1 text-sm font-medium text-[#D4D4D8]">
            {shipment.eventCount}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#71717A]">
            Version
          </p>

          <p className="mt-1 text-sm font-medium text-[#D4D4D8]">
            v{shipment.lastVersion}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#71717A]">
            Last Updated
          </p>

          <p className="mt-1 text-sm font-medium text-[#D4D4D8]">
            {shipment.lastEventAt
              ? new Date(shipment.lastEventAt).toLocaleString()
              : "Not available"}
          </p>
        </div>

      </div>

         </div>
       )}

        </div>

         </div>
         
       </div>
       )
}

function Summary({text , value}){
    
  return(
    <div className="rounded-xl border border-[#3F3F46] bg-[#27272A] p-6 transition hover:-translate-y-1 hover:border-[#3B82F6]">
        <p className="text-sm font-medium text-[#A1A1AA]">
            {text}
        </p>
        <p className="mt-2 text-3xl font-bold text-[#FAFAFA]">
            {value}
        </p>
    </div>
  )
}
export default Dashboard;