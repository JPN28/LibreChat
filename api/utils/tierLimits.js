const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Load tiers.yaml from config folder
let limits = {};
let models = [];

try {
  const file = fs.readFileSync(path.join(__dirname, '..', 'config', 'tiers.yaml'), 'utf8');
  const config = yaml.load(file);
  limits = config.limits || {};
  models = config.models || [];
} catch (err) {
  console.error('[TierConfig] Failed to load limits:', err.message);
}

function getLimitsForRole(role) {
  return limits[role] || limits['LITE'];
}

function getModelsForRole(role) {
  return models.filter((m) => m.roles.includes(role));
}

module.exports = {
  getLimitsForRole,
  getModelsForRole,
};
