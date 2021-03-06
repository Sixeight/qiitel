import "whatwg-fetch";
import { push } from "react-router-redux";

// List
export const CHANGE_LIST_MODE = "change_list_mode";
export const CHANGE_ALBUM_MODE = "change_album_mode";
export const CHANGE_ALBUM_EXPANDED_SINGLE = "change_album_expanded_single";

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
export const MOVE_TO = "move_to";
export const UPDATE_INDEX = "update_index";
export const SETUP_LIST = "setup_list";
export const TOGGLE_HELP = "toggle_help";

// Genre
export const UPDATE_GENRES = "fetch_genres";

// Google Analytics

export const GA_EVENT = "ga_event";

// Action creators

export const changeListModeToTrack = () => {
    return changeListMode(listMode.track);
};
export const changeListModeToAlbum = () => {
    return changeListMode(listMode.album);
};
const changeListMode = (mode) => {
    return (dispatch) => {
        dispatch({
            type: CHANGE_LIST_MODE,
            mode: mode
        });
        dispatch(gaEvent("Change List Mode", {
            event_category: "List",
            event_label: mode
        }));
    };
};

export const collapseAlbum = () => {
    return changeAlbumMode(albumMode.collapsed);
};
export const expandAlbum = () => {
    return changeAlbumMode(albumMode.expanded);
};
const changeAlbumMode = (mode) => {
    return (dispatch) => {
        dispatch({
            type: CHANGE_ALBUM_MODE,
            mode: mode
        });
        dispatch(gaEvent("Change Album Mode", {
            event_category: "List",
            event_label: mode
        }));
    };
};

export const expandAlbumSingle = (collectionId) => {
    return changeAlbumExpandedSingle(collectionId, true);
};
export const collapseAlbumSingle = (collectionId) => {
    return changeAlbumExpandedSingle(collectionId, false);
};
const changeAlbumExpandedSingle = (collectionId, expanded) => {
    return (dispatch) => {
        dispatch({
            type: CHANGE_ALBUM_EXPANDED_SINGLE,
            collection_id: collectionId,
            expanded: expanded
        });
        dispatch(gaEvent("Album Expand Single", {
            event_category: "List",
            event_label: collectionId,
            value: expanded ? 1 : 0
        }));
    };
};

export const play = (track) => {
    return (dispatch) => {
        dispatch({
            type: PLAY,
            track: track
        });
        dispatch(gaEvent("Play", {
            event_category: "Player",
            event_label: track.track_view_url
        }));
    };
};

