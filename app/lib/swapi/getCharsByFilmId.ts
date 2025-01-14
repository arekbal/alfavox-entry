export interface FilmChar {
  id: number;
  name: string;
}

export const getCharsByFilmId = (filmId: number) =>
  fetch(`https://swapi.online/api/films/${filmId}/characters`).then(
    (x) => x.json() as Promise<FilmChar[]>
  );
