const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupJdk() {
  // 1. Check if system javac is already available
  try {
    const check = spawnSync('javac', ['-version'], { encoding: 'utf-8' });
    if (check.status === 0) {
      console.log('✓ System javac found:', (check.stdout || check.stderr || '').trim());
      return;
    }
  } catch (e) {}

  const jdkDir = path.join(process.cwd(), '.jdk');
  const javacPath = path.join(jdkDir, 'bin', process.platform === 'win32' ? 'javac.exe' : 'javac');

  if (fs.existsSync(javacPath)) {
    console.log('✓ Local JDK found at:', javacPath);
    return;
  }

  // 2. If on Linux (e.g. Render Node environment without root), download portable OpenJDK 17
  if (process.platform === 'linux') {
    console.log('⚡ System javac not found. Downloading OpenJDK 17 for Linux on Render...');
    try {
      fs.mkdirSync(jdkDir, { recursive: true });
      const cmd = `curl -sL "https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse" | tar -xz -C "${jdkDir}" --strip-components=1`;
      const res = spawnSync('sh', ['-c', cmd], { stdio: 'inherit' });
      if (fs.existsSync(javacPath)) {
        try {
          spawnSync('chmod', ['-R', '+x', path.join(jdkDir, 'bin')]);
        } catch {}
        console.log('✓ OpenJDK 17 installed successfully into .jdk');
      } else {
        console.warn('⚠️ Could not complete OpenJDK download via curl/tar. Return code:', res.status);
      }
    } catch (err) {
      console.error('Failed to download OpenJDK:', err.message);
    }
  } else {
    console.log('ℹ️ Non-Linux platform and javac not in system PATH. Ensure JDK 17 is installed locally.');
  }
}

setupJdk();

