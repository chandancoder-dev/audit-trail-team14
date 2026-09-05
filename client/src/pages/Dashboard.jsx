import {Link} from "react-router-dom";
import { useEffect ,useState } from "react";
import {queryAPI, authAPI} from "../services/api.js"

function Dashboard(){
    
      const [name, setname] = useState("");
      const [inTransit , setInTransit] = useState(0);
      const [total , setTotal] = useState(0);
      const [arrived , setArrived] = useState(0);
      const [alert , setAlert] = useState(0);
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
  }, []);
    return(
        <div className="min-h-screen bg-[#18181B] px-6 py-10">
            {/* greeting*/}
           <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 md:p-10">
                    <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
                         Hello, {name} 👋 
                        
                    </p>

                    <p className="mt-3 text-base leading-7 text-[#A1A1AA] md:text-lg">
                         Here's what's happening with your shipments.
                    </p>

                    
                </div>
              </div>
              
              {/* Summary*/}
              <div className="mx-auto max-w-6xl py-6">

                   <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <Summary
                       text = {"Total Shipments"}
                       value = {total}
                      />

                      <Summary
                       text = {"In Transit"}
                       value = {inTransit}
                      />

                      <Summary
                       text = {"Arrived"}
                       value = {arrived}
                      />

                      <Summary
                       text = {"Alert"}
                       value = {alert}
                      />
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