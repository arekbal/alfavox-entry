'use client'

import { useQuery } from "@tanstack/react-query";
import { getAllFilmChars } from "../lib/swapi";
import CharFilms from "./CharFilms";

export default function AllFilmChars() {  
  const { data, isError, isLoading} = useQuery({ 
    queryKey: ["allFilmChars"], 
    queryFn: getAllFilmChars 
  });

  if(isLoading) {
    return <>Loading All Film Characters</>
  }

  if(isError || !data) {
    return <>Has Error</>
  }
  
 return data.map(({id, name}) => {
   return <>
    <div key={id}>
    <h1 className="text-3xl font-bold underline">{name}</h1>      
      <CharFilms key={id} charId={id}/>
    </div>
   </>;
  }); 
};