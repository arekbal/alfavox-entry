import { SwCharacter, SwPaging } from "@/pages/api/characters";

export const getSwMovieChars = (page: number) =>
  fetch(`/api/characters?page=${page}`).then<SwPaging<SwCharacter>>((r) =>
    r.json()
  );
