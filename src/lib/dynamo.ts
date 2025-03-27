import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Movie, Person } from "@/types/database";

if (!process.env.DYNAMO_MOVIES_TABLE) {
  throw new Error("DYNAMO_MOVIES_TABLE is not defined");
}

if (!process.env.DYNAMO_PEOPLE_TABLE) {
  throw new Error("DYNAMO_PEOPLE_TABLE is not defined");
}

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const MOVIES_TABLE = process.env.DYNAMO_MOVIES_TABLE;
const PEOPLE_TABLE = process.env.DYNAMO_PEOPLE_TABLE;

// Movies operations
export async function getMovie(tconst: string): Promise<Movie | null> {
  try {
    const command = new GetCommand({
      TableName: MOVIES_TABLE,
      Key: { tconst },
    });

    const response = await docClient.send(command);
    return response.Item as Movie || null;
  } catch (error) {
    console.error("Błąd podczas pobierania filmu:", error);
    return null;
  }
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const command = new ScanCommand({
      TableName: MOVIES_TABLE,
    });

    const response = await docClient.send(command);
    return (response.Items || []) as Movie[];
  } catch (error) {
    console.error("Błąd podczas pobierania filmów:", error);
    return [];
  }
}

// People operations
export async function getPerson(nconst: string): Promise<Person | null> {
  try {
    const command = new GetCommand({
      TableName: PEOPLE_TABLE,
      Key: { nconst },
    });

    const response = await docClient.send(command);
    return response.Item as Person || null;
  } catch (error) {
    console.error(`Błąd podczas pobierania osoby ${nconst}:`, error);
    return null;
  }
}

export async function getPeople(): Promise<Person[]> {
  try {
    const command = new ScanCommand({
      TableName: PEOPLE_TABLE,
    });

    const response = await docClient.send(command);
    return (response.Items || []) as Person[];
  } catch (error) {
    console.error("Błąd podczas pobierania osób:", error);
    return [];
  }
}

export async function getMoviePeople(movie: Movie): Promise<{
  movie: Movie;
  directors: Person[];
  writers: Person[];
  actors: Person[];
}> {
  const directorsPromises = movie.directors.map(nconst => getPerson(nconst));
  const writersPromises = movie.writers.map(nconst => getPerson(nconst));
  const actorsPromises = movie.actors.map(nconst => getPerson(nconst));

  const [directors, writers, actors] = await Promise.all([
    Promise.all(directorsPromises),
    Promise.all(writersPromises),
    Promise.all(actorsPromises),
  ]);

  return {
    movie,
    directors: directors.filter((d): d is Person => d !== null),
    writers: writers.filter((w): w is Person => w !== null),
    actors: actors.filter((a): a is Person => a !== null),
  };
} 