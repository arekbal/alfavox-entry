export interface Film {
  id: string;
  title: string;
}

export const getFilmsByCharId = (charId: number) =>
  fetch(`https://swapi.online/api/characters/${charId}/films`).then(
    (x) => x.json() as Promise<Film[]>
  );
