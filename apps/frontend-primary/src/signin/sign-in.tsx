import { store } from "@workspace/utils/store/zustand"
import { useState } from "react";
import { useNavigate } from "react-router";

export function SignIn() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch("https://attendx-t48b.onrender.com/api/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        const data = await res.json();

        localStorage.setItem("token", data.data)
        data.user.role === "TEACHER" ? navigate("/teacher-dashboard") : navigate("/student-dashboard")
    }

    const setSignIn = store((s) => s.setSignIn)

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-blue-300 flex items-center justify-center px-4 py-4">

            <div className="w-full max-w-md p-8 rounded-xl space-y-5 bg-white animate-slide-up">

                <div className="py-1">
                    <h1 className="text-3xl font-semibold">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 py-2">
                        Sign in to your account
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm block">
                            Email Address
                        </label>

                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="you@example.com"
                            type="text"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-sm block">
                            Password
                        </label>

                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="****"
                            type="password"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        
                        type="submit"
                        className="w-full border border-[#1D6AE4] text-white bg-[#1D6AE4] px-3 py-2 rounded-xl hover:bg-blue-500 cursor-pointer">
                        Sign In
                    </button>

                    <div className="flex items-center justify-center gap-1">
                        <label className="text-sm block text-gray-500">
                            Don't have an account?
                        </label>
                        <button
                            onClick={() => setSignIn(false)}
                            type="button"
                            className="text-sm text-blue-600 font-medium cursor-pointer">
                            Sign Up
                        </button>
                    </div>

                </form>

            </div>

        </div>
    )
}