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
  name?: string;
  overview: string;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name: string;
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

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetMultiSearchResult {
  page: number;
  results: ITv[] | IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANG}&region=${REGION}`
  ).then((response) => response.json());
}

export function getTvs() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=${LANG}&page=1`
  ).then((response) => response.json());
}

export function getSearch(query: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=${LANG}&query=${query}&page=1`
  ).then((response) => response.json());
}
