import React, { useCallback, useEffect, useState } from 'react';
  import MoviesList from './MoviesList';
  import './App.css';
import AddMovie from './AddMovie';
import Header from './Header';
  
  function App() {

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchMovies = useCallback(async () => { //so I can call later to use as a dependency in usestate
      setIsLoading(true); //to display loading paragraph
      setError(null);
      try {
        const response = await fetch('https://movies-cd8dc-default-rtdb.firebaseio.com/movies.json'); //movies.json creates new node in that api

        if(!response.ok) { //if response is not gotten
          throw new Error('Error occured'); //
        }

        const data = await response.json();

        const loadedMovies = [];

        for (const key in data) { //for loop
          loadedMovies.push({ //add new movie entry to end of (empty) loadedMovies array
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            whyText: data[key].whyText,
          });
        }
        setMovies(loadedMovies);
        setIsLoading(false);
      } catch (error) { //for catching errors
       setError(error.message);
      }
      setIsLoading(false);
   }, []);
   
   useEffect(() => {
    handleFetchMovies();
     }, [handleFetchMovies]);

     async function handleAddMovie(movie) {
      const response = await fetch('https://movies-cd8dc-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST', //request to database
        body: JSON.stringify(movie), //to turn js object to json format
        headers: {
          'Content-Type': 'application/json' //
        }
      });
      const data = await response.json();
     }
  
    return (
      <React.Fragment>
        <Header />
        <section>
        <AddMovie onAddMovie={handleAddMovie} />
        </section>
        <section>
          <button>Fetch Movies</button>
        </section>
        <section>
          {!isLoading && movies.length > 0 && <MoviesList movies={movies}/>}
          {isLoading && movies.length === 0 && !error && <p>No movies available</p>}
          {isLoading && error && <p>Loading...</p>}
          {isLoading && <p>Loading...</p>}
        </section>
      </React.Fragment>
    );
  }

export default App;
