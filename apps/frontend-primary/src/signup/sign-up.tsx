import { store } from "@workspace/utils/store/zustand";
import { useShallow } from "zustand/shallow"
import { useState } from "react";
import { useNavigate } from "react-router";

export function SignUp() {

    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const { role, setRole, setSignIn } = store(useShallow((s) => ({
        setSignIn: s.setSignIn,
        role: s.role,
        setRole: s.setRole
    })))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (confirmPass !== password) return null;

        const res = await fetch("http://localhost:3000/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: fullName,
                username,
                password: confirmPass,
                role
            })
        })

        const data = await res.json();
        
        localStorage.setItem("token", data.data);
        navigate("/student-dashboard");
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-blue-300 flex items-center justify-center px-4 py-4">

            <div className="w-full max-w-md rounded-xl shadow-lg p-8 space-y-5 bg-white">

                <div className="py-1">
                    <h1 className="text-3xl font-bold">
                        Join Us
                    </h1>
                    <p className="text-sm text-gray-500 py-2">
                        Create your account to get started
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-sm block">
                            Full Name
                        </label>

                        <input
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm block">
                            I am a
                        </label>

                        <div className="grid grid-cols-2 gap-2 text-center text-md font-medium">

                            <button
                                type="button"
                                onClick={() => setRole("STUDENT")}
                                className={`${role === "STUDENT" ? 'border-2 border-blue-600' : 'border border-gray-200 '} py-3 rounded-xl bg-[#F6F8FF] cursor-pointer`}
                            >
                                Student
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("TEACHER")}
                                className={`${role === "TEACHER" ? 'border-2 border-blue-600' : 'border border-gray-200 '} py-3 rounded-xl bg-[#F6F8FF] cursor-pointer`}
                            >
                                Teacher
                            </button>

                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm block">
                            Email Address
                        </label>

                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="space-y-2">
                        <label className="text-sm block">
                            Password
                        </label>

                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="space-y-2">
                        <label className="text-sm block">
                            Confirm Password
                        </label>

                        <input
                            onChange={(e) => setConfirmPass(e.target.value)}
                            type="password"
                            className="w-full border px-3 py-2 border-gray-200 rounded-md bg-[#F6F8FF] text-gray-500 text-sm focus:outline focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full border border-[#1D6AE4] text-white bg-[#1D6AE4] px-3 py-2 rounded-xl hover:bg-blue-500 cursor-pointer">
                        Create Account
                    </button>

                    <div className="flex items-center justify-center gap-1">
                        <label className="text-sm block text-gray-500">
                            Already have an acccount?
                        </label>
                        <button
                            onClick={() => setSignIn(true)}
                            type="button"
                            className="text-sm text-blue-600 font-medium cursor-pointer">
                            Sign In
                        </button>
                    </div>
                </form>

            </div>

        </div>
    );
}