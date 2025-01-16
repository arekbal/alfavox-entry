import type { NextApiRequest, NextApiResponse } from "next";
import {
  SwCharacterInternal,
  SwMovieInternal,
  swapiClient,
} from "@/lib/SwapiClient";

export interface SwCharacter {
  id: number;
  name: string;
  movies?: string[];
}

async function fetchMovies() {
  const movies: SwMovieInternal[] = [];
  // In better world, we would filter movies by characters, after filtering characters (right join them).
  for await (const moviesPage of swapiClient.getMoviesPagesIterator()) {
    movies.push(...moviesPage);
  }
  return movies;
}

async function fetchAndMapCharacters() {
  const chars: { id: number; char: SwCharacterInternal }[] = [];
  const pageSize = 10;
  let pageNumber = 0;

  for await (const charsPage of swapiClient.getCharacterPagesIterator()) {
    for (
      let iPageCharacter = 0;
      iPageCharacter < charsPage.length;
      iPageCharacter++
    ) {
      chars.push({
        id: pageNumber * pageSize + iPageCharacter + 1,
        char: charsPage[iPageCharacter],
      });
    }
    pageNumber++;
  }
  return chars;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SwCharacter[]>
) {
  // Join. No filters.
  const [chars, movies] = await Promise.all([
    fetchAndMapCharacters(),
    fetchMovies(),
  ]);

  const results = chars.map(({ char, id }) => ({
    id,
    name: char.name,
    movies: movies
      .filter((movie) => movie.characters.includes(char.url))
      .map((movie) => movie.title),
  }));

  res.status(200).json(results);
}
