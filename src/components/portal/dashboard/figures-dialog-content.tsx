"use client";

import { Download, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type FiguresDialogContentProps = {
  title: string;
  description: string;
  closeLabel: string;
  doneLabel: string;
  downloadLabel: string;
  downloadHref: string;
  returnFocus: () => void;
  children: React.ReactNode;
};

/**
 * The dialog itself, loaded on demand by `FiguresDialog`. The primitive's own close
 * button carries an English-only label, so this renders a localized one instead.
 */
export function FiguresDialogContent({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  doneLabel,
  downloadLabel,
  downloadHref,
  returnFocus,
  children,
}: FiguresDialogContentProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocus();
        }}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl"
      >
        <DialogHeader className="flex-row items-start justify-between gap-4">
          <DialogTitle className="type-panel text-foreground">{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label={closeLabel} className="-mt-1 -mr-2">
              <XIcon aria-hidden />
            </Button>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="type-support text-muted-foreground">{description}</DialogDescription>
        <div className="flex flex-col gap-4">{children}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="type-nav">
              {doneLabel}
            </Button>
          </DialogClose>
          <Button asChild className="type-nav">
            <a href={downloadHref} download>
              <Download aria-hidden data-icon="inline-start" />
              {downloadLabel}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
