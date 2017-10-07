import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


const Track = ({ track }) => {
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
            <span className="genre"><a href={`/genres/${track.genre_name}`}>[{track.genre_name}]</a></span><br />
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
                <a href={`/users/${user.name}/tracks`}>
                    <img src={`${user.image_url}`} alt={`@${user.name}`} />
                    <span className="name">@{user.name}</span>
                </a> :
                <span className="name">@{user.name}</span>
        }
    </span>;
};

const Tracks = ({ tracks }) => {
    return tracks.map(track => {
        return <Track track={track} key={track.track_id} />
    });
};

const Header = ({ trackCount }) => {
    return <header>
        <h1>聴いてる</h1>
        僕か僕の知り合いが最近聴いた{trackCount}曲です。
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
        return [
            <Header key="header" trackCount={this.state.tracks.length} />,
            <Tracks key="tracks" tracks={this.state.tracks} />,
            <Footer key="footer" />
        ];
    }
}

const RecentTracksPage = () => {
    return <TracksPage api="/api/tracks" />;
};

const App = () => {
    return <Router>
        <Route exact path="/" component={RecentTracksPage} />
    </Router>;
};

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
