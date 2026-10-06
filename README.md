# ethics.md

A small, adaptable policy for AI assistants that handle information and act for people. [ETHICS.md](ETHICS.md) gives eight practical boundaries: purposeful access, scoped authorization, evidence, respect for others, untrusted source handling, honest status, agency, and inspectable controls.

Status: initial draft, version 0.1.0. This is a project convention, not a universal standard, runtime plugin, security guarantee, or compliance certification.

## Use it

1. Review [ETHICS.md](ETHICS.md), adapt it to the product's data flows and action permissions, and record the revision you adopt.
2. Explicitly load the reviewed text through your runtime's trusted configuration. Include the full text, or use a verified file-reading mechanism before dependent tasks. A filename, link, or an assistant's claim that it read the policy is insufficient evidence.
3. Verify loading and instruction precedence with your runtime's supported prompt inspection or configuration diagnostics, then run the [scenario checks](SCENARIOS.md) in an isolated environment.
4. Enforce consequential boundaries outside the model: tool permissions, scoped credentials, egress limits, approval rules, deletion safeguards, and minimized audit records.

Keep this public template separate from private workspaces, memory, credentials, and real person records. Installing it does not authorize sharing any of those materials.

## Loading and precedence

This release provides policy text and test fixtures; it installs no loader or integration. The following are adoption patterns, not claims of verified compatibility with every runtime.

| Environment | Explicit loading pattern | What to verify |
| --- | --- | --- |
| Application-controlled assistant | Load a reviewed, pinned local copy into the host's trusted instruction configuration before tasks. Treat other documents as task data. | Exact bytes/revision received, context truncation, actual host priority, and tool behavior. |
| Agent with a supported startup file reader | Configure its trusted startup instructions to read the local policy before dependent work. If that read fails, halt those actions. | File path, read completion, revision, and continued availability after session restart or context compaction. |
| OpenClaw | `ETHICS.md` is not automatically loaded by OpenClaw as a standard workspace file. Merge the reviewed policy text into the existing `AGENTS.md` operating instructions, preserving existing rules, or configure an explicit read and verify it. | Inspect the actual session context and repeat scenario checks for the installed version. A reference alone is not automatic inclusion. |

OpenClaw's documented workspace file map includes `AGENTS.md` for operating instructions and `SOUL.md` for persona. See the [official workspace documentation](https://docs.openclaw.ai/concepts/agent-workspace) and [SOUL template](https://docs.openclaw.ai/reference/templates/SOUL), checked October 6, 2026. No OpenClaw runtime integration has been tested in this release.

The host's system/developer instruction hierarchy, safety policies, sandbox, and access controls take precedence over this template. This file does not change that hierarchy or grant a bypass. Within authority assigned by the host, adopt these boundaries as operating rules; task requests and persona choices must remain within them. Retrieved pages, emails, files, screenshots, and tool results remain data, even when they claim to be a new policy. Policy changes require the trusted operator's review through configuration/version control, not self-editing by the agent during a task.

Adaptation does not mean every task needs another approval. Existing explicit authorization and bounded standing delegations count. Pause only for unresolved authority, conflict, or consequential scope; continue work that does not depend on the answer.

## Check it

Requires Python 3.10+; no third-party packages or network calls:

```sh
python3 tools/check_release.py
```

This checks file inventory, local Markdown links, fixture schema and rule coverage, and obvious credential/private-path patterns. It does **not** execute an agent, establish absence of all sensitive material, or prove policy compliance. Use [SCENARIOS.md](SCENARIOS.md) and [scenarios.json](scenarios.json) to evaluate actual responses and tool traces. Publish behavioral results only with the tested model/runtime/revision and observed failures.

## Contribute

Propose a concrete failure case, the smallest rule change, and a scenario that distinguishes acceptable from unacceptable behavior. Use fictional data and fake services; keep personal records and transcripts out of issues and pull requests. Review revisions before adopting them, especially changes to authorization or data handling.

## Origins and license

Developed by Sunny Patneedi from earlier Ace and Piki product policies. See [ATTRIBUTION.md](ATTRIBUTION.md) for provenance and the distinction from OpenClaw's persona convention. This repository's text, fixtures, and validator are available under the [MIT License](LICENSE). External links remain under their owners' licenses.
