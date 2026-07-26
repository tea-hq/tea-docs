// Language-page parity check.
//
// Asserts that every English page under src/content/docs has a Simplified
// Chinese counterpart under src/content/docs/zh with the same relative path,
// and vice versa. The Starlight sidebar autogenerates per locale, so a missing
// counterpart would silently break the language switcher and translation
// fallback. Exit 1 on any mismatch.

import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'src/content/docs';
const ZH = join(ROOT, 'zh');
const EXTENSIONS = ['.md', '.mdx'];

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

function toPosix(p) {
	return p.split(sep).join('/');
}

const all = walk(ROOT).map(toPosix);
const english = all
	.filter((p) => !p.startsWith(`${ROOT}/zh/`))
	.map((p) => toPosix(relative(ROOT, p)));
const chinese = all
	.filter((p) => p.startsWith(`${ROOT}/zh/`))
	.map((p) => toPosix(relative(ZH, p)));

const englishSet = new Set(english);
const chineseSet = new Set(chinese);

const missingChinese = english.filter((p) => !chineseSet.has(p));
const missingEnglish = chinese.filter((p) => !englishSet.has(p));

let failed = false;

if (missingChinese.length > 0) {
	console.error('English pages with no Simplified Chinese counterpart under /zh/:');
	for (const path of missingChinese) console.error(`  ${path}`);
	failed = true;
}

if (missingEnglish.length > 0) {
	console.error('Simplified Chinese pages with no English counterpart:');
	for (const path of missingEnglish) console.error(`  ${path}`);
	failed = true;
}

if (!failed) {
	console.log(
		`Parity OK: ${english.length} English and ${chinese.length} Simplified Chinese pages match.`
	);
}

process.exit(failed ? 1 : 0);
