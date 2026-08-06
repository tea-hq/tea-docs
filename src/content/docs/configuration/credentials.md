---
title: Credentials and models
description: Select a built-in provider or configure an OpenAI-compatible endpoint without persisting secrets.
---

## One-time selection

Pass the API key from a temporary shell variable rather than writing it to a
settings file:

```sh
export TEA_API_KEY='YOUR_KEY'
tea --provider openai --model gpt-4o-mini --api-key "$TEA_API_KEY"
```

Built-in Provider IDs are `openai` and `anthropic`. The key passed by
`--api-key` is used for that invocation and redacted from diagnostics.

## Custom endpoint

Add an entry to `~/.tea/providers.json`:

```json
{
  "providers": {
    "gateway": {
      "base_url": "https://gateway.example.com/v1",
      "api_key": "$TEA_API_KEY",
      "api_mode": "chat-completions",
      "models": [{ "id": "team-model" }]
    }
  }
}
```

Then run:

```sh
tea --provider gateway --model team-model
```

`api_key` may reference `$NAME` or `${NAME}`. A trusted workspace can add
`.tea/providers.json`; project entries overlay global Provider fields, while a
non-empty project model list replaces the global list.

## Built-in environment contracts

| Provider | Required | Common optional values |
| --- | --- | --- |
| OpenAI-compatible | `TEA_OPENAI_API_KEY` | `TEA_OPENAI_MODEL`, `TEA_OPENAI_BASE_URL`, `TEA_OPENAI_API_MODE` |
| Anthropic | `TEA_ANTHROPIC_API_KEY` | `TEA_ANTHROPIC_MODEL`, `TEA_ANTHROPIC_BASE_URL`, `TEA_ANTHROPIC_API_VERSION` |

These adapter-specific variables are convenient defaults. Applications and
scripts can keep a provider-neutral configuration boundary by using
`--provider`, `--model`, `--api-key`, and `providers.json`.

Never place credentials in `settings.json`, prompts, source files, or tool
output. Session databases and terminal history can contain other project data
and should be protected accordingly.
