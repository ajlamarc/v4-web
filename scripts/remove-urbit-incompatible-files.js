import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
// .ts will remove .d.ts files (it's only matching last extension)
const extensionsToRemove = ['.ts', '.cur']; // Add the file extensions you want to remove

function removeFileExtensions(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      removeFileExtensions(filePath);
    } else if (extensionsToRemove.includes(path.extname(file))) {
      fs.unlinkSync(filePath);
      console.log(`Removed file: ${filePath}`);
    }
  }
}

removeFileExtensions(distDir);
