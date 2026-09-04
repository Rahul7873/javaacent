import { NextResponse } from 'next/server';
import { spawnSync } from 'child_process';

export async function GET() {
  const checkCommand = (cmd: string, args: string[]) => {
    try {
      const res = spawnSync(cmd, args, { encoding: 'utf-8', timeout: 5000 });
      return {
        installed: res.status === 0,
        stdout: (res.stdout || '').trim(),
        stderr: (res.stderr || '').trim(),
        error: res.error ? res.error.message : null
      };
    } catch (e: any) {
      return {
        installed: false,
        error: e?.message || 'Failed to execute command'
      };
    }
  };

  const javacCheck = checkCommand('javac', ['-version']);
  const javaCheck = checkCommand('java', ['-version']);
  const pythonCheck = checkCommand('python3', ['--version']);

  return NextResponse.json({
    status: 'ok',
    deployedCommit: '48e2265-perf-judge',
    buildTimestamp: new Date().toISOString(),
    environment: {
      platform: process.platform,
      nodeVersion: process.version,
      isDocker: process.platform === 'linux'
    },
    tools: {
      javac: javacCheck,
      java: javaCheck,
      python3: pythonCheck
    }
  });
}
