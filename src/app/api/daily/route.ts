import { NextResponse } from "next/server";
import { getDailyMovieCollection } from "@/lib/mongodb";

interface Genre {
    id: number;
    name: string;
}

function getTodayDateRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return { start, end };
}

export async function GET(req: Request) {
    const collection = await getDailyMovieCollection();
    const { start, end } = getTodayDateRange();
    const { searchParams } = new URL(req.url);
    const dayNumberParam = searchParams.get("dayNumber");
    
    const dayCount = await collection.countDocuments();
    if(dayNumberParam !== null){
        const dayNumber: number = parseInt(dayNumberParam);
        
        if (dayNumber == dayCount) {
            const existing = await collection.findOne({
                InsertDate: { $gte: start, $lt: end },
            });

            if (existing) {
                return NextResponse.json(existing);
            }

            const pageIndex = Math.floor(Math.random() * 100) + 1;
            const moviePage = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageIndex}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    Accept: "application/json"
                }
            });
            
            const pageData = await moviePage.json();
            const movies = pageData.results;
            
            const movieGenres = await fetch(`https://api.themoviedb.org/3/genre/movie/list`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    Accept: "application/json"
                }
            });
            
            const genresData = await movieGenres.json();
            const genres: Genre[] = genresData.genres;
            const movieIndex = Math.floor(Math.random() * movies.length);
            const selectedMovie = movies[movieIndex];
            
            const genreNames = selectedMovie.genre_ids
            .map((id: number) => {
                const genre = genres.find((g: Genre) => g.id === id);
                return genre ? genre.name : null;
            })
            .filter((name: string): name is string => name !== null);
            
            selectedMovie.genreNames = genreNames;
            
            const insertDoc = {
                InsertDate: new Date(),
                Page: pageIndex,
                ...selectedMovie,
            };
            
            await collection.insertOne(insertDoc);
            
            return NextResponse.json(insertDoc);
        }
        
        
        if (dayNumber <= dayCount) {
            // Cas 3 : passé
            const doc = await collection.find().skip(dayNumber - 1).limit(1).toArray();
            if (doc.length === 1) {
                return NextResponse.json(doc[0]);
            }
            
            return NextResponse.json({ message: "Film introuvable pour ce jour." }, { status: 404 });
        }
    }
    
    return NextResponse.json(
        { message: "Ce jour n'existe pas encore." },
        { status: 404 }
    );
}