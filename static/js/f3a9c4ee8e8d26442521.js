webpackJsonp([1],{"/aC4":function(e,t,n){"use strict";function a(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e){var t=[].concat(a(e)),n=t.splice(Math.floor(Math.random()*t.length),1);return[c(n,1)[0],t]}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){var n=[],a=!0,r=!1,l=void 0;try{for(var c,u=e[Symbol.iterator]();!(a=(c=u.next()).done)&&(n.push(c.value),!t||n.length!==t);a=!0);}catch(e){r=!0,l=e}finally{try{!a&&u.return&&u.return()}finally{if(r)throw l}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i=n("2KeS"),o=n("KKqu"),s=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(o),d=n("VbiM"),f=function(e){return e&&e.__esModule?e:{default:e}}(d),p=f.default.get("lastMode",s.listMode.track),m=f.default.get("lastAlbumMode",s.albumMode.collapsed),_={mode:p,albumMode:m,albumExpandMap:{}},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_,t=arguments[1];switch(t.type){case s.CHANGE_LIST_MODE:return f.default.set("lastMode",t.mode),u({},e,{mode:t.mode});case s.CHANGE_ALBUM_MODE:return f.default.set("lastAlbumMode",t.mode),u({},e,{albumMode:t.mode,albumExpandMap:{}});case s.CHANGE_ALBUM_EXPANDED_SINGLE:var n=e.albumExpandMap;return u({},e,{albumExpandMap:u({},n,r({},t.collection_id,t.expanded))});default:return e}},h={currentTrack:null,playList:[]},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u({},h),t=arguments[1];switch(t.type){case s.PLAY:return u({},e,{currentTrack:t.track,playList:[]});case s.PLAY_ALL:var n=l(t.tracks),a=c(n,2),r=a[0],i=a[1];return u({},e,{currentTrack:r,playList:i});case s.PLAY_NEXT:var o=l(e.playList),d=c(o,2),f=d[0],p=d[1];return f?u({},e,{currentTrack:f,playList:p}):e;case s.CLEAR:return u({},h);default:return e}},k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{index:0,tracks:[],active:!1},t=arguments[1];switch(t.type){case s.SWITCH_POINTER:return u({},e,{active:t.active});case s.MOVE_RESET:return u({},e,{active:!1,index:0});case s.MOVE_TO:return e.active?u({},e,{index:Math.min(Math.max(t.index,0),e.tracks.length-1)}):u({},e,{active:!0});case s.UPDATE_INDEX:return u({},e,{index:Math.min(Math.max(t.index,0),e.tracks.length-1)});case s.SETUP_LIST:return u({},e,{tracks:t.tracks});default:return e}},b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{names:[]},t=arguments[1];switch(t.type){case s.UPDATE_GENRES:return u({},e,{names:t.genreNames});default:return e}};t.default=(0,i.combineReducers)({list:E,play:v,pointer:k,genre:b})},KKqu:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.updateGenres=t.fetchGenres=t.watchKeyboard=t.selectTrack=t.focus=t.setupList=t.updateIndex=t.moveTo=t.moveReset=t.switchPointer=t.clear=t.playNext=t.playAll=t.play=t.collapseAlbumSingle=t.expandAlbumSingle=t.expandAlbum=t.collapseAlbum=t.changeListModeToAlbum=t.changeListModeToTrack=t.UPDATE_GENRES=t.SETUP_LIST=t.UPDATE_INDEX=t.MOVE_TO=t.MOVE_RESET=t.SWITCH_POINTER=t.CLEAR=t.PLAY_NEXT=t.PLAY_ALL=t.PLAY=t.albumMode=t.listMode=t.CHANGE_ALBUM_EXPANDED_SINGLE=t.CHANGE_ALBUM_MODE=t.CHANGE_LIST_MODE=void 0,n("rplX");var a=t.CHANGE_LIST_MODE="change_list_mode",r=t.CHANGE_ALBUM_MODE="change_album_mode",l=t.CHANGE_ALBUM_EXPANDED_SINGLE="change_album_expanded_single",c=t.listMode={track:"track",album:"album"},u=t.albumMode={collapsed:"collapsed",expanded:"expnded"},i=t.PLAY="play",o=t.PLAY_ALL="play_all",s=t.PLAY_NEXT="play_next",d=t.CLEAR="clear",f=t.SWITCH_POINTER="switch_pointer",p=t.MOVE_RESET="move_reset",m=t.MOVE_TO="move_to",_=t.UPDATE_INDEX="update_index",E=t.SETUP_LIST="setup_list",h=t.UPDATE_GENRES="fetch_genres",v=(t.changeListModeToTrack=function(){return v(c.track)},t.changeListModeToAlbum=function(){return v(c.album)},function(e){return{type:a,mode:e}}),k=(t.collapseAlbum=function(){return k(u.collapsed)},t.expandAlbum=function(){return k(u.expanded)},function(e){return{type:r,mode:e}}),b=(t.expandAlbumSingle=function(e){return b(e,!0)},t.collapseAlbumSingle=function(e){return b(e,!1)},function(e,t){return{type:l,collection_id:e,expanded:t}}),y=t.play=function(e){return{type:i,track:e}},g=t.playAll=function(e){return{type:o,tracks:e}},A=(t.playNext=function(){return{type:s}},t.clear=function(){return{type:d}}),x=t.switchPointer=function(e){return{type:f,active:e}},T=t.moveReset=function(){return{type:p}},M=t.moveTo=function(e){return{type:m,index:e}},w=t.updateIndex=function(e){return{type:_,index:e}},N=(t.setupList=function(e){return{type:E,tracks:e}},t.focus=function(e){return function(){var t=e.offsetTop-window.innerHeight/2;window.scrollTo(0,t)}},t.selectTrack=function(e){return function(t,n){var a=n().app.pointer,r=a.tracks.indexOf(e);t(x(!1)),t(w(r))}},t.watchKeyboard=function(){var e=function(e){var t=e.app.list,n=e.app.pointer,a=n.index+1;if(t.mode===c.track||t.albumMode===u.expanded)return a;var r=n.tracks[n.index];return!r||t.albumExpandMap[r.collection_id]?a:a+n.tracks.slice(n.index+1).findIndex(function(e){return e.collection_id!==r.collection_id})},t=function(e){var t=e.app.list,n=e.app.pointer,a=n.index-1;if(t.mode===c.track||t.albumMode===u.expanded)return a;var r=n.tracks[n.index];if(!r)return a;var l=n.tracks.slice(0,n.index).reverse(),i=l.findIndex(function(e){return e.collection_id!==r.collection_id}),o=l[i];if(!o||t.albumExpandMap[o.collection_id])return a;var s=l.slice(i+1),d=s.findIndex(function(e){return e.collection_id!==o.collection_id}),f=0===i||!t.albumExpandMap[r.collection_id];return-1===d&&f?0:f?a-(i+d):a},n=function(e){var t=e.app.pointer,n=t.tracks[t.index];if(!n)return-1;var a=t.tracks.slice(0,t.index).reverse(),r=a.findIndex(function(e){return e.collection_id!==n.collection_id});return-1===r?0:t.index-r};return function(a,r){window.addEventListener("click",function(){r().app.pointer.active&&a(x(!1))}),window.addEventListener("keydown",function(l){var i=r().app,o=i.pointer,s=i.list;switch(l.code){case"KeyJ":a(M(e(r())));break;case"KeyK":a(M(t(r())));break;case"KeyP":if(l.shiftKey){var d=o.active&&o.tracks[o.index];if(d){var f=o.tracks.filter(function(e){return e.artist_id===d.artist_id});a(g(f));break}}a(g(o.tracks));break;case"Enter":var p=o.active&&o.tracks[o.index];if(!p)break;if(l.preventDefault(),l.shiftKey){var m=n(r()),_=o.tracks.slice(m),E=_.findIndex(function(e){return e.collection_id!==p.collection_id});a(g(_.slice(0,E)))}else a(y(p));break;case"Escape":case"KeyS":a(A()),a(x(!1));break;case"Tab":a(x(!1));break;case"KeyL":var h=o.active&&o.tracks[o.index];if(h){var w=h.collection_id,N=s.albumExpandMap[w]||!1;a(b(w,!N)),a(M(n(r())))}break;case"KeyA":if(l.shiftKey){var L=s.albumMode===u.expanded?u.collapsed:u.expanded;a(k(L))}else{var P=s.mode===c.album?c.track:c.album;a(v(P))}a(x(!1));break;case"KeyT":window.scrollTo(0,0),a(T())}})}},t.fetchGenres=function(){return function(e){fetch("/api/genres").then(function(e){return e.json()}).then(function(t){return e(N(t.genre_names))}).catch(function(e){console.log(e)})}},t.updateGenres=function(e){return{type:h,genreNames:e}})},NF59:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e){return Array.isArray(e)?e:Array.from(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n("GiK3"),d=a(s),f=n("O27J"),p=a(f),m=n("2KeS"),_=n("RH2O"),E=n("MT/C"),h=n("4ufr"),v=a(h),k=n("ciQf"),b=a(k),y=n("gFN5"),g=n("TKwO"),A=a(g),x=n("PIAa");n("rplX");var T=n("F8kA");n("hvFc");var M=n("KKqu"),w=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(M),N=n("/aC4"),L=a(N),P=function(e){function t(e){l(this,t);var n=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={shown:!1},n._shown=n.shown.bind(n),n._play=function(){return n.props.play(n.props.track)},n._focus=function(e){return n.props.focus(e)},n._select=function(){return n.props.selectTrack(n.props.track)},n}return u(t,e),o(t,[{key:"shown",value:function(){this.setState({shown:!0})}},{key:"render",value:function(){var e=this,t=this.props.track,n=this.props.selected,a=new Date(1e3*t.released_at),r=new Date(1e3*t.updated_at);return d.default.createElement(A.default,{onEnter:this._shown},d.default.createElement("div",{className:"track"+(n?" selected":""),onClick:this._select,ref:function(t){return t&&n&&e._focus(t)}},d.default.createElement("div",{className:"image"},d.default.createElement("div",{className:"artwork",style:this.state.shown?{backgroundImage:"url("+t.thumbnail_url+")"}:{}}),d.default.createElement("a",{href:t.track_view_url+"&app="+t.app_type,rel:"nofollow",target:"_blank"},t.is_streamable?d.default.createElement("img",{src:"/image/JP_Listen_on_Apple_Music_Badge.svg"}):d.default.createElement("img",{src:"/image/Get_it_on_iTunes_Badge_JP_1214.svg"}))),d.default.createElement("div",{className:"meta"},d.default.createElement("h2",null,d.default.createElement("a",{href:t.track_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.track_name)),d.default.createElement("a",{href:t.artist_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.artist_name)," - ",d.default.createElement("a",{href:t.collection_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.collection_name),d.default.createElement("br",null),d.default.createElement("span",{className:"genre"},d.default.createElement(T.Link,{to:"/genres/"+encodeURIComponent(t.genre_name)},t.genre_name)),"・",d.default.createElement("span",{className:"release"},a.getFullYear()),d.default.createElement("br",null),d.default.createElement("time",{dateTime:r.toISOString(),title:r.toISOString()},r.toLocaleString()),t.user&&d.default.createElement(C,{user:t.user})),d.default.createElement("div",{className:"play-button"},d.default.createElement("button",{onClick:this._play},"プレビュー")),d.default.createElement("div",{className:"clear"})))}}]),t}(d.default.PureComponent),O=(0,_.connect)(function(e,t){return{selected:e.app.pointer.active&&t.track===e.app.pointer.tracks[e.app.pointer.index]}},function(e){return i({},(0,m.bindActionCreators)(w,e))})(P),C=function(e){var t=e.user;return d.default.createElement("span",{className:"profile"},t.image_url?d.default.createElement(T.Link,{to:"/users/"+t.name},d.default.createElement("img",{src:""+t.image_url,alt:"@"+t.name}),d.default.createElement("span",{className:"name"},"@",t.name)):d.default.createElement("span",{className:"name"},"@",t.name))},S=function(e){function t(e){l(this,t);var n=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n._expand=function(){return n.props.expandAlbumSingle(n.props.tracks[0].collection_id)},n._playAll=function(){return n.props.playAll(n.props.tracks)},n}return u(t,e),o(t,[{key:"render",value:function(){var e=this,t=r(this.props.tracks),n=t[0],a=t.slice(1);return d.default.createElement("div",{className:"album"+(this.props.isAlbumExpanded?" expanded":"")},d.default.createElement("div",{className:"album-meta"},d.default.createElement("h2",null,"「",n.collection_name,"」",d.default.createElement("button",{className:"play-button",onClick:this._playAll},"▶"))),d.default.createElement("div",{className:"album-tracks",key:"tracks"},d.default.createElement(O,{track:n,key:n.track_id}),a.map(function(t,n){return e.props.isAlbumExpanded?d.default.createElement(O,{track:t,key:t.track_id}):d.default.createElement("div",{className:"track dummy",style:{zIndex:-(n+1)},key:t.track_id})})),this.props.isAlbumExpanded||d.default.createElement("div",{className:"rest",key:"rest"},d.default.createElement("a",{onClick:this.props.isAlbumExpanded?this._collapse:this._expand},"他",a.length,"曲をみる")))}}]),t}(d.default.PureComponent),I=(0,_.connect)(function(e,t){var n=t.tracks[0].collection_id,a=e.app.list.albumExpandMap;return{isAlbumExpanded:t.expanded||a[n]||!1}},function(e){return i({},(0,m.bindActionCreators)(w,e))})(S),R=function(e){var t=e.tracks,n=e.albumExpanded;return t.reduce(function(e,t){0===e.length&&e.push([]);var n=e[e.length-1],a=n[n.length-1];return void 0===a||t.collection_id===a.collection_id?n.push(t):e.push([t]),e},[]).map(function(e){if(e.length>1){var t=e[e.length-1];return d.default.createElement(I,{tracks:e,expanded:n,key:t.collection_id+"-"+t.track_id})}var a=e[0];return d.default.createElement(O,{track:a,key:a.track_id})})},D=function(e){return e.tracks.map(function(e){return d.default.createElement(O,{track:e,key:e.track_id})})},K=function(e){var t=e.genre,n=e.user;return d.default.createElement("header",null,d.default.createElement(x.Helmet,null,d.default.createElement("title",null,"聴いてる"+(t?" - "+t:"")+(n?" - @"+n:""))),d.default.createElement("h1",null,d.default.createElement(T.Link,{to:"/"},"聴いてる"),t&&" - "+t,n&&" - @"+n))},G=function(){return d.default.createElement("footer",null,"© 2016-2017 ",d.default.createElement("a",{href:"https://twitter.com/tomohi_ro"},"@tomohi_ro"))},j=function(e){function t(e){l(this,t);var n=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={tracks:[],nextPage:null},n.timer=null,n._fetchMoreTracks=n.fetchMoreTracks.bind(n),n._changeModeToTrack=function(){return n.props.changeListModeToTrack()},n._changeModeToAlbum=function(){return n.props.changeListModeToAlbum()},n._expandAlbum=function(){return n.props.expandAlbum()},n._collapseAlbum=function(){return n.props.collapseAlbum()},n._scrollToTop=function(){window.scrollTo(0,0),n.props.moveReset()},n._playAll=function(){return n.props.playAll(n.state.tracks)},n._clear=function(){return n.props.clear()},n}return u(t,e),o(t,[{key:"componentDidMount",value:function(){var e=this;this.fetchTracks(),this.timer=setInterval(function(){return e.fetchTracks()},1e4),this.props.moveReset()}},{key:"componentWillUnmount",value:function(){this.timer&&clearInterval(this.timer)}},{key:"fetchTracks",value:function(e){var t=this,n=void 0!==e,a=this.props.api+(n?"?page="+e:"");fetch(a).then(function(e){return e.json()}).then(function(e){return t.updateTracks(e,n)}).catch(function(){})}},{key:"updateTracks",value:function(e,t){var n=this.state.tracks[0],a=void 0===n,r=t?this.state.tracks.concat(e.tracks):a?e.tracks:e.tracks.filter(function(e){return e.updated_at>=n.updated_at&&e.track_id!==n.track_id}).concat(this.state.tracks),l=e.next_page||null,c=t?l:a?l:this.state.nextPage;this.setState({tracks:r,nextPage:c}),this.props.setupList(r)}},{key:"fetchMoreTracks",value:function(){var e=this.state.nextPage;null!==e&&(this.setState({nextPage:null}),this.fetchTracks(e))}},{key:"render",value:function(){var e=this.props.user?"@"+this.props.user:"僕か僕の知り合い",t=this.props.genre||"",n=[d.default.createElement("div",{id:"description",key:"description"},d.default.createElement("p",null,e,"が最近聴いた",t,this.state.tracks.length,"曲です。")),d.default.createElement("nav",{id:"menu",key:"menu"},d.default.createElement("ul",null,d.default.createElement("li",{className:"minimum"},d.default.createElement("button",{className:"play-button",onClick:this._playAll},"▶")),d.default.createElement("li",{className:"minimum"},d.default.createElement("button",{className:"stop-button",disabled:!this.props.playing,onClick:this.props.playing?this._clear:function(){}},"■")),d.default.createElement("li",null,d.default.createElement("button",{onClick:this.props.isAlbumMode?this._changeModeToTrack:this._changeModeToAlbum},this.props.isAlbumMode?"曲をならべる":"アルバムごとにまとめる")),this.props.isAlbumMode&&d.default.createElement("li",null,d.default.createElement("button",{onClick:this.props.isAlbumExpanded?this._collapseAlbum:this._expandAlbum},this.props.isAlbumExpanded?"アルバムを閉じる":"アルバムを開く")),d.default.createElement("li",null,d.default.createElement("button",{onClick:this._scrollToTop},"先頭にもどる")))),d.default.createElement("div",{id:"tracks",key:"tracks"},this.props.isAlbumMode?d.default.createElement(R,{tracks:this.state.tracks,albumExpanded:this.props.isAlbumExpanded}):d.default.createElement(D,{tracks:this.state.tracks}))];return this.hasNext&&n.push(d.default.createElement(A.default,{key:"waypoint",bottomOffset:"-800px",onEnter:this._fetchMoreTracks},d.default.createElement("div",{className:"read-more"},d.default.createElement("a",{onClick:this._fetchMoreTracks},"もっとみる")))),n}},{key:"hasNext",get:function(){return null!==this.state.nextPage}}]),t}(d.default.PureComponent),U=(0,_.connect)(function(e){return{playing:e.app.play.currentTrack||e.app.play.playList.length>0,isAlbumMode:e.app.list.mode===w.listMode.album,isAlbumExpanded:e.app.list.albumMode===w.albumMode.expanded}},function(e){return i({},(0,m.bindActionCreators)(w,e))})(j),H=(0,_.connect)(function(e){return{genreNames:e.app.genre.names}})(function(e){var t=e.genreNames;return d.default.createElement("aside",{id:"genres"},d.default.createElement("ul",null,d.default.createElement("li",{key:"all"},d.default.createElement(T.NavLink,{exact:!0,to:"/",activeClassName:"current"},"すべて")),t.map(function(e){return d.default.createElement("li",{key:e},d.default.createElement(T.NavLink,{to:"/genres/"+encodeURIComponent(e),activeClassName:"current",isActive:function(t,n){return decodeURIComponent(n.pathname)==="/genres/"+e}},e))})))}),B=(0,_.connect)(function(e){return{track:e.app.play.currentTrack}},function(e){return i({},(0,m.bindActionCreators)(w,e))})(function(e){var t=e.track,n=e.playNext;return t?d.default.createElement("div",{id:"player",className:"track"},d.default.createElement("div",{className:"image"},d.default.createElement("div",{className:"artwork",style:{backgroundImage:"url("+t.thumbnail_url+")"}})),d.default.createElement("div",{className:"meta"},d.default.createElement("h2",null,d.default.createElement("a",{href:t.track_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.track_name)),d.default.createElement("a",{href:t.artist_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.artist_name)," - ",d.default.createElement("a",{href:t.collection_view_url+"&app=itunes",rel:"nofollow",target:"_blank"},t.collection_name),d.default.createElement("br",null),d.default.createElement("span",{className:"genre"},d.default.createElement(T.Link,{to:"/genres/"+encodeURIComponent(t.genre_name)},t.genre_name)),"・",d.default.createElement("span",{className:"release"},new Date(1e3*t.released_at).getFullYear()),d.default.createElement("br",null)),d.default.createElement("div",{className:"banner"},d.default.createElement("a",{href:t.track_view_url+"&app="+t.app_type,rel:"nofollow",target:"_blank"},t.is_streamable?d.default.createElement("img",{src:"/image/JP_Listen_on_Apple_Music_Badge.svg"}):d.default.createElement("img",{src:"/image/Get_it_on_iTunes_Badge_JP_1214.svg"}))),d.default.createElement("div",{className:"clear"}),d.default.createElement("div",{className:"preview"},d.default.createElement("audio",{src:t.preview_url,controls:!0,ref:function(e){return e&&e.load()},onCanPlay:function(e){return e.target.play()},onPause:function(e){var t=e.target;t.duration<=t.currentTime&&n()}}),d.default.createElement("br",null),d.default.createElement("span",null,"provided courtesy of iTunes"))):d.default.createElement("noscript",null)}),X=function(){return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(K,null),d.default.createElement(U,{api:"/api/tracks"}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,null)))},Y=function(e){var t=e.match,n=t.params.genre,a=decodeURIComponent(n);return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(K,{genre:a}),d.default.createElement(U,{key:n,genre:a,api:"/api/genres/"+n}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,{key:n})))},F=function(e){var t=e.match,n=t.params.user;return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(K,{user:n}),d.default.createElement(U,{key:n,user:n,api:"/api/users/"+n}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,null)))},V=function(){return d.default.createElement(T.BrowserRouter,null,d.default.createElement("div",null,d.default.createElement(T.Switch,null,d.default.createElement(T.Route,{exact:!0,path:"/",component:X}),d.default.createElement(T.Route,{path:"/genres/:genre+",component:Y}),d.default.createElement(T.Route,{path:"/users/:user",component:F})),d.default.createElement(B,null)))},J=(0,b.default)(),W=(0,m.createStore)((0,m.combineReducers)({app:L.default,router:E.routerReducer}),(0,y.composeWithDevTools)((0,m.applyMiddleware)(v.default,(0,E.routerMiddleware)(J))));W.dispatch(w.fetchGenres()),W.dispatch(w.watchKeyboard()),p.default.render(d.default.createElement(_.Provider,{store:W},d.default.createElement(E.ConnectedRouter,{history:J},d.default.createElement(V,null))),document.getElementById("container"))},VbiM:function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),l=function(){function e(){a(this,e)}return r(e,[{key:"set",value:function(e,t){try{localStorage.setItem(e,t)}catch(e){}}},{key:"get",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return localStorage.getItem(e)||t}}]),e}();t.default=new l},hvFc:function(e,t){}},["NF59"]);