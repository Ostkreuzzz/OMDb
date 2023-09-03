import { useState, useEffect } from "react";

const KEY = "a9255fff";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok) throw new Error("Error");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie was not found");

          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message);

          if (!err.message === "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
