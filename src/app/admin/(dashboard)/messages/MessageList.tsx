'use client';

import { useState } from 'react';
import { Mail, MailOpen, Trash2, Calendar, User, CheckCircle2 } from 'lucide-react';
import { markMessageRead, deleteMessage } from '@/actions/admin/messages';

export function MessageList({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);

  const handleMarkAsRead = async (id: string) => {
    // Optimistic UI update
    setMessages(messages.map(m => m._id === id ? { ...m, status: 'READ' } : m));
    await markMessageRead(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    // Optimistic UI update
    setMessages(messages.filter(m => m._id !== id));
    await deleteMessage(id);
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">You're all caught up!</h3>
        <p className="text-slate-500 mt-1">There are no new messages in your inbox.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`p-6 transition-colors duration-200 ${msg.status === 'UNREAD' ? 'bg-blue-50/30' : 'bg-white hover:bg-slate-50/50'}`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              
              <div className="flex-1 space-y-4">
                {/* Header: Name, Subject, Date */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {msg.status === 'UNREAD' ? (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 shrink-0">
                        <Mail size={16} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 shrink-0">
                        <MailOpen size={16} />
                      </span>
                    )}
                    <h3 className={`text-lg ${msg.status === 'UNREAD' ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {msg.subject || "No Subject"}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 ml-11">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <User size={14} className="text-slate-400" /> {msg.name}
                    </span>
                    <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                      {msg.email}
                    </a>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" /> 
                      {new Date(msg.createdAt).toLocaleString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* The Message Content */}
                <div className="ml-11 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-[#f8fafc] border border-slate-100 p-4 rounded-lg">
                  {msg.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center md:flex-col gap-2 shrink-0 md:ml-6 mt-4 md:mt-0">
                {msg.status === 'UNREAD' && (
                  <button 
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase rounded-md hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase rounded-md hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}