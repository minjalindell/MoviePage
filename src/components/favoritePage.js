import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/userContext";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const { user } = useContext(UserContext); 

  useEffect(() => {
    const fetchFavoritesWithMovieDetails = async () => {
      if (user && user.user_id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/favorites?user_id=${user.user_id}`
          );
          const favoritesData = response.data;

          const favoritesWithDetails = await Promise.all(
            favoritesData.map(async (favorite) => {
              try {
                const tmdbResponse = await fetch(
                  `https://api.themoviedb.org/3/movie/${favorite.movie_id}?language=en-US`,
                  {
                    headers: {
                      Authorization:
                      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
                      "Content-Type": "application/json",
                    },
                  }
                );
                const movieData = await tmdbResponse.json();
                return {
                  ...favorite,
                  movie_title: movieData.title, 
                  release_date: movieData.release_date, 
                  poster_path: movieData.poster_path, 
                };
              } catch (error) {
                console.error(`Error fetching movie details for ID ${favorite.movie_id}:`, error);
                return { ...favorite, movie_title: "Unknown Movie" };
              }
            })
          );

          setFavorites(favoritesWithDetails); 
          setLoading(false);
        } catch (error) {
          console.error("Error fetching favorite movies:", error);
          setLoading(false);
        }
      } else {
        console.error("User not available:", user);
        setLoading(false);
      }
    };

    fetchFavoritesWithMovieDetails();
  }, [user]);

 
  

  return (
    <div>
      <h1>Your Favorite Movies</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {favorites.length === 0 ? (
            <li>No favorite movies added yet.</li>
          ) : (
            favorites.map((favorite) => (
              <li key={favorite.favorite_id}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${favorite.poster_path}`}
                  alt={favorite.movie_title}
                />
                <div>
                  <h3>{favorite.movie_title}</h3>
                  <p>Release Date: {favorite.release_date}</p>
                 
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default FavoritePage;
