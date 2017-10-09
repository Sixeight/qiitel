import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from "react-router-dom";

const Track = ({ track }) => {
    const releasedAt = new Date(track.released_at * 1000);
    const updatedAt = new Date(track.updated_at * 1000);

    return <div className="track">
        <div className="image">
            <div className="artwork" style={{ backgroundImage: `url(${track.thumbnail_url})` }}>
            </div>
            <a href={`${track.track_view_url}&app=${track.app_type}`} rel="nofollow" target="_blank">
                {
                    track.is_streamable ?
                        <img src="/img/JP_Listen_on_Apple_Music_Badge.svg" /> :
                        <img src="/img/Get_it_on_iTunes_Badge_JP_1214.svg" />
                }
            </a>
        </div>
        <div className="meta">
            <h2><a href={`${track.track_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.track_name}</a></h2>
            <a href={`${track.artist_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.artist_name}</a> - <a href={`${track.collection_view_url}&app=itunes`} rel="nofollow" target="_blank">{track.collection_name}</a><br />
            <span className="genre"><Link to={`/genres/${track.genre_name}`}>{track.genre_name}</Link></span>・<span className="release">{releasedAt.getFullYear()}</span><br />
            <time dateTime={updatedAt.toISOString()} title={updatedAt.toISOString()}>{updatedAt.toLocaleString()}</time>
            {track.user && <User user={track.user} />}
        </div>
        <div className="preview">
            <audio src={track.preview_url} controls></audio><br />
            <span>provided courtesy of iTunes</span>
        </div>
        <div className="clear"></div>
    </div>;
};

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

const Tracks = ({ tracks }) => {
    return tracks.map(track => {
        return <Track track={track} key={track.track_id} />;
    });
};

const Header = ({ genre }) => {
    return <header>
        <h1><Link to="/">聴いてる</Link>{genre && ` - ${genre}`}</h1>
    </header>;
};

const Footer = () => {
    return <footer>
        <a href="https://twitter.com/tomohi_ro">@tomohi_ro</a>
    </footer>;
};

class TracksPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
        };
        this.timer = null;
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

    fetchTracks() {
        fetch(this.props.api)
            .then(res => res.json())
            .then(json => {
                this.setState({ tracks: json.tracks });
            });
    }

    render() {
        const who = this.props.user ? `@${this.props.user}` : "僕か僕の知り合い";
        const genre = this.props.genre || "";

        return [
            <p key="description">{who}が最近聴いた{genre}{this.state.tracks.length}曲です。</p>,
            <Tracks key="tracks" tracks={this.state.tracks} />
        ];
    }
}

const RecentTracksPage = () => {
    return <div>
        <Header />
        <TracksPage api="/api/tracks" />
        <Footer />
    </div>;
};

const GenreTracksPage = ({ match }) => {
    const genre = match.params.genre;

    return <div>
        <Header genre={genre} />
        <TracksPage genre={genre} api={`/api/genres/${genre}`} />
        <Footer />
    </div>;
};

const UserTracksPage = ({ match }) => {
    const user = match.params.user;

    return <div>
        <Header />
        <TracksPage user={user} api={`/api/users/${user}`} />
        <Footer />
    </div>;
};

const App = () => {
    return <Router>
        <Switch>
            <Route exact path="/" component={RecentTracksPage} />
            <Route path="/genres/:genre" component={GenreTracksPage} />
            <Route path="/users/:user" component={UserTracksPage} />
        </Switch>
    </Router>;
};

ReactDOM.render(
    <App />,
    document.getElementById("container")
);
