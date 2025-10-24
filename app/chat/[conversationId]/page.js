
"use client";

import { useState, useEffect, use } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"; // logout icon
import { redirect } from "next/navigation";


export default  function  ChatPage({ params }) {
  const { conversationId } = use(params);

  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  useEffect(() => {
    if (session && conversationId) {
      axios
        .get(`/api/messages/${conversationId}`)
        .then((res) => setMessages(res.data))
        .catch(console.error);
    }
  }, [conversationId, session]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await axios.post(`/api/messages/${conversationId}`, { content: input });
    setMessages((prev) => [...prev, res.data]);
    setInput("");

    // refetch full messages list
    const rest = await axios.get(`/api/messages/${conversationId}`);
    setMessages(rest.data);
  };

  const clearMessages = async () => {
    await axios.delete(`/api/messages/${conversationId}`);
    setMessages([]);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
   <div
  className="p-4 flex flex-col h-screen relative" // <-- add 'relative' here
  style={{
    backgroundImage: "url('https://wallpapercave.com/wp/wp9875549.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Logout Icon */}
  <button
    onClick={() => signOut({ callbackUrl: "/signin" })}
    className="absolute top-0 right-0 p-0  hover:bg-white-200"
    title="Logout"
  >
    <ArrowRightOnRectangleIcon className="h-6 w-6 text-white-700" />
  </button>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto flex flex-col p-2 space-y-2">
    {messages.map((m) => (
      <div
        key={m.id}
        className={`max-w-md p-2 rounded ${
          m.sender.email === session.user.email
            ? "bg-green-400 text-white self-end"
            : "bg-yellow-200 text-black self-start"
        }`}
      >
        <strong>{m.sender.name || m.sender.email}</strong>: {m.content}
        <div className="text-xs text-gray-700 mt-1 text-right">
          {new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
    ))}
  </div>

  {/* Input */}
  <div className="flex mt-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="border p-2 flex-1 rounded"
      placeholder="Type a message..."
    />
    <button className="ml-2 px-4 bg-blue-500 text-white rounded" onClick={sendMessage}>
      Send
    </button>
  </div>

  {/* Clear Messages */}
  <div className="flex mt-4">
    <button
      onClick={clearMessages}
      className="ml-337 px-4 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Clear Messages
    </button>
  </div>
</div>

  );
}
