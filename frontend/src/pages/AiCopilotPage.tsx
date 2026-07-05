import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cards?: any[];
}

export const AiCopilotPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am Stavya Intelligence Copilot, the AI brain of Stavya Spine Hospital IT. Ask me about today's work, network bottlenecks, OPD printer issues, or generate executive reports.",
      timestamp: '09:00 AM'
    }
  ]);

  const quickPrompts = [
    "Show today's work.",
    "Why is OPD slow?",
    "Show printers needing maintenance.",
    "Generate monthly report."
  ];

  const handleSend = (queryText?: string) => {
    const textToSubmit = queryText || input;
    if (!textToSubmit.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');

    // AI Intelligence Engine Response logic
    setTimeout(() => {
      let aiResponse: ChatMessage;

      if (textToSubmit.toLowerCase().includes("today's work") || textToSubmit.toLowerCase().includes("today work")) {
        aiResponse = {
          sender: 'ai',
          text: "Here is today's scheduled IT maintenance work across Stavya Spine Hospital:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cards: [
            { title: "Daily Server Room Environmental Check", status: "PENDING", assigned: "Het Patel", urgency: "HIGH" },
            { title: "OPD Billing Printer Roller Replacement", status: "IN_PROGRESS", assigned: "Het Patel", urgency: "HIGH" },
            { title: "PACS DICOM Network Gateway Ping Audit", status: "PENDING", assigned: "Rahul Mehta", urgency: "MEDIUM" }
          ]
        };
      } else if (textToSubmit.toLowerCase().includes("opd slow") || textToSubmit.toLowerCase().includes("opd")) {
        aiResponse = {
          sender: 'ai',
          text: "Analyzing OPD telemetric dependencies... Found root cause:\n1. OPD Switch `OPD-SW-02` port 14 is experiencing 4.2% packet drops.\n2. Thermal Printer `STV-PRN-004` spool queue is holding 18 stalled billing jobs.\n\nRecommended Action: Power-cycle OPD-SW-02 switch and clear printer spool buffer on HIS Server.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (textToSubmit.toLowerCase().includes("printer") || textToSubmit.toLowerCase().includes("maintenance")) {
        aiResponse = {
          sender: 'ai',
          text: "Scanned all 14 hospital printers. 1 printer currently requires maintenance:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cards: [
            { title: "STV-PRN-004 (OPD Counter 03 Printer)", status: "ROLLER_JAM", risk: "Score 48 (High)", recommendation: "Replace roller kit #R-404" }
          ]
        };
      } else if (textToSubmit.toLowerCase().includes("report")) {
        aiResponse = {
          sender: 'ai',
          text: "Generated Executive IT Operations Monthly Briefing for Stavya Spine Hospital.\nSummary: Total SLA Compliance: 99.98% • Incidents Resolved: 42 • Mean Time to Repair: 14 mins • Infrastructure Health: 96.8%.\n\nDownload options generated: [Executive PDF Summary] [Full Asset Excel Sheet]",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        aiResponse = {
          sender: 'ai',
          text: `Analyzed query "${textToSubmit}". All 48 assets across 10 hospital departments are monitored. HIS Server is operating at optimal temperature (18°C). How else can I assist you?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-600/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Stavya Intelligence AI Copilot <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-500">
            Natural language hospital IT operator assistant powered by RAG and predictive telemetry logs.
          </p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 text-xs text-cyan-900 font-bold shadow-xs transition-all hover:border-cyan-300"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-[480px] flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white font-semibold rounded-br-none shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.cards && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-200">
                    {msg.cards.map((c, ci) => (
                      <div key={ci} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-[11px] space-y-0.5 shadow-xs">
                        <div className="font-bold text-cyan-800">{c.title}</div>
                        {c.assigned && <div>Assigned: {c.assigned}</div>}
                        {c.recommendation && <div className="text-amber-800 font-bold">Fix: {c.recommendation}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-mono font-semibold">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI: 'Why is OPD slow?', 'Show printers needing maintenance', 'Generate monthly report'..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <button
            onClick={() => handleSend()}
            className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all shadow-md shadow-cyan-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
