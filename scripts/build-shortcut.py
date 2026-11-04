#!/usr/bin/env python3
"""Compile shortcuts/ASMA-Daily.json → public/shortcuts/ASMA-Daily.shortcut (signed when possible)."""

from __future__ import annotations

import json
import plistlib
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "shortcuts" / "ASMA-Daily.json"
OUT_DIR = ROOT / "public" / "shortcuts"
UNSIGNED = OUT_DIR / "ASMA-Daily.unsigned.shortcut"
SIGNED = OUT_DIR / "ASMA-Daily.shortcut"


def main() -> int:
    spec = json.loads(SRC.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with UNSIGNED.open("wb") as f:
        plistlib.dump(spec, f, fmt=plistlib.FMT_BINARY)
    print(f"compiled unsigned: {UNSIGNED}")

    try:
        subprocess.run(
            [
                "shortcuts",
                "sign",
                "--mode",
                "anyone",
                "--input",
                str(UNSIGNED),
                "--output",
                str(SIGNED),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        print(f"signed: {SIGNED}")
        return 0
    except FileNotFoundError:
        print("shortcuts CLI not found — keeping unsigned copy as ASMA-Daily.shortcut", file=sys.stderr)
        SIGNED.write_bytes(UNSIGNED.read_bytes())
        return 0
    except subprocess.CalledProcessError as e:
        print("signing failed (Apple only accepts Shortcuts-app exports):", file=sys.stderr)
        print(e.stderr or e.stdout or e, file=sys.stderr)
        # Still publish unsigned for documentation / Mac re-sign later
        SIGNED.write_bytes(UNSIGNED.read_bytes())
        print(f"wrote unsigned fallback: {SIGNED}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
