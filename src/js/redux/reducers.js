import { combineReducers } from "redux";

import * as actions from "./actions";
import safeStorage from "../storage";

// リスト操作

const lastMode = safeStorage.get("lastMode", actions.listMode.track);
const lastAlbumMode = safeStorage.get("lastAlbumMode", actions.albumMode.collapsed);
const defaultListState = {
    mode: lastMode,
    albumMode: lastAlbumMode,
    albumExpandMap: {}
};

const listReducer = (state = defaultListState, action) => {
    switch (action.type) {
        case actions.CHANGE_LIST_MODE: {
            safeStorage.set("lastMode", action.mode);
            return { ...state, mode: action.mode };
        }
        case actions.CHANGE_ALBUM_MODE: {
            safeStorage.set("lastAlbumMode", action.mode);
            return { ...state, albumMode: action.mode, albumExpandMap: {} };
        }
        case actions.CHANGE_ALBUM_EXPANDED_SINGLE: {
            const albumExpandMap = state.albumExpandMap;
            return {
                ...state,
                albumExpandMap: {
                    ...albumExpandMap,
                    [action.collection_id]: action.expanded
                }
            };
        }
        default:
            return state;
    }
};

// 再生関連

const defaultPlayState = {
    currentTrack: null,
    playList: []
};

function pick(tracks) {
    const copied = [...tracks];
    const [picked] = copied.splice(Math.floor(Math.random() * copied.length), 1);
    return [picked, copied];
}

const playReducer = (state = { ...defaultPlayState }, action) => {
    switch (action.type) {
        case actions.PLAY: {
            return { ...state, currentTrack: action.track, playList: [] };
        }
        case actions.PLAY_ALL: {
            const [nextTrack, rest] = pick(action.tracks);
            return {
                ...state,
                currentTrack: nextTrack,
                playList: rest
            };
        }
        case actions.PLAY_NEXT: {
            const [nextTrack, rest] = pick(state.playList);
            if (nextTrack) {
                return {
                    ...state,
                    currentTrack: nextTrack,
                    playList: rest
                };
            } else {
                return state;
            }
        }
        case actions.CLEAR: {
            return { ...defaultPlayState };
        }
        default: {
            return state;
        }
    }
};

// カーソル移動

const pointerReducer = (state = { index: 0, tracks: [], active: false }, action) => {
    switch (action.type) {
        case actions.SWITCH_POINTER: {
            return { ...state, active: action.active };
        }
        case actions.MOVE_RESET: {
            return { ...state, active: false, index: 0 };
        }
        case actions.MOVE_TO: {
            if (state.active) {
                return { ...state, index: Math.min(Math.max(action.index, 0), state.tracks.length - 1) };
            }
            return { ...state, active: true };
        }
        case actions.UPDATE_INDEX: {
            return { ...state, index: Math.min(Math.max(action.index, 0), state.tracks.length - 1) };
        }
        case actions.SETUP_LIST: {
            return { ...state, tracks: action.tracks };
        }
        default:
            return state;
    }
};

// ジャンル一覧

const genresReducer = (state = { names: [] }, action) => {
    switch (action.type) {
        case actions.UPDATE_GENRES: {
            return { ...state, names: action.genreNames };
        }
        default: {
            return state;
        }
    }
};

// ヘルプ

const helpReducer = (state = { shown: false }, action) => {
    switch (action.type) {
        case actions.TOGGLE_HELP: {
            return { shown: !state.shown };
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({
    list: listReducer,
    play: playReducer,
    pointer: pointerReducer,
    genre: genresReducer,
    help: helpReducer
});

