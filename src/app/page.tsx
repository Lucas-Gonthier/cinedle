"use client"

import { useEffect, useState } from 'react';

interface Movie {
  title: string;
  genreNames: string[];

}

export default function Home() {
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  return (
    <div>
      <h1>Films :</h1>
      <ul>
        <li>{movie?.title}</li>
        {movie?.genreNames.map((g, i) => <li key={i}>{g}</li>)}
      </ul>
    </div>
  );
}
