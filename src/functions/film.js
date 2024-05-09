const { app } = require('@azure/functions');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addMovie = async (movieData) => {
    try {
        const newMovie = await prisma.movie.create({
            data: await readableToString(movieData),
        });
        return newMovie;
    } catch (error) {
        throw new Error(`Could not add movie: ${error}`);
    }
};

app.http('film', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        if (request.method === 'POST') {
            try {
                const movieData = request.body; // Assuming the movie data is sent in the request body

                const addedMovie = await addMovie(movieData);

                return {
                    status: 201, // Created
                    body: JSON.stringify(addedMovie),
                };
            } catch (error) {
                return {
                    status: 500, // Internal Server Error
                    body: `Error adding movie: ${error.message}`,
                };
            }
        } else {
            const name = request.query.get('name') || (await request.text()) || 'world';
            return { body: `Hello, ${name}!` };
        }
    }
});

async function readableToString(readable) {
    const reader = await readable.getReader();
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder("utf-8").decode(value);
    }
    return JSON.parse(result);
}