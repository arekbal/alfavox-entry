'use client'

import { useQuery } from "@tanstack/react-query";
import { getSwMovieChars } from "../app/lib/api";
import { useState } from "react";

const PageSize = 10;

export default function SwMovieChars() {
  const [currPage, setPage] = useState(1)

  const { data, error, isLoading} = useQuery({
    queryKey: ["swMovieChars", currPage] as const,
    queryFn: ({ queryKey: [, page]}) => getSwMovieChars(page),
    throwOnError: true,
  });
  
 return <div>
  <section>   
    <p>
      Page Nr: {currPage}
    </p> 
    <button style={{border: 'black'}} disabled={data?.total === undefined || currPage === 1} onClick={() => setPage((v)=> v - 1)}>Prev</button>   
    
    <button style={{border: 'black'}} disabled={data?.total === undefined || (currPage * PageSize) > data.total} onClick={() => setPage((v)=> v + 1)}>Next</button>
  </section>

  <section>
    {isLoading ? <>Loading Page {currPage} of Star Wars Movie Characters</> :
     (error || !data) ? 'Error' : data.items.map(({id, name, movies}) =>
    <div key={id}>
      <h4 className="text-3xl font-bold underline">{name}</h4>
      {movies ? <ul>
        {movies.map((movie) => 
          <li key={id.toString() + movie}>{movie}</li>
        )}  
      </ul> : null}
      </div>    
    )}
    </section> 

  </div>; 
};