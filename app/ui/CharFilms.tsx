import { useQuery } from "@tanstack/react-query";
import { getFilmsByCharId } from "../lib/swapi/getFilmsByCharId";

export type CharFilmsProps = {
  charId: number;
}

export default function CharFilms({ charId }: CharFilmsProps) {
  const { data: films, isError, isLoading} = useQuery({ 
    queryKey: ["getFilmsByCharId", charId] as const, 
    queryFn: ({ queryKey: [, charId] }) => getFilmsByCharId(charId)
  });

  if(isLoading) {
    return <>Loading Films</>
  }

  if(isError || !films) {
    return <>Has Error</>
  }
  
 return <ul>
   {films.map(({id, title}) => 
      <li key={charId.toString() + id.toString()}>{title}</li>)} 
  </ul>
}