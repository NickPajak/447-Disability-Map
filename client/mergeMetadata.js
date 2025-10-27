// mergeMetadata.js
const fs = require("fs");
const path = require("path");

const metadataDir = path.join(process.cwd(), "public", "metadata");
const outputFile = path.join(metadataDir, "metadata.json");

const files = fs.readdirSync(metadataDir).filter(f => f.endsWith(".json") && f !== "index.json");

const combined = {};

for (const file of files) {
  const filePath = path.join(metadataDir, file);
  const content = fs.readFileSync(filePath, "utf8").trim();

  if (!content) {
    console.warn(`⚠️ Skipping empty file: ${file}`);
    continue;
  }

  try {
    const data = JSON.parse(content);
    if (data.building_id) {
      combined[data.building_id] = data;
    }
  } catch (err) {
    console.error(`❌ Error parsing JSON in file ${file}:`, err);
  }
}


fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2));
console.log(`✅ Combined ${files.length} files into metadata.json`);