import { testRunner } from '@cairul/plugin-kit/runner';
import adapter from './run.mjs';
import { junit, testPlugin } from '@cairul/plugin-kit/reports';

const reports = testPlugin('flutter.passed', { junit });

export default testRunner(reports, 'flutter.run', adapter);
