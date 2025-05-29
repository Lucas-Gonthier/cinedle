"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DayList() {

    const [count, setCount] = useState();

    useEffect(() => {
        fetch("/api/dayCount")
            .then((res) => res.json())
            .then((data) => setCount(data.total)) // selon ce que ta route renvoie
            .catch((err) =>
            console.error("Erreur de communication avec la base :", err)
            );
    }, []);

    return (
        <div>
            <h1>Choisissez un jour</h1>
            <div className="flex flex-col justify-center items-center">
                {count !== undefined && Array.from({ length: count }, (_, i) => (
                    <div key={i+1} className="flex flex-row">
                        <Link href={`/mode/dayList/${i+1}`}>Jour {i+1}</Link>
                    </div>
                ))}
                
            </div>
        </div>
    );
}