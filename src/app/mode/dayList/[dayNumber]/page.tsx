'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Movie {
    title: string;
    genreNames: string[];
}

export default function Mode() {
    const params = useParams();
    const dayNumber = params.dayNumber;
    
    const [movie, setMovie] = useState<Movie>();

    useEffect(() => {
        fetch(`/api/daily?dayNumber=${dayNumber}`)
            .then((res) => res.json())
            .then((data) => setMovie(data))
            .catch((err) => console.error("Erreur API:", err));
    }, []);

    return (
        <div>
            <h1>Film numéro {dayNumber}</h1>
            <div className="flex justify-center items-center">
                <ul>
                    <li>{movie?.title ?? "Aucun film disponible"}</li>
                    {movie?.genreNames && movie.genreNames.length > 0 ? (
                    movie.genreNames.map((g, i) => <li key={i}>{g}</li>)
                    ) : (
                    <li>Pas de genres disponibles</li>
                    )}
                </ul>
            </div>
        </div>
    );
}