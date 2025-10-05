import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "../css/ChatWidget.css";
import responses from "../../data/chatResponses.json";

type IntentName = keyof typeof responses["intents"];

interface SlotValidation {
  regex?: string;
  minLength?: number;
  maxLength?: number;
  allowedValues?: string[];
  errorMessage?: string;
}

interface SlotPromptDef {
  prompt: string;
  validation?: SlotValidation;
}

interface IntentDef {
  responses?: string[];
  requiredSlots?: string[];
  slotPrompts?: Record<string, SlotPromptDef>;
  actions?: string[];
  suggestedReplies?: { label: string; intent: string }[];
  followUps?: { label: string; intent: string }[];
}

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

interface PendingSlots {
  intent?: IntentName;
  required: string[];
  collected: Record<string, string>;
}

let messageCounter = 0;
const nextId = () => ++messageCounter;

const pickOne = <T,>(arr: T[] | undefined) => {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

const sanitizePhoneForWa = (phone = "") => phone.replace(/[^0-9]/g, "");

const validateSlot = (value: string, v?: SlotValidation) => {
  if (!v) return { ok: true };
  if (v.minLength && value.length < v.minLength) return { ok: false, message: v.errorMessage || `Minimum ${v.minLength} characters required.` };
  if (v.maxLength && value.length > v.maxLength) return { ok: false, message: v.errorMessage || `Maximum ${v.maxLength} characters allowed.` };
  if (v.allowedValues && v.allowedValues.length > 0) {
    if (!v.allowedValues.map((s) => s.toLowerCase()).includes(value.toLowerCase()))
      return { ok: false, message: v.errorMessage || `Invalid selection.` };
  }
  if (v.regex) {
    const re = new RegExp(v.regex);
    if (!re.test(value)) return { ok: false, message: v.errorMessage || `Invalid format.` };
  }
  return { ok: true };
};

const ChatbotScreen: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<PendingSlots>({ required: [], collected: {} });
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ label: string; intent: string }[]>([]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messages.length === 0) startConversation();
    if (open) {
      // focus input shortly after opening
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // return focus to the trigger when closing
      triggerRef.current?.focus?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const pushMessage = (from: "bot" | "user", text: string) => {
    const msg: Message = { id: nextId(), from, text };
    setMessages((m) => [...m, msg]);
    return msg;
  };

  const startConversation = () => {
    const greet = responses.intents.greeting as IntentDef;
    const text = (pickOne(greet.responses) as string) || "Hello!";
    pushMessage("bot", text);
    setSuggestions(greet.suggestedReplies || []);
  };

  const openHandoffOptions = (agentDept = "support") => {
    pushMessage("bot", "You can continue on: WhatsApp, Email, Call, or SMS.");
    setSuggestions([
      { label: "WhatsApp", intent: `__handoff_wa::${agentDept}` },
      { label: "Email", intent: `__handoff_email::${agentDept}` },
      { label: "Call", intent: `__handoff_call::${agentDept}` },
      { label: "SMS", intent: `__handoff_sms::${agentDept}` },
    ]);
  };

  const handleSuggestion = (s: { label: string; intent: string }) => {
    pushMessage("user", s.label);

    if (s.intent.startsWith("__handoff_")) {
      const [, channelKey, dept] = s.intent.split(/::/);
      performHandoff(channelKey.replace("__handoff_", ""), dept || "support");
      return;
    }

    const intentKey = s.intent as IntentName;
    startIntentFlow(intentKey);
  };

  const startIntentFlow = (intentKey: IntentName) => {
    const intent = (responses.intents as any)[intentKey] as IntentDef | undefined;
    if (!intent) {
      const fb = (responses.intents as any).fallback as IntentDef;
      pushMessage("bot", (pickOne(fb.responses) as string) || "Sorry, I didn't catch that.");
      setSuggestions(fb.suggestedReplies || []);
      return;
    }

    const required = intent.requiredSlots || [];
    if (required.length > 0) {
      setPending({ intent: intentKey, required: [...required], collected: {} });
      const next = required[0];
      const prompt = intent.slotPrompts?.[next]?.prompt || `Please provide ${next}`;
      pushMessage("bot", prompt);
      setSuggestions([]);
      return;
    }

    pushMessage("bot", (pickOne(intent.responses) as string) || "Working on it...");
    runActions(intent.actions || [], intentKey);
    setSuggestions(intent.suggestedReplies || intent.followUps || []);
  };

  const runActions = async (actions: string[], intentKey: IntentName) => {
    for (const act of actions) {
      switch (act) {
        case "fetchOrderStatus": {
          const orderId = pending.collected.order_id || "#00000";
          pushMessage("bot", "Checking order status...");
          await delay(700);
          const result = { order_id: orderId, status: "Shipped", eta: "2025-09-28" };
          const tpl = (responses.templates as any).orderStatusTemplate
            .replace("{{order_id}}", result.order_id)
            .replace("{{status}}", result.status)
            .replace("{{eta}}", result.eta);
          pushMessage("bot", tpl);
          break;
        }

        case "searchProductDatabase": {
          const q = pending.collected.product_query || input || "query";
          pushMessage("bot", `Searching products for '${q}'...`);
          await delay(600);
          pushMessage("bot", `Found several items for '${q}'. Would you like recommendations?`);
          setSuggestions([{ label: "Yes — show recommendations", intent: "recommend_products" }]);
          break;
        }

        case "bookAppointment": {
          pushMessage("bot", "Scheduling appointment...");
          await delay(900);
          pushMessage("bot", "Appointment confirmed. You'll get a reminder 24 hours before.");
          break;
        }

        case "setMedicationReminder": {
          pushMessage("bot", "Setting medication reminder...");
          await delay(700);
          pushMessage("bot", "Medication reminder set.");
          break;
        }

        case "fetchAccountBalance": {
          pushMessage("bot", "Looking up your account balance...");
          await delay(700);
          const tpl = (responses.templates as any).balanceTemplate
            .replace("{{account}}", pending.collected.account_identifier || "****1234")
            .replace("{{balance}}", "$1,234.56");
          pushMessage("bot", tpl);
          break;
        }

        case "investigateTransaction": {
          pushMessage("bot", "Investigating the transaction...");
          await delay(1100);
          pushMessage("bot", "We've flagged the transaction and escalated to billing. An agent will follow up.");
          break;
        }

        case "sendWhatsAppToAgent": {
          const dept = (pending.collected.department || "support").toLowerCase();
          const agent = (responses.agents as any)[dept] || (responses.agents as any).support;
          const brief = pending.collected.brief || "Hello, I need help";
          const phone = sanitizePhoneForWa(agent.whatsappNumber || agent.phone || "");
          const text = encodeURIComponent(brief);
          pushMessage("bot", "Opening WhatsApp to contact an agent...");
          window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
          break;
        }

        default: {
          pushMessage("bot", `Performing: ${act}`);
          break;
        }
      }
    }

    setPending({ required: [], collected: {} });
  };

  const performHandoff = (channelKeyRaw: string, dept = "support") => {
    const channelKey = channelKeyRaw.toLowerCase();
    const agent = (responses.agents as any)[dept] || (responses.agents as any).support;

    switch (channelKey) {
      case "wa":
      case "whatsapp": {
        const phone = sanitizePhoneForWa(agent.whatsappNumber || agent.phone || "");
        const text = encodeURIComponent(`Hi ${agent.name}, I need assistance.`);
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
        pushMessage("bot", `Opening WhatsApp to ${agent.name}...`);
        break;
      }

      case "email": {
        const mailto = `mailto:${agent.email}?subject=${encodeURIComponent("Support request")}&body=${encodeURIComponent("Please assist this customer.")}`;
        window.open(mailto, "_blank");
        pushMessage("bot", `Opening email composer to ${agent.email}...`);
        break;
      }

      case "call": {
        const tel = `tel:${agent.phone}`;
        window.open(tel);
        pushMessage("bot", `Opening phone dialer for ${agent.phone}...`);
        break;
      }

      case "sms": {
        const sms = `sms:${agent.phone}?body=${encodeURIComponent("Please assist this customer.")}`;
        window.open(sms, "_blank");
        pushMessage("bot", `Opening SMS composer for ${agent.phone}...`);
        break;
      }

      default:
        pushMessage("bot", "Channel not supported.");
    }

    setSuggestions([]);
  };

  const submitInput = () => {
    const text = input.trim();
    if (!text) return;

    pushMessage("user", text);

    if (pending.intent && pending.required.length > 0) {
      const currentSlot = pending.required[0];
      const intentDef = (responses.intents as any)[pending.intent] as IntentDef;
      const slotDef: SlotPromptDef | undefined = intentDef?.slotPrompts?.[currentSlot];
      const validation = slotDef?.validation;

      const vres = validateSlot(text, validation);
      if (!vres.ok) {
        pushMessage("bot", vres.message || "Invalid input. Please try again.");
        setInput("");
        return;
      }

      const collected = { ...pending.collected, [currentSlot]: text };
      const remaining = pending.required.slice(1);
      setPending({ intent: pending.intent, required: remaining, collected });

      setInput("");

      if (remaining.length > 0) {
        const next = remaining[0];
        const nextPrompt = intentDef?.slotPrompts?.[next]?.prompt || `Please provide ${next}`;
        pushMessage("bot", nextPrompt);
        return;
      }

      pushMessage("bot", (pickOne(intentDef.responses) as string) || "Processing...");
      runActions(intentDef.actions || [], pending.intent);
      setSuggestions(intentDef.suggestedReplies || intentDef.followUps || []);
      setPending({ required: [], collected: {} });
      setInput("");
      return;
    }

    const lowered = text.toLowerCase();
    const matchedIntent = Object.keys((responses.intents as any)).find((k) => {
      const intent: IntentDef = (responses.intents as any)[k];
      const labels = (intent.suggestedReplies || intent.followUps || []).map((s) => s.label?.toLowerCase()).filter(Boolean);
      return labels.includes(lowered);
    }) as IntentName | undefined;

    if (matchedIntent) {
      setInput("");
      startIntentFlow(matchedIntent);
      return;
    }

    const fb = (responses.intents as any).fallback as IntentDef;
    setInput("");
    pushMessage("bot", (pickOne(fb.responses) as string) || "Sorry, I didn't catch that.");
    setSuggestions(fb.suggestedReplies || []);
  };

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const renderSuggestions = () => {
    if (!suggestions || suggestions.length === 0) return null;
    return (
      <div className="suggestions" role="list" aria-label="Suggested replies" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {suggestions.map((s, i) => (
          <Button
            key={i}
            onClick={() => handleSuggestion(s)}
            size="sm"
            variant="outline"
            aria-label={`Suggested: ${s.label}`}>
            {s.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div ref={triggerRef} className="chat-floating-icon" onClick={() => setOpen((v) => !v)} aria-label="Open chat" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}>
        💬
      </div>

      {open && (
        <div
          className="chat-widget"
          role="dialog"
          aria-label="Support chat"
          aria-modal="true"
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        >
          <div className="chat-header">
            <span>Support Chat</span>
            <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close chat">✖</button>
          </div>

          <div className="chat-body">
            <div ref={chatContainerRef} className="chat-history" aria-live="polite" style={{ overflowY: 'auto', maxHeight: 360 }}>
              {messages.map((m) => (
                <div key={m.id} className={`chat-message ${m.from === 'user' ? 'user' : ''}`}>
                  {m.text}
                </div>
              ))}
            </div>

            {renderSuggestions()}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                ref={inputRef}
                type="text"
                aria-label="Type your message"
                placeholder="Type your message or choose a suggestion"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitInput(); }}
                style={{ flex: 1 }}
              />

              <Button onClick={submitInput} className="send-btn" aria-label="Send message">
                Send
              </Button>
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <Button variant="ghost" onClick={() => openHandoffOptions('support')} size="sm">Contact Agent</Button>
              <Button variant="ghost" onClick={() => { pushMessage('bot', 'Help is available. Try: Track my order, Product info, Contact agent.'); setSuggestions((responses.intents.greeting as IntentDef).suggestedReplies || []); }} size="sm">Help</Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotScreen;
