# dit

`dit` similar idea to [degit](https://github.com/Rich-Harris/degit) but for private repos too, using git-native clone

## Usage

```bash
npx @shriek/dit <repository> <destination> [--ref <branch|tag|commit>]
```

### Examples

```bash
# default remote branch behavior (git-native)
dit https://github.com/org/template.git my-app

# shorthand GitHub repo (auto-expanded to git@github.com:org/template.git)
dit org/template my-app

# pin to tag
dit https://github.com/org/template.git my-app --ref v1.2.0

# pin to commit
dit git@github.com:org/template.git my-app --ref 3b8f4a2
```

## Not supported
- Submodule handling
- Git LFS-specific handling
- Custom auth flows

## Development

Run tests:

```bash
pnpm test
```

Run locally without publishing:

```bash
node main.mjs <repository> <destination> [--ref <branch|tag|commit>]
```