export const playAll = (tracks) => {
    return (dispatch) => {
        dispatch({
            type: PLAY_ALL,
            tracks: tracks
        });
        dispatch(gaEvent("Play All", {
            event_category: "Player",
            value: tracks.length
        }));
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

export const moveTo = (index) => {
    return {
        type: MOVE_TO,
        index: index
    };
};

export const updateIndex = (index) => {
    return {
        type: UPDATE_INDEX,
        index: index
    };
};

export const setupList = (tracks) => {
    return {
        type: SETUP_LIST,
        tracks: tracks
    };
};

export const toggleHelp = () => {
    return {
        type: TOGGLE_HELP
    };
};

export const focus = (element) => {
    return () => {
        const top = element.offsetTop - (window.innerHeight / 2);
        window.scrollTo(0, top);
    };
};

export const selectTrack = (track) => {
    return (dispatch, getState) => {
        const pointer = getState().app.pointer;
        const foundIndex = pointer.tracks.indexOf(track);
        dispatch(switchPointer(false));
        dispatch(updateIndex(foundIndex));
    };
};

export const watchKeyboard = () => {
    const findNextIndex = (state) => {
        const list = state.app.list;
        const pointer = state.app.pointer;
        const nextIndex = pointer.index + 1;

        if (list.mode === listMode.track || list.albumMode === albumMode.expanded) {
            return nextIndex;
        }

        const selectedTrack = pointer.tracks[pointer.index];
        if (!selectedTrack || list.albumExpandMap[selectedTrack.collection_id]) {
            return nextIndex;
        }

        const tracks = pointer.tracks.slice(pointer.index + 1);
        const indexDiff = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);
        return nextIndex + indexDiff;
    };

    const findPreviousIndex = (state) => {
        const list = state.app.list;
        const pointer = state.app.pointer;
        const previousIndex = pointer.index - 1;

        if (list.mode === listMode.track || list.albumMode === albumMode.expanded) {
            return previousIndex;
        }

        const selectedTrack = pointer.tracks[pointer.index];
        if (!selectedTrack) {
            return previousIndex;
        }

        const tracks = pointer.tracks.slice(0, pointer.index).reverse();
        const foundIndex = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);

        const selectingAlbumTracks = tracks[foundIndex];
        if (!selectingAlbumTracks || list.albumExpandMap[selectingAlbumTracks.collection_id]) {
            return previousIndex;
        }

        const secondTracks = tracks.slice(foundIndex + 1);
        const secondFoundIndex = secondTracks.findIndex(track => track.collection_id !== selectingAlbumTracks.collection_id);
        const skippable = foundIndex === 0 || !list.albumExpandMap[selectedTrack.collection_id];
        if (secondFoundIndex === -1 && skippable) {
            return 0;
        } else if (skippable) {
            return previousIndex - (foundIndex + secondFoundIndex);
        }
        return previousIndex;
    };

    const findAlbumTrackIndex = (state) => {
        const pointer = state.app.pointer;
        const selectedTrack = pointer.tracks[pointer.index];
        if (!selectedTrack) {
            return -1;
        }

        const tracks = pointer.tracks.slice(0, pointer.index).reverse();
        const foundIndex = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);
        if (foundIndex === -1) {
            return 0;
        }

        return pointer.index - foundIndex;
    };

    return (dispatch, getState) => {
        window.addEventListener("click", () => {
            const pointer = getState().app.pointer;
            if (pointer.active) {
                dispatch(switchPointer(false));
            }
        });
        window.addEventListener("keydown", event => {
            const app = getState().app;
            const pointer = app.pointer;
            const list = app.list;

            switch (event.code) {
                case "KeyJ": {
                    dispatch(moveTo(findNextIndex(getState())));
                    break;
                }
                case "KeyK": {
                    dispatch(moveTo(findPreviousIndex(getState())));
                    break;
                }
                case "KeyP": {
                    if (event.shiftKey) {
                        const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            const artistTracks = pointer.tracks.filter(track => track.artist_id === selectedTrack.artist_id);
                            if (artistTracks.length > 0) {
                                dispatch(playAll(artistTracks));
                                dispatch(gaEvent("Play Atrist All", {
                                    event_category: "Player",
                                    event_label: artistTracks[0].artist_name
                                }));
                            }
                            break;
                        }
                    }
                    dispatch(playAll(pointer.tracks));
                    break;
                }
                case "Enter": {
                    const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                    if (!selectedTrack) {
                        break;
                    }
                    event.preventDefault();
                    if (event.shiftKey) {
                        const albumTrackIndex = findAlbumTrackIndex(getState());
                        const tracks = pointer.tracks.slice(albumTrackIndex);
                        const nextAlbumTrackIndex = tracks.findIndex(track => track.collection_id !== selectedTrack.collection_id);
                        dispatch(playAll(tracks.slice(0, nextAlbumTrackIndex)));
                        dispatch(gaEvent("Play Album All", {
                            event_category: "Player",
                            event_label: tracks[0].collection_name
                        }));
                    } else {
                        dispatch(play(selectedTrack));
                    }
                    break;
                }
                case "Escape":
                case "Period":
                case "KeyS": {
                    dispatch(clear());
                    dispatch(switchPointer(false));
                    break;
                }
                case "Tab": {
                    dispatch(switchPointer(false));
                    break;
                }
                case "KeyL": {
                    const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                    if (selectedTrack) {
                        const selectedCollectionId = selectedTrack.collection_id;
                        const albumExpanded = list.albumExpandMap[selectedCollectionId] || false;
                        dispatch(changeAlbumExpandedSingle(selectedCollectionId, !albumExpanded));
                        dispatch(moveTo(findAlbumTrackIndex(getState())));
                    }
                    break;
                }
                case "KeyA": {
                    if (event.shiftKey) {
                        const nextMode = list.albumMode === albumMode.expanded ? albumMode.collapsed : albumMode.expanded;
                        dispatch(changeAlbumMode(nextMode));
                    } else {
                        const nextMode = list.mode === listMode.album ? listMode.track : listMode.album;
                        dispatch(changeListMode(nextMode));
                    }
                    dispatch(switchPointer(false));
                    break;
                }
                case "KeyT": {
                    window.scrollTo(0, 0);
                    dispatch(moveReset());
                    break;
                }
                case "KeyO": {
                    if (event.shiftKey) {
                        const currentTrack = app.play.currentTrack;
                        if (currentTrack) {
                            window.open(currentTrack.track_view_url + `&at=1010ldrf&app=${currentTrack.app_type}`, "_blank");
                        }
                    } else {
                        const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            window.open(selectedTrack.track_view_url + `&at=1010ldrf&app=${selectedTrack.app_type}`, "_blank");
                        }
                    }
                    break;
                }
                case "KeyG": {
                    if (event.shiftKey) {
                        dispatch(push("/"));
                    } else {
                        const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            dispatch(push(`/genres/${encodeURIComponent(selectedTrack.genre_name)}`));
                        }
                    }
                    break;
                }
                case "KeyM": {
                    if (event.shiftKey) {
                        dispatch(push("/"));
                    } else {
                        const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                        if (selectedTrack) {
                            dispatch(push(`/artists/${encodeURIComponent(selectedTrack.artist_name)}/${selectedTrack.artist_id}`));
                        }
                    }
                    break;
                }
                case "KeyU": {
                    if (event.shiftKey) {
                        dispatch(push("/"));
                    } else {
                        const selectedTrack = pointer.active && pointer.tracks[pointer.index];
                        if (selectedTrack && selectedTrack.user) {
                            dispatch(push(`/users/${encodeURIComponent(selectedTrack.user.name)}`));
                        }
                    }
                    break;
                }
                case "Slash": {
                    if (event.shiftKey) {
                        dispatch(toggleHelp());
                    }
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

export const gaEvent = (name, params) => {
    return () => {
        setTimeout(() => {
            window.gtag("event", name, params);
        }, 0);
    };
};
