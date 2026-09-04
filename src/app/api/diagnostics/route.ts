import { NextResponse } from 'next/server';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

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


  const localJdkBin = path.join(process.cwd(), '.jdk', 'bin');
  const localJavacPath = path.join(localJdkBin, process.platform === 'win32' ? 'javac.exe' : 'javac');
  const localJavaPath = path.join(localJdkBin, process.platform === 'win32' ? 'java.exe' : 'java');

  const javacCheck = checkCommand(fs.existsSync(localJavacPath) ? localJavacPath : 'javac', ['-version']);
  const javaCheck = checkCommand(fs.existsSync(localJavaPath) ? localJavaPath : 'java', ['-version']);
  const pythonCheck = checkCommand('python3', ['--version']);

  return NextResponse.json({
    status: 'ok',
    buildTimestamp: new Date().toISOString(),
    environment: {
      platform: process.platform,
      nodeVersion: process.version,
      hasLocalJdk: fs.existsSync(localJavacPath)
    },
    tools: {
      javac: javacCheck,
      java: javaCheck,
      python3: pythonCheck
    }
  });

}
