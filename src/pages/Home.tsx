import { useState, useEffect } from "react";

// Type for a bookmark
interface Bookmark {
  id: number;
  url: string;
  title: string;
  description?: string;
  tags?: string;
  favorite?: boolean;
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newURL, setNewURL] = useState("");

  const API_BASE = "https://bookmark-backend-ebexmmsxy8bx7ctargbsxxhy-3000.thekalkicinematicuniverse.com/bookmark";

  // Fetch all bookmarks
  const fetchBookmarks = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (Array.isArray(data)) setBookmarks(data);
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Add a new bookmark
  const addBookmark = async () => {
    if (!newTitle || !newURL) return;
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, url: newURL }),
      });
      const bookmark = await res.json();
      setBookmarks([...bookmarks, bookmark]);
      setNewTitle("");
      setNewURL("");
    } catch (err) {
      console.error(err);
    }
    console.log("Adding bookmark", newTitle, newURL);
  };

  // Toggle favorite
  const toggleFavorite = async (id: number) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (!bookmark) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !bookmark.favorite }),
      });
      const updated = await res.json();
      setBookmarks(bookmarks.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a bookmark
  const deleteBookmark = async (id: number) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmark Manager</h1>

      {/* Add bookmark */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={newURL}
          onChange={(e) => setNewURL(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* List bookmarks */}
      <ul className="space-y-2">
        {bookmarks.length === 0 ? (
          <p>No bookmarks yet</p>
        ) : (
          bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex justify-between items-center border p-2 rounded bg-white"
            >
              <div>
                <a href={b.url} target="_blank" className="font-semibold">
                  {b.title}
                </a>
                {b.favorite && (
                  <span className="ml-2 text-yellow-500">★</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(b.id)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  {b.favorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
