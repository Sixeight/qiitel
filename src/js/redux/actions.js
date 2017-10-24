// Play
export const PLAY = "play";
export const PLAY_ALL = "play_all";
export const PLAY_NEXT = "play_next";
export const CLEAR = "clear";

// Keyboard
export const MOVE_DOWN = "move_down";
export const MOVE_UP = "move_up";
export const SETUP_LIST = "setup_list";

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

