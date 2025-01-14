import { FilmChar, getCharsByFilmId } from "./getCharsByFilmId";

export const getAllFilmChars = async () => {
  const filmChars: FilmChar[] = [];

  let filmId = 1;

  while (true) {
    const chars = await getCharsByFilmId(filmId);
    if (chars.length === 0) {
      break;
    }
    filmChars.push(...chars);
    filmId++;
  }

  return filmChars.filter(
    (char0, index, arr) =>
      arr.findIndex((char1) => char1.id === char0.id) === index
  );
};
