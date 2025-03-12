import fs from 'fs';
import chokidar from 'chokidar';

if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

// Cloud Upload Function
const uploadToCloud = (filePath) => {
    // read file and sync here
};

// Watch for new files in `/uploads` folder
chokidar.watch('./uploads',
    {
        persistent: true,
        depth: 1,
        ignored: ['*.log'],

    }
)
    .on('add', (filePath) => {
            console.log(`📂 New file detected: ${filePath}`);
            uploadToCloud(filePath);
    })
    .on('error', (error) => console.error(`❌ Watcher Error: ${error.message}`))
    .on('ready', () => console.log('🚀 Continuous sync started...'));;

// ✅ add → When a new file is added.
// ✅ change → When an existing file is modified.
// ✅ unlink → When a file is deleted.
// ✅ addDir → When a new directory is created.
// ✅ unlinkDir → When a directory is deleted.
// ✅ error → When an error occurs.
// ✅ ready → When the initial scan is complete.
// ✅ raw → Internal event tracking for debugging.

// Start Sync Process
console.log('🚀 Sync service is running... Monitoring `/uploads` folder for changes.');
