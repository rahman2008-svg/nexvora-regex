import { ExplanationNode, RegexEvaluation, RegexFlavor, RegexMatch } from '../types/regex';

/**
 * Safely evaluates a regular expression pattern against a test string.
 * Handles zero-length matches and avoids infinite loops.
 */
export function evaluateRegex(
  pattern: string,
  flagsStr: string,
  testString: string
): RegexEvaluation {
  const startTime = performance.now();

  if (!pattern) {
    return {
      matches: [],
      totalMatches: 0,
      executionTimeMs: 0,
      error: null,
      stepCount: 0,
    };
  }

  // Filter valid JS flags (g, m, i, s, u, y, d)
  const validJsFlags = flagsStr
    .split('')
    .filter((f) => ['g', 'm', 'i', 's', 'u', 'y'].includes(f))
    .join('');

  // Include 'd' flag for indices if available in browser
  let execFlags = validJsFlags;
  try {
    new RegExp('', execFlags + 'd');
    if (!execFlags.includes('d')) {
      execFlags += 'd';
    }
  } catch {
    // browser doesn't support 'd' flag
  }

  try {
    const isGlobal = flagsStr.includes('g');
    // If not global, RegExp constructor without 'g'
    const cleanFlags = isGlobal ? execFlags : execFlags.replace(/g/g, '');
    const regex = new RegExp(pattern, cleanFlags);

    const matches: RegexMatch[] = [];
    let matchIdx = 0;
    const maxMatches = 5000; // safety ceiling
    let stepCount = 0;

    if (!isGlobal) {
      const match = regex.exec(testString);
      if (match) {
        stepCount += 1;
        const start = match.index;
        const end = start + match[0].length;
        const groups: RegexMatch['groups'] = [];

        // Determine group offsets
        // Check if indices is supported
        const hasIndices = (match as any).indices;
        for (let i = 1; i < match.length; i++) {
          const groupText = match[i];
          if (groupText !== undefined) {
            let gStart = start;
            let gEnd = end;
            if (hasIndices && hasIndices[i]) {
              gStart = hasIndices[i][0];
              gEnd = hasIndices[i][1];
            } else {
              // fallback approximate start
              const searchIdx = match[0].indexOf(groupText);
              if (searchIdx !== -1) {
                gStart = start + searchIdx;
                gEnd = gStart + groupText.length;
              }
            }
            groups.push({
              number: i,
              start: gStart,
              end: gEnd,
              text: groupText,
            });
          }
        }

        matches.push({
          index: 0,
          start,
          end,
          text: match[0],
          groups,
          namedGroups: match.groups ? { ...match.groups } : undefined,
        });
      }
    } else {
      let match: RegExpExecArray | null;
      let lastIndex = 0;

      while ((match = regex.exec(testString)) !== null) {
        stepCount++;
        if (matchIdx >= maxMatches) break;

        const start = match.index;
        const end = start + match[0].length;
        const groups: RegexMatch['groups'] = [];
        const hasIndices = (match as any).indices;

        for (let i = 1; i < match.length; i++) {
          const groupText = match[i];
          if (groupText !== undefined) {
            let gStart = start;
            let gEnd = end;
            if (hasIndices && hasIndices[i]) {
              gStart = hasIndices[i][0];
              gEnd = hasIndices[i][1];
            } else {
              const searchIdx = match[0].indexOf(groupText);
              if (searchIdx !== -1) {
                gStart = start + searchIdx;
                gEnd = gStart + groupText.length;
              }
            }
            groups.push({
              number: i,
              start: gStart,
              end: gEnd,
              text: groupText,
            });
          }
        }

        matches.push({
          index: matchIdx,
          start,
          end,
          text: match[0],
          groups,
          namedGroups: match.groups ? { ...match.groups } : undefined,
        });

        matchIdx++;

        // Prevent infinite loop on zero-width match (e.g. ^, $, (?=...))
        if (match[0].length === 0) {
          regex.lastIndex++;
        }

        if (regex.lastIndex <= lastIndex && match[0].length === 0) {
          break;
        }
        lastIndex = regex.lastIndex;
      }
    }

    const duration = performance.now() - startTime;

    return {
      matches,
      totalMatches: matches.length,
      executionTimeMs: Math.round(duration * 100) / 100,
      error: null,
      stepCount: stepCount > 0 ? stepCount * 3 + 12 : 0,
    };
  } catch (err: any) {
    return {
      matches: [],
      totalMatches: 0,
      executionTimeMs: 0,
      error: err.message || 'Invalid regular expression',
      stepCount: 0,
    };
  }
}

