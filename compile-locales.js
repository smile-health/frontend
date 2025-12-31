const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIRS = [
  './apps/web',
  './packages/ui'
];
const OUTPUT_DIR = './lang';
const LANGUAGES = ['en', 'id'];

// Utility function to recursively find all locale files
function findLocaleFiles(dir, language) {
  const localeFiles = [];
  
  function searchDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
          // Skip node_modules and other build directories
          if (!['node_modules', '.next', '.turbo', 'dist', 'build'].includes(item.name)) {
            searchDirectory(fullPath);
          }
        } else if (item.isFile() && item.name === `${language}.json`) {
          // Check if this is in a locales directory
          const parentDir = path.basename(path.dirname(fullPath));
          if (parentDir === 'locales') {
            localeFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${currentDir}:`, error.message);
    }
  }
  
  searchDirectory(dir);
  return localeFiles;
}



// Function to merge JSON objects deeply and track duplicates
function mergeDeepWithDuplicateTracking(target, source, duplicates, filePath, keyPath = '') {
  // Ensure target is an object
  if (!target || typeof target !== 'object') {
    target = {};
  }
  
  for (const key in source) {
    const fullKey = keyPath ? `${keyPath}.${key}` : key;
    
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      // Initialize nested object if it doesn't exist
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      mergeDeepWithDuplicateTracking(target[key], source[key], duplicates, filePath, fullKey);
    } else {
      // Check if key already exists (duplicate)
      if (target.hasOwnProperty(key)) {
        if (!duplicates[fullKey]) {
          duplicates[fullKey] = {
            previousValue: target[key],
            previousSource: 'unknown',
            duplicateCount: 1
          };
        } else {
          duplicates[fullKey].duplicateCount++;
        }
        duplicates[fullKey].latestValue = source[key];
        duplicates[fullKey].latestSource = filePath;
      }
      // Always use the latest value (overwrite)
      target[key] = source[key];
    }
  }
  return target;
}

// Function to extract feature name from file path
function getFeatureName(filePath, sourceDir) {
  const relativePath = path.relative(sourceDir, filePath);
  const pathParts = relativePath.split(path.sep);
  
  // Remove 'locales' and language file from the end
  const cleanParts = pathParts.slice(0, -2); // Remove 'locales' and '{language}.json'
  
  if (cleanParts.length > 0) {
    // Use the last meaningful directory as feature name
    const featureName = cleanParts[cleanParts.length - 1];
    
    // If it's a generic name like 'src', use the parent directory
    if (featureName === 'src' && cleanParts.length > 1) {
      return cleanParts[cleanParts.length - 2];
    }
    
    return featureName;
  }
  
  // Fallback to the source directory name
  return path.basename(sourceDir);
}

// Main compilation function
function compileLocales() {
  console.log('🚀 Starting locale compilation...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
  
  for (const language of LANGUAGES) {
    console.log(`\n🌐 Processing language: ${language}`);
    
    const compiledTranslations = {};
    const duplicatedKeys = {};
    const featureFiles = {}; // Track individual feature files
    let fileCount = 0;
    
    for (const sourceDir of SOURCE_DIRS) {
      console.log(`  📂 Scanning directory: ${sourceDir}`);
      
      const localeFiles = findLocaleFiles(sourceDir, language);
      console.log(`  📄 Found ${localeFiles.length} ${language}.json files`);
      
      for (const filePath of localeFiles) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const translations = JSON.parse(content);
          
          // Get feature name for this file
          const featureName = getFeatureName(filePath, sourceDir);
          
          // Copy individual feature file
          const featureFileName = `${featureName}-${language}.json`;
          const featureOutputPath = path.join(OUTPUT_DIR, featureFileName);
          fs.writeFileSync(featureOutputPath, JSON.stringify(translations, null, 2), 'utf8');
          
          // Track feature files for summary
          if (!featureFiles[featureName]) {
            featureFiles[featureName] = [];
          }
          featureFiles[featureName].push(featureFileName);
          
          // Merge for combined file
          mergeDeepWithDuplicateTracking(compiledTranslations, translations, duplicatedKeys, filePath);
          fileCount++;
          
          console.log(`    ✅ ${filePath} -> ${featureFileName}`);
        } catch (error) {
          console.error(`    ❌ Error processing ${filePath}:`, error.message);
        }
      }
    }
    
    // Write compiled file
    const outputFile = path.join(OUTPUT_DIR, `${language}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(compiledTranslations, null, 2), 'utf8');
    
    // Write duplicated keys file
    const duplicatesFile = path.join(OUTPUT_DIR, `${language}-duplicates.json`);
    fs.writeFileSync(duplicatesFile, JSON.stringify(duplicatedKeys, null, 2), 'utf8');
    
    console.log(`  💾 Compiled ${fileCount} files into: ${outputFile}`);
    console.log(`  📊 Total translation keys: ${Object.keys(compiledTranslations).length}`);
    console.log(`  🔄 Duplicated keys: ${Object.keys(duplicatedKeys).length} (saved to ${duplicatesFile})`);
    console.log(`  📋 Individual feature files created:`);
    for (const [feature, files] of Object.entries(featureFiles)) {
      console.log(`    ${feature}: ${files.join(', ')}`);
    }
  }
  
  console.log('\n✨ Locale compilation completed successfully!');
  
  // Generate summary
  console.log('\n📋 Summary:');
  for (const language of LANGUAGES) {
    const outputFile = path.join(OUTPUT_DIR, `${language}.json`);
    const duplicatesFile = path.join(OUTPUT_DIR, `${language}-duplicates.json`);
    const stats = fs.statSync(outputFile);
    const duplicatesStats = fs.statSync(duplicatesFile);
    console.log(`  ${language}.json: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`  ${language}-duplicates.json: ${(duplicatesStats.size / 1024).toFixed(2)} KB`);
  }
}

// Run the compilation
if (require.main === module) {
  compileLocales();
}

module.exports = { compileLocales };