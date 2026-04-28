import { DitError } from './errors.mjs';

export const USAGE = `Usage: node main.mjs <repository> <destination> [--ref <branch|tag|commit>]\n\nExamples:\n  node main.mjs https://github.com/org/template.git my-app\n  node main.mjs git@github.com:org/template.git my-app --ref v1.2.0`;

function normalizeRepository(repository) {
  if (
    repository.startsWith('git@') ||
    repository.startsWith('https://') ||
    repository.startsWith('http://') ||
    repository.startsWith('git://') ||
    repository.startsWith('ssh://')
  ) {
    return repository;
  }

  return `git@github.com:${repository}.git`;
}

export function parseArgs(argv) {
  const positional = [];
  let ref = null;

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--ref' || token === '-r') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        throw new DitError('REF_REQUIRED', '--ref requires a value.', {
          hint: 'Pass a branch, tag, or commit hash after --ref.',
        });
      }
      ref = value;
      i += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      return { help: true };
    }

    if (token.startsWith('-')) {
      throw new DitError('UNKNOWN_OPTION', `Unknown option: ${token}`, {
        hint: USAGE,
      });
    }

    positional.push(token);
  }

  if (positional.length < 1) {
    throw new DitError('REPOSITORY_REQUIRED', 'Repository is required.', {
      hint: USAGE,
    });
  }

  if (positional.length < 2) {
    throw new DitError(
      'DESTINATION_REQUIRED',
      'Destination directory is required.',
      {
        hint: USAGE,
      }
    );
  }

  return {
    repository: normalizeRepository(positional[0]),
    destination: positional[1],
    ref,
  };
}

export { normalizeRepository };

export default parseArgs;
