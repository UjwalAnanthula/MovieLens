const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// ===============================
// Admin credentials
// ===============================
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

// ===============================
// MongoDB connection
// ===============================
// Replace <DB_username> and <DB_password>
// with your actual MongoDB Atlas credentials.
const uri =
    "mongodb+srv://Ujwal:Ujwal1234@cluster0.taww3.mongodb.net/?appName=Cluster0";

let db;

// ===============================
// Middleware
// ===============================
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true
    })
);

// ===============================
// View engine
// ===============================
app.set('view engine', 'ejs');

// ===============================
// Admin middleware
// ===============================
function checkAdmin(req, res, next) {
    req.isAdmin = req.session.isAdmin || false;
    next();
}

// ===============================
// Multer storage
// ===============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ===============================
// Utility functions
// ===============================
function groupMoviesByGenre(movies) {
    const grouped = movies.reduce((result, movie) => {
        const genres = Array.isArray(movie.genre)
            ? movie.genre
            : [movie.genre || 'Uncategorized'];

        genres.forEach((genre) => {
            const genreKey = String(genre).toLowerCase();

            if (!result[genreKey]) {
                result[genreKey] = [];
            }

            result[genreKey].push(movie);
        });

        return result;
    }, {});

    return Object.keys(grouped)
        .sort()
        .reduce((sorted, key) => {
            sorted[key] = grouped[key];
            return sorted;
        }, {});
}

function calculateAverageRating(movie) {
    if (movie.ratings && movie.ratings.length > 0) {
        const totalRating = movie.ratings.reduce(
            (sum, rating) => sum + Number(rating),
            0
        );

        return (totalRating / movie.ratings.length).toFixed(1);
    }

    return 0;
}

// ===============================
// Home
// ===============================
app.get('/', checkAdmin, async (req, res) => {
    try {
        const movies = await db
            .collection('movies')
            .find()
            .toArray();

        const newlyAddedMovies = movies.slice(-10);

        const groupedMovies = groupMoviesByGenre(movies);

        res.render('index', {
            movies,
            newlyAddedMovies,
            groupedMovies,
            isAdmin: req.isAdmin
        });
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).send('Failed to load movies.');
    }
});

// ===============================
// Search
// ===============================
app.get('/search', checkAdmin, async (req, res) => {
    const query = req.query.query
        ? req.query.query.trim()
        : '';

    try {
        let movies;

        if (!query) {
            movies = await db
                .collection('movies')
                .find()
                .toArray();
        } else {
            movies = await db
                .collection('movies')
                .find({
                    $or: [
                        {
                            title: {
                                $regex: query,
                                $options: 'i'
                            }
                        },
                        {
                            actors: {
                                $regex: query,
                                $options: 'i'
                            }
                        },
                        {
                            genre: {
                                $elemMatch: {
                                    $regex: query,
                                    $options: 'i'
                                }
                            }
                        }
                    ]
                })
                .toArray();
        }

        const groupedMovies = groupMoviesByGenre(movies);

        res.render('index', {
            movies,
            newlyAddedMovies: movies.slice(-10),
            groupedMovies,
            isAdmin: req.isAdmin
        });
    } catch (err) {
        console.error('Error searching movies:', err);
        res.status(500).send('Failed to search movies.');
    }
});

// ===============================
// Login page
// ===============================
app.get('/login', (req, res) => {
    res.render('login', {
        error: null
    });
});

// ===============================
// Login
// ===============================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        req.session.isAdmin = true;
        res.redirect('/');
    } else {
        res.render('login', {
            error: 'Invalid credentials. Please try again.'
        });
    }
});

// ===============================
// Logout
// ===============================
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }

        res.redirect('/');
    });
});

// ===============================
// Add Movie page
// ===============================
app.get('/addMovie', checkAdmin, (req, res) => {
    if (!req.isAdmin) {
        return res.redirect('/');
    }

    res.render('addMovie');
});

