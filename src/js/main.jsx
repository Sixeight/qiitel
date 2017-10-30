import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from "redux";
import { Provider, connect } from "react-redux";
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import { composeWithDevTools } from "redux-devtools-extension";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import "whatwg-fetch";
import {
    Router,
    Route,
    Switch,
    Link,
    NavLink
} from "react-router-dom";
import "../scss/main.scss";

import * as actions from "./redux/actions";
import appReducer from "./redux/reducers";

class TrackComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            shown: false
        };

        this._shown = this.shown.bind(this);
        this._play = () => this.props.play(this.props.track);
        this._focus = (element) => this.props.focus(element);
        this._select = () => this.props.selectTrack(this.props.track);
    }

    shown() {
        this.setState({ shown: true });
    }

    render() {
        const track = this.props.track;
        const selected = this.props.selected;
        const releasedAt = new Date(track.released_at * 1000);
        const updatedAt = new Date(track.updated_at * 1000);

        return <Waypoint onEnter={this._shown}>
            <div
                className={`track${selected ? " selected" : ""}`}
                onClick={this._select}
                ref={(div) => div && selected && this._focus(div)}
            >
                <div className="image">
                    <div className="artwork" style={this.state.shown ? { backgroundImage: `url(${track.thumbnail_url})` } : {}}>
                    </div>
                </div>
                <div className="data">
                    <div className="title">
                        <h2><a href={track.track_view_ur} rel="nofollow" target="_blank">{track.track_name}</a></h2>
                        <span className="play-button">
                            <button onClick={this._play}>プレビュー<i className="fa fa-play-circle-o" aria-hidden="true"></i></button>
                        </span>
                    </div>
                    <div className="info">
                        <ul className="meta">
                            <li>
                                <a href={track.artist_view_url} rel="nofollow" target="_blank">
                                    <i className="qi-artist" aria-hidden="true"></i> <i className="fa fa-angle-right" aria-hidden="true"></i> {track.artist_name}
                                </a>
                            </li>
                            <li>
                                <a href={track.collection_view_url} rel="nofollow" target="_blank">
                                    <i className="qi-album" aria-hidden="true"></i> <i className="fa fa-angle-right" aria-hidden="true"></i> {track.collection_name} ({releasedAt.getFullYear()})
                                </a>
                            </li>
                            <li className="genre">
                                <Link to={`/genres/${encodeURIComponent(track.genre_name)}`}>{track.genre_name}</Link>
                            </li>
                        </ul>
                        <div className="external">
                            <a href={track.track_view_url} rel="nofollow" target="_blank">
                                {
                                    track.is_streamable ?
                                        <img src="/image/JP_Listen_on_Apple_Music_Badge.svg" /> :
                                        <img src="/image/Get_it_on_iTunes_Badge_JP_1214.svg" />
                                }
                            </a>
                            <div className="listener">
                                {track.user && <User user={track.user} />}
                                <time dateTime={updatedAt.toISOString()} title={updatedAt.toISOString()}>{updatedAt.toLocaleString()}</time>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Waypoint>;
    }
}
const Track = connect(
    (state, props) => {
        return {
            selected: state.app.pointer.active && props.track === state.app.pointer.tracks[state.app.pointer.index]
        };
    },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(TrackComponent);

const User = ({ user }) => {
    return <span className="profile">
        {
            user.image_url ?
                <Link to={`/users/${user.name}`} title={`@${user.name}`}>
                    <img src={`${user.image_url}`} alt={`@${user.name}`} />
                </Link> :
                <span className="name">@{user.name}</span>
        }
    </span>;
};

class AlbumComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this._expand = () => this.props.expandAlbumSingle(this.props.tracks[0].collection_id);
        this._playAll = () => this.props.playAll(this.props.tracks);
    }

    render() {
        const [first, ...rest] = this.props.tracks;

        return <div className={`album${this.props.isAlbumExpanded ? " expanded" : ""}`}>
            <div className="album-meta">
                <button className="play-button" onClick={this._playAll}>
                    <h2><i className="qi-album" aria-hidden="true"></i>{first.collection_name}</h2>
                    <span className="play-button">まとめてプレビュー<i className="fa fa-play-circle-o" aria-hidden="true"></i></span>
                </button>
            </div>
            <div className="album-tracks" key="tracks">
                <Track track={first} key={first.track_id} />
                <div className="stacks">
                    {rest.map((track) => {
                        return this.props.isAlbumExpanded ?
                            <Track track={track} key={track.track_id} /> :
                            <div className="stack" key={track.track_id} />;
                    })}
                </div>
            </div>
            {this.props.isAlbumExpanded ||
                <div className="rest" key="rest">
                    <a onClick={this.props.isAlbumExpanded ? this._collapse : this._expand}>他{rest.length}曲をみる</a>
                </div>
            }
        </div>;
    }
}
const Album = connect(
    (state, props) => {
        const collectionId = props.tracks[0].collection_id;
        const albumExpandMap = state.app.list.albumExpandMap;
        return {
            isAlbumExpanded: props.expanded || albumExpandMap[collectionId] || false
        };
    },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(AlbumComponent);

const GroupedTracks = ({ tracks, albumExpanded }) => {
    return tracks.reduce((albums, track) => {
        if (albums.length === 0) {
            albums.push([]);
        }
        const tracks = albums[albums.length - 1];
        const first = tracks[tracks.length - 1];
        if (first === undefined || track.collection_id === first.collection_id) {
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

const Header = ({ genre, user, artist }) => {
    const genre_or_artist = genre || artist;
    return <header>
        <Helmet>
            <title>{`聴いてる${genre_or_artist ? ` - ${genre_or_artist}` : ""}${user ? ` - @${user}` : ""}`}</title>
        </Helmet>
        <h1><Link to="/">聴いてる</Link>{genre_or_artist && ` - ${genre_or_artist}`}{user && ` - @${user}`}</h1>
    </header>;
};

const Footer = () => {
    return <footer>
        &copy; 2017 <a href="https://twitter.com/tomohi_ro">@tomohi_ro</a> / <a href="https://twitter.com/sailtask">@sailtask</a>
    </footer>;
};

class TracksPageComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
            nextPage: null
        };

        this.timer = null;
        this._fetchMoreTracks = this.fetchMoreTracks.bind(this);

        this._changeModeToTrack = () => this.props.changeListModeToTrack();
        this._changeModeToAlbum = () => this.props.changeListModeToAlbum();

        this._expandAlbum = () => this.props.expandAlbum();
        this._collapseAlbum = () => this.props.collapseAlbum();
        this._scrollToTop = () => {
            window.scrollTo(0, 0);
            this.props.moveReset();
        };
        this._playAll = () => this.props.playAll(this.state.tracks);
        this._clear = () => this.props.clear();
    }

    componentDidMount() {
        this.fetchTracks();
        this.timer = setInterval(
            () => this.fetchTracks(),
            10000,
        );
        this.props.moveReset();
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

        this.props.setupList(tracks);
    }

    fetchMoreTracks() {
        const nextPage = this.state.nextPage;
        if (nextPage !== null) {
            this.setState({ nextPage: null });
            this.fetchTracks(nextPage);
        }
    }

    artistLink() {
        const firstTrack = this.state.tracks[0];
        if (firstTrack) {
            return <a href={firstTrack.artist_view_url} target="_blank" rel="nofollow">
                {firstTrack.artist_name}
            </a>;
        }
        return "";
    }

    render() {
        const who = this.props.user ? `@${this.props.user}` : "僕か僕の知り合い";
        const genre = this.props.genre || "";
        const artist = this.props.artist;

        const components = [
            <div id="description" key="description">
                <p>{who}が最近聴いた{genre}{artist && <span> {this.artistLink()} の</span>}{this.state.tracks.length}曲です。</p>
                <ul id="view">
                    <li>
                        <button className="play-button" onClick={this._playAll}>
                            <i className="fa fa-play fa-fw" aria-hidden="true"></i>
                        </button>
                    </li>
                    <li>
                        <button className="stop-button" disabled={!this.props.playing} onClick={this.props.playing ? this._clear : () => { }}>
                            <i className="fa fa-stop fa-fw" aria-hidden="true"></i>
                        </button>
                    </li>
                    <li>
                        <button>
                            <i className="fa fa-list-ul fa-fw" aria-hidden="true"></i>
                        </button>
                    </li>
                    <li>
                        <button>
                            <i className="fa fa-th-large fa-fw" aria-hidden="true"></i>
                        </button>
                    </li>
                </ul>
            </div>,
            // ↑ 押下で.trackの表示切り替えが出来たらいいな 😕
            <nav id="menu" key="menu">
                <ul id="menu-primary">
                    <li>
                        <button onClick={this.props.isAlbumMode ? this._changeModeToTrack : this._changeModeToAlbum}>
                            <i className="qi-album" aria-hidden="true"></i>
                            {this.props.isAlbumMode ? "アルバム表示 ON" : "アルバム表示 OFF"}
                        </button>
                    </li>
                    <li>
                        <button onClick={this._scrollToTop}>
                            <i className="fa fa-chevron-up" aria-hidden="true"></i>
                            TOP
                        </button>
                    </li>
                </ul>
                {this.props.isAlbumMode &&
                    <ul id="menu-secondary">
                        <button onClick={this.props.isAlbumExpanded ? this._collapseAlbum : this._expandAlbum}>
                            <i className="fa fa-folder" aria-hidden="true"></i>
                            {this.props.isAlbumExpanded ? "OPEN" : "CLOSE"}
                        </button>
                    </ul>
                }
            </nav>,
            <div id="tracks" key="tracks" >
                {this.props.isAlbumMode ?
                    <GroupedTracks tracks={this.state.tracks} albumExpanded={this.props.isAlbumExpanded} /> :
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
    (state) => {
        return {
            playing: state.app.play.currentTrack || state.app.play.playList.length > 0,
            isAlbumMode: state.app.list.mode === actions.listMode.album,
            isAlbumExpanded: state.app.list.albumMode === actions.albumMode.expanded
        };
    },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(TracksPageComponent);

const Genres = connect(
    (state) => { return { genreNames: state.app.genre.names }; }
)(({ genreNames }) => {
    return <aside id="genres">
        <h2>ジャンル一覧</h2>
        <ul>
            <li key="all"><NavLink exact to="/" activeClassName="current">すべて</NavLink></li>
            {genreNames.map(genreName => {
                return <li key={genreName}>
                    <NavLink
                        to={`/genres/${encodeURIComponent(genreName)}`}
                        activeClassName="current"
                        isActive={(match, location) => { return decodeURIComponent(location.pathname) === `/genres/${genreName}`; }}
                    >{genreName}</NavLink>
                </li>;
            })}
        </ul>
    </aside>;
});

const Player = connect(
    (state) => { return { track: state.app.play.currentTrack }; },
    (dispatch) => { return { ...bindActionCreators(actions, dispatch) }; }
)(({ track, playNext }) => {
    if (track) {
        return <div id="player" className="track">
            <div className="image" >
                <div className="artwork" style={{ backgroundImage: `url(${track.thumbnail_url})` }} />
            </div>
            <div className="meta">
                <h2><a href={track.track_view_url} rel="nofollow" target="_blank">{track.track_name}</a></h2>
                <a href={track.artist_view_url} rel="nofollow" target="_blank">{track.artist_name}</a> - <a href={track.collection_view_url} rel="nofollow" target="_blank">{track.collection_name}</a><br />
                <span className="genre"><Link to={`/genres/${encodeURIComponent(track.genre_name)}`}>{track.genre_name}</Link></span>・<span className="release">{new Date(track.released_at * 1000).getFullYear()}</span><br />
            </div>
            <div className="banner">
                <a href={track.track_view_url} rel="nofollow" target="_blank">
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
                    volume="0.1"
                    controls
                    ref={(audio) => audio && audio.load()}
                    onCanPlay={event => event.target.play()}
                    onPause={(event) => {
                        const audio = event.target;
                        if (audio.duration <= audio.currentTime) { playNext(); }
                    }}
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
        <Header />
        <article>
            <div id="main">
                <TracksPage api="/api/tracks" />
            </div>
            <div id="side">
                <Genres />
            </div>
        </article>
        <Footer />
    </div>;
};

const GenreTracksPage = ({ match }) => {
    const genre = match.params.genre;
    const decodedGenre = decodeURIComponent(genre);

    return <div id="contents">
        <Header genre={decodedGenre} />
        <article>
            <div id="main">
                <TracksPage key={genre} genre={decodedGenre} api={`/api/genres/${genre}`} />
            </div>
            <div id="side">
                <Genres key={genre} />
            </div>
        </article>
        <Footer />
    </div>;
};

const UserTracksPage = ({ match }) => {
    const user = match.params.user;

    return <div id="contents">
        <Header user={user} />
        <article>
            <div id="main">
                <TracksPage key={user} user={user} api={`/api/users/${user}`} />
            </div>
            <div id="side">
                <Genres />
            </div>
        </article>
        <Footer />
    </div>;
};

const ArtistTracksPage = ({ match }) => {
    const artist = match.params.artist;
    const artist_id = match.params.artist_id;

    return <div id="contents">
        <div id="main">
            <Header artist={artist} />
            <TracksPage key={artist_id} artist={artist} api={`/api/artists/${artist_id}`} />
            <Footer />
        </div>
        <div id="side">
            <Genres />
        </div>
    </div>;
};

const App = () => {
    return <div>
        <Switch>
            <Route exact path="/" component={RecentTracksPage} />
            <Route path="/genres/:genre+" component={GenreTracksPage} />
            <Route path="/users/:user" component={UserTracksPage} />
            <Route path="/artists/:artist+/:artist_id" component={ArtistTracksPage} />
        </Switch>
        <Player />
    </div>;
};

const history = createHistory();

const store = createStore(
    combineReducers({
        app: appReducer,
        router: routerReducer
    }),
    composeWithDevTools(
        applyMiddleware(thunk, routerMiddleware(history))
    )
);

store.dispatch(actions.fetchGenres());
store.dispatch(actions.watchKeyboard());

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Router history={history}>
                <App />
            </Router>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("container")
);
