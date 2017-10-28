import "whatwg-fetch";

export const PLAY = "play";
export const PLAY_ALL = "play_all";
export const PLAY_NEXT = "play_next";
export const CLEAR = "clear";
export const UPDATE_GENRES = "fetch_genres";

export const play = (track) => {
    return {
        type: PLAY,
        track: track
    };
};

export const playAll = (tracks) => {
    return {
        type: PLAY_ALL,
        tracks: tracks
    };
};

export const playNext = () => {
    return {
        type: PLAY_NEXT
    };
};

export const clear = () => {
    return {
        type: CLEAR
    };
};

export const fetchGenres = () => {
    return (dispatch) => {
        fetch("/api/genres")
            .then(res => res.json())
            .then(json =>
                dispatch(updateGenres(json.genre_names))
            ).catch((e) => { console.log(e); });
    };
};

export const updateGenres = (genreNames) => {
    return {
        type: UPDATE_GENRES,
        genreNames: genreNames
    };
};
