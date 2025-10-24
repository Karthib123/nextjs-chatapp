
"use client";

import { signIn,useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
    const { data: session, status } = useSession();


  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/chat/1"); // redirect if already signed in
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/chat/1"; // redirect after login
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDE - Background Image */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage:
            "url('https://cdn5.vectorstock.com/i/1000x1000/58/04/chat-messaging-app-logo-design-vector-21795804.jpg')",
        }}
      ></div>

      {/* RIGHT SIDE - Sign In Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Sign In</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-white p-8 rounded-2xl shadow-lg w-3/4 max-w-md"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-3 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 text-blue-900"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-3 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 text-green-700"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
