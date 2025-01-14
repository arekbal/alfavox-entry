import { useQuery } from "@tanstack/react-query";
import { getFilmsByCharId } from "../lib/swapi/getFilmsByCharId";

export type CharFilmsProps = {
  charId: number;
}

export default function CharFilms({ charId }: CharFilmsProps) {
  const { data: films, isError, isLoading} = useQuery({ 
    queryKey: ["getFilmByCharId", charId] as const, 
    queryFn: ({ queryKey: [_, charId] }) => getFilmsByCharId(charId)
  });

  if(isLoading) {
    return <>Loading Films</>
  }

  if(isError || !films) {
    return <>Has Error</>
  }
  
 return <ul>
   {films.map(({id, title}) => {
      return <li key={charId.toString()+id.toString()}>{title}</li>
  })} 
  </ul>
}