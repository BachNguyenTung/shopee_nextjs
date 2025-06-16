const fs = require('fs');
const path = require('path');

// Read next.config.js and extract CSP
async function extractCSPFromNextConfig() {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfig = require(nextConfigPath);

  // Find the CSP header in the config
  const headersConfig = nextConfig.headers ? await nextConfig.headers() : [];

  // Find the main CSP configuration
  const mainConfig = headersConfig.find(h => h.source === '/(.*)')
  if (!mainConfig) {
    throw new Error('Main header configuration not found');
  }

  const cspHeader = mainConfig.headers.find(h => h.key === 'Content-Security-Policy');
  if (!cspHeader) {
    throw new Error('CSP header not found in next.config.js');
  }

  // Clean up the CSP value by removing extra whitespace
  const cleanCspValue = cspHeader.value.replace(/\s+/g, ' ').trim();
  return cleanCspValue;
}

// Update or create vercel.json with the CSP
function updateVercelJson(cspValue) {
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  let vercelConfig = {
    framework: "nextjs",
    buildCommand: "./install-packages.sh && npm run build:production",
    outputDirectory: ".next",
    headers: []
  };

  // Try to read existing vercel.json
  try {
    if (fs.existsSync(vercelJsonPath)) {
      vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    }
  } catch (error) {
    console.warn('Could not read existing vercel.json, using default config');
  }

  // Ensure headers array exists
  vercelConfig.headers = vercelConfig.headers || [];

  // Find existing CSP header configuration
  const cspHeaderIndex = vercelConfig.headers.findIndex(
    h => h.source === '/(.*)'
  );

  const cspHeaderConfig = {
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: cspValue
      }
    ]
  };

  if (cspHeaderIndex >= 0) {
    // Update existing CSP header while preserving other headers
    const existingHeaders = vercelConfig.headers[cspHeaderIndex].headers || [];
    const otherHeaders = existingHeaders.filter(h => h.key !== 'Content-Security-Policy');
    cspHeaderConfig.headers = [...otherHeaders, cspHeaderConfig.headers[0]];
    vercelConfig.headers[cspHeaderIndex] = cspHeaderConfig;
  } else {
    // Add new CSP header config
    vercelConfig.headers.push(cspHeaderConfig);
  }

  // Write updated config back to vercel.json
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log('Successfully updated vercel.json with CSP from next.config.js');
}

async function main() {
  try {
    const csp = await extractCSPFromNextConfig();
    updateVercelJson(csp);
  } catch (error) {
    console.error('Error syncing CSP:', error.message);
    process.exit(1);
  }
}

main();
