#!/usr/bin/env python3
# Copyright (c) 2023-2026 Datalayer, Inc.
#
# Datalayer License

"""
Extract one SVG per AWS Architecture Icon: the top ones into ``svg/aws``,
built into the package, every other one into ``svg/aws2``, kept in the
repository and left out of the package.

The AWS Architecture Icons package (https://aws.amazon.com/architecture/icons/)
ships each icon in several sizes (16, 32, 48, 64) and, for some resource
icons, in light and dark variants. This keeps one file per icon: the largest
size there is, the light (or plain) variant, never the dark one.

Names say what kind of icon it is, so that none clashes with another set:

- ``Arch_<Service>_<size>.svg``        -> ``aws-<service>.svg``
- ``Res_<Resource>_<size>.svg``        -> ``aws-res-<resource>.svg``
- ``Arch-Category_<Category>_<size>``  -> ``aws-category-<category>.svg``
- an architecture group icon           -> ``aws-group-<group>.svg``

Usage:
    python svg/extract_aws.py <unzipped AWS icon package>

To build another icon into the package, add its name to ``TOP`` and run it again.
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

#: The icons built into the package (``svg/aws``): the services Datalayer's
#: agents run on and watch, and AWS's own mark. Every other one is kept in
#: ``svg/aws2``, which is not built.
TOP = (
    "aws-amazon-bedrock-agentcore",
    "aws-amazon-bedrock",
    "aws-amazon-elastic-kubernetes-service",
    "aws-amazon-ec2",
    "aws-amazon-simple-storage-service",
    "aws-aws-lambda",
    "aws-aws-identity-and-access-management",
    "aws-amazon-cloudwatch",
    "aws-aws-cost-explorer",
    "aws-aws-marketplace-light",
    "aws-amazon-elastic-container-registry",
    "aws-amazon-rds",
    "aws-amazon-dynamodb",
    "aws-aws-cloudformation",
    "aws-aws-organizations",
    "aws-aws-security-hub",
    "aws-aws-trusted-advisor",
    "aws-aws-compute-optimizer",
    "aws-amazon-sagemaker-ai",
    "aws-group-aws-cloud-logo",
)

#: Sizes in order of preference, the largest first.
SIZES = ("64", "48", "32", "16")

SUFFIX = re.compile(r"_(?P<size>16|32|48|64)(?:_(?P<theme>Dark|Light))?$")


def kebab(name: str) -> str:
    """``Amazon-Elastic-Kubernetes-Service_EKS-Anywhere`` -> ``amazon-elastic-kubernetes-service-eks-anywhere``."""
    name = re.sub(r"[^A-Za-z0-9]+", "-", name)
    return re.sub(r"-+", "-", name).strip("-").lower()


def classify(path: Path) -> tuple[str, str, str] | None:
    """The icon's output name, its size and its theme, or None when it is not an icon of the set."""
    stem = path.stem
    match = SUFFIX.search(stem)
    size, theme = (match.group("size"), match.group("theme") or "") if match else ("", "")
    base = stem[: match.start()] if match else stem
    parts = path.parts
    if base.startswith("Arch-Category_"):
        name = "aws-category-" + kebab(base[len("Arch-Category_") :])
    elif base.startswith("Arch_"):
        name = "aws-" + kebab(base[len("Arch_") :])
    elif base.startswith("Res_"):
        name = "aws-res-" + kebab(base[len("Res_") :])
    elif any(part.startswith("Architecture-Group-Icons") for part in parts):
        name = "aws-group-" + kebab(base)
    else:
        return None
    return name, size, theme


def rank(size: str, theme: str) -> tuple[int, int]:
    """Lower is better: the largest size first, then the plain variant before the light one."""
    size_rank = SIZES.index(size) if size in SIZES else len(SIZES)
    theme_rank = {"": 0, "Light": 1}.get(theme, 2)
    return size_rank, theme_rank


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    parser.add_argument("package", type=Path)
    parser.add_argument("--out", type=Path, default=Path(__file__).parent / "aws")
    parser.add_argument("--rest", type=Path, default=Path(__file__).parent / "aws2")
    args = parser.parse_args()

    if not args.package.is_dir():
        print(f"{args.package} is not a directory", file=sys.stderr)
        return 1

    chosen: dict[str, tuple[tuple[int, int], Path]] = {}
    for path in sorted(args.package.rglob("*.svg")):
        if "__MACOSX" in path.parts or path.name.startswith("._"):
            continue
        found = classify(path)
        if found is None:
            continue
        name, size, theme = found
        if theme == "Dark":
            continue
        key = rank(size, theme)
        if name not in chosen or key < chosen[name][0]:
            chosen[name] = (key, path)

    missing = [name for name in TOP if name not in chosen]
    if missing:
        print(f"Not in this package: {', '.join(missing)}: TOP names an icon AWS no longer ships", file=sys.stderr)
        return 1
    for folder in (args.out, args.rest):
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)
    for name, (_, path) in sorted(chosen.items()):
        shutil.copyfile(path, (args.out if name in TOP else args.rest) / f"{name}.svg")

    kinds: dict[str, int] = {}
    for name in chosen:
        kind = (
            "category" if name.startswith("aws-category-")
            else "resource" if name.startswith("aws-res-")
            else "group" if name.startswith("aws-group-")
            else "service"
        )
        kinds[kind] = kinds.get(kind, 0) + 1
    print(
        f"{len(chosen)} icons ({', '.join(f'{v} {k}' for k, v in sorted(kinds.items()))}): "
        f"{len(TOP)} into {args.out}, {len(chosen) - len(TOP)} into {args.rest}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
