# dit

`dit` is a tiny scaffolding CLI for copying a git repository into a new directory **without inheriting git history**.

It supports any git-compatible remote (GitHub, GitLab, Bitbucket, self-hosted, local path), optional branch/tag/commit refs, and uses your existing system git authentication.

## What it does

1. Validates destination directory input
2. Clones the repository
3. Optionally checks out a specific ref (`branch`, `tag`, or `commit`)
4. Removes the cloned `.git` metadata

Result: plain project files, no upstream history relics.

## Requirements

- Node.js (ESM-compatible)
- `git` in `PATH`
- `pnpm` (for dependency install)

## Install

```bash
pnpm install
```

## Usage

```bash
node main.mjs <repository> <destination> [--ref <branch|tag|commit>]
```

### Examples

```bash
# default remote branch behavior (git-native)
node main.mjs https://github.com/org/template.git my-app

# pin to tag
node main.mjs https://github.com/org/template.git my-app --ref v1.2.0

# pin to commit
node main.mjs git@github.com:org/template.git my-app --ref 3b8f4a2
```

## Behavior

- Destination is required
- Destination must be empty (or not yet created, with existing parent directory)
- Uses system git auth as-is (SSH agent, credential manager, PAT, etc.)
- Does **not** run `git init` after scaffolding

## Out of scope (v1)

- Submodule handling
- Git LFS-specific handling
- Custom auth flows

## Development

Run tests:

```bash
pnpm test
```

Implementation uses [`zx`](https://github.com/google/zx) for git command orchestration.
