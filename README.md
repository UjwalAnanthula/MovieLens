# 🎬 MovieLens

**MovieLens** is a full-stack movie discovery and review web application built with **Node.js, Express.js, MongoDB, and EJS**.

The application allows users to browse and search for movies, explore movie details, view ratings and reviews, and submit their own reviews and ratings. It also provides an admin interface for managing movies, uploading movie posters, and maintaining the movie catalog.

---

## 🚀 Quick Setup

For a quick installation on Windows:

```powershell
git clone https://github.com/UjwalAnanthula/MovieLens.git

cd MovieLens

python3 -m venv venv

.\venv\Scripts\activate

npm install

node app.js
```

Then open:

```text
http://localhost:4000
```

---

## ✨ Features

* 🎥 **Movie Catalog** — Browse movies stored in MongoDB.
* 🔎 **Movie Search** — Search movies by:

  * Movie title
  * Actors
  * Genre
* 🏷️ **Genre Organization** — Movies can be organized and explored by genre.
* 📄 **Movie Details** — View movie descriptions, genres, actors, posters, trailers, ratings, and reviews.
* ⭐ **Movie Ratings** — Users can submit ratings and view the calculated average rating.
* 💬 **Movie Reviews** — Users can submit reviews for movies.
* 🔐 **Admin Authentication** — Protected admin functionality for managing movie content.
* ➕ **Add Movies** — Administrators can add movies with details such as title, description, genres, actors, trailers, and posters.
* 🖼️ **Poster Uploads** — Movie images can be uploaded using Multer.
* 🗑️ **Movie Management** — Administrators can remove movies from the catalog.
* 🚪 **Session-based Authentication** — Express sessions are used to maintain administrator login sessions.
* 🖥️ **Server-side Rendering** — EJS templates are used to render dynamic pages.

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* EJS

### Backend

* Node.js
* Express.js
* Body Parser
* Express Session
* Multer

### Database

* MongoDB
* MongoDB Node.js Driver

### Additional Tools

* Axios
* Git
* GitHub

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │     MovieLens UI    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Express.js     │
                    │       Server        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       ┌───────────┐     ┌───────────┐     ┌───────────┐
       │    EJS    │     │  Multer   │     │  Session  │
       │ Templates │     │  Uploads  │     │   Auth    │
       └───────────┘     └───────────┘     └───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │      Database       │
                    └─────────────────────┘
```

---

## 🔄 How MovieLens Works

1. The user opens the MovieLens application.
2. Express.js receives and processes the request.
3. The application communicates with MongoDB to retrieve movie information.
4. EJS templates render the movie information dynamically.
5. Users can search for movies by title, actor, or genre.
6. Users can open individual movie pages to view detailed information.
7. Users can submit ratings and reviews.
8. Movie ratings are used to calculate the average rating.
9. Administrators can log in to manage the movie catalog.
10. Administrators can add movies and upload movie posters.
11. Movie information, ratings, and reviews are stored in MongoDB.

---

## 📂 Project Structure

```text
MovieLens/
│
├── public/
│   └── images/
│       └── movie posters
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── addMovie.ejs
│   └── viewDetails.ejs
│
├── app.js
├── movies.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

Follow the steps below to run MovieLens locally.

## 1. Clone the Repository

```bash
git clone https://github.com/UjwalAnanthula/MovieLens.git
cd MovieLens
```

## 2. Create a Python Virtual Environment

Create a virtual environment:

```bash
python3 -m venv venv
```

## 3. Activate the Virtual Environment

On Windows:

```powershell
.\venv\Scripts\activate
```

Once activated, your terminal should show:

```text
(venv)
```

## 4. Install Node.js Dependencies

Install the required packages:

```bash
npm install
```

## 5. Connect MongoDB Properly

MovieLens requires MongoDB to store movie information, ratings, and reviews.

Log in to **MongoDB Atlas** and follow these steps:

**Database → Connect → Drivers → Node.js**

Copy the MongoDB connection string provided by MongoDB Atlas and configure it in the application.

Make sure:

* Your MongoDB Atlas cluster is running.
* Your connection string is correct.
* Your database user has the required permissions.
* Your IP address is allowed in MongoDB Atlas Network Access.

> **Important:** Never commit your MongoDB username, password, or other credentials to GitHub. Use environment variables for sensitive information.

## 6. Start the Application

Run:

```bash
node app.js
```

