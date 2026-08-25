import { useState } from "react";
import { Link } from "react-router-dom";

function Register(){

    const [name, setname] = useState("");
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [showpassword, setshowpassword] = useState(false);

    function submitDetails(e){
        e.preventDefault();
        console.log(name);
        console.log(username);
        console.log(email);
        console.log(password);

    }

    return(
        <div className="min-h-screen bg-[#18181B] text-[#D4D4D8] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <div className="bg-[#27272A] border border-[#3F3F46] rounded-2xl p-8 shadow-2xl">

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <Link
                            to="/"
                            className="text-2xl font-bold text-[#FAFAFA]"
                        >
                            Audit<span className="text-[#3B82F6]">Trail</span>
                        </Link>

                        <h1 className="mt-6 text-2xl font-bold text-[#FAFAFA]">
                            Create an account
                        </h1>

                        <p className="mt-2 text-sm text-[#A1A1AA]">
                            Create your Audit Trail account
                        </p>

                    </div>


                    <form
                        onSubmit={submitDetails}
                        className="space-y-5"
                    >

                        {/* Name */}
                        <div>

                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                id="name"
                                placeholder="Name"
                                onChange={(e) =>
                                    setname(e.target.value)
                                }
                                className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition"
                            />

                        </div>


                        {/* Username */}
                        <div>

                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                id="username"
                                placeholder="Username"
                                onChange={(e) =>
                                    setusername(e.target.value)
                                }
                                className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                id="email"
                                placeholder="Email"
                                onChange={(e) =>
                                    setemail(e.target.value)
                                }
                                className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition"
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Password
                            </label>

                            <input
                                type={
                                    showpassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                placeholder="Password"
                                id="password"
                                onChange={(e) =>
                                    setpassword(e.target.value)
                                }
                                className="w-full rounded-lg border border-[#3F3F46] bg-[#202023] px-4 py-3 text-[#FAFAFA] placeholder:text-[#71717A] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition"
                            />

                        </div>


                        {/* Show Password */}
                        <div className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                id="showpassword"
                                onChange={(e) =>
                                    setshowpassword(!showpassword)
                                }
                                className="h-4 w-4 rounded border-[#3F3F46] bg-[#202023] accent-[#3B82F6]"
                            />

                            <label
                                htmlFor="showpassword"
                                className="text-sm text-[#A1A1AA] cursor-pointer"
                            >
                                Show Password
                            </label>

                        </div>


                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3 font-semibold text-[#FAFAFA] transition duration-200 hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
                        >
                            Register
                        </button>

                    </form>


                    {/* Login Link */}
                    <div className="mt-6 text-center">

                        <p className="text-sm text-[#A1A1AA]">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;