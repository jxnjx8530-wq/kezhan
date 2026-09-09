import { foodScenarios } from "./food";
import { journeyScenarios } from "./journey";
import { marketScenarios } from "./market";
import type { ScenarioData } from "./types";
import { villageScenarios } from "./village";

export interface ScenarioTheme {
  key: string;
  ko: { name: string };
  en: { name: string };
  scenarios: ScenarioData[];
}

export const scenarioThemes: ScenarioTheme[] = [
  { key: "gourmet", ko: { name: "미식채" }, en: { name: "Gourmet Wing" }, scenarios: foodScenarios },
  { key: "journey", ko: { name: "여정채" }, en: { name: "Journey Wing" }, scenarios: journeyScenarios },
  { key: "market", ko: { name: "상점채" }, en: { name: "Market Wing" }, scenarios: marketScenarios },
  { key: "village", ko: { name: "마을채" }, en: { name: "Village Wing" }, scenarios: villageScenarios },
];

const scenarioBySlug: Record<string, ScenarioData> = Object.fromEntries(
  scenarioThemes.flatMap(theme => theme.scenarios.map(scenario => [scenario.slug, scenario]))
);

export function getScenario(slug: string): ScenarioData | undefined {
  return scenarioBySlug[slug];
}

export type { Choice, Dialogue, DialogueNode, Line, ScenarioData } from "./types";
