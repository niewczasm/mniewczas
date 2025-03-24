import { 
  QueryCommand, 
  GetCommand, 
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "./dynamodb";
import { Movie, Person } from "@/types/database";

// Movies operations
export async function getMovie(tconst: string): Promise<Movie | null> {
  const command = new GetCommand({
    TableName: process.env.DYNAMO_MOVIES_TABLE,
    Key: { tconst },
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Item as Movie || null;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

export async function getMovies(): Promise<Movie[]> {
  const command = new ScanCommand({
    TableName: process.env.DYNAMO_MOVIES_TABLE,
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Items as Movie[] || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

// People operations
export async function getPerson(nconst: string): Promise<Person | null> {
  const command = new GetCommand({
    TableName: process.env.DYNAMO_PEOPLE_TABLE,
    Key: { nconst },
  });

  try {
    const response = await dynamoDb.send(command);
    console.log(`Fetching person ${nconst}:`, response.Item);
    return response.Item as Person || null;
  } catch (error) {
    console.error(`Error fetching person ${nconst}:`, error);
    return null;
  }
}

export async function getPeople(): Promise<Person[]> {
  const command = new ScanCommand({
    TableName: process.env.DYNAMO_PEOPLE_TABLE,
  });

  try {
    const response = await dynamoDb.send(command);
    return response.Items as Person[] || [];
  } catch (error) {
    console.error("Error fetching people:", error);
    throw error;
  }
}

// Funkcja pomocnicza do pobrania wszystkich osób związanych z filmem
export async function getMoviePeople(movie: Movie): Promise<{
  directors: Person[];
  writers: Person[];
  actors: Person[];
}> {
  // Nie musimy już dzielić stringów, bo mamy już tablice
  const directorsArray = movie.directors;
  const writersArray = movie.writers;
  const actorsArray = movie.actors;

  // Pobieramy wszystkie osoby równolegle
  const allPeople = await Promise.all([
    ...directorsArray.map(nconst => getPerson(nconst)),
    ...writersArray.map(nconst => getPerson(nconst)),
    ...actorsArray.map(nconst => getPerson(nconst))
  ]);

  // Tworzyma mapę dla szybkiego dostępu
  const peopleMap = new Map(
    allPeople.filter((p): p is Person => p !== null)
      .map(p => [p.nconst, p])
  );

  return {
    directors: directorsArray
      .map(nconst => peopleMap.get(nconst))
      .filter((p): p is Person => p !== undefined),
    writers: writersArray
      .map(nconst => peopleMap.get(nconst))
      .filter((p): p is Person => p !== undefined),
    actors: actorsArray
      .map(nconst => peopleMap.get(nconst))
      .filter((p): p is Person => p !== undefined)
  };
} 