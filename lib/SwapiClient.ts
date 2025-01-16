export interface SwPagingInternal<TItem> {
  count: number;
  next: string | null;
  prev: string | null;
  results: TItem[];
}

export interface SwMovieInternal {
  url: string;
  title: string;
  characters: string[];
}

export interface SwCharacterInternal {
  url: string;
  name: string;
  films: string[];
}

async function* fetchPagesAsync<TItem>(listUrl: string) {
  let url = listUrl;
  while (true) {
    const page = (await fetch(url).then((r) =>
      r.json()
    )) as SwPagingInternal<TItem>;
    yield page.results;
    if (page.next === null) {
      break;
    }

    url = page.next;
  }
}

class SwapiClient {
  private baseUrl = "https://swapi.dev/api";

  getMoviesPagesIterator() {
    return fetchPagesAsync<SwMovieInternal>(`${this.baseUrl}/films`);
  }

  // Good for streaming, long running processing
  getCharacterPagesIterator() {
    return fetchPagesAsync<SwCharacterInternal>(`${this.baseUrl}/people`);
  }

  getCharactersPage(page: number) {
    return fetch(`${this.baseUrl}/people?page=${page}`).then<
      SwPagingInternal<SwCharacterInternal>
    >((r) => r.json());
  }
}

export const swapiClient = new SwapiClient();
