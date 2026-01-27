"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ResetPassword() {
  const { userId } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const reset = async () => {
    const res = await fetch("/api/admin/reset_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newPassword: password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>

      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={reset}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Reset Password
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