If the application starts successfully, the server will run on:

```text
Port 4000
```

## 7. Open MovieLens

Open your browser and visit:

```text
http://localhost:4000
```

You can now use the MovieLens application locally.

---

# 🔎 Search Functionality

MovieLens provides movie search functionality that allows users to find movies using different attributes.

Users can search by:

```text
Movie Title
Actor
Genre
```

This makes it easier to discover movies without browsing the entire catalog.

---

# ⭐ Rating & Review System

MovieLens includes a rating and review system.

Users can:

* Submit a numerical rating.
* Write a review.
* View existing reviews.
* View the average movie rating.

When ratings are submitted, the application calculates the movie's average rating and stores the rating information in MongoDB.

Example:

```text
Movie
 ├── Rating 1
 ├── Rating 2
 ├── Rating 3
 └── Average Rating
```

---

# 🔐 Admin Functionality

MovieLens provides administrative functionality for managing the movie catalog.

Administrators can:

* Log in through the admin interface.
* Add new movies.
* Upload movie posters.
* Add movie descriptions.
* Add genres.
* Add actors.
* Add trailer information.
* Delete movies.

This allows the movie catalog to be maintained without directly modifying the database.

---

# 🖼️ Movie Poster Uploads

MovieLens uses **Multer** to handle movie poster uploads.

Uploaded images are stored in:

```text
public/images/
```

The image path is then associated with the corresponding movie record.

---

# 🗄️ Database

MovieLens uses **MongoDB** as its database.

The database stores information including:

* Movie titles
* Descriptions
* Genres
* Actors
* Movie posters
* Trailers
* Ratings
* Reviews
* Average ratings

A movie record can contain information similar to:

```json
{
  "title": "Movie Title",
  "description": "Movie description",
  "genre": [
    "Action",
    "Drama"
  ],
  "poster": "/images/movie.jpg",
  "trailer": "trailer-url",
  "actors": [
    "Actor 1",
    "Actor 2"
  ],
  "reviews": [],
  "ratings": [],
  "averageRating": 0
}
```

The project also contains `movies.json`, which provides movie data for the application.

---

# 🔑 Authentication

MovieLens uses **Express Session** for maintaining administrator login sessions.

The authentication flow allows authorized administrators to access movie management functionality while restricting those operations from normal users.

For production deployment, authentication credentials and session secrets should be stored securely using environment variables.

---

# 📡 Backend

The backend is built using **Node.js and Express.js**.

The Express server handles:

* Movie listing
* Movie search
* Movie details
* Admin login
* Admin logout
* Adding movies
* Deleting movies
* Movie reviews
* Movie ratings
* Image uploads

The backend communicates with MongoDB using the official MongoDB Node.js driver.

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* Node.js application development
* Express.js routing
* MongoDB database integration
* EJS server-side rendering
* CRUD operations
* Search functionality
* Session-based authentication
* File uploads using Multer
* Rating and review systems
* Dynamic web pages
* Git and GitHub version control

---

# 🚀 Future Improvements

Some potential improvements for MovieLens include:

* 🤖 Personalized movie recommendation system
* 👤 User registration and authentication
* ❤️ Watchlist and favorites
* 🎯 Personalized recommendations based on user ratings
* 🎞️ Integration with external movie APIs
* 📊 Admin dashboard and analytics
* 🔒 Improved authentication and authorization
* 🛡️ Environment-based configuration
* ☁️ Cloud-based image storage
* 📱 Improved responsive design
* 🧪 Automated testing
* 🚀 Production deployment
* 🔄 CI/CD integration

---

# 🔒 Security Notes

Before deploying MovieLens publicly, make sure sensitive information is not hardcoded in the source code.

Use a `.env` file for:

```env
MONGODB_URI=your-mongodb-connection-string
SESSION_SECRET=your-session-secret
PORT=4000
```

And make sure `.env` is included in `.gitignore`:

```gitignore
node_modules/
.env
```

Never upload database passwords, API keys, session secrets, or other private credentials to GitHub.

---

# 👨‍💻 Author

## Ujwal Ananthula

GitHub:
https://github.com/UjwalAnanthula

---

# 📄 License

This project is available in the repository for educational and development purposes.

---

## ⭐ If You Like This Project

If you find MovieLens useful or interesting, consider giving the repository a ⭐ on GitHub!

**Repository:**
https://github.com/UjwalAnanthula/MovieLens
