class Storage {
    set(key, item) {
        try {
            localStorage.setItem(key, item);
        } catch (e) {
            // Not supported
        }
    }

    get(key, defaultValue = null) {
        return localStorage.getItem(key) || defaultValue;
    }
}

export default new Storage();
