import { NextResponse } from 'next/server';
import { getAllMoviesCollection } from '@/lib/mongodb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET() {
    const moviesCollection = await getAllMoviesCollection();
    await moviesCollection.createIndex({ id: 1 }, { unique: true });
    const totalPages = 100;
    
    for (let page = 1; page <= totalPages; page++) {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`, {
            headers: {
                Authorization: `Bearer ${TMDB_API_KEY}`,
                Accept: 'application/json',
            },
        });
        
        if (!res.ok) {
            console.error(`Erreur sur la page ${page}`);
            continue;
        }
        
        const data = await res.json();
        const movies = data.results;
        
        try {
        await moviesCollection.insertMany(movies, { ordered: false });
            console.log(`Page ${page} insérée.`);
        } catch (error) {
            if (error instanceof Error) {
                console.warn(`Erreur à la page ${page}:`, error.message);
            } else {
                console.warn(`Erreur inconnue à la page ${page}:`, error);
            }
        }
        
        // Optionnel : petite pause entre chaque appel (300ms)
        await new Promise((r) => setTimeout(r, 300));
    }
    
    return NextResponse.json({ message: 'Seed terminé' });
}