/**
 * Builds an authentic, detailed hierarchical breakdown of the regex pattern
 * matching the Regex101 style explanation tree.
 */
export function explainRegex(pattern: string, flagsStr: string): ExplanationNode[] {
  if (!pattern) return [];

  const nodes: ExplanationNode[] = [];

  // Flag nodes first or root info
  const flagDescriptions: Record<string, string> = {
    g: 'Global — All matches (do not return after first match)',
    m: 'Multiline — ^ and $ match start/end of line instead of whole string',
    i: 'Case Insensitive — Match letters without regard to case',
    s: 'Single line (dotAll) — . matches any character including newline',
    u: 'Unicode — Treat pattern as a sequence of Unicode code points',
    x: 'Extended — Ignore whitespace and comments in pattern',
    y: 'Sticky — Matches only from the index indicated by the lastIndex property',
  };

  // Parse pattern into structured explanation
  let idx = 0;
  const len = pattern.length;
  let groupCounter = 0;

  function parseSegment(untilChar?: string): ExplanationNode[] {
    const segNodes: ExplanationNode[] = [];

    while (idx < len) {
      const char = pattern[idx];

      if (untilChar && char === untilChar) {
        idx++;
        break;
      }

      // Anchors
      if (char === '^') {
        segNodes.push({
          id: `node-${idx}-${Math.random()}`,
          raw: '^',
          title: '^ asserts start of string',
          description: flagsStr.includes('m')
            ? 'Asserts position at start of a line (multiline mode active)'
            : 'Asserts position at the beginning of the string',
          category: 'anchor',
          color: '#38bdf8',
        });
        idx++;
        continue;
      }

      if (char === '$') {
        segNodes.push({
          id: `node-${idx}-${Math.random()}`,
          raw: '$',
          title: '$ asserts end of string',
          description: flagsStr.includes('m')
            ? 'Asserts position at end of a line (multiline mode active)'
            : 'Asserts position at the end of the string',
          category: 'anchor',
          color: '#38bdf8',
        });
        idx++;
        continue;
      }

      // Word boundary
      if (char === '\\' && idx + 1 < len) {
        const nextChar = pattern[idx + 1];

        if (nextChar === 'b') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\b',
            title: '\\b asserts word boundary',
            description: 'Matches a zero-width word boundary position between a \\w and a \\W character',
            category: 'anchor',
            color: '#38bdf8',
          });
          idx += 2;
          continue;
        }

        if (nextChar === 'B') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\B',
            title: '\\B asserts non-word boundary',
            description: 'Matches at any position where \\b does not match',
            category: 'anchor',
            color: '#38bdf8',
          });
          idx += 2;
          continue;
        }

        // Shorthand character classes
        if (nextChar === 'd') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\d',
            title: '\\d matches any digit',
            description: 'Matches any Arabic numeral character [0-9]',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        if (nextChar === 'D') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\D',
            title: '\\D matches any non-digit',
            description: 'Matches any character that is NOT a digit [^0-9]',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        if (nextChar === 'w') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\w',
            title: '\\w matches any word character',
            description: 'Matches any alphanumeric character or underscore [a-zA-Z0-9_]',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        if (nextChar === 'W') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\W',
            title: '\\W matches any non-word character',
            description: 'Matches any character other than [a-zA-Z0-9_]',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        if (nextChar === 's') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\s',
            title: '\\s matches any whitespace character',
            description: 'Matches spaces, tabs, line breaks [ \\t\\r\\n\\f]',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        if (nextChar === 'S') {
          segNodes.push({
            id: `node-${idx}-${Math.random()}`,
            raw: '\\S',
            title: '\\S matches any non-whitespace character',
            description: 'Matches any character that is not a whitespace character',
            category: 'class',
            color: '#a78bfa',
          });
          idx += 2;
          checkQuantifier(segNodes);
          continue;
        }

        // Escaped literal
        segNodes.push({
          id: `node-${idx}-${Math.random()}`,
          raw: `\\${nextChar}`,
          title: `\\${nextChar} matches character "${nextChar}" literally`,
          description: `Escaped character "${nextChar}" (case sensitive)`,
          category: 'literal',
          color: '#fbbf24',
        });
        idx += 2;
        checkQuantifier(segNodes);
        continue;
      }

      // Dot .
      if (char === '.') {
        segNodes.push({
          id: `node-${idx}-${Math.random()}`,
          raw: '.',
          title: '. matches any character',
          description: flagsStr.includes('s')
            ? 'Matches any character including newlines (dotAll mode)'
            : 'Matches any character except line breaks',
          category: 'meta',
          color: '#34d399',
        });
        idx++;
        checkQuantifier(segNodes);
        continue;
      }

      // Character Set [...]
      if (char === '[') {
        const startBracket = idx;
        idx++;
        let isNegated = false;
        if (idx < len && pattern[idx] === '^') {
          isNegated = true;
          idx++;
        }

        let innerContent = '';
        while (idx < len && (pattern[idx] !== ']' || pattern[idx - 1] === '\\')) {
          innerContent += pattern[idx];
          idx++;
        }
        if (idx < len && pattern[idx] === ']') {
          idx++;
        }

        const rawSet = pattern.slice(startBracket, idx);
        segNodes.push({
          id: `node-${startBracket}-${Math.random()}`,
          raw: rawSet,
          title: isNegated ? `Match a character NOT in the set [^${innerContent}]` : `Match a single character in the set [${innerContent}]`,
          description: isNegated
            ? `Negated character class: matches any character except: ${innerContent}`
            : `Matches a single character present in the list: ${innerContent}`,
          category: 'class',
          color: '#f472b6',
        });
        checkQuantifier(segNodes);
        continue;
      }

      // Groups (...)
      if (char === '(') {
        const groupStart = idx;
        idx++;
        let isNonCapturing = false;
        let isLookahead = false;
        let isLookbehind = false;
        let isPositive = true;
        let groupName = '';

        if (idx < len && pattern[idx] === '?') {
          idx++;
          if (pattern[idx] === ':') {
            isNonCapturing = true;
            idx++;
          } else if (pattern[idx] === '=') {
            isLookahead = true;
            isPositive = true;
            idx++;
          } else if (pattern[idx] === '!') {
            isLookahead = true;
            isPositive = false;
            idx++;
          } else if (pattern[idx] === '<') {
            idx++;
            if (pattern[idx] === '=') {
              isLookbehind = true;
              isPositive = true;
              idx++;
            } else if (pattern[idx] === '!') {
              isLookbehind = true;
              isPositive = false;
              idx++;
            } else {
              // Named group: (?<name>...)
              while (idx < len && pattern[idx] !== '>') {
                groupName += pattern[idx];
                idx++;
              }
              if (idx < len && pattern[idx] === '>') idx++;
            }
          }
        }

        let title = '';
        let desc = '';
        let category: ExplanationNode['category'] = 'group';

        if (isNonCapturing) {
          title = 'Non-capturing group (?:...)';
          desc = 'Groups multiple tokens together without creating a capture group';
        } else if (isLookahead) {
          category = 'lookaround';
          title = isPositive ? 'Positive Lookahead (?=...)' : 'Negative Lookahead (?!...)';
          desc = isPositive
            ? 'Asserts that what immediately follows the current position in the string matches the contained pattern'
            : 'Asserts that what immediately follows does NOT match the contained pattern';
        } else if (isLookbehind) {
          category = 'lookaround';
          title = isPositive ? 'Positive Lookbehind (?<=...)' : 'Negative Lookbehind (?<!...)';
          desc = isPositive
            ? 'Asserts that what immediately precedes the current position matches the pattern'
            : 'Asserts that what immediately precedes does NOT match the pattern';
        } else if (groupName) {
          groupCounter++;
          title = `Named Capturing Group (?<${groupName}>...) [Group #${groupCounter}]`;
          desc = `Groups multiple tokens together and captures them with the name "${groupName}"`;
        } else {
          groupCounter++;
          title = `Capturing Group #${groupCounter}`;
          desc = `Groups multiple tokens together and creates capture group #${groupCounter} for extraction or backreferences`;
        }

        const childNodes = parseSegment(')');
        const groupRaw = pattern.slice(groupStart, idx);

        segNodes.push({
          id: `node-${groupStart}-${Math.random()}`,
          raw: groupRaw,
          title,
          description: desc,
          category,
          color: '#60a5fa',
          children: childNodes,
        });
        checkQuantifier(segNodes);
        continue;
      }

      // Alternation |
      if (char === '|') {
        segNodes.push({
          id: `node-${idx}-${Math.random()}`,
          raw: '|',
          title: 'Alternation | (OR)',
          description: 'Matches either the expression on the left or the expression on the right',
          category: 'meta',
          color: '#e879f9',
        });
        idx++;
        continue;
      }

      // Literals
      const literalStart = idx;
      let literalText = '';
      while (
        idx < len &&
        !['^', '$', '\\', '.', '[', ']', '(', ')', '*', '+', '?', '{', '}', '|'].includes(pattern[idx])
      ) {
        literalText += pattern[idx];
        idx++;
      }

      if (literalText.length > 0) {
        segNodes.push({
          id: `node-${literalStart}-${Math.random()}`,
          raw: literalText,
          title: `"${literalText}" matches the characters literally`,
          description: `Matches string "${literalText}" literally (case ${flagsStr.includes('i') ? 'insensitive' : 'sensitive'})`,
          category: 'literal',
          color: '#94a3b8',
        });
        checkQuantifier(segNodes);
      }
    }

    return segNodes;
  }

  function checkQuantifier(segNodes: ExplanationNode[]) {
    if (idx >= len) return;
    const char = pattern[idx];
    const targetNode = segNodes[segNodes.length - 1];
    if (!targetNode) return;

    if (char === '*' || char === '+' || char === '?' || char === '{') {
      const qStart = idx;
      let rawQ = '';

      if (char === '{') {
        while (idx < len && pattern[idx] !== '}') {
          rawQ += pattern[idx];
          idx++;
        }
        if (idx < len && pattern[idx] === '}') {
          rawQ += '}';
          idx++;
        }
      } else {
        rawQ = char;
        idx++;
      }

      let isLazy = false;
      if (idx < len && pattern[idx] === '?') {
        isLazy = true;
        rawQ += '?';
        idx++;
      }

      let qTitle = '';
      let qDesc = '';

      if (rawQ.startsWith('*')) {
        qTitle = `* Quantifier — Match 0 or more times (${isLazy ? 'lazy' : 'greedy'})`;
        qDesc = `${isLazy ? 'As few times as possible' : 'As many times as possible (greedy)'}, giving back as needed`;
      } else if (rawQ.startsWith('+')) {
        qTitle = `+ Quantifier — Match 1 or more times (${isLazy ? 'lazy' : 'greedy'})`;
        qDesc = `Matches between one and unlimited times, ${isLazy ? 'lazy' : 'greedy'}`;
      } else if (rawQ.startsWith('?')) {
        qTitle = `? Quantifier — Match between 0 and 1 time (${isLazy ? 'lazy' : 'greedy'})`;
        qDesc = 'Optional token, matches zero or one time';
      } else if (rawQ.startsWith('{')) {
        qTitle = `${rawQ} Quantifier — Specified count (${isLazy ? 'lazy' : 'greedy'})`;
        qDesc = `Matches exactly according to range ${rawQ}`;
      }

      // Add as child quantifier or annotate
      targetNode.raw += rawQ;
      if (!targetNode.children) targetNode.children = [];
      targetNode.children.unshift({
        id: `node-${qStart}-quantifier`,
        raw: rawQ,
        title: qTitle,
        description: qDesc,
        category: 'quantifier',
        color: '#fbbf24',
      });
    }
  }

  const parsed = parseSegment();
  nodes.push(...parsed);

  // Add Flags Node at bottom if any flags set
  if (flagsStr) {
    const flagChildren: ExplanationNode[] = flagsStr.split('').map((f) => ({
      id: `flag-${f}`,
      raw: f,
      title: `Flag /${f}/`,
      description: flagDescriptions[f] || `Modifier flag ${f}`,
      category: 'flag',
      color: '#ec4899',
    }));

    nodes.push({
      id: 'flags-node',
      raw: `/${flagsStr}`,
      title: `Pattern Modifiers: ${flagsStr}`,
      description: 'Global flags affecting matching behavior across the entire regular expression',
      category: 'flag',
      color: '#f43f5e',
      children: flagChildren,
    });
  }

  return nodes;
}

