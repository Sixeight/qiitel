import React from "react";
import ReactDOM from "react-dom";
import { createStore, bindActionCreators } from "redux";
import { Provider, connect } from "react-redux";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import "whatwg-fetch";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    NavLink
} from "react-router-dom";
import "../scss/main.scss";

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
const safeStorage = new Storage();

class TrackComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            shown: false
        };

        this._shown = this.shown.bind(this);
        this._play = () => this.props.play(this.props.track);
    }

    shown() {
        this.setState({ shown: true });
    }

    render() {
        const track = this.props.track;
        const releasedAt = new Date(track.released_at * 1000);
        const updatedAt = new Date(track.updated_at * 1000);

        return <Waypoint onEnter={this._shown}>
            <div className="track">
                <div className="image">
                    <div className="artwork" style={this.state.shown ? { backgroundImage: `url(${track.thumbnail_url})` } : {}}>
                    </div>
                    <a href={`${track.track_view_url}&app=${track.app_type}`} rel="nofollow" target="_blank">
                        {
                            track.is_streamable ?
                                <img src="/image/JP_Listen_on_Apple_Music_Badge.svg" /> :
                                <img src="/image/Get_it_on_iTunes_Badge_JP_1214.svg" />
                        }
                    </a>
                </div>
                <div className="meta">
                    <h2><a href={`${track.track_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.track_name}</a></h2>
                    <a href={`${track.artist_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.artist_name}</a> - <a href={`${track.collection_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.collection_name}</a><br />
                    <span className="genre"><Link to={`/genres/${encodeURIComponent(track.genre_name)}`}>{track.genre_name}</Link></span>・<span className="release">{releasedAt.getFullYear()}</span><br />
                    <time dateTime={updatedAt.toISOString()} title={updatedAt.toISOString()}>{updatedAt.toLocaleString()}</time>
                    {track.user && <User user={track.user} />}
                </div>
                <div className="play-button">
                    <button onClick={this._play}>プレビュー</button>
                </div>
                <div className="clear"></div>
            </div>
        </Waypoint>;
    }
}
const Track = connect(
    undefined,
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(TrackComponent);

const User = ({ user }) => {
    return <span className="profile">
        {
            user.image_url ?
                <Link to={`/users/${user.name}`}>
                    <img src={`${user.image_url}`} alt={`@${user.name}`} />
                    <span className="name">@{user.name}</span>
                </Link> :
                <span className="name">@{user.name}</span>
        }
    </span>;
};

class AlbumComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { expanded: props.expanded };
        this._expand = () => this.setState({ expanded: true });
        this._collapse = () => this.setState({ expanded: false });
        this._playAll = () => this.props.playAll(this.props.tracks);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.expanded === newProps.expanded) {
            return;
        }
        if (newProps.expanded !== this.state.expanded) {
            this.setState({ expanded: newProps.expanded });
        }
    }

    render() {
        const [first, ...rest] = this.props.tracks;

        return <div className={`album${this.state.expanded ? " expanded" : ""}`}>
            <div className="album-meta">
                <h2>
                    「{first.collection_name}」
                    <button className="play-button" onClick={this._playAll}>▶</button>
                </h2>
            </div>
            <div className="album-tracks" key="tracks">
                <Track track={first} key={first.track_id} />
                {rest.map((track, i) => {
                    return this.state.expanded ?
                        <Track track={track} key={track.track_id} /> :
                        <div className="track dummy" style={{ zIndex: -(i + 1) }} key={track.track_id} />;
                })}
            </div>
            {this.state.expanded ||
                <div className="rest" key="rest">
                    <a onClick={this.state.expanded ? this._collapse : this._expand}>他{rest.length}曲をみる</a>
                </div>
            }
        </div>;
    }
}
const Album = connect(
    undefined,
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(AlbumComponent);

const GroupedTracks = ({ tracks, albumExpanded }) => {
    return tracks.reduce((albums, track) => {
        if (albums.length === 0) {
            albums.push([]);
        }
        const tracks = albums[albums.length - 1];
        const first = tracks[tracks.length - 1];
        if (first === undefined || track.collection_name === first.collection_name) {
            tracks.push(track);
        } else {
            albums.push([track]);
        }
        return albums;
    }, []).map(album => {
        if (album.length > 1) {
            const firstTrack = album[album.length - 1];
            return <Album
                tracks={album} expanded={albumExpanded}
                key={`${firstTrack.collection_id}-${firstTrack.track_id}`} />;
        } else {
            const track = album[0];
            return <Track track={track} key={track.track_id} />;
        }
    });
};

const Tracks = ({ tracks }) => {
    return tracks.map(track => {
        return <Track track={track} key={track.track_id} />;
    });
};

const Header = ({ genre, user }) => {
    return <header>
        <Helmet>
            <title>{`聴いてる${genre ? ` - ${genre}` : ""}${user ? ` - @${user}` : ""}`}</title>
        </Helmet>
        <h1><Link to="/">聴いてる</Link>{genre && ` - ${genre}`}{user && ` - @${user}`}</h1>
    </header>;
};

const Footer = () => {
    return <footer>
        &copy; 2016-2017 <a href="https://twitter.com/tomohi_ro">@tomohi_ro</a>
    </footer>;
};

class TracksPageComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        const lastMode = safeStorage.get("lastMode", "track");
        const lastAlbumExpanded = safeStorage.get("lastAlbumExpanded", "false");

        this.state = {
            tracks: [],
            nextPage: null,
            mode: lastMode,
            albumExpanded: (lastAlbumExpanded === "true")
        };

        this.timer = null;
        this._fetchMoreTracks = this.fetchMoreTracks.bind(this);

        const changeMode = (mode) => {
            this.setState({ mode: mode });
            safeStorage.set("lastMode", mode);
        };
        this._trackMode = () => changeMode("track");
        this._albumMode = () => changeMode("album");

        const changeExpanded = (expanded) => {
            this.setState({ albumExpanded: expanded });
            safeStorage.set("lastAlbumExpanded", expanded);
        };
        this._albumExpand = () => changeExpanded(true);
        this._albumCollapse = () => changeExpanded(false);
        this._scrollToTop = () => window.scrollTo(0, 0);
        this._playAll = () => this.props.playAll(this.state.tracks);
        this._clear = () => this.props.clear();
    }

    componentDidMount() {
        this.fetchTracks();
        this.timer = setInterval(
            () => this.fetchTracks(),
            10000,
        );
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    get hasNext() {
        return this.state.nextPage !== null;
    }

    fetchTracks(page) {
        const paging = page !== undefined;
        const endpoint = this.props.api + (paging ? `?page=${page}` : "");
        fetch(endpoint)
            .then(res => res.json())
            .then(json => this.updateTracks(json, paging))
            .catch(() => { }); // 握りつぶす
    }

    updateTracks(json, paging) {
        const firstTrack = this.state.tracks[0];
        const isFirstFetch = firstTrack === undefined;
        const tracks = paging ?
            this.state.tracks.concat(json.tracks) :
            isFirstFetch ? json.tracks :
                json.tracks.filter(track => {
                    return track.updated_at >= firstTrack.updated_at &&
                        track.track_id !== firstTrack.track_id;
                }).concat(this.state.tracks);

        const jsonNextPage = json.next_page || null;
        const nextPage = paging ? jsonNextPage :
            isFirstFetch ? jsonNextPage : this.state.nextPage;

        this.setState({
            tracks: tracks,
            nextPage: nextPage
        });
    }

    fetchMoreTracks() {
        const nextPage = this.state.nextPage;
        if (nextPage !== null) {
            this.setState({ nextPage: null });
            this.fetchTracks(nextPage);
        }
    }

    render() {
        const who = this.props.user ? `@${this.props.user}` : "僕か僕の知り合い";
        const genre = this.props.genre || "";

        const components = [
            <div id="description" key="description">
                <p>{who}が最近聴いた{genre}{this.state.tracks.length}曲です。</p>
            </div>,
            <nav id="menu" key="menu">
                <ul>
                    <li className="minimum">
                        <button className="play-button" onClick={this._playAll}>▶</button>
                    </li>
                    <li className="minimum">
                        <button className="stop-button" disabled={!this.props.playing} onClick={this.props.playing ? this._clear : () => { }}>
                            ■
                        </button>
                    </li>
                    <li>
                        <button onClick={this.state.mode === "track" ? this._albumMode : this._trackMode}>
                            {this.state.mode === "track" ? "アルバムごとにまとめる" : "曲をならべる"}
                        </button>
                    </li>
                    {this.state.mode === "album" &&
                        <li>
                            <button onClick={this.state.albumExpanded ? this._albumCollapse : this._albumExpand}>
                                {this.state.albumExpanded ? "アルバムを閉じる" : "アルバムを開く"}
                            </button>
                        </li>
                    }
                    <li>
                        <button onClick={this._scrollToTop}>
                            先頭にもどる
                        </button>
                    </li>
                </ul>
            </nav>,
            <div id="tracks" key="tracks" >
                {this.state.mode === "album" ?
                    <GroupedTracks tracks={this.state.tracks} albumExpanded={this.state.albumExpanded} /> :
                    <Tracks tracks={this.state.tracks} />
                }
            </div>
        ];
        if (this.hasNext) {
            components.push(
                <Waypoint key="waypoint" bottomOffset="-800px" onEnter={this._fetchMoreTracks}>
                    <div className="read-more">
                        <a onClick={this._fetchMoreTracks}>もっとみる</a>
                    </div>
                </Waypoint>
            );
        }
        return components;
    }
}
const TracksPage = connect(
    (state) => { return { playing: state.currentTrack || state.playList.length > 0 }; },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(TracksPageComponent);

class Genres extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            genreNames: []
        };
    }

    componentDidMount() {
        fetch("/api/genres")
            .then(res => res.json())
            .then(json => this.setState({
                genreNames: json.genre_names
            }));
    }

    render() {
        return <aside id="genres">
            <ul>
                <li key="all"><NavLink exact to="/" activeClassName="current">すべて</NavLink></li>
                {this.state.genreNames.map(genreName => {
                    return <li key={genreName}><NavLink to={`/genres/${encodeURIComponent(genreName)}`} activeClassName="current">{genreName}</NavLink></li>;
                })}
            </ul>
        </aside>;
    }
}

const Player = connect(
    (state) => { return { track: state.currentTrack }; },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(({ track, playNext }) => {
    if (track) {
        return <div id="player" className="track">
            <div className="image" >
                <div className="artwork" style={{ backgroundImage: `url(${track.thumbnail_url})` }} />
            </div >
            <div className="meta">
                <h2><a href={`${track.track_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.track_name}</a></h2>
                <a href={`${track.artist_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.artist_name}</a> - <a href={`${track.collection_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.collection_name}</a><br />
                <span className="genre"><Link to={`/genres/${encodeURIComponent(track.genre_name)}`}>{track.genre_name}</Link></span>・<span className="release">{new Date(track.released_at * 1000).getFullYear()}</span><br />
            </div>
            <div className="banner">
                <a href={`${track.track_view_url}&app=${track.app_type}`} rel="nofollow" target="_blank">
                    {
                        track.is_streamable ?
                            <img src="/image/JP_Listen_on_Apple_Music_Badge.svg" /> :
                            <img src="/image/Get_it_on_iTunes_Badge_JP_1214.svg" />
                    }
                </a>
            </div>
            <div className="clear"></div>
            <div className="preview">
                <audio
                    src={track.preview_url}
                    controls
                    ref={(audio) => audio && audio.load()}
                    onCanPlay={event => event.target.play()}
                    onPause={() => playNext()}
                ></audio>
                <br />
                <span>provided courtesy of iTunes</span>
            </div>
        </div >;
    } else {
        return <noscript />;
    }
});

const RecentTracksPage = () => {
    return <div id="contents">
        <div id="main">
            <Header />
            <TracksPage api="/api/tracks" />
            <Footer />
        </div>
        <div id="side">
            <Genres />
        </div>
    </div>;
};

const GenreTracksPage = ({ match }) => {
    const genre = match.params.genre;

    return <div id="contents">
        <div id="main">
            <Header genre={genre} />
            <TracksPage key={genre} genre={genre} api={`/api/genres/${genre}`} />
            <Footer />
        </div>
        <div id="side">
            <Genres key={genre} />
        </div>
    </div>;
};

const UserTracksPage = ({ match }) => {
    const user = match.params.user;

    return <div id="contents">
        <div id="main">
            <Header user={user} />
            <TracksPage key={user} user={user} api={`/api/users/${user}`} />
            <Footer />
        </div>
        <div id="side">
            <Genres />
        </div>
    </div>;
};

const App = () => {
    return <Router>
        <div>
            <Switch>
                <Route exact path="/" component={RecentTracksPage} />
                <Route path="/genres/:genre" component={GenreTracksPage} />
                <Route path="/users/:user" component={UserTracksPage} />
            </Switch>
            <Player />
        </div>
    </Router>;
};

const PLAY = "play";
const PLAY_ALL = "play_all";
const PLAY_NEXT = "play_next";
const CLEAR = "clear";

const actions = {
    play: (track) => {
        return {
            type: PLAY,
            track: track
        };
    },
    playAll: (tracks) => {
        return {
            type: PLAY_ALL,
            tracks: tracks
        };
    },
    playNext: () => {
        return {
            type: PLAY_NEXT
        };
    },
    clear: () => {
        return {
            type: CLEAR
        };
    }
};

const defaultState = {
    currentTrack: null,
    playList: []
};

function pick(tracks) {
    const copied = [ ...tracks ];
    const [picked] = copied.splice(Math.floor(Math.random() * copied.length), 1);
    return [picked, copied];
}

const reducer = (state = { ...defaultState }, action) => {
    switch (action.type) {
        case PLAY: {
            return { ...state, currentTrack: action.track, playList: [] };
        }
        case PLAY_ALL: {
            const [nextTrack, rest] = pick(action.tracks);
            return {
                ...state,
                currentTrack: nextTrack,
                playList: rest
            };
        }
        case PLAY_NEXT: {
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
        case CLEAR: {
            return { ...defaultState };
        }
        default: {
            return state;
        }
    }
};

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("container")
);
