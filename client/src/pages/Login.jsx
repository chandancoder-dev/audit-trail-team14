import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function submitDetails(e) {
        e.preventDefault();
         
        try{
              const res = await axios.post("http://localhost:5001/api/auth/login", {
                  email : email,
                  password : password
              });

              const token = res.data.token;
              localStorage.setItem("token" , token);
              navigate("/dashboard");


        }
        catch(e){
            alert(e?.response?.data?.message || "Login failed");
        }
       
    }

    return (
        <div className="min-h-screen bg-[#18181B] text-[#D4D4D8] flex items-center justify-center px-4 py-12">

            {/* Background glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 
                            w-80 h-80 rounded-full 
                            bg-[#3B82F6]/10 blur-[120px]" />

            {/* Login Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-[#27272A] border border-[#3F3F46] rounded-2xl p-8 shadow-2xl shadow-black/30">

                    {/* Logo */}
                    <div className="text-center mb-8">

                        <Link
                            to="/"
                            className="inline-block text-2xl font-bold text-[#FAFAFA]"
                        >
                            Audit<span className="text-[#3B82F6]">
                                Trail
                            </span>
                        </Link>

                        <h1 className="mt-6 text-2xl font-bold text-[#FAFAFA]">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-[#A1A1AA]">
                            Sign in to access your shipment dashboard
                        </p>

                    </div>


                    {/* Form */}
                    <form
                        onSubmit={submitDetails}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>

                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-[#3F3F46]
                                    bg-[#202023]
                                    px-4 py-3
                                    text-[#FAFAFA]
                                    placeholder:text-[#71717A]
                                    outline-none
                                    transition
                                    focus:border-[#3B82F6]
                                    focus:ring-2
                                    focus:ring-[#3B82F6]/20
                                "
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-[#D4D4D8]"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-[#3F3F46]
                                        bg-[#202023]
                                        px-4 py-3
                                        pr-20
                                        text-[#FAFAFA]
                                        placeholder:text-[#71717A]
                                        outline-none
                                        transition
                                        focus:border-[#3B82F6]
                                        focus:ring-2
                                        focus:ring-[#3B82F6]/20
                                    "
                                />

                                {/* Show / Hide */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-sm
                                        text-[#71717A]
                                        hover:text-[#D4D4D8]
                                        transition
                                    "
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Remember me */}
                        <div className="flex items-center gap-2">

                            <input
                                id="remember"
                                type="checkbox"
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    border-[#3F3F46]
                                    bg-[#202023]
                                    accent-[#3B82F6]
                                "
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-[#A1A1AA]"
                            >
                                Remember me
                            </label>

                        </div>


                        {/* Login button */}
                        <button
                            type="submit"
                            className="
                                w-full
                                rounded-lg
                                bg-[#3B82F6]
                                px-4
                                py-3
                                font-semibold
                                text-[#FAFAFA]
                                transition
                                duration-200
                                hover:bg-[#2563EB]
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#3B82F6]/40
                                active:scale-[0.99]
                            "
                        >
                            Login
                        </button>

                    </form>


                    {/* Register */}
                    <div className="mt-8 text-center">

                        <p className="text-sm text-[#A1A1AA]">
                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition"
                            >
                                Create an account
                            </Link>
                        </p>

                    </div>

                </div>


                {/* Back to home */}
                <div className="mt-6 text-center">

                    <Link
                        to="/"
                        className="text-sm text-[#71717A] hover:text-[#D4D4D8] transition"
                    >
                        ← Back to home
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;