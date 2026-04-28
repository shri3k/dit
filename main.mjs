#!/usr/bin/env node
import { $ } from 'zx';

import parseArgs, { USAGE } from './cli.mjs';
import progressBar from './progress.mjs';

$.verbose = process.env.DIT_VERBOSE === '1';
$.quiet = !$.verbose;

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.help) {
    console.log(USAGE);
    return;
  }

  const tmpName = Math.random().toString(36).substring(2, 15);
  const tmpPath = `/tmp/${tmpName}`;

  const steps = [
    {
      label: 'Cloning repository',
      run: async () => $`git clone --depth=1 ${args.repository} ${tmpPath}`,
    },
    ...(args.ref
      ? [
          {
            label: `Checking out ref ${args.ref}`,
            run: async () => $`git -C ${tmpPath} checkout ${args.ref}`,
          },
        ]
      : []),
    {
      label: 'Removing git metadata',
      run: async () => $`rm -rf ${tmpPath}/.git`,
    },
    {
      label: 'Moving files to destination',
      run: async () => $`mv ${tmpPath} ${args.destination}`,
    },
    {
      label: 'Cleaning up temporary files',
      run: async () => $`rm -rf ${tmpPath}`,
    },
  ];

  const progress = progressBar(
    steps.length,
    process.stdout.isTTY && !$.verbose
  );
  progress.render(0, 'Starting');

  try {
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      progress.render(i, step.label);
      await step.run();
      progress.render(i + 1, step.label);
    }

    progress.finish();
  } catch (error) {
    // Cleanup any leftover temporary files on error
    await steps[steps.length - 1].run();

    progress.abort();
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default main;
