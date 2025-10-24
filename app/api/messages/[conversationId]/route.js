
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET messages
export async function GET(req, { params }) {
  try {
    const conversationId = params.conversationId;
    if (!conversationId) {
      return new Response(JSON.stringify({ error: "Missing conversationId" }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  const { conversationId } = params;

  // Get session
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Delete all messages for this conversation
  await prisma.message.deleteMany({
    where: { conversationId: Number(conversationId) },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}


// POST message
export async function POST(req, { params }) {
  try {
    const conversationId = params.conversationId;
    if (!conversationId) {
      return new Response(JSON.stringify({ error: "Missing conversationId" }), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return new Response(JSON.stringify({ error: "Message content required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        conversationId: Number(conversationId),
      },
      include: { sender: true },
    });

    return new Response(JSON.stringify(message), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

