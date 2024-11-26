import { classifyBookmark } from './classifier.js';

// Listen for bookmark creation
chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (bookmark.url) {
    try {
      const category = await classifyBookmark(bookmark.url);
      await moveBookmarkToFolder(id, category);
    } catch (error) {
      console.error('Error processing bookmark:', error);
    }
  }
});

// Find or create a folder for the category
async function findOrCreateFolder(category) {
  const bookmarks = await chrome.bookmarks.getTree();
  const root = bookmarks[0];
  
  // Search for existing category folder
  const folders = await chrome.bookmarks.search({ title: category });
  for (const folder of folders) {
    if (!folder.url) { // If it's a folder (not a bookmark)
      return folder.id;
    }
  }
  
  // Create new folder if not found
  const newFolder = await chrome.bookmarks.create({
    parentId: root.id,
    title: category
  });
  return newFolder.id;
}

// Move bookmark to appropriate folder
async function moveBookmarkToFolder(bookmarkId, category) {
  try {
    const folderId = await findOrCreateFolder(category);
    await chrome.bookmarks.move(bookmarkId, { parentId: folderId });
  } catch (error) {
    console.error('Error moving bookmark:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'organizeAll') {
    organizeAllBookmarks();
  }
});

// Function to organize all existing bookmarks
async function organizeAllBookmarks() {
  try {
    const bookmarks = await chrome.bookmarks.getTree();
    await processBookmarkNode(bookmarks[0]);
  } catch (error) {
    console.error('Error organizing bookmarks:', error);
  }
}

// Recursively process bookmark nodes
async function processBookmarkNode(node) {
  if (node.url) {
    try {
      const category = await classifyBookmark(node.url);
      await moveBookmarkToFolder(node.id, category);
    } catch (error) {
      console.error('Error processing bookmark:', error);
    }
  }
  
  if (node.children) {
    for (const child of node.children) {
      await processBookmarkNode(child);
    }
  }
}
