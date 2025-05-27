import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) {
	throw new Error("l'URI n'est pas défini dans .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = globalThis as typeof globalThis & {
	_mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options);
		globalWithMongo._mongoClientPromise = client.connect();
	}
	clientPromise = globalWithMongo._mongoClientPromise!;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export async function getDailyMovieCollection(): Promise<Collection> {
	const client = await clientPromise;
	const db = client.db("cinedle");
	return db.collection("dailyMovies");
}

export async function getAllMoviesCollection(): Promise<Collection> {
	const client = await clientPromise;
	const db = client.db("cinedle");
	return db.collection("allMovies");
}
