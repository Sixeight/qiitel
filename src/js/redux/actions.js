import "whatwg-fetch";

// Play
export const PLAY = "play";
export const PLAY_ALL = "play_all";
export const PLAY_NEXT = "play_next";
export const CLEAR = "clear";

// Keyboard
export const MOVE_RESET = "move_reset";
export const MOVE_DOWN = "move_down";
export const MOVE_UP = "move_up";
export const SETUP_LIST = "setup_list";

// Genre
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

export const moveReset = () => {
    return {
        type: MOVE_RESET
    };
};

export const moveDown = () => {
    return {
        type: MOVE_DOWN
    };
};

export const moveUp = () => {
    return {
        type: MOVE_UP
    };
};

export const setupList = (tracks) => {
    return {
        type: SETUP_LIST,
        tracks: tracks
    };
};

export const focus = (element) => {
    return () => {
        const top = element.offsetTop - (window.innerHeight / 2);
        window.scrollTo(0, top);
    };
};

export const watchKeyboard = () => {
    return (dispatch, getState) => {
        window.addEventListener("keydown", event => {
            switch (event.code) {
                case "KeyJ": {
                    event.preventDefault();
                    dispatch(moveDown());
                    break;
                }
                case "KeyK": {
                    event.preventDefault();
                    dispatch(moveUp());
                    break;
                }
                case "KeyP": {
                    event.preventDefault();
                    const pointer = getState().pointer;
                    const selectedTrack = pointer.tracks[pointer.index];
                    if (selectedTrack) {
                        dispatch(play(selectedTrack));
                    }
                    break;
                }
                case "Escape": {
                    dispatch(clear());
                    break;
                }
                default:
                // Nothing to do
            }
        });
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
