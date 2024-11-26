'use client';

import { useState, useEffect } from 'react';

interface BookmarkFolder {
  id: string;
  title: string;
  children?: BookmarkFolder[];
}

interface FolderSelectorProps {
  onSelect: (folderId: string) => void;
}

export default function FolderSelector({ onSelect }: FolderSelectorProps) {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarkFolders = async () => {
      try {
        // Using Chrome's bookmarks API
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          const extractFolders = (nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkFolder[] => {
            return nodes
              .filter(node => !node.url) // Only folders
              .map(node => ({
                id: node.id,
                title: node.title,
                children: node.children ? extractFolders(node.children) : undefined
              }));
          };

          setFolders(extractFolders(bookmarkTreeNodes));
          setLoading(false);
        });
      } catch (error) {
        console.error('Error loading bookmark folders:', error);
        setLoading(false);
      }
    };

    loadBookmarkFolders();
  }, []);

  const renderFolder = (folder: BookmarkFolder, depth = 0) => (
    <div key={folder.id} style={{ marginLeft: `${depth * 16}px` }}>
      <button
        onClick={() => onSelect(folder.id)}
        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="text-gray-600">📁</span> {folder.title}
      </button>
      {folder.children?.map(child => renderFolder(child, depth + 1))}
    </div>
  );

  if (loading) {
    return <div className="text-gray-600">Loading folders...</div>;
  }

  return (
    <div className="max-h-[200px] overflow-y-auto border rounded-lg p-2">
      {folders.map(folder => renderFolder(folder))}
    </div>
  );
}
