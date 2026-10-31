export interface CaseStudy {
  problem: string;
  role: string;
  flow: { label: string; detail: string }[];
  decisions: { title: string; detail: string }[];
  outcome: string[];
}

export interface CaseStudyLabels {
  screensTab: string;
  caseTab: string;
  open: string;
  problem: string;
  role: string;
  flow: string;
  decisions: string;
  outcome: string;
}
