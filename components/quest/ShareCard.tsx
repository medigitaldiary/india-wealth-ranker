"use client";

import { Button } from "@/components/bondscanner/core/Button";
import { APP_URL, APP_NAME } from "@/lib/config";

/**
 * Social sharing — drives the viral-coefficient metric. WhatsApp first, since
 * that's how India shares. Each button opens a share intent the user completes
 * themselves; nothing posts automatically.
 */
export function ShareCard({ rankLabel }: { rankLabel: string }) {
  const text = `My All India Wealth Rank is ${rankLabel}. Where do you rank?`;
  const shareText = `${text} ${APP_URL}`;

  const onWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const onNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: APP_NAME, text, url: APP_URL });
      } catch {
        /* user dismissed — ignore */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        /* clipboard blocked — ignore */
      }
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
      </div>
    </div>
  );
}
