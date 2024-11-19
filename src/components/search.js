import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import './search.css';
 
function Search() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
 
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
 
  const Movies = () => {
    return (
      <table>
        {movies && movies.map((movie) => (
          <tr key={movie.id}>
            <td>{movie.title}</td>
          </tr>
        ))}
      </table>
    );
  };
 
  const search = () => {
    let url = '';
    let endpoint = '';
 
    if (query) {
  
      endpoint = 'search/movie';
      url = `https://api.themoviedb.org/3/${endpoint}?query=${query}&page=${page}`;
    } else {

      endpoint = 'discover/movie';
      url = `https://api.themoviedb.org/3/${endpoint}?include_adult=false&page=${page}`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
    }
 
    fetch(url, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let filteredMovies = json.results || [];
 

        if (genre || year) {
          filteredMovies = filteredMovies.filter((movie) => {
            const matchesGenre = genre ? movie.genre_ids.includes(Number(genre)) : true;
            const matchesYear = year ? movie.release_date?.startsWith(year) : true;
            return matchesGenre && matchesYear;
          });
        }
 
        setMovies(filteredMovies);
        setPageCount(json.total_pages || 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  useEffect(() => {
    search();
  }, [page]);
 
  return (
    <div id="container">
      <h3>Search movies</h3>
 
      <div>
        <label>Title:</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title"
        />
      </div>
 
      <div>
        <label>Genre:</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">-- Select Genre --</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
 
      <div>
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Search by release year"
        />
      </div>
 
      <button onClick={search} type="button">
        Search
      </button>
 
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< "
        renderOnZeroPageCount={null}
      />
 
      <Movies />
    </div>
  );
}
 
export default Search;