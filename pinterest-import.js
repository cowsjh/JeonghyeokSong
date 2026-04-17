'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parse } = require('csv-parse/sync');

const GALLERY_DIR = path.join(__dirname, 'gallery');
const EXPORT_DIR = process.argv[2];

if (!EXPORT_DIR) {
  console.error('Usage: node pinterest-import.js <export-folder-path>');
  process.exit(1);
}

if (!fs.existsSync(EXPORT_DIR)) {
  console.error(`Export folder not found: ${EXPORT_DIR}`);
  process.exit(1);
}

const boardsPath = path.join(EXPORT_DIR, 'boards.csv');
const pinsPath = path.join(EXPORT_DIR, 'pins.csv');

if (!fs.existsSync(boardsPath)) {
  console.error(`boards.csv not found in ${EXPORT_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(pinsPath)) {
  console.error(`pins.csv not found in ${EXPORT_DIR}`);
  process.exit(1);
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true });
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getImageExtension(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : 'jpg';
  } catch {
    return 'jpg';
  }
}

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ Already exists: ${path.basename(filePath)}`);
      resolve();
      return;
    }

    https.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ Downloaded: ${path.basename(filePath)}`);
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('Parsing boards.csv...');
  const boards = parseCSV(boardsPath);
  const boardMap = {};
  boards.forEach((row) => {
    const id = row['Board Id'] || row['board_id'] || row['Board id'];
    const name = row['Board name'] || row['board_name'] || row['Name'];
    if (id && name) {
      boardMap[id] = sanitizeFileName(name);
    }
  });
  console.log(`Found ${Object.keys(boardMap).length} board(s)\n`);

  console.log('Parsing pins.csv...');
  const pins = parseCSV(pinsPath);
  const pinsByBoard = {};
  pins.forEach((row) => {
    const boardId = row['Board Id'] || row['board_id'] || row['Board id'];
    const imageUrl = row['Image Url'] || row['image_url'] || row['Image url'];
    if (boardId && imageUrl && boardMap[boardId]) {
      const boardName = boardMap[boardId];
      if (!pinsByBoard[boardName]) {
        pinsByBoard[boardName] = [];
      }
      pinsByBoard[boardName].push(imageUrl);
    }
  });

  let totalImages = 0;
  for (const board of Object.keys(pinsByBoard).sort()) {
    totalImages += pinsByBoard[board].length;
  }
  console.log(`Found ${totalImages} pin(s) across ${Object.keys(pinsByBoard).length} board(s)\n`);

  for (const boardName of Object.keys(pinsByBoard).sort()) {
    const boardDir = path.join(GALLERY_DIR, boardName);
    if (!fs.existsSync(boardDir)) {
      fs.mkdirSync(boardDir, { recursive: true });
      console.log(`Created: ${boardName}/`);
    }

    const urls = pinsByBoard[boardName];
    console.log(`Downloading ${urls.length} pin(s) to ${boardName}/...`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const ext = getImageExtension(url);
      const fileName = `pin-${String(i + 1).padStart(3, '0')}.${ext}`;
      const filePath = path.join(boardDir, fileName);

      try {
        await downloadImage(url, filePath);
      } catch (err) {
        console.error(`  ✗ Failed: ${fileName} — ${err.message}`);
      }
    }
    console.log('');
  }

  console.log('✓ Import complete!');
  console.log('Next: node gallery-sync.js');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
