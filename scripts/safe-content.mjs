// Safe-content scan for public documentation pages.
//
// Scans every Markdown/MDX page under src/content/docs for material that must
// never appear in the public site: private Git hosts, the private repository
// path, internal document directories (decisions, plans, security, spikes,
// cli, mcp), commit hashes, and real-looking secrets. The maintainer context
// files (AGENTS.md, maintainers/*) deliberately discuss these concepts and are
// not scanned.
//
// Known placeholders (YOUR_KEY, ..., <key>) are allowed. Exit 1 on any other
// match.

import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

const ROOT = 'src/content/docs';
const EXTENSIONS = ['.md', '.mdx'];
const PLACEHOLDERS = ['your_key', 'your-key', '<key>', '<your_key>', '...', 'placeholder', 'example'];

const PATTERNS = [
	{ name: 'private git host', re: /g\.hz\.netease\.com|gitlab/i },
	{ name: 'private repository path', re: /agent-runtime-rs\.git/i },
	{
		name: 'private internal doc path',
		re: /docs\/(?:decisions|plans|security|spikes|cli|mcp)\//,
	},
	{ name: 'commit ref', re: /\bcommit\s+[0-9a-f]{7,40}\b/i },
	{ name: 'commit url ref', re: /\/commit\/[0-9a-f]{7,40}\b/i },
	{ name: 'openai key literal', re: /\bsk-[A-Za-z0-9]{20,}\b/ },
	{
		name: 'real-looking secret assignment',
		re: /(?:API_KEY|TOKEN|SECRET|PASSWORD|AUTHORIZATION)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{20,}['"]?/i,
	},
];

function walk(dir, out = []) {
	let entries;
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		if (entry.name.startsWith('_')) continue;
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(path, out);
		} else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
			out.push(path);
		}
	}
	return out;
}

function isPlaceholder(match) {
	const lower = match.toLowerCase();
	return PLACEHOLDERS.some((placeholder) => lower.includes(placeholder));
}

let failed = false;

for (const file of walk(ROOT)) {
	const text = readFileSync(file, 'utf8');
	const lines = text.split(/\r?\n/);
	lines.forEach((line, index) => {
		for (const { name, re } of PATTERNS) {
			const match = line.match(re);
			if (match && !isPlaceholder(match[0])) {
				console.error(`${file.split(sep).join('/')}:${index + 1}: ${name}: ${match[0]}`);
				failed = true;
			}
		}
	});
}

if (!failed) {
	console.log('Safe-content scan OK: no private identifiers or real secrets found.');
}

process.exit(failed ? 1 : 0);
