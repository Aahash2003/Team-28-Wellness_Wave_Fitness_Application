const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths
const source = path.join(__dirname, 'build');
const destination = path.join(__dirname, 'src/server', 'build');

// Check if source exists
if (!fs.existsSync(source)) {
    console.error('Source folder does not exist:', source);
    process.exit(1);
}

// Ensure the destination directory exists and move the build folder
fs.ensureDirSync(destination);
fs.move(source, destination, { overwrite: true }, err => {
    if (err) {
        console.error('Error moving build folder:', err);
    } else {
        console.log('Build folder moved successfully to', destination);
    }
});
