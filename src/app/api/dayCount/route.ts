import { NextResponse } from "next/server";
import { getDailyMovieCollection } from "@/lib/mongodb";

function getTodayStart(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function GET() {
    const collection = await getDailyMovieCollection();
    
    let count = await collection.countDocuments();
    
    const latest = await collection
        .find()
        .sort({ InsertDate: -1 }) //trie dans l'ordre décroissant, date la plus récente en premier
        .limit(1)
        .toArray();

    if (latest.length === 1) {
        const todayStart = getTodayStart();
        const latestDate = new Date(latest[0].InsertDate);

        if (latestDate < todayStart) {
            // Aucun film ajouté aujourd'hui → on incrémente
            count += 1;
        }
    }

    return NextResponse.json({ total: count });
}