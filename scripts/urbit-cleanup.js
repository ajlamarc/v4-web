import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
// .ts will remove .d.ts files (it's only matching last extension)
const extensionsToRemove = ['.ts', '.cur', '.md']; // Add the file extensions you want to remove

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

function moveIndexHtmlToRoot(dir) {
  // move /entry-points/index.html to /index.html
  const indexHtmlPath = path.join(distDir, 'entry-points', 'index.html');
  const indexHtmlDestPath = path.join(distDir, 'index.html');
  fs.renameSync(indexHtmlPath, indexHtmlDestPath);
  console.log(`Moved index.html to root: ${indexHtmlDestPath}`);
}

function makeAllFileNamesLowercase(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      makeAllFileNamesLowercase(filePath);
    } else {
      const lowercaseFile = file.toLowerCase();
      if (file !== lowercaseFile) {
        const lowercaseFilePath = path.join(dir, lowercaseFile);
        fs.renameSync(filePath, lowercaseFilePath);
        console.log(`Renamed file: ${filePath} -> ${lowercaseFilePath}`);

        // Replace references in all files within the dist/ directory
        replaceFileReferences(distDir, file, lowercaseFile);
      }
    }
  }
}

function replaceFileReferences(dir, oldFileName, newFileName) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceFileReferences(filePath, oldFileName, newFileName);
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const updatedContent = fileContent.split(oldFileName).join(newFileName);
      if (fileContent !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated references in file: ${filePath}`);
      }
    }
  }
}

removeFileExtensions(distDir);
moveIndexHtmlToRoot(distDir);
makeAllFileNamesLowercase(distDir);
