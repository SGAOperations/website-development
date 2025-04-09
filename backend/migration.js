const fs = require('fs');

function transformData(oldData) {
  const userMap = new Map(); // Using Map to track users by name
  
  // Handle both array and single object cases
  const inputArray = Array.isArray(oldData) ? oldData : [oldData];
  
  inputArray.forEach(oldUser => {
    const userName = oldUser.name;
    
    if (!userMap.has(userName)) {
      // Create new user entry if it doesn't exist
      userMap.set(userName, {
        _id: oldUser._id, // Keep the first _id encountered
        name: userName,
        pictureUrl: oldUser.pictureUrl || '',
        positions: []
      });
    }
    
    // Get the user record
    const userRecord = userMap.get(userName);
    
    // Update picture URL if the new one exists and is different
    if (oldUser.pictureUrl && oldUser.pictureUrl !== userRecord.pictureUrl) {
      userRecord.pictureUrl = oldUser.pictureUrl;
    }
    
    // Add the position
    userRecord.positions.push({
      title: oldUser.position || '',
      divisionName: oldUser.divisionName,
      role: oldUser.role,
      blurb: '', // default empty
      links: ''  // default empty
    });
  });
  
  // Convert Map values to array
  return Array.from(userMap.values());
}

function migrateJsonFile(inputFile, outputFile) {
  try {
    // Read the input file
    const rawData = fs.readFileSync(inputFile);
    const oldData = JSON.parse(rawData);
    
    // Transform the data
    const newData = transformData(oldData);
    
    // Write the output file
    fs.writeFileSync(outputFile, JSON.stringify(newData, null, 2));
    
    console.log(`Successfully merged and migrated data. Output saved to ${outputFile}`);
    console.log(`Merged ${Array.isArray(oldData) ? oldData.length : 1} records into ${newData.length} unique users`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Usage: node merge_migrate.js input.json output.json
const [inputFile, outputFile] = process.argv.slice(2);
if (!inputFile || !outputFile) {
  console.log('Usage: node merge_migrate.js <input-file.json> <output-file.json>');
  process.exit(1);
}

migrateJsonFile(inputFile, outputFile);