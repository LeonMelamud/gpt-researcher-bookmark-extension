'use client';

import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category?: string;
}

interface BookmarkListProps {
  folderId: string;
  bookmarks: Bookmark[];
}

export default function BookmarkList({ folderId, bookmarks: initialBookmarks }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [loading, setLoading] = useState(false);
  const [organizing, setOrganizing] = useState(false);

  useEffect(() => {
    if (folderId) {
      loadBookmarks();
    }
  }, [folderId]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      // Using Chrome's bookmarks API
      chrome.bookmarks.getChildren(folderId, (results) => {
        const bookmarks = results
          .filter(node => node.url) // Only bookmarks with URLs
          .map(node => ({
            id: node.id,
            title: node.title,
            url: node.url || '',
          }));
        setBookmarks(bookmarks);
      });
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeBookmarks = async () => {
    setOrganizing(true);
    try {
      // Get categories for all bookmarks
      const response = await fetch('http://localhost:8000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: bookmarks.map(b => b.url)
        }),
      });

      const categories = await response.json();
      
      // Update bookmarks with categories
      const updatedBookmarks = bookmarks.map((bookmark, index) => ({
        ...bookmark,
        category: categories[index]?.category
      }));

      setBookmarks(updatedBookmarks);

      // TODO: Create folders for each category and move bookmarks
      const uniqueCategories = [...new Set(updatedBookmarks.map(b => b.category))];
      
      for (const category of uniqueCategories) {
        if (!category) continue;
        
        // Create category folder
        chrome.bookmarks.create({
          parentId: folderId,
          title: category,
        }, (newFolder) => {
          // Move bookmarks to their category folders
          const categoryBookmarks = updatedBookmarks.filter(b => b.category === category);
          categoryBookmarks.forEach(bookmark => {
            chrome.bookmarks.move(bookmark.id, {
              parentId: newFolder.id
            });
          });
        });
      }
    } catch (error) {
      console.error('Error organizing bookmarks:', error);
    } finally {
      setOrganizing(false);
    }
  };

  if (!folderId) {
    return <div className="text-gray-600">Select a folder to view bookmarks</div>;
  }

  if (loading) {
    return <div className="text-gray-600">Loading bookmarks...</div>;
  }

  return (
    <div className="space-y-4">
      {bookmarks.length > 0 && (
        <button
          onClick={organizeBookmarks}
          disabled={organizing}
          className={`w-full px-4 py-2 rounded-lg text-white ${
            organizing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {organizing ? 'Organizing...' : 'Organize Bookmarks'}
        </button>
      )}

      <div className="space-y-2">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{bookmark.title}</h3>
                <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
              </div>
              {bookmark.category && (
                <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                  {bookmark.category}
                </span>
              )}
            </div>
          </div>
        ))}

        {bookmarks.length === 0 && (
          <div className="text-center text-gray-600">
            No bookmarks found in this folder
          </div>
        )}
      </div>
    </div>
  );
}
