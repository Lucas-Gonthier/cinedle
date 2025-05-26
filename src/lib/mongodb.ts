import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let db: Db;

if (!uri) {
	throw new Error("❌ MONGODB_URI n'est pas défini dans .env.local");
}

let clientPromise: Promise<MongoClient>;

declare global {
	var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export async function getDailyMovieCollection(): Promise<Collection> {
	const client = await clientPromise;
	const db = client.db("cinedle");
	return db.collection("dailyMovies");
}