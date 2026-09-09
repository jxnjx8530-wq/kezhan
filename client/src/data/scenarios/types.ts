/**
 * Shared shape for every scenario's scripted dialogue graph. A node's aiLine
 * is null only on a scenario's start node when the learner speaks first
 * (common in real life — you're usually the one who walks up and asks).
 * A node with an empty choices array is terminal: show its aiLine, then the
 * conversation is done. A choice with next === "end" is terminal the other
 * way — the conversation ends right after the learner's line, with no more
 * AI reply, matching scripts that end on the learner's turn.
 */
import type { LucideIcon } from "lucide-react";

export interface Line {
  zh: string;
  pinyin: string;
  ko: string;
  en: string;
}

export interface Choice {
  id: string;
  line: Line;
  next: string;
}

export interface DialogueNode {
  id: string;
  aiLine: Line | null;
  choices: Choice[];
}

export type Dialogue = Record<string, DialogueNode>;

export interface ScenarioData {
  slug: string;
  icon: LucideIcon;
  ko: { title: string };
  en: { title: string };
  dialogue: Dialogue;
  totalSteps: number;
  stepIndex: (nodeId: string) => number;
}

/**
 * `order` groups node ids by their position in the conversation, so branches
 * that reconverge (or diverge right up to the end) still report a sane
 * step number for the "N/total" progress indicator.
 */
export function makeStepIndex(order: string[][]): (nodeId: string) => number {
  const map = new Map<string, number>();
  order.forEach((ids, i) => ids.forEach(id => map.set(id, i)));
  return (nodeId: string) => map.get(nodeId) ?? order.length - 1;
}
