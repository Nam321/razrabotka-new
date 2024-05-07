const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addMovie = async (movieData) => {
    try {
        const newMovie = await prisma.movie.create({
            data: movieData,
        });
        return newMovie;
    } catch (error) {
        throw new Error(`Could not add movie: ${error}`);
    }
};

module.exports = async function (context, req) {
    try {
        const movieData = req.body; // Assuming the movie data is sent in the request body

        const addedMovie = await addMovie(movieData);

        context.res = {
            status: 201, // Created
            body: addedMovie,
        };
    } catch (error) {
        context.res = {
            status: 500, // Internal Server Error
            body: `Error adding movie: ${error.message}`,
        };
    }
};
