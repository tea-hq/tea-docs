import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const zh = (label) => ({ 'zh-CN': label });

// Bilingual documentation: English at the default route (`/`, root locale) and
// Simplified Chinese under `/zh/`. Shared page file names across the two
// content directories enable Starlight's language switcher, fallback, and
// translation-parity checks.
export default defineConfig({
  // Org-root GitHub Pages deployment at https://tea-hq.github.io/ — no `base`
  // path prefix. A subpath or custom-domain target would be set at a later
  // review; today the documentation is published at the organization root.
  site: 'https://tea-hq.github.io',
  integrations: [
    mermaid({ autoTheme: true, enableLog: false }),
    starlight({
      title: 'Tea docs',
      defaultLocale: 'root',
      locales: {
        // English docs live in src/content/docs/ and are served at `/`.
        root: { label: 'English', lang: 'en' },
        // Simplified Chinese docs live in src/content/docs/zh/ and are served at /zh/.
        zh: { label: '简体中文', lang: 'zh-CN' },
      },
      sidebar: [
        { label: 'Overview', translations: zh('概览'), link: 'overview' },
        {
          label: 'CLI & TUI',
          translations: zh('CLI 与 TUI'),
          items: [
            {
              label: 'Install and first run',
              translations: zh('安装与首次运行'),
              link: 'get-started/install',
            },
            { label: 'Using the TUI', translations: zh('使用 TUI'), link: 'cli/tui' },
            {
              label: 'Modes and commands',
              translations: zh('模式与命令'),
              link: 'get-started/cli-modes',
            },
            {
              label: 'Configuration',
              translations: zh('配置'),
              link: 'configuration/settings',
            },
            {
              label: 'CLI reference',
              translations: zh('CLI 配置参考'),
              link: 'configuration/cli-config-reference',
            },
            {
              label: 'Credentials and models',
              translations: zh('凭据与模型'),
              link: 'configuration/credentials',
            },
            {
              label: 'Workspace trust',
              translations: zh('工作区信任'),
              link: 'safety/trust',
            },
            {
              label: 'Approvals and grants',
              translations: zh('审批与授权'),
              link: 'safety/approvals',
            },
            {
              label: 'Sessions and recovery',
              translations: zh('会话与恢复'),
              link: 'sessions/sessions',
            },
            {
              label: 'MCP servers',
              translations: zh('MCP 服务器'),
              link: 'mcp/configuration',
            },
            {
              label: 'JSONL/RPC automation',
              translations: zh('JSONL/RPC 自动化'),
              link: 'automation/rpc',
            },
            {
              label: 'Security boundaries',
              translations: zh('安全边界'),
              link: 'safety/security',
            },
          ],
        },
        {
          label: 'SDK',
          items: [
            {
              label: 'Quick Start',
              translations: zh('快速开始'),
              link: 'sdk/quick-start',
            },
            {
              label: 'Embed Tea',
              translations: zh('嵌入 Tea'),
              link: 'integration/embedding',
            },
            {
              label: 'Model providers',
              translations: zh('模型提供商'),
              link: 'integration/model-providers',
            },
            {
              label: 'Tools and policy',
              translations: zh('工具与策略'),
              link: 'integration/tools-policy',
            },
            {
              label: 'Session stores',
              translations: zh('会话存储'),
              link: 'integration/session-stores',
            },
            {
              label: 'MCP integration',
              translations: zh('MCP 集成'),
              link: 'integration/mcp',
            },
            {
              label: 'Protocol and RPC',
              translations: zh('协议与 RPC'),
              link: 'integration/protocol-rpc',
            },
          ],
        },
      ],
      plugins: [starlightLinksValidator()],
    }),
  ],
});
