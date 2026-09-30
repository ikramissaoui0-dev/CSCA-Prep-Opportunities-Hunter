"use client";

import { useEffect, useRef, useState } from "react";

const WHATSAPP_CONTACTS = [
  { label: "+212 6 21 52 18 61", number: "212621521861" },
  { label: "+212 6 88 05 17 03", number: "212688051703" },
];

const PREFILLED_MESSAGE = "Hi! I have a question about CSCA Prep.";

function whatsappUrl(number: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.8a9.75 9.75 0 0 1-4.97-1.36l-.357-.213-4.665 1.04 1.02-4.55-.234-.372A9.74 9.74 0 0 1 6.2 15c0-5.413 4.396-9.8 9.804-9.8 5.407 0 9.796 4.387 9.796 9.8 0 5.413-4.389 9.8-9.796 9.8Zm5.37-7.336c-.294-.148-1.74-.858-2.01-.956-.27-.098-.467-.148-.663.148-.196.295-.76.956-.932 1.153-.172.196-.343.221-.637.074-.294-.148-1.243-.458-2.368-1.462-.875-.78-1.466-1.744-1.638-2.04-.172-.295-.018-.454.13-.601.133-.133.294-.344.441-.516.148-.172.196-.295.294-.492.098-.196.049-.369-.025-.516-.074-.148-.663-1.598-.909-2.188-.24-.576-.484-.498-.663-.507l-.564-.01c-.196 0-.516.074-.786.369-.27.295-1.03 1.006-1.03 2.454s1.055 2.847 1.202 3.043c.148.196 2.077 3.172 5.034 4.448.703.303 1.252.484 1.68.62.706.225 1.348.193 1.856.117.566-.085 1.74-.712 1.985-1.4.245-.688.245-1.278.172-1.4-.074-.123-.27-.196-.564-.344Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    // z-40, one below dialog/alert-dialog's z-50 (including their
    // backdrop) — otherwise this floats visibly above an open modal's
    // scrim and stays clickable, e.g. during the exam submit
    // confirmation, which is exactly the moment a stray click away
    // from the page is least wanted.
    <div ref={containerRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-64 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <p className="px-2 pb-1.5 pt-1 text-xs font-medium text-muted-foreground">Message us on WhatsApp</p>
          {WHATSAPP_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={whatsappUrl(contact.number)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="size-4 shrink-0 text-[#25D366]" />
              {contact.label}
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Message us on WhatsApp"
        aria-expanded={open}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20BD5A] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#25D366]/50"
      >
        <WhatsAppIcon className="size-7" />
      </button>
    </div>
  );
}
