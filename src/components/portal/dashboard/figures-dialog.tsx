"use client";

import dynamic from "next/dynamic";
import { Info } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import type { FiguresDialogContentProps } from "./figures-dialog-content";

const load = () => import("./figures-dialog-content").then((m) => m.FiguresDialogContent);
const FiguresDialogContent = dynamic(load, { ssr: false });

/**
 * "How to read these figures": definitions and source caveats, on demand.
 *
 * The dialog stack (focus trap, scroll lock, dismiss layer) is most of this page's
 * script weight and few readers open it, so it loads on first intent: hover or focus
 * prefetches it, a click opens it. There is no Radix trigger to return focus to, so
 * closing hands focus back to this button explicitly.
 */
export function FiguresDialog({
  triggerLabel,
  ...content
}: Omit<FiguresDialogContentProps, "returnFocus"> & { triggerLabel: string }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={trigger}
        variant="ghost"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={load}
        onFocus={load}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        className="type-caption -ml-2 px-2 font-bold text-muted-foreground"
      >
        {triggerLabel}
        <Info aria-hidden data-icon="inline-end" />
      </Button>
      {requested ? (
        <FiguresDialogContent
          open={open}
          onOpenChange={setOpen}
          returnFocus={() => trigger.current?.focus()}
          {...content}
        />
      ) : null}
    </>
  );
}
