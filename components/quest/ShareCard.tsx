"use client";

import { useState } from "react";
import { Button } from "@/components/bondscanner/core/Button";
import { APP_URL, APP_NAME } from "@/lib/config";

/**
 * Social sharing — drives the viral-coefficient metric (PRD §7). WhatsApp is
 * first because it's how India shares. Each button opens a share intent the
 * user completes themselves; nothing posts automatically.
 */
export function ShareCard({
  topPercentLabel,
  tierName,
}: {
  topPercentLabel: string;
  tierName: string;
}) {
  const [copied, setCopied] = useState(false);

  const text = `I'm in the Top ${topPercentLabel} of India's wealth hierarchy (${tierName}). Where do you rank?`;
  const shareText = `${text} ${APP_URL}`;

  const onWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const onNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: APP_NAME, text, url: APP_URL });
      } catch {
        /* user dismissed — ignore */
      }
    } else {
      onCopy();
    }
  };

  return (
    <div
      className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-5 flex flex-col gap-3"
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      <p
        className="text-text-title"
        style={{ fontSize: "var(--body-md-size)", fontWeight: "var(--weight-semibold)" }}
      >
        Share your rank
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="primary"
          size="md"
          onClick={onWhatsApp}
          leadingIcon={<i className="ri-whatsapp-line text-lg" aria-hidden />}
          className="flex-1"
        >
          WhatsApp
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onNativeShare}
          leadingIcon={<i className="ri-share-line text-lg" aria-hidden />}
          className="flex-1"
        >
          Share
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onCopy}
          leadingIcon={
            <i className={copied ? "ri-check-line text-lg" : "ri-link text-lg"} aria-hidden />
          }
          className="flex-1"
        >
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
