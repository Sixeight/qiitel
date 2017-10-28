import "whatwg-fetch";

// List
export const CHANGE_LIST_MODE = "change_list_mode";
export const CHANGE_ALBUM_MODE = "change_album_mode";

export const listMode = {
    track: "track",
    album: "album"
};

export const albumMode = {
    collapsed: "collapsed",
    expanded: "expnded"
};

// Play
export const PLAY = "play";
export const PLAY_ALL = "play_all";
export const PLAY_NEXT = "play_next";
export const CLEAR = "clear";

// Keyboard
export const SWITCH_POINTER = "switch_pointer";
export const MOVE_RESET = "move_reset";
export const MOVE_DOWN = "move_down";
export const MOVE_TO = "move_to";
export const MOVE_UP = "move_up";
export const SETUP_LIST = "setup_list";

// Genre
export const UPDATE_GENRES = "fetch_genres";

// Action creators

export const changeListModeToTrack = () => {
    return changeListMode(listMode.track);
};
export const changeListModeToAlbum = () => {
    return changeListMode(listMode.album);
};
const changeListMode = (mode) => {
    return {
        type: CHANGE_LIST_MODE,
        mode: mode
    };
};

export const collapseAlbum = () => {
    return changeAlbumMode(albumMode.collapsed);
};
export const expandAlbum = () => {
    return changeAlbumMode(albumMode.expanded);
};
const changeAlbumMode = (mode) => {
    return {
        type: CHANGE_ALBUM_MODE,
        mode: mode
    };
};

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

export const switchPointer = (active) => {
    return {
        type: SWITCH_POINTER,
        active: active
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

export const moveTo = (index) => {
    return {
        type: MOVE_TO,
        index: index
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
        window.addEventListener("click", () => {
            dispatch(switchPointer(false));
        });
        window.addEventListener("keydown", event => {
            const app = getState().app;
            const pointer = app.pointer;

            switch (event.code) {
                case "KeyJ": {
                    if (app.list.mode === listMode.album && app.list.albumMode === albumMode.collapsed) {
                        const selectedTrack = pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            const tracks = pointer.tracks.slice(pointer.index + 1);
                            const foundIndex = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);
                            dispatch(moveTo(pointer.index + 1 + foundIndex));
                            break;
                        }
                    }
                    dispatch(moveDown());
                    break;
                }
                case "KeyK": {
                    if (app.list.mode === listMode.album && app.list.albumMode === albumMode.collapsed) {
                        const selectedTrack = pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            const tracks = pointer.tracks.slice(0, pointer.index).reverse();
                            const foundIndex = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);

                            const selectingAlbumTracks = tracks[foundIndex];
                            if (selectingAlbumTracks) {
                                const secondTracks = tracks.slice(foundIndex + 1);
                                const secondFoundIndex = secondTracks.findIndex(track => track.collection_id !== selectingAlbumTracks.collection_id);
                                if (secondFoundIndex === -1) {
                                    dispatch(moveTo(0));
                                } else {
                                    dispatch(moveTo(pointer.index - 1 - (foundIndex + secondFoundIndex)));
                                }
                                break;
                            }
                        }
                    }
                    dispatch(moveUp());
                    break;
                }
                case "Enter":
                case "KeyP": {
                    const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                    if (selectedTrack) {
                        event.preventDefault();
                        dispatch(play(selectedTrack));
                        dispatch(switchPointer(false));
                    }
                    break;
                }
                case "KeyA": {
                    dispatch(playAll(getState().app.pointer.tracks));
                    dispatch(switchPointer(false));
                    break;
                }
                case "Escape":
                case "KeyS": {
                    dispatch(clear());
                    dispatch(switchPointer(false));
                    break;
                }
                case "Tab": {
                    dispatch(switchPointer(false));
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
