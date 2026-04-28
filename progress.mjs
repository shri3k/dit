const ANSI = {
  clearLine: '\x1b[2K',
  carriage: '\r',
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
};

export default function progress(totalSteps, enabled) {
  const width = 10;

  function render(completedSteps) {
    if (!enabled) return;

    const ratio = totalSteps === 0 ? 1 : completedSteps / totalSteps;
    const filled = Math.round(ratio * width);
    const percent = Math.round(ratio * 100);
    const bar = `${'#'.repeat(filled)}${'-'.repeat(width - filled)}`;

    process.stdout.write(
      `${ANSI.clearLine}${ANSI.carriage}${ANSI.cyan}[${bar}]${ANSI.reset} ${String(percent).padStart(3)}%`
    );
  }

  function finish(label = 'Done') {
    if (!enabled) return;
    render(totalSteps, label);
    process.stdout.write(`\n${ANSI.green}✔ Complete${ANSI.reset}\n`);
  }

  function abort() {
    if (!enabled) return;
    process.stdout.write('\n');
  }

  return { render, finish, abort };
}
