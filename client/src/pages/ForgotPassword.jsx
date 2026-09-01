import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function ForgotPassword() {

    const [email, setemail] = useState("");
    const [newpassword, setnewpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function submitDetails(e) {
        e.preventDefault();

        if (newpassword !== confirmpassword) {
            alert("Passwords do not match");
            return;
        }
         
         await axios.post("http://localhost:8000/api/auth/reset-password",{
            email : email,
            password: newpassword
        }).then((res)=>{
           alert(res.data.message);
        }).catch((err)=>{
            alert(err.message);
        })
    }

    return (

        <div className="min-h-screen bg-[#18181B] text-[#D4D4D8] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <div className="bg-[#27272A] border border-[#3F3F46] rounded-2xl p-8 shadow-2xl shadow-black/30">

                    {/* Logo */}
                    <div className="text-center mb-8">

                        <Link
                            to="/"
                            className="text-2xl font-bold text-[#FAFAFA]"
                        >
                            Audit<span className="text-[#3B82F6]">
                                Trail
                            </span>
                        </Link>

                        <h1 className="mt-6 text-2xl font-bold text-[#FAFAFA]">
                            Reset Password
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
                            Enter your email and create a new password
                            for your account.
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
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setemail(e.target.value)
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


                        {/* New Password */}
                        <div>

                            <label
                                htmlFor="newpassword"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="newpassword"
                                    placeholder="Enter new password"
                                    value={newpassword}
                                    onChange={(e) =>
                                        setnewpassword(e.target.value)
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-[#3F3F46]
                                        bg-[#202023]
                                        px-4 py-3
                                        pr-16
                                        text-[#FAFAFA]
                                        placeholder:text-[#71717A]
                                        outline-none
                                        transition
                                        focus:border-[#3B82F6]
                                        focus:ring-2
                                        focus:ring-[#3B82F6]/20
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
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
                                    {showNewPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div>

                            <label
                                htmlFor="confirmpassword"
                                className="block mb-2 text-sm font-medium text-[#D4D4D8]"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmpassword"
                                    placeholder="Confirm new password"
                                    value={confirmpassword}
                                    onChange={(e) =>
                                        setconfirmpassword(e.target.value)
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-[#3F3F46]
                                        bg-[#202023]
                                        px-4 py-3
                                        pr-16
                                        text-[#FAFAFA]
                                        placeholder:text-[#71717A]
                                        outline-none
                                        transition
                                        focus:border-[#3B82F6]
                                        focus:ring-2
                                        focus:ring-[#3B82F6]/20
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
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
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Reset Password Button */}
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
                            "
                        >
                            Reset Password
                        </button>

                    </form>


                    {/* Login Link */}
                    <div className="mt-6 text-center">

                        <p className="text-sm text-[#A1A1AA]">

                            Remember your password?{" "}

                            <Link
                                to="/login"
                                className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition"
                            >
                                Back to Login
                            </Link>

                        </p>

                    </div>

                </div>


                {/* Back to Home */}
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

export default ForgotPassword;