// ===============================
// Add Movie
// ===============================
app.post(
    '/addMovie',
    upload.single('poster'),
    checkAdmin,
    async (req, res) => {
        if (!req.isAdmin) {
            return res.redirect('/');
        }

        try {
            const {
                title,
                description,
                genre,
                trailer,
                actors
            } = req.body;

            if (!req.file) {
                return res.status(400).send(
                    'Poster image is required.'
                );
            }

            const poster =
                '/images/' + req.file.filename;

            const genres = genre
                ? genre
                      .split(',')
                      .map((g) => g.trim())
                      .filter(Boolean)
                : ['Uncategorized'];

            const actorsList = actors
                ? actors
                      .split(',')
                      .map((a) => a.trim())
                      .filter(Boolean)
                : ['Uncategorized'];

            const newMovie = {
                title,
                description,
                genre: genres,
                poster,
                trailer,
                actors: actorsList,
                reviews: [],
                ratings: [],
                averageRating: 0
            };

            await db
                .collection('movies')
                .insertOne(newMovie);

            res.redirect('/');
        } catch (err) {
            console.error(
                'Error adding movie:',
                err
            );

            res.status(500).send(
                'Failed to add movie.'
            );
        }
    }
);

// ===============================
// Delete Movie
// ===============================
app.post('/deleteMovie/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const result = await db
            .collection('movies')
            .deleteOne({
                _id: new ObjectId(movieId)
            });

        if (result.deletedCount === 1) {
            console.log(
                'Movie deleted successfully'
            );
        } else {
            console.log(
                'No movie found to delete'
            );
        }

        res.redirect('/');
    } catch (err) {
        console.error(
            'Error deleting movie:',
            err
        );

        res.redirect('/');
    }
});

// ===============================
// Movie Details
// ===============================
app.get(
    '/viewDetails/:id',
    checkAdmin,
    async (req, res) => {
        const movieId = req.params.id;

        try {
            const movie = await db
                .collection('movies')
                .findOne({
                    _id: new ObjectId(movieId)
                });

            if (movie) {
                res.render('viewDetails', {
                    movie,
                    isAdmin: req.isAdmin
                });
            } else {
                res.redirect('/');
            }
        } catch (err) {
            console.error(
                'Error fetching movie details:',
                err
            );

            res.redirect('/');
        }
    }
);

// ===============================
// Add Review + Rating
// ===============================
app.post(
    '/addReview/:id',
    async (req, res) => {
        const {
            reviewText,
            username,
            rating
        } = req.body;

        const movieId = req.params.id;

        try {
            const movie = await db
                .collection('movies')
                .findOne({
                    _id: new ObjectId(movieId)
                });

            if (!movie) {
                return res.redirect('/');
            }

            const newReview = {
                user: username,
                text: reviewText
            };

            const newRating = parseInt(
                rating,
                10
            );

            if (
                Number.isNaN(newRating) ||
                newRating < 1 ||
                newRating > 5
            ) {
                return res
                    .status(400)
                    .send(
                        'Rating must be between 1 and 5.'
                    );
            }

            const reviews = Array.isArray(
                movie.reviews
            )
                ? movie.reviews
                : [];

            const ratings = Array.isArray(
                movie.ratings
            )
                ? movie.ratings
                : [];

            reviews.push(newReview);
            ratings.push(newRating);

            movie.reviews = reviews;
            movie.ratings = ratings;

            movie.averageRating =
                calculateAverageRating(movie);

            await db
                .collection('movies')
                .updateOne(
                    {
                        _id: new ObjectId(movieId)
                    },
                    {
                        $set: {
                            reviews:
                                movie.reviews,
                            ratings:
                                movie.ratings,
                            averageRating:
                                movie.averageRating
                        }
                    }
                );

            res.redirect(
                `/viewDetails/${movieId}`
            );
        } catch (err) {
            console.error(
                'Error adding review:',
                err
            );

            res.status(500).send(
                'Failed to add review.'
            );
        }
    }
);

// ===============================
// Start MongoDB + Server
// ===============================
async function startServer() {
    try {
        const client = new MongoClient(uri);

        await client.connect();

        db = client.db('movielens');

        console.log(
            'Connected to MongoDB Atlas'
        );

        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log(
                `Server is running on port ${PORT}`
            );
        });
    } catch (err) {
        console.error(
            'Failed to connect to MongoDB:',
            err
        );

        process.exit(1);
    }
}

startServer();