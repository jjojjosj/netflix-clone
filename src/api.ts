const { REACT_APP_API_KEY } = process.env;
const API_KEY = REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";
const LANG = "ko-KR";
//const LANG = "en-US";
const REGION = "kr";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&region=${REGION}`
  ).then((response) => response.json());
}
