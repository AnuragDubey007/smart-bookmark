"use client";

import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
}

export default function Home(){
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes (login/logout)
    const {data : listner} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      }
    );

    return () => {
      listner.subscription.unsubscribe();
    };
  }, []);

  //  Fetch bookmarks after login
  useEffect(() => {
    if(!user) return;

    fetchBookmarks();

    // const channel = supabase
    // .channel("bookmarks-realtime")
    // .on(
    //   "postgres_changes",
    //   {
    //     event: "*",
    //     schema: "public",
    //     table: "bookmarks",
    //   },
    //   (eventType, payload) => {
    //     const { eventType, new: newRow, old } = payload as any;

    //     setBookmarks((prev) => {
    //       if (eventType === "INSERT") {
    //         return [
    //           {
    //             id: newRow.id,
    //             title: newRow.title,
    //             url: newRow.url,
    //           },
    //           ...prev,
    //         ];
    //       }

    //       if (eventType === "DELETE") {
    //         return prev.filter((b) => b.id !== old.id);
    //       }

    //       return prev;
    //     });
    //   }
    // )
    // .subscribe();
  },[user]);

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", {ascending: false});
    
    if(!error && data){
      setBookmarks(data);
    }
  };

  const addBookmark = async () => {
    if(!title || !url || !user) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks();
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  }

  const handleLogin = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Login with Google
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm">Logged in as {user.email}</p>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 w-1/3"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="border p-2 flex-1"
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white px-3"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {bookmarks.map((b) => (
          <li key={b.id} className="border p-2 flex justify-between">
            <a href={b.url} target="_blank" className="text-blue-600">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}