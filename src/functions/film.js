const { app } = require('@azure/functions');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addMovie = async (movieData) => {
    try {
        const newMovie = await prisma.movie.create({
            data: await readableToString(movieData), // Assuming the movie data is already in the correct format
        });
        return newMovie;
    } catch (error) {
        throw new Error(`Could not add movie: ${error}`);
    }
};

const addMovieReview = async (reviewData) => {
    try {
        const newReview = await prisma.movieReview.create({
            data: reviewData,
        });
        return newReview;
    } catch (error) {
        throw new Error(`Could not add movie review: ${error}`);
    }
};

app.http('film', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        if (request.method === 'POST') {
            try {
                const requestData = request.body;

                // Check if the request data contains information for adding a movie or a review
                if (requestData.type === 'movie') {
                    const addedMovie = await addMovie(requestData.data);
                    return {
                        status: 201, // Created
                        body: JSON.stringify(addedMovie),
                    };
                } else if (requestData.type === 'review') {
                    const addedReview = await addMovieReview(requestData.data);
                    return {
                        status: 201, // Created
                        body: JSON.stringify(addedReview),
                    };
                } else {
                    return {
                        status: 400, // Bad Request
                        body: 'Invalid request data',
                    };
                }
            } catch (error) {
                return {
                    status: 500, // Internal Server Error
                    body: `Error processing request: ${error.message}`,
                };
            }
        } else {
            const name = request.query.get('name') || (await request.text()) || 'world';
            return { body: `Hello, ${name}!` };
        }
    }
});
