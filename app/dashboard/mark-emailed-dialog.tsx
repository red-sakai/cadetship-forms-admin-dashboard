"use client";

import { useEffect } from "react";

type MarkEmailedDialogProps = {
  open: boolean;
  belowCount: number;
  busy: boolean;
  onMarkThisAndBelow: () => void;
  onMarkOnlyThis: () => void;
  onCancel: () => void;
};

export default function MarkEmailedDialog({
  open,
  belowCount,
  busy,
  onMarkThisAndBelow,
  onMarkOnlyThis,
  onCancel,
}: MarkEmailedDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Keep an open View All dialog from closing underneath this prompt.
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-overlay"
      role="presentation"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mark-emailed-title"
        aria-describedby="mark-emailed-description"
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <h3 id="mark-emailed-title">Mark as emailed</h3>
        <p id="mark-emailed-description">
          {belowCount === 1
            ? "There is 1 record below this one that has not been marked as emailed yet."
            : `There are ${belowCount} records below this one that have not been marked as emailed yet.`}{" "}
          Mark them as emailed too?
        </p>
        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-button primary"
            disabled={busy}
            onClick={onMarkThisAndBelow}
          >
            This + {belowCount} below
          </button>
          <button
            type="button"
            className="confirm-button"
            disabled={busy}
            onClick={onMarkOnlyThis}
          >
            Only this row
          </button>
          <button
            type="button"
            className="confirm-button ghost"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
