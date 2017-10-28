import { combineReducers } from "redux";

import * as actions from "./actions";

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

const pointerReducer = (state = { index: -1, tracks: [], active: false }, action) => {
    switch (action.type) {
        case actions.SWITCH_POINTER: {
            return { ...state, active: action.active };
        }
        case actions.MOVE_RESET: {
            return { ...state, active: false, index: -1 };
        }
        case actions.MOVE_DOWN: {
            return { ...state, active: true, index: Math.min(state.index + 1, state.tracks.length - 1) };
        }
        case actions.MOVE_UP: {
            return { ...state, active: true, index: Math.max(state.index - 1, 0) };
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

export default combineReducers({
    play: playReducer,
    pointer: pointerReducer,
    genre: genresReducer
});

