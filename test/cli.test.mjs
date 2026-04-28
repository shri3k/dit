import assert from 'node:assert/strict';
import test from 'node:test';

import { parseArgs } from '../cli.mjs';
import { DitError } from '../errors.mjs';

test('parseArgs parses repository and destination', () => {
  assert.deepEqual(parseArgs(['repo-url', 'my-app']), {
    repository: 'repo-url',
    destination: 'my-app',
    ref: null,
  });
});

test('parseArgs parses --ref', () => {
  assert.deepEqual(parseArgs(['repo-url', 'my-app', '--ref', 'v1.2.0']), {
    repository: 'repo-url',
    destination: 'my-app',
    ref: 'v1.2.0',
  });
});

test('parseArgs parses -r shorthand', () => {
  assert.deepEqual(parseArgs(['repo-url', 'my-app', '-r', 'main']), {
    repository: 'repo-url',
    destination: 'my-app',
    ref: 'main',
  });
});

test('parseArgs handles --help', () => {
  assert.deepEqual(parseArgs(['--help']), { help: true });
});

test('parseArgs throws when repository is missing', () => {
  assert.throws(
    () => parseArgs([]),
    (error) => error instanceof DitError && error.code === 'REPOSITORY_REQUIRED'
  );
});

test('parseArgs throws when destination is missing', () => {
  assert.throws(
    () => parseArgs(['repo-url']),
    (error) => error instanceof DitError && error.code === 'DESTINATION_REQUIRED'
  );
});

test('parseArgs throws for unknown options', () => {
  assert.throws(
    () => parseArgs(['repo-url', 'my-app', '--nope']),
    (error) => error instanceof DitError && error.code === 'UNKNOWN_OPTION'
  );
});

test('parseArgs throws when --ref has no value', () => {
  assert.throws(
    () => parseArgs(['repo-url', 'my-app', '--ref']),
    (error) => error instanceof DitError && error.code === 'REF_REQUIRED'
  );
});
