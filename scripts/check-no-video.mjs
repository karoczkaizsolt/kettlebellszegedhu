// Fails when a video file is tracked or staged in Git. Used by the pre-commit hook
// and can be run in CI (`npm run check:no-video`). Video files never go to Git.
import { execFileSync } from 'node:child_process';

const VIDEO = /\.(mp4|m4v|mov|webm|mkv|avi|mpg|mpeg|wmv|flv)$/i;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean);

let tracked = [];
let staged = [];
try {
  tracked = git('ls-files');
  staged = git('diff', '--cached', '--name-only', '--diff-filter=ACMR');
} catch {
  console.error('check-no-video: not a Git repository or Git is unavailable.');
  process.exit(2);
}

const offenders = [...new Set([...tracked, ...staged])].filter((f) => VIDEO.test(f));
if (offenders.length > 0) {
  console.error('\nVideo files must never be committed to Git:\n  ' + offenders.join('\n  '));
  console.error('\nUnstage with: git rm --cached <file>  (keep the file on disk). See CLAUDE.md section 4.\n');
  process.exit(1);
}
console.log('check-no-video: OK (no video files tracked or staged).');
