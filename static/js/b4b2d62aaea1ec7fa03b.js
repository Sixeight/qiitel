webpackJsonp([1],{"/aC4":function(e,t,a){"use strict";function n(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e){var t=[].concat(n(e)),a=t.splice(Math.floor(Math.random()*t.length),1);return[c(a,1)[0],t]}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){var a=[],n=!0,r=!1,l=void 0;try{for(var c,u=e[Symbol.iterator]();!(n=(c=u.next()).done)&&(a.push(c.value),!t||a.length!==t);n=!0);}catch(e){r=!0,l=e}finally{try{!n&&u.return&&u.return()}finally{if(r)throw l}}return a}return function(t,a){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,a);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},i=a("2KeS"),o=a("KKqu"),s=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(o),d=a("VbiM"),f=function(e){return e&&e.__esModule?e:{default:e}}(d),p=f.default.get("lastMode",s.listMode.track),m=f.default.get("lastAlbumMode",s.albumMode.collapsed),_={mode:p,albumMode:m,albumExpandMap:{}},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_,t=arguments[1];switch(t.type){case s.CHANGE_LIST_MODE:return f.default.set("lastMode",t.mode),u({},e,{mode:t.mode});case s.CHANGE_ALBUM_MODE:return f.default.set("lastAlbumMode",t.mode),u({},e,{albumMode:t.mode,albumExpandMap:{}});case s.CHANGE_ALBUM_EXPANDED_SINGLE:var a=e.albumExpandMap;return u({},e,{albumExpandMap:u({},a,r({},t.collection_id,t.expanded))});default:return e}},h={currentTrack:null,playList:[]},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u({},h),t=arguments[1];switch(t.type){case s.PLAY:return u({},e,{currentTrack:t.track,playList:[]});case s.PLAY_ALL:var a=l(t.tracks),n=c(a,2),r=n[0],i=n[1];return u({},e,{currentTrack:r,playList:i});case s.PLAY_NEXT:var o=l(e.playList),d=c(o,2),f=d[0],p=d[1];return f?u({},e,{currentTrack:f,playList:p}):e;case s.CLEAR:return u({},h);default:return e}},k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{index:0,tracks:[],active:!1},t=arguments[1];switch(t.type){case s.SWITCH_POINTER:return u({},e,{active:t.active});case s.MOVE_RESET:return u({},e,{active:!1,index:0});case s.MOVE_TO:return e.active?u({},e,{index:Math.min(Math.max(t.index,0),e.tracks.length-1)}):u({},e,{active:!0});case s.UPDATE_INDEX:return u({},e,{index:Math.min(Math.max(t.index,0),e.tracks.length-1)});case s.SETUP_LIST:return u({},e,{tracks:t.tracks});default:return e}},b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{names:[]},t=arguments[1];switch(t.type){case s.UPDATE_GENRES:return u({},e,{names:t.genreNames});default:return e}};t.default=(0,i.combineReducers)({list:E,play:v,pointer:k,genre:b})},KKqu:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.updateGenres=t.fetchGenres=t.watchKeyboard=t.selectTrack=t.focus=t.setupList=t.updateIndex=t.moveTo=t.moveReset=t.switchPointer=t.clear=t.playNext=t.playAll=t.play=t.collapseAlbumSingle=t.expandAlbumSingle=t.expandAlbum=t.collapseAlbum=t.changeListModeToAlbum=t.changeListModeToTrack=t.UPDATE_GENRES=t.SETUP_LIST=t.UPDATE_INDEX=t.MOVE_TO=t.MOVE_RESET=t.SWITCH_POINTER=t.CLEAR=t.PLAY_NEXT=t.PLAY_ALL=t.PLAY=t.albumMode=t.listMode=t.CHANGE_ALBUM_EXPANDED_SINGLE=t.CHANGE_ALBUM_MODE=t.CHANGE_LIST_MODE=void 0,a("rplX");var n=a("MT/C"),r=t.CHANGE_LIST_MODE="change_list_mode",l=t.CHANGE_ALBUM_MODE="change_album_mode",c=t.CHANGE_ALBUM_EXPANDED_SINGLE="change_album_expanded_single",u=t.listMode={track:"track",album:"album"},i=t.albumMode={collapsed:"collapsed",expanded:"expnded"},o=t.PLAY="play",s=t.PLAY_ALL="play_all",d=t.PLAY_NEXT="play_next",f=t.CLEAR="clear",p=t.SWITCH_POINTER="switch_pointer",m=t.MOVE_RESET="move_reset",_=t.MOVE_TO="move_to",E=t.UPDATE_INDEX="update_index",h=t.SETUP_LIST="setup_list",v=t.UPDATE_GENRES="fetch_genres",k=(t.changeListModeToTrack=function(){return k(u.track)},t.changeListModeToAlbum=function(){return k(u.album)},function(e){return{type:r,mode:e}}),b=(t.collapseAlbum=function(){return b(i.collapsed)},t.expandAlbum=function(){return b(i.expanded)},function(e){return{type:l,mode:e}}),y=(t.expandAlbumSingle=function(e){return y(e,!0)},t.collapseAlbumSingle=function(e){return y(e,!1)},function(e,t){return{type:c,collection_id:e,expanded:t}}),g=t.play=function(e){return{type:o,track:e}},A=t.playAll=function(e){return{type:s,tracks:e}},x=(t.playNext=function(){return{type:d}},t.clear=function(){return{type:f}}),T=t.switchPointer=function(e){return{type:p,active:e}},w=t.moveReset=function(){return{type:m}},M=t.moveTo=function(e){return{type:_,index:e}},N=t.updateIndex=function(e){return{type:E,index:e}},L=(t.setupList=function(e){return{type:h,tracks:e}},t.focus=function(e){return function(){var t=e.offsetTop-window.innerHeight/2;window.scrollTo(0,t)}},t.selectTrack=function(e){return function(t,a){var n=a().app.pointer,r=n.tracks.indexOf(e);t(T(!1)),t(N(r))}},t.watchKeyboard=function(){var e=function(e){var t=e.app.list,a=e.app.pointer,n=a.index+1;if(t.mode===u.track||t.albumMode===i.expanded)return n;var r=a.tracks[a.index];return!r||t.albumExpandMap[r.collection_id]?n:n+a.tracks.slice(a.index+1).findIndex(function(e){return e.collection_id!==r.collection_id})},t=function(e){var t=e.app.list,a=e.app.pointer,n=a.index-1;if(t.mode===u.track||t.albumMode===i.expanded)return n;var r=a.tracks[a.index];if(!r)return n;var l=a.tracks.slice(0,a.index).reverse(),c=l.findIndex(function(e){return e.collection_id!==r.collection_id}),o=l[c];if(!o||t.albumExpandMap[o.collection_id])return n;var s=l.slice(c+1),d=s.findIndex(function(e){return e.collection_id!==o.collection_id}),f=0===c||!t.albumExpandMap[r.collection_id];return-1===d&&f?0:f?n-(c+d):n},a=function(e){var t=e.app.pointer,a=t.tracks[t.index];if(!a)return-1;var n=t.tracks.slice(0,t.index).reverse(),r=n.findIndex(function(e){return e.collection_id!==a.collection_id});return-1===r?0:t.index-r};return function(r,l){window.addEventListener("click",function(){l().app.pointer.active&&r(T(!1))}),window.addEventListener("keydown",function(c){var o=l().app,s=o.pointer,d=o.list;switch(c.code){case"KeyJ":r(M(e(l())));break;case"KeyK":r(M(t(l())));break;case"KeyP":if(c.shiftKey){var f=s.active&&s.tracks[s.index];if(f){var p=s.tracks.filter(function(e){return e.artist_id===f.artist_id});r(A(p));break}}r(A(s.tracks));break;case"Enter":var m=s.active&&s.tracks[s.index];if(!m)break;if(c.preventDefault(),c.shiftKey){var _=a(l()),E=s.tracks.slice(_),h=E.findIndex(function(e){return e.collection_id!==m.collection_id});r(A(E.slice(0,h)))}else r(g(m));break;case"Escape":case"Period":case"KeyS":r(x()),r(T(!1));break;case"Tab":r(T(!1));break;case"KeyL":var v=s.active&&s.tracks[s.index];if(v){var N=v.collection_id,L=d.albumExpandMap[N]||!1;r(y(N,!L)),r(M(a(l())))}break;case"KeyA":if(c.shiftKey){var P=d.albumMode===i.expanded?i.collapsed:i.expanded;r(b(P))}else{var O=d.mode===u.album?u.track:u.album;r(k(O))}r(T(!1));break;case"KeyT":window.scrollTo(0,0),r(w());break;case"KeyO":if(c.shiftKey){var C=o.play.currentTrack;C&&window.open(C.track_view_url,"_blank")}else{var I=s.active&&s.tracks[s.index];I&&window.open(I.track_view_url,"_blank")}break;case"KeyG":if(c.shiftKey)r((0,n.push)("/"));else{var S=s.active&&s.tracks[s.index];S&&r((0,n.push)("/genres/"+encodeURIComponent(S.genre_name)))}break;case"KeyM":if(c.shiftKey)r((0,n.push)("/"));else{var R=s.active&&s.tracks[s.index];R&&r((0,n.push)("/artists/"+encodeURIComponent(R.artist_name)+"/"+R.artist_id))}}})}},t.fetchGenres=function(){return function(e){fetch("/api/genres").then(function(e){return e.json()}).then(function(t){return e(L(t.genre_names))}).catch(function(e){console.log(e)})}},t.updateGenres=function(e){return{type:v,genreNames:e}})},NF59:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){return Array.isArray(e)?e:Array.from(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},o=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=a("GiK3"),d=n(s),f=a("O27J"),p=n(f),m=a("2KeS"),_=a("RH2O"),E=a("MT/C"),h=a("4ufr"),v=n(h),k=a("ciQf"),b=n(k),y=a("gFN5"),g=a("TKwO"),A=n(g),x=a("PIAa");a("rplX");var T=a("F8kA");a("hvFc");var w=a("KKqu"),M=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(w),N=a("/aC4"),L=n(N),P=function(e){function t(e){l(this,t);var a=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={shown:!1},a._shown=a.shown.bind(a),a._play=function(){return a.props.play(a.props.track)},a._focus=function(e){return a.props.focus(e)},a._select=function(){return a.props.selectTrack(a.props.track)},a}return u(t,e),o(t,[{key:"shown",value:function(){this.setState({shown:!0})}},{key:"render",value:function(){var e=this,t=this.props.track,a=this.props.selected,n=new Date(1e3*t.released_at),r=new Date(1e3*t.updated_at);return d.default.createElement(A.default,{onEnter:this._shown},d.default.createElement("div",{className:"track"+(a?" selected":""),onClick:this._select,ref:function(t){return t&&a&&e._focus(t)}},d.default.createElement("div",{className:"image"},d.default.createElement("div",{className:"artwork",style:this.state.shown?{backgroundImage:"url("+t.thumbnail_url+")"}:{}}),d.default.createElement("a",{href:t.track_view_url,rel:"nofollow",target:"_blank"},t.is_streamable?d.default.createElement("img",{src:"/image/JP_Listen_on_Apple_Music_Badge.svg"}):d.default.createElement("img",{src:"/image/Get_it_on_iTunes_Badge_JP_1214.svg"}))),d.default.createElement("div",{className:"meta"},d.default.createElement("h2",null,d.default.createElement("a",{href:t.track_view_url,rel:"nofollow",target:"_blank"},t.track_name)),d.default.createElement("a",{href:t.artist_view_url,rel:"nofollow",target:"_blank"},t.artist_name)," - ",d.default.createElement("a",{href:t.collection_view_url,rel:"nofollow",target:"_blank"},t.collection_name),d.default.createElement("br",null),d.default.createElement("span",{className:"genre"},d.default.createElement(T.Link,{to:"/genres/"+encodeURIComponent(t.genre_name)},t.genre_name)),"・",d.default.createElement("span",{className:"release"},n.getFullYear()),d.default.createElement("br",null),d.default.createElement("time",{dateTime:r.toISOString(),title:r.toISOString()},r.toLocaleString()),t.user&&d.default.createElement(C,{user:t.user})),d.default.createElement("div",{className:"play-button"},d.default.createElement("button",{onClick:this._play},"プレビュー")),d.default.createElement("div",{className:"clear"})))}}]),t}(d.default.PureComponent),O=(0,_.connect)(function(e,t){return{selected:e.app.pointer.active&&t.track===e.app.pointer.tracks[e.app.pointer.index]}},function(e){return i({},(0,m.bindActionCreators)(M,e))})(P),C=function(e){var t=e.user;return d.default.createElement("span",{className:"profile"},t.image_url?d.default.createElement(T.Link,{to:"/users/"+t.name},d.default.createElement("img",{src:""+t.image_url,alt:"@"+t.name}),d.default.createElement("span",{className:"name"},"@",t.name)):d.default.createElement("span",{className:"name"},"@",t.name))},I=function(e){function t(e){l(this,t);var a=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a._expand=function(){return a.props.expandAlbumSingle(a.props.tracks[0].collection_id)},a._playAll=function(){return a.props.playAll(a.props.tracks)},a}return u(t,e),o(t,[{key:"render",value:function(){var e=this,t=r(this.props.tracks),a=t[0],n=t.slice(1);return d.default.createElement("div",{className:"album"+(this.props.isAlbumExpanded?" expanded":"")},d.default.createElement("div",{className:"album-meta"},d.default.createElement("h2",null,"「",a.collection_name,"」",d.default.createElement("button",{className:"play-button",onClick:this._playAll},"▶"))),d.default.createElement("div",{className:"album-tracks",key:"tracks"},d.default.createElement(O,{track:a,key:a.track_id}),n.map(function(t,a){return e.props.isAlbumExpanded?d.default.createElement(O,{track:t,key:t.track_id}):d.default.createElement("div",{className:"track dummy",style:{zIndex:-(a+1)},key:t.track_id})})),this.props.isAlbumExpanded||d.default.createElement("div",{className:"rest",key:"rest"},d.default.createElement("a",{onClick:this.props.isAlbumExpanded?this._collapse:this._expand},"他",n.length,"曲をみる")))}}]),t}(d.default.PureComponent),S=(0,_.connect)(function(e,t){var a=t.tracks[0].collection_id,n=e.app.list.albumExpandMap;return{isAlbumExpanded:t.expanded||n[a]||!1}},function(e){return i({},(0,m.bindActionCreators)(M,e))})(I),R=function(e){var t=e.tracks,a=e.albumExpanded;return t.reduce(function(e,t){0===e.length&&e.push([]);var a=e[e.length-1],n=a[a.length-1];return void 0===n||t.collection_id===n.collection_id?a.push(t):e.push([t]),e},[]).map(function(e){if(e.length>1){var t=e[e.length-1];return d.default.createElement(S,{tracks:e,expanded:a,key:t.collection_id+"-"+t.track_id})}var n=e[0];return d.default.createElement(O,{track:n,key:n.track_id})})},K=function(e){return e.tracks.map(function(e){return d.default.createElement(O,{track:e,key:e.track_id})})},D=function(e){var t=e.genre,a=e.user,n=e.artist,r=t||n;return d.default.createElement("header",null,d.default.createElement(x.Helmet,null,d.default.createElement("title",null,"聴いてる"+(r?" - "+r:"")+(a?" - @"+a:""))),d.default.createElement("h1",null,d.default.createElement(T.Link,{to:"/"},"聴いてる"),r&&" - "+r,a&&" - @"+a))},G=function(){return d.default.createElement("footer",null,"© 2016-2017 ",d.default.createElement("a",{href:"https://twitter.com/tomohi_ro"},"@tomohi_ro"))},U=function(e){function t(e){l(this,t);var a=c(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={tracks:[],nextPage:null},a.timer=null,a._fetchMoreTracks=a.fetchMoreTracks.bind(a),a._changeModeToTrack=function(){return a.props.changeListModeToTrack()},a._changeModeToAlbum=function(){return a.props.changeListModeToAlbum()},a._expandAlbum=function(){return a.props.expandAlbum()},a._collapseAlbum=function(){return a.props.collapseAlbum()},a._scrollToTop=function(){window.scrollTo(0,0),a.props.moveReset()},a._playAll=function(){return a.props.playAll(a.state.tracks)},a._clear=function(){return a.props.clear()},a}return u(t,e),o(t,[{key:"componentDidMount",value:function(){var e=this;this.fetchTracks(),this.timer=setInterval(function(){return e.fetchTracks()},1e4),this.props.moveReset()}},{key:"componentWillUnmount",value:function(){this.timer&&clearInterval(this.timer)}},{key:"fetchTracks",value:function(e){var t=this,a=void 0!==e,n=this.props.api+(a?"?page="+e:"");fetch(n).then(function(e){return e.json()}).then(function(e){return t.updateTracks(e,a)}).catch(function(){})}},{key:"updateTracks",value:function(e,t){var a=this.state.tracks[0],n=void 0===a,r=t?this.state.tracks.concat(e.tracks):n?e.tracks:e.tracks.filter(function(e){return e.updated_at>=a.updated_at&&e.track_id!==a.track_id}).concat(this.state.tracks),l=e.next_page||null,c=t?l:n?l:this.state.nextPage;this.setState({tracks:r,nextPage:c}),this.props.setupList(r)}},{key:"fetchMoreTracks",value:function(){var e=this.state.nextPage;null!==e&&(this.setState({nextPage:null}),this.fetchTracks(e))}},{key:"artistLink",value:function(){var e=this.state.tracks[0];return e?d.default.createElement("a",{href:e.artist_view_url,target:"_blank",rel:"nofollow"},e.artist_name):""}},{key:"render",value:function(){var e=this.props.user?"@"+this.props.user:"僕か僕の知り合い",t=this.props.genre||"",a=this.props.artist,n=[d.default.createElement("div",{id:"description",key:"description"},d.default.createElement("p",null,e,"が最近聴いた",t,a&&d.default.createElement("span",null," ",this.artistLink()," の"),this.state.tracks.length,"曲です。")),d.default.createElement("nav",{id:"menu",key:"menu"},d.default.createElement("ul",null,d.default.createElement("li",{className:"minimum"},d.default.createElement("button",{className:"play-button",onClick:this._playAll},"▶")),d.default.createElement("li",{className:"minimum"},d.default.createElement("button",{className:"stop-button",disabled:!this.props.playing,onClick:this.props.playing?this._clear:function(){}},"■")),d.default.createElement("li",null,d.default.createElement("button",{onClick:this.props.isAlbumMode?this._changeModeToTrack:this._changeModeToAlbum},this.props.isAlbumMode?"曲をならべる":"アルバムごとにまとめる")),this.props.isAlbumMode&&d.default.createElement("li",null,d.default.createElement("button",{onClick:this.props.isAlbumExpanded?this._collapseAlbum:this._expandAlbum},this.props.isAlbumExpanded?"アルバムを閉じる":"アルバムを開く")),d.default.createElement("li",null,d.default.createElement("button",{onClick:this._scrollToTop},"先頭にもどる")))),d.default.createElement("div",{id:"tracks",key:"tracks"},this.props.isAlbumMode?d.default.createElement(R,{tracks:this.state.tracks,albumExpanded:this.props.isAlbumExpanded}):d.default.createElement(K,{tracks:this.state.tracks}))];return this.hasNext&&n.push(d.default.createElement(A.default,{key:"waypoint",bottomOffset:"-800px",onEnter:this._fetchMoreTracks},d.default.createElement("div",{className:"read-more"},d.default.createElement("a",{onClick:this._fetchMoreTracks},"もっとみる")))),n}},{key:"hasNext",get:function(){return null!==this.state.nextPage}}]),t}(d.default.PureComponent),j=(0,_.connect)(function(e){return{playing:e.app.play.currentTrack||e.app.play.playList.length>0,isAlbumMode:e.app.list.mode===M.listMode.album,isAlbumExpanded:e.app.list.albumMode===M.albumMode.expanded}},function(e){return i({},(0,m.bindActionCreators)(M,e))})(U),H=(0,_.connect)(function(e){return{genreNames:e.app.genre.names}})(function(e){var t=e.genreNames;return d.default.createElement("aside",{id:"genres"},d.default.createElement("ul",null,d.default.createElement("li",{key:"all"},d.default.createElement(T.NavLink,{exact:!0,to:"/",activeClassName:"current"},"すべて")),t.map(function(e){return d.default.createElement("li",{key:e},d.default.createElement(T.NavLink,{to:"/genres/"+encodeURIComponent(e),activeClassName:"current",isActive:function(t,a){return decodeURIComponent(a.pathname)==="/genres/"+e}},e))})))}),B=(0,_.connect)(function(e){return{track:e.app.play.currentTrack}},function(e){return i({},(0,m.bindActionCreators)(M,e))})(function(e){var t=e.track,a=e.playNext;return t?d.default.createElement("div",{id:"player",className:"track"},d.default.createElement("div",{className:"image"},d.default.createElement("div",{className:"artwork",style:{backgroundImage:"url("+t.thumbnail_url+")"}})),d.default.createElement("div",{className:"meta"},d.default.createElement("h2",null,d.default.createElement("a",{href:t.track_view_url,rel:"nofollow",target:"_blank"},t.track_name)),d.default.createElement("a",{href:t.artist_view_url,rel:"nofollow",target:"_blank"},t.artist_name)," - ",d.default.createElement("a",{href:t.collection_view_url,rel:"nofollow",target:"_blank"},t.collection_name),d.default.createElement("br",null),d.default.createElement("span",{className:"genre"},d.default.createElement(T.Link,{to:"/genres/"+encodeURIComponent(t.genre_name)},t.genre_name)),"・",d.default.createElement("span",{className:"release"},new Date(1e3*t.released_at).getFullYear()),d.default.createElement("br",null)),d.default.createElement("div",{className:"banner"},d.default.createElement("a",{href:t.track_view_url,rel:"nofollow",target:"_blank"},t.is_streamable?d.default.createElement("img",{src:"/image/JP_Listen_on_Apple_Music_Badge.svg"}):d.default.createElement("img",{src:"/image/Get_it_on_iTunes_Badge_JP_1214.svg"}))),d.default.createElement("div",{className:"clear"}),d.default.createElement("div",{className:"preview"},d.default.createElement("audio",{src:t.preview_url,controls:!0,ref:function(e){return e&&e.load()},onCanPlay:function(e){return e.target.play()},onPause:function(e){var t=e.target;t.duration<=t.currentTime&&a()}}),d.default.createElement("br",null),d.default.createElement("span",null,"provided courtesy of iTunes"))):d.default.createElement("noscript",null)}),X=function(){return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(D,null),d.default.createElement(j,{api:"/api/tracks"}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,null)))},Y=function(e){var t=e.match,a=t.params.genre,n=decodeURIComponent(a);return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(D,{genre:n}),d.default.createElement(j,{key:a,genre:n,api:"/api/genres/"+a}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,{key:a})))},F=function(e){var t=e.match,a=t.params.user;return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(D,{user:a}),d.default.createElement(j,{key:a,user:a,api:"/api/users/"+a}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,null)))},V=function(e){var t=e.match,a=t.params.artist,n=t.params.artist_id;return d.default.createElement("div",{id:"contents"},d.default.createElement("div",{id:"main"},d.default.createElement(D,{artist:a}),d.default.createElement(j,{key:n,artist:a,api:"/api/artists/"+n}),d.default.createElement(G,null)),d.default.createElement("div",{id:"side"},d.default.createElement(H,null)))},J=function(){return d.default.createElement("div",null,d.default.createElement(T.Switch,null,d.default.createElement(T.Route,{exact:!0,path:"/",component:X}),d.default.createElement(T.Route,{path:"/genres/:genre+",component:Y}),d.default.createElement(T.Route,{path:"/users/:user",component:F}),d.default.createElement(T.Route,{path:"/artists/:artist+/:artist_id",component:V})),d.default.createElement(B,null))},W=(0,b.default)(),q=(0,m.createStore)((0,m.combineReducers)({app:L.default,router:E.routerReducer}),(0,y.composeWithDevTools)((0,m.applyMiddleware)(v.default,(0,E.routerMiddleware)(W))));q.dispatch(M.fetchGenres()),q.dispatch(M.watchKeyboard()),p.default.render(d.default.createElement(_.Provider,{store:q},d.default.createElement(E.ConnectedRouter,{history:W},d.default.createElement(T.Router,{history:W},d.default.createElement(J,null)))),document.getElementById("container"))},VbiM:function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),l=function(){function e(){n(this,e)}return r(e,[{key:"set",value:function(e,t){try{localStorage.setItem(e,t)}catch(e){}}},{key:"get",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return localStorage.getItem(e)||t}}]),e}();t.default=new l},hvFc:function(e,t){}},["NF59"]);