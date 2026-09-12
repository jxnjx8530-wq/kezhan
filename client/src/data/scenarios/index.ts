import { foodScenarios } from "./food";
import { journeyScenarios } from "./journey";
import { marketScenarios } from "./market";
import type { ScenarioData } from "./types";
import { villageScenarios } from "./village";

export interface ScenarioWithImage extends ScenarioData {
  /** Scene photo for this scenario, matched to the slug at build time. */
  image: string;
}

export interface ScenarioTheme {
  key: string;
  ko: { name: string };
  en: { name: string };
  scenarios: ScenarioWithImage[];
}

function withImage(scenario: ScenarioData): ScenarioWithImage {
  return { ...scenario, image: `/images/scenarios/${scenario.slug}.webp` };
}

export const scenarioThemes: ScenarioTheme[] = [
  { key: "gourmet", ko: { name: "미식채" }, en: { name: "Gourmet Wing" }, scenarios: foodScenarios.map(withImage) },
  { key: "journey", ko: { name: "여정채" }, en: { name: "Journey Wing" }, scenarios: journeyScenarios.map(withImage) },
  { key: "market", ko: { name: "상점채" }, en: { name: "Market Wing" }, scenarios: marketScenarios.map(withImage) },
  { key: "village", ko: { name: "마을채" }, en: { name: "Village Wing" }, scenarios: villageScenarios.map(withImage) },
];

const scenarioBySlug: Record<string, ScenarioWithImage> = Object.fromEntries(
  scenarioThemes.flatMap(theme => theme.scenarios.map(scenario => [scenario.slug, scenario]))
);

export function getScenario(slug: string): ScenarioWithImage | undefined {
  return scenarioBySlug[slug];
}

export type { Choice, Dialogue, DialogueNode, Line, ScenarioData } from "./types";
