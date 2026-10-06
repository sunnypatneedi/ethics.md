#!/usr/bin/env python3
"""Offline release hygiene and fixture validation; not an agent behavior evaluator."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    "ETHICS.md", "README.md", "ATTRIBUTION.md", "LICENSE",
    "SCENARIOS.md", "scenarios.json", "tools/check_release.py",
}


def main():
    errors = []
    actual = set()
    for path in ROOT.rglob("*"):
        relative = path.relative_to(ROOT)
        if ".git" in relative.parts:
            continue
        if path.is_symlink():
            errors.append(f"Symlink is not allowed in release: {relative}")
        elif path.is_file():
            actual.add(relative.as_posix())
    if actual != EXPECTED:
        errors.append(f"Inventory differs: missing={sorted(EXPECTED - actual)}, extra={sorted(actual - EXPECTED)}")

    texts = {}
    for name in sorted(actual & EXPECTED):
        try:
            texts[name] = (ROOT / name).read_text(encoding="utf-8")
        except (OSError, UnicodeError) as exc:
            errors.append(f"Cannot read {name}: {exc}")

    # Deliberately narrow: these checks supplement, never replace, human review.
    patterns = {
        "private absolute path": r"/(?:Users|home)/[\w.-]+/",
        "private key": r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        "GitHub token": r"\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b",
        "AWS access key": r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b",
    }
    for name, text in texts.items():
        if not text.endswith("\n"):
            errors.append(f"Missing terminal newline: {name}")
        for label, pattern in patterns.items():
            if re.search(pattern, text):
                errors.append(f"Possible {label} in {name}")
        if name.endswith(".md"):
            for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
                if re.match(r"https?://", target):
                    continue
                local = target.split("#", 1)[0]
                if not local:
                    continue
                resolved = (ROOT / name).parent.joinpath(local).resolve()
                if not resolved.is_relative_to(ROOT) or not resolved.is_file():
                    errors.append(f"Broken or outside local link in {name}: {target}")

    policy_rules = set(re.findall(r"^## (E\d+)\.", texts.get("ETHICS.md", ""), re.MULTILINE))
    if policy_rules != {f"E{i}" for i in range(1, 9)}:
        errors.append("Policy must declare exactly E1 through E8")
    covered, ids = set(), set()
    try:
        fixtures = json.loads(texts.get("scenarios.json", ""))
        if set(fixtures) != {"schema_version", "cases"} or fixtures["schema_version"] != 1:
            raise ValueError("Unsupported fixture schema")
        cases = fixtures["cases"]
        if not isinstance(cases, list) or len(cases) < 10:
            raise ValueError("Expected at least ten scenario cases")
        for case in cases:
            if not isinstance(case, dict) or set(case) != {"id", "rules", "setup", "prompt", "required", "forbidden"}:
                raise ValueError("Invalid scenario fields")
            identifier = case["id"]
            if not isinstance(identifier, str) or not re.fullmatch(r"[a-z]+(?:-[a-z]+)*", identifier) or identifier in ids:
                raise ValueError("Invalid or duplicate scenario ID")
            ids.add(identifier)
            for key in ["setup", "prompt"]:
                if not isinstance(case[key], str) or not case[key].strip():
                    raise ValueError(f"{identifier}: invalid {key}")
            for key in ["rules", "required", "forbidden"]:
                values = case[key]
                if not isinstance(values, list) or not values or not all(isinstance(x, str) and x.strip() for x in values):
                    raise ValueError(f"{identifier}: invalid {key}")
            if not set(case["rules"]).issubset(policy_rules):
                raise ValueError(f"{identifier}: unknown rule")
            if set(case["required"]) & set(case["forbidden"]):
                raise ValueError(f"{identifier}: contradictory identical outcomes")
            covered.update(case["rules"])
    except (ValueError, KeyError, TypeError) as exc:
        errors.append(f"Fixture validation failed: {exc}")
    if covered != policy_rules:
        errors.append(f"Uncovered policy rules: {sorted(policy_rules - covered)}")
    if "Copyright (c) 2026 Sunny Patneedi" not in texts.get("LICENSE", ""):
        errors.append("Missing license copyright notice")

    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return 1
    print(f"PASS: {len(actual)} release files; {len(ids)} scenario fixtures; {len(covered)} rules covered.")
    print("Static validation only. No live agent behavior was evaluated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
