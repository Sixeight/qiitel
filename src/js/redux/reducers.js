import { combineReducers } from "redux";

import * as actions from "./actions";

const defaultState = {
    currentTrack: null,
    playList: []
};

function pick(tracks) {
    const copied = [...tracks];
    const [picked] = copied.splice(Math.floor(Math.random() * copied.length), 1);
    return [picked, copied];
}

const playReducer = (state = { ...defaultState }, action) => {
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
            return { ...defaultState };
        }
        default: {
            return state;
        }
    }
};

const pointerReducer = (state = { index: 0, tracks: [] }, action) => {
    switch (action.type) {
        case actions.MOVE_DOWN: {
            return { ...state, index: Math.min(state.index + 1, state.tracks.length - 1) };
        }
        case actions.MOVE_UP: {
            return { ...state, index: Math.max(state.index - 1, 0) };
        }
        case actions.SETUP_LIST: {
            return { ...state, tracks: action.tracks };
        }
        default:
            return state;
    }
};

export default combineReducers({
    play: playReducer,
    pointer: pointerReducer
});

