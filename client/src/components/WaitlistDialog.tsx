import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { submitLead } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: "trial" | "diagnostic";
}

const COPY = {
  trial: {
    title: "AI 회화 무료 체험 알림 받기",
    description: "무료 체험이 열리면 남겨주신 이메일로 가장 먼저 안내드립니다.",
  },
  diagnostic: {
    title: "중국어 실력 진단 알림 받기",
    description: "실력 진단이 준비되는 대로 남겨주신 이메일로 안내드립니다.",
  },
} as const;

export function WaitlistDialog({
  open,
  onOpenChange,
  source,
}: WaitlistDialogProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const copy = COPY[source];

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
      }, 200);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitLead({ type: "waitlist", source, email });
      setSubmitted(true);
    } catch {
      toast("접수에 실패했습니다.", {
        description: "잠시 후 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>신청이 접수되었습니다</DialogTitle>
              <DialogDescription>
                오픈 소식을 가장 먼저 알려드릴게요. 감사합니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => handleClose(false)}>
                닫기
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <input
                type="email"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="이메일 주소"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "접수 중..." : "알림 받기"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