/**
 * Performs substitution and calculates statistics.
 */
export function performSubstitution(
  pattern: string,
  flagsStr: string,
  testString: string,
  replacement: string
): { result: string; replacementsCount: number; error: string | null } {
  if (!pattern) {
    return { result: testString, replacementsCount: 0, error: null };
  }

  try {
    const validJsFlags = flagsStr
      .split('')
      .filter((f) => ['g', 'm', 'i', 's', 'u', 'y'].includes(f))
      .join('');
    const regex = new RegExp(pattern, validJsFlags);
    let count = 0;

    const result = testString.replace(regex, (...args) => {
      count++;
      // Custom handler for $1, \1 or replacement
      return replacement
        .replace(/\$([0-9]+)/g, (_, n) => args[parseInt(n, 10)] ?? '')
        .replace(/\\([0-9]+)/g, (_, n) => args[parseInt(n, 10)] ?? '')
        .replace(/\$&/g, args[0]);
    });

    return { result, replacementsCount: count, error: null };
  } catch (err: any) {
    return { result: testString, replacementsCount: 0, error: err.message };
  }
}

/**
 * Generates ready-to-run code snippets across multiple languages.
 */
export function generateCode(
  pattern: string,
  flagsStr: string,
  testString: string,
  flavor: RegexFlavor
): string {
  const safePattern = pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const safeTest = testString.slice(0, 150).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  switch (flavor) {
    case 'javascript':
      return `// JavaScript (ECMAScript) Implementation
const regex = /${pattern}/${flagsStr};
const str = \`${testString.slice(0, 150)}\`;

let m;
while ((m = regex.exec(str)) !== null) {
  // Prevent infinite loops on zero-width matches
  if (m.index === regex.lastIndex) {
    regex.lastIndex++;
  }
  
  m.forEach((match, groupIndex) => {
    console.log(\`Found match, group \${groupIndex}: \${match}\`);
  });
}`;

    case 'python':
      return `# Python 3 Implementation
import re

pattern = r"${pattern}"
text = """${testString.slice(0, 150)}"""

# Flags
flags = 0
${flagsStr.includes('i') ? 'flags |= re.IGNORECASE\n' : ''}${flagsStr.includes('m') ? 'flags |= re.MULTILINE\n' : ''}${flagsStr.includes('s') ? 'flags |= re.DOTALL\n' : ''}
matches = re.finditer(pattern, text, flags)
for match_num, match in enumerate(matches, start=1):
    print(f"Match {match_num} was found at {match.start()}-{match.end()}: {match.group()}")
    for group_num in range(1, len(match.groups()) + 1):
        print(f"  Group {group_num}: {match.group(group_num)}")`;

    case 'golang':
      return `// Golang Implementation
package main

import (
	"fmt"
	"regexp"
)

func main() {
	var re = regexp.MustCompile(\`${pattern}\`)
	var str = \`${testString.slice(0, 150)}\`
	
	matches := re.FindAllStringSubmatch(str, -1)
	for i, match := range matches {
		fmt.Printf("Match %d: %s\\n", i+1, match[0])
		for j, group := range match[1:] {
			fmt.Printf("  Group %d: %s\\n", j+1, group)
		}
	}
}`;

    case 'java':
      return `// Java Implementation
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexExample {
    public static void main(String[] args) {
        final String regex = "${safePattern}";
        final String string = "${safeTest}";
        
        int flags = 0;
        ${flagsStr.includes('i') ? 'flags |= Pattern.CASE_INSENSITIVE;\n        ' : ''}${flagsStr.includes('m') ? 'flags |= Pattern.MULTILINE;\n        ' : ''}${flagsStr.includes('s') ? 'flags |= Pattern.DOTALL;\n        ' : ''}
        final Pattern pattern = Pattern.compile(regex, flags);
        final Matcher matcher = pattern.matcher(string);
        
        while (matcher.find()) {
            System.out.println("Full match: " + matcher.group(0));
            for (int i = 1; i <= matcher.groupCount(); i++) {
                System.out.println("  Group " + i + ": " + matcher.group(i));
            }
        }
    }
}`;

    case 'csharp':
      return `// C# (.NET) Implementation
using System;
using System.Text.RegularExpressions;

public class Program {
    public static void Main() {
        string pattern = @"${pattern.replace(/"/g, '""')}";
        string input = @"${testString.slice(0, 150).replace(/"/g, '""')}";
        
        RegexOptions options = RegexOptions.None;
        ${flagsStr.includes('i') ? 'options |= RegexOptions.IgnoreCase;\n        ' : ''}${flagsStr.includes('m') ? 'options |= RegexOptions.Multiline;\n        ' : ''}${flagsStr.includes('s') ? 'options |= RegexOptions.Singleline;\n        ' : ''}
        MatchCollection matches = Regex.Matches(input, pattern, options);
        foreach (Match match in matches) {
            Console.WriteLine("Match: " + match.Value);
            for (int i = 1; i < match.Groups.Count; i++) {
                Console.WriteLine("  Group " + i + ": " + match.Groups[i].Value);
            }
        }
    }
}`;

    case 'rust':
      return `// Rust (regex crate)
use regex::Regex;

fn main() {
    let re = Regex::new(r"${pattern}").unwrap();
    let text = r#"${testString.slice(0, 150)}"#;
    
    for cap in re.captures_iter(text) {
        println!("Match: {}", &cap[0]);
        for i in 1..cap.len() {
            if let Some(m) = cap.get(i) {
                println!("  Group {}: {}", i, m.as_str());
            }
        }
    }
}`;

    case 'pcre2':
    default:
      return `<?php
// PHP PCRE2 Implementation
$pattern = '/${pattern}/${flagsStr}';
$subject = '${testString.slice(0, 150).replace(/'/g, "\\'")}';

preg_match_all($pattern, $subject, $matches, PREG_SET_ORDER, 0);

// Print results
foreach ($matches as $i => $match) {
    echo "Match " . ($i + 1) . ": " . $match[0] . "\\n";
    foreach (array_slice($match, 1) as $groupIndex => $group) {
        echo "  Group " . ($groupIndex + 1) . ": " . $group . "\\n";
    }
}
?>`;
  }
}
