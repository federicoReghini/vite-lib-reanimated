import fs from "fs";
import path from "path";

const sourcePath = "./dist/dist";
const destinationPath = "./dist";

function moveFilesRecursively(source, destination) {
  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourceFilePath = path.join(source, file);
    const destinationFilePath = path.join(destination, file);

    if (fs.statSync(sourceFilePath).isDirectory()) {
      // If it's a directory, recursively move its contents
      fs.mkdirSync(destinationFilePath, { recursive: true });
      moveFilesRecursively(sourceFilePath, destinationFilePath);
    } else {
      // If it's a file, move it
      fs.renameSync(sourceFilePath, destinationFilePath);
    }
  });

  // Remove the empty source directory
  fs.rmdirSync(source);
}

moveFilesRecursively(sourcePath, destinationPath);
