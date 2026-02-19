# Smart Bookmark App

A simple and secure bookmark manager built as part of a Fullstack micro-challenge.

The app allows users to log in with Google, manage their personal bookmarks, and see updates instantly without page refresh. All data privacy is enforced at the database level.

---

## 🚀 Live Demo
https://smart-bookmark-phi-lime.vercel.app

## 📦 GitHub Repository
https://github.com/AnuragDubey007/smart-bookmark

---

## ✨ Features

- Google OAuth authentication (no email/password)
- Private bookmarks per user
- Add and delete bookmarks
- Bookmark list updates without page refresh
- Secure backend using Row Level Security (RLS)
- Deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** Supabase (Auth, PostgreSQL, RLS)  
- **Authentication:** Google OAuth via Supabase  
- **Deployment:** Vercel  

---

## 🔐 Authentication & User Privacy

- Users authenticate using **Google OAuth** through Supabase Auth.
- Each bookmark row contains a `user_id`.
- **Row Level Security (RLS)** policies ensure:
  - Users can only read their own bookmarks
  - Users can only insert bookmarks for themselves
  - Users can only delete their own bookmarks
- No authorization logic is handled on the frontend — the database enforces all access rules.

---

## ⚙️ How the App Works

1. User logs in using Google.
2. Supabase creates and manages the user session.
3. After login, the app fetches bookmarks belonging only to the logged-in user.
4. Users can:
   - Add a bookmark (title + URL)
   - Delete their own bookmarks
5. The UI updates immediately after each action.
6. The app is deployed on Vercel and configured using environment variables.

---

## 🧠 Challenges Faced & How I Solved Them

### 1. Google OAuth redirect issues after deployment  
**Problem:**  
After deploying to Vercel, Google login redirected to `localhost` instead of the production URL.

**Solution:**  
Updated Supabase **Site URL** and **Redirect URLs** to include the Vercel domain. This ensured Supabase redirected users correctly after authentication in production.

---

### 2. Session not restoring after OAuth login  
**Problem:**  
The user was created successfully, but the frontend did not detect the logged-in state.

**Solution:**  
Used the correct Supabase anon public key and configured the Supabase client with session persistence and PKCE flow to properly restore sessions after OAuth redirects.

---

### 3. Ensuring data privacy between users  
**Problem:**  
Preventing one user from accessing another user’s bookmarks.

**Solution:**  
Implemented Supabase **Row Level Security (RLS)** policies so that all read/write/delete operations are automatically scoped to the authenticated user at the database level.

---

## 🧪 Testing

- Tested login with multiple Google accounts
- Verified that bookmarks are private to each user
- Confirmed add/delete functionality
- Tested production login flow on Vercel

---

## 📌 Notes

- Environment variables are used for Supabase configuration.
- The project focuses on correctness, security, and clarity over UI polish.
- The code is intentionally kept simple and readable for easy explanation in interviews.

---

## 👤 Author

**Anurag Dubey**  
Built as part of a Fullstack & AI/ML Micro-Challenge
