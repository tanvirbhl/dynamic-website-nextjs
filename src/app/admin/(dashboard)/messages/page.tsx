import dbConnect from '@/lib/db';
import { Message } from '@/models/Message';
import { MessageList } from './MessageList';

export default async function AdminMessagesPage() {
  await dbConnect();
  
  // Fetch messages, newest first
  const rawMessages = await Message.find().sort({ createdAt: -1 }).lean();

  // Convert MongoDB IDs and Dates to safe strings for the Client Component
  const messages = rawMessages.map((msg: any) => ({
    ...msg,
    _id: msg._id.toString(),
    createdAt: msg.createdAt.toISOString()
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inbox</h1>
        <p className="text-slate-500 text-sm mt-1">Review inquiries and messages from your public website.</p>
      </div>

      <MessageList initialMessages={messages} />
    </div>
  );
}