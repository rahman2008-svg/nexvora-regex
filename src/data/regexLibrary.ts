import { SavedPattern } from '../types/regex';

export const POPULAR_PATTERNS: SavedPattern[] = [
  {
    id: 'email-validation',
    title: 'RFC-5322 Compliant Email Address',
    description: 'Matches standard user@domain.tld email addresses with username and domain capture groups.',
    pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Validation',
    testString: `Contact us at:
support@nexvora.com
prince.dev@example.org
hello.world+filter@sub.domain.co.uk
invalid-email@
notanemail.com
user.name123@company.io`,
  },
  {
    id: 'url-parser',
    title: 'HTTP/HTTPS URL with Protocol & Path',
    description: 'Extracts protocol, domain host, optional port, path and query parameters from web links.',
    pattern: '(https?:\\/\\/)?([\\w\\.-]+)(:\\d+)?(\\/[\\w\\.-]*)*(\\?[\\w\\.~%+-=&]*)?',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Web',
    testString: `Visit our platforms:
https://regex101.com/r/sample
http://localhost:3000/dashboard?view=grid&sort=asc
https://api.nexvora.org/v1/auth
ftp://not-matched.org
http://example.com/posts/2026/october/update`,
  },
  {
    id: 'ipv4-address',
    title: 'IPv4 Address Validation',
    description: 'Matches standard IPv4 addresses ensuring each octet is in valid ranges 0-255.',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Network',
    testString: `Router Gateway: 192.168.1.1
Public DNS: 8.8.8.8
Cloudflare DNS: 1.1.1.1
Localhost: 127.0.0.1
Invalid addresses:
999.999.999.999
192.168.1.256
10.0.0.1`,
  },
  {
    id: 'phone-number-bd-intl',
    title: 'Phone Numbers (International & Local)',
    description: 'Captures country code and domestic digits across common formats.',
    pattern: '(\\+?\\d{1,3}[- .]?)?(\\d{3,4})[- .]?(\\d{3,4})[- .]?(\\d{3,4})',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Communication',
    testString: `Contact numbers:
01707424006
01796951709
+880 1707 424006
+1 (555) 234-5678
+44 20 7946 0919
12345 (too short)`,
  },
  {
    id: 'hex-color',
    title: 'CSS Hex Color Codes (#RGB, #RRGGBB, #RRGGBBAA)',
    description: 'Matches valid hex color values with 3, 6, or 8 characters.',
    pattern: '#(?:[0-9a-fA-F]{3,4}){1,2}\\b',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Design',
    testString: `Brand Colors:
#3b82f6 (NexVora Blue)
#10b981 (Emerald Green)
#fff
#1e222b
#12345678 (8-digit hex with alpha)
#ff8800
Invalid: #xyz123, #12345`,
  },
  {
    id: 'iso-date',
    title: 'ISO 8601 Date Format (YYYY-MM-DD)',
    description: 'Matches standard ISO dates with year, month, and day capturing groups.',
    pattern: '(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Dates',
    testString: `Project milestones:
2026-10-13 (Release 1.0.0)
2026-12-25 (Holiday update)
2025-01-01 (Kickoff)
Invalid dates:
2026-13-40
26-10-13`,
  },
  {
    id: 'uuid-v4',
    title: 'UUID v4 (Universally Unique Identifier)',
    description: 'Validates 128-bit UUID strings formatted with hyphens.',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Data',
    testString: `Generated Tokens:
df169e23-4168-4e81-9a09-2efaeb1f37b9
c9a646d3-9c61-4cd7-9b2d-e2d6b359f4f4
6ba7b810-9dad-11d1-80b4-00c04fd430c8
not-a-valid-uuid-format`,
  },
  {
    id: 'html-tags',
    title: 'HTML Tag & Attributes Extractor',
    description: 'Captures HTML tag name, attributes, and inner content.',
    pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b([^>]*)>(.*?)<\\/\\1>',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Markup',
    testString: `<div class="container" id="main">Welcome to NexVora Regex</div>
<p style="color: red;">Sample paragraph text</p>
<span class="badge">v1.0.0</span>
<h1>Title Heading</h1>`,
  },
  {
    id: 'slug-validator',
    title: 'URL Slug Validator',
    description: 'Validates kebab-case URL slugs containing lowercase letters, numbers, and hyphens.',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Web',
    testString: `nexvora-regex-tester
regex101-recreation-v1
modern-android-productivity-tools
Invalid_slug_with_underscores
-invalid-leading-dash`,
  },
  {
    id: 'markdown-links',
    title: 'Markdown Hyperlinks [label](url)',
    description: 'Extracts the label text and target URL from Markdown formatted links.',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s\\)]+)\\)',
    flags: 'gm',
    flavor: 'javascript',
    category: 'Markup',
    testString: `Explore our official links:
[NexVora Developer Profile](https://www.facebook.com/share/1BNn32qoJo/)
[Instagram Profile](https://www.instagram.com/ur___abdur____rahman__2008)
[Regex Reference Docs](https://regex101.com)
Normal text without formatting.`,
  },
];
