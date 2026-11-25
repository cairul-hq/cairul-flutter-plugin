import { counts, list, option, selectors, stdout, value } from '@cairul/plugin-kit/runner';

function summarize(output) {
  const results = counts();
  let complete = false;
  for (const line of output.split(/\r?\n/)) {
    if (!line.startsWith('{')) continue;
    const event = JSON.parse(line);
    if (event.type === 'done') complete = true;
    if (event.type !== 'testDone' || event.hidden) continue;
    if (event.skipped) results.skipped++;
    else if (event.result === 'success') results.passed++;
    else results.failed++;
  }
  if (!complete) throw new Error('Flutter returned an incomplete test event stream.');
  return results;
}

export default {
  command: ['flutter'],
  select: selectors({ paths: list, namePattern: value, nameIncludes: value, device: value }, [
    'paths',
    'namePattern',
    'nameIncludes',
  ]),
  build({ paths, namePattern, nameIncludes, device }) {
    if (namePattern && nameIncludes) throw new Error('Choose a name pattern or substring.');
    return {
      args: [
        'test',
        '--machine',
        ...option('--name', namePattern),
        ...option('--plain-name', nameIncludes),
        ...option('-d', device),
        ...(paths ?? []),
      ],
      capture: true,
      read: stdout(summarize),
    };
  },
};
