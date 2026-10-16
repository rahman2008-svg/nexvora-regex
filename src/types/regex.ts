export type RegexFlavor = 'pcre2' | 'javascript' | 'python' | 'golang' | 'java' | 'csharp' | 'rust';

export interface RegexFlags {
  global: boolean; // g
  multiline: boolean; // m
  caseInsensitive: boolean; // i
  singleLine: boolean; // s (dotAll)
  unicode: boolean; // u
  extended: boolean; // x
  sticky: boolean; // y
}

export interface MatchGroup {
  number: number;
  name?: string;
  start: number;
  end: number;
  text: string;
}

export interface RegexMatch {
  index: number;
  start: number;
  end: number;
  text: string;
  groups: MatchGroup[];
  namedGroups?: Record<string, string>;
}

export interface RegexEvaluation {
  matches: RegexMatch[];
  totalMatches: number;
  executionTimeMs: number;
  error: string | null;
  stepCount: number;
}

export interface ExplanationNode {
  id: string;
  raw: string;
  title: string;
  description: string;
  category: 'anchor' | 'group' | 'quantifier' | 'class' | 'literal' | 'meta' | 'lookaround' | 'flag';
  color?: string;
  children?: ExplanationNode[];
}

export interface UnitTest {
  id: string;
  name: string;
  testString: string;
  expectedMatch: boolean;
  actualMatch?: boolean;
  passed?: boolean;
}

export interface QuickReferenceItem {
  token: string;
  name: string;
  description: string;
  category: 'common' | 'classes' | 'anchors' | 'quantifiers' | 'groups' | 'flags' | 'substitutions';
  example: string;
}

export interface SavedPattern {
  id: string;
  title: string;
  description: string;
  pattern: string;
  flags: string;
  flavor: RegexFlavor;
  testString: string;
  category: string;
}
