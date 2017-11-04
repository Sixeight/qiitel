import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from "redux";
import { Provider, connect } from "react-redux";
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import { CSSTransition } from "react-transition-group";
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
                    <a href={track.track_view_url} rel="nofollow" target="_blank">
                        {
                            track.is_streamable ?
                                <img src="/image/JP_Listen_on_Apple_Music_Badge.svg" /> :
                                <img src="/image/Get_it_on_iTunes_Badge_JP_1214.svg" />
                        }
                    </a>
                </div>
                <div className="meta">
                    <h2><a href={track.track_view_url} rel="nofollow" target="_blank">{track.track_name}</a></h2>
                    <a href={track.artist_view_url} rel="nofollow" target="_blank">{track.artist_name}</a> - <a href={track.collection_view_url} rel="nofollow" target="_blank">{track.collection_name}</a><br />
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
        this._expand = () => this.props.expandAlbumSingle(this.props.tracks[0].collection_id);
        this._playAll = () => this.props.playAll(this.props.tracks);
        this._loadStarEntries = (ref) => window.Hatena.Star.EntryLoader.loadNewEntries(ref);
    }

    render() {
        const [first, ...rest] = this.props.tracks;

        return <div
            className={`album${this.props.isAlbumExpanded ? " expanded" : ""}`}
            ref={(ref) => ref && this._loadStarEntries(ref)}>

            <div className="album-meta">
                <h2>
                    「{first.collection_name}」
                    <button className="play-button" onClick={this._playAll}>▶</button>
                </h2>
            </div>
            <div className="album-tracks" key="tracks">
                <Track track={first} key={first.track_id} />
                {rest.map((track, i) => {
                    return this.props.isAlbumExpanded ?
                        <Track track={track} key={track.track_id} /> :
                        <div className="track dummy" style={{ zIndex: -(i + 1) }} key={track.track_id} />;
                })}
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
        &copy; 2016-2017 <a href="https://twitter.com/tomohi_ro">@tomohi_ro</a>
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
        this._loadStarEntries = (ref) => window.Hatena.Star.EntryLoader.loadNewEntries(ref);
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
                        <button onClick={this.props.isAlbumMode ? this._changeModeToTrack : this._changeModeToAlbum}>
                            {this.props.isAlbumMode ? "曲をならべる" : "アルバムごとにまとめる"}
                        </button>
                    </li>
                    {this.props.isAlbumMode &&
                        <li>
                            <button onClick={this.props.isAlbumExpanded ? this._collapseAlbum : this._expandAlbum}>
                                {this.props.isAlbumExpanded ? "アルバムを閉じる" : "アルバムを開く"}
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
            <div id="tracks" key="tracks" ref={ref => this._loadStarEntries(ref)}>
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
    const decodedGenre = decodeURIComponent(genre);

    return <div id="contents">
        <div id="main">
            <Header genre={decodedGenre} />
            <TracksPage key={genre} genre={decodedGenre} api={`/api/genres/${genre}`} />
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

const KeyboardShortcutHelp = connect(
    state => { return { shown: state.app.help.shown }; },
    dispatch => { return { ...bindActionCreators(actions, dispatch) }; }
)(({ shown, toggleHelp }) => {
    return <CSSTransition classNames="popup-transition" timeout={50} in={shown} mountOnEnter={true} unmountOnExit={true}>
        <div id="keyboard-shortcut-help" className="popup-dim" onClick={() => toggleHelp()}>
            <div className="popup-content" onClick={(event) => event.stopPropagation()}>
                <article className="help">
                    <header>
                        <h1>キーボードショートカット</h1>
                        <button onClick={() => toggleHelp()}>&times;</button>
                    </header>
                    <div className="help-contents">
                        <section className="move">
                            <h2>移動</h2>
                            <dl>
                                <dt><kbd>J</kbd></dt><dd>次の曲へ</dd>
                                <dt><kbd>K</kbd></dt><dd>前の曲へ</dd>
                                <dt><kbd>G</kbd></dt><dd>選択している曲のジャンルページへ移動</dd>
                                <dt><kbd>Shift</kbd> + <kbd>G</kbd></dt><dd>すべての曲へ移動</dd>
                                <dt><kbd>M</kbd></dt><dd>選択している曲のアーティストページへ移動</dd>
                                <dt><kbd>Shift</kbd> + <kbd>M</kbd></dt><dd>すべての曲へ移動</dd>
                                <dt><kbd>U</kbd></dt><dd>選択している曲を最後に聴いたユーザーのページへ移動</dd>
                                <dt><kbd>Shift</kbd> + <kbd>U</kbd></dt><dd>すべての曲へ移動</dd>
                                <dt><kbd>T</kbd></dt><dd>先頭に移動</dd>
                                <dt><kbd>O</kbd></dt><dd>開く</dd>
                                <dt><kbd>Shift</kbd> + <kbd>O</kbd></dt><dd>再生中の曲を開く</dd>
                            </dl>
                        </section>
                        <section className="play">
                            <h2>再生</h2>
                            <dl>
                                <dt><kbd>P</kbd></dt><dd>シャッフル再生</dd>
                                <dt><kbd>Shift</kbd> + <kbd>P</kbd></dt><dd>選択しているアーティストをシャッフル再生</dd>
                                <dt><kbd>Enter</kbd></dt><dd>選択している曲を再生</dd>
                                <dt><kbd>Shift</kbd> + <kbd>Enter</kbd></dt><dd>選択しているアルバムをシャッフル再生</dd>
                                <dt><kbd>.</kbd> / <kbd>S</kbd> / <kbd>Escape</kbd></dt><dd>停止</dd>
                            </dl>
                        </section>
                        <section className="list">
                            <h2>リスト操作</h2>
                            <dl>
                                <dt><kbd>A</kbd></dt><dd>アルバム表示をトグル</dd>
                                <dt><kbd>Shift</kbd> + <kbd>A</kbd></dt><dd>全アルバムの曲展開をトグル</dd>
                                <dt><kbd>L</kbd></dt><dd>アルバムの曲展開をトグル</dd>
                            </dl>
                        </section>
                    </div>
                </article>
            </div>
        </div>
    </CSSTransition>;
});

const App = () => {
    return <div>
        <Switch>
            <Route exact path="/" component={RecentTracksPage} />
            <Route path="/genres/:genre+" component={GenreTracksPage} />
            <Route path="/users/:user" component={UserTracksPage} />
            <Route path="/artists/:artist+/:artist_id" component={ArtistTracksPage} />
        </Switch>
        <Player />
        <KeyboardShortcutHelp />
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

history.listen((location) => {
    store.dispatch(actions.gaEvent("page_view", {
        page_path: location.pathname + location.search
    }));
});

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
