import {Link} from "react-router-dom";
import { useEffect ,useState } from "react";
import {queryAPI, authAPI} from "../services/api.js"

function Dashboard(){
    
      const [name, setname] = useState("");

    useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await authAPI.getMe();

        console.log(res.name);

        setname(res.name);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsername();
  }, []);
    return(
        <>
           <div className="min-h-[30vh] bg-[#18181B] px-6 py-10">
                <div className="mx-auto max-w-6xl rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 md:p-10">
                    <p className="text-2xl font-semibold tracking-tight text-[#FAFAFA] md:text-3xl">
                         Good morning, {name} 👋 
                        
                    </p>

                    <p className="mt-3 text-base leading-7 text-[#A1A1AA] md:text-lg">
                         Here's what's happening with your shipments.
                    </p>
                </div>
           </div>
        </>
    )
}

export default Dashboard;