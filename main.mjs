#!/usr/bin/env node
import { $ } from 'zx';

import parseArgs, { USAGE } from './cli.mjs';

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.help) {
    console.log(USAGE);
    return;
  }

  const tmpName = Math.random().toString(36).substring(2, 15);

  // Clone git
  await $`git clone --depth=1 ${args.repository} /tmp/${tmpName}`;

  if (args.ref) {
    await $`git -C /tmp/${tmpName} checkout ${args.ref}`;
  }

  // Remove .git
  await $`rm -rf /tmp/${tmpName}/.git`;

  // Move to destination
  await $`mv /tmp/${tmpName} ${args.destination}`;

  // Cleanup
  await $`rm -rf /tmp/${tmpName}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default main;
