import type { NextApiRequest, NextApiResponse } from "next";
import {
  SwCharacterInternal,
  SwMovieInternal,
  swapiClient,
} from "../../lib/SwapiClient";
import { ErrorsFactory } from "../../lib/ErrorsFactory";

export interface SwCharacter {
  id: number;
  name: string;
  movies?: string[];
}

export interface SwPaging<TItem> {
  total: number;
  items: TItem[];
}

const InvalidPageSearchParameterMessage = "Invalid 'page' search parameter";

const PageSize = 10;

async function fetchMovies() {
  const movies: SwMovieInternal[] = [];
  // In better world, we would filter movies by characters, after filtering characters (right join them).
  for await (const moviesPage of swapiClient.getMoviesPagesIterator()) {
    movies.push(...moviesPage);
  }
  return movies;
}

async function fetchAndMapCharacters(pageNr: number) {
  const chars: { id: number; char: SwCharacterInternal }[] = [];

  const charsPage = await swapiClient.getCharactersPage(pageNr);

  for (
    let iPageCharacter = 0;
    iPageCharacter < charsPage.results?.length;
    iPageCharacter++
  ) {
    chars.push({
      id: pageNr * PageSize + iPageCharacter + 1,
      char: charsPage.results[iPageCharacter],
    });
  }
  return { total: charsPage.count, chars };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ total: number; items: SwCharacter[] }>
) {
  const { page = "1" } = req.query;

  const err = new ErrorsFactory(res);

  if (typeof page !== "string" || !page.length) {
    return err.validation(InvalidPageSearchParameterMessage);
  }

  const pageNr = parseInt(page, 10);
  if (Number.isNaN(pageNr) || pageNr < 1) {
    return err.validation(InvalidPageSearchParameterMessage);
  }

  // Join. No filters.
  const [{ total, chars }, movies] = await Promise.all([
    fetchAndMapCharacters(pageNr),
    fetchMovies(),
  ]);

  const items = chars.map(({ char, id }) => ({
    id,
    name: char.name,
    movies: movies
      .filter((movie) => movie.characters.includes(char.url))
      .map((movie) => movie.title),
  }));

  res.status(200).json({ total, items });
}
