(this["webpackJsonp@pyrogenic/spelling-sea"]=this["webpackJsonp@pyrogenic/spelling-sea"]||[]).push([[0],{38:function(e,t,a){"use strict";t.__esModule=!0,t.ensureArray=void 0,t.ensureArray=function(e,t){var a=e[t];return void 0!==a?a:e[t]=new Array}},40:function(e,t,a){"use strict";t.__esModule=!0,t.arraySetToggle=void 0;var n=a(10),r=a(50),c=a(38);t.arraySetToggle=function(e,t,a,s){if(void 0===e[t])return r.arraySetAdd(e,t,a,s),!0;var l=c.ensureArray(e,t),i="object"!==typeof a?l.indexOf(a):l.findIndex(n.isEqual.bind(null,a));return i>=0?(l.splice(i,1),!1):(r.arraySetAdd(e,t,a,s),!0)}},48:function(e,t,a){},50:function(e,t,a){"use strict";t.__esModule=!0,t.arraySetAdd=void 0;var n=a(10),r=a(38);t.arraySetAdd=function(e,t,a,c){var s=r.ensureArray(e,t),l="object"!==typeof a?s.indexOf(a):s.findIndex(n.isEqual.bind(null,a)),i=l>=0;if(i){if("mru"!==c)return!1;s.splice(l,1)}return s.push(a),"function"===typeof c?s.sort(c):!0===c&&s.sort(),!i}},63:function(e,t,a){},68:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(23),s=a.n(c),l=(a(48),a(13)),i=a(8),o=a(40),u=a(41),j=a.n(u),d=a(42),b=a.n(d);function f(e){for(var t=[],a=1;a<arguments.length;a++)t[a-1]=arguments[a];var n=j()(b()(t));switch(n.length){case 0:return;case 1:return n[0];default:return n.join(e)}}function x(e,t){return function(e,t,a){var n,c,s,l=f(":",t),i=r.a.useMemo((function(){return"local"===e?e=window.localStorage:"session"===e&&(e=window.sessionStorage),[e.setItem.bind(e,l),e.removeItem.bind(e,l),e.getItem(l)]}),[e,l]),o=i[0],u=i[1],j=i[2];if(null!==j)try{c=null!==(n=JSON.parse(j))&&void 0!==n?n:void 0}catch(h){console.error(h)}s=void 0===c?"function"===typeof a?a():a:c;var d=r.a.useState(s),b=d[0],x=d[1];return r.a.useEffect((function(){o(JSON.stringify(b))}),[b,o,u]),r.a.useEffect(x.bind(null,s),[l,x]),[b,x,function(){x("function"===typeof a?a():a)}]}(window.localStorage,e,t)}var h=f.bind(null," "),O=a(11),p=a(4),m=a(9),v=a(36),g=a.n(v),y=a(43);function w(){return(w=Object(y.a)(g.a.mark((function e(){var t;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("spelling-sea/puzzles.json");case 2:return t=e.sent,e.prev=3,e.next=6,t.json();case 6:return e.abrupt("return",e.sent);case 9:return e.prev=9,e.t0=e.catch(3),e.t1=console,e.t2=e.t0,e.next=15,fetch("spelling-sea/puzzles.json");case 15:return e.next=17,e.sent.text();case 17:return e.t3=e.sent,e.t1.error.call(e.t1,e.t2,e.t3),e.abrupt("return",{});case 20:case"end":return e.stop()}}),e,null,[[3,9]])})))).apply(this,arguments)}a(63);var N=a(10),k=a.n(N),z=a(22),C=a(18),S=a(31),A=a(14),E=a(32),P=a(1),I=["found","alpha","length"],M=["overall","length","distance","cheat"];function U(e){var t,a=e.puzzle,n=e.prevPuzzle,c=e.nextPuzzle,s=F(a),o=x([s,"board"],[]),u=Object(i.a)(o,2),j=u[0],d=u[1],b=x([s,"rack"],[]),f=Object(i.a)(b,3),v=f[0],g=f[1],y=f[2],w=x([s,"words"],[]),N=Object(i.a)(w,3),C=N[0],S=N[1],E=N[2],U=x([s,"fails"],[]),B=Object(i.a)(U,3),T=B[0],J=B[1],q=B[2],L=r.a.useState(0),W=Object(i.a)(L,2),K=W[0],$=W[1],G=r.a.useState(0),H=Object(i.a)(G,2),Q=H[0],V=H[1],X=x(["order"],"found"),Y=Object(i.a)(X,2),Z=Y[0],ee=Y[1],te=x(["progress"],"overall"),ae=Object(i.a)(te,2),ne=ae[0],re=ae[1],ce=r.a.useRef(Q);function se(e){var t=e.key;switch(e.code){case"Escape":g([]);break;case"Delete":case"Backspace":le();break;case"Return":case"Enter":v.length?fe():ie();break;case"Space":oe();break;case"Slash":ie();break;case"ArrowLeft":n();break;case"ArrowRight":c();break;default:je(t)}}function le(){var e=Object(l.a)(v);e.pop(),g(e)}function ie(){var e=Object(l.a)(k.a.last(C));g(e)}function oe(){if(a){for(var e=[],t=Object(l.a)(a.board);t.length>0;){var n=Math.floor(Math.random()*t.length),r=t.splice(n,1)[0];e.push(r),3===e.length&&e.push(a.island)}d(e)}else d([])}r.a.useEffect((function(){ce.current!==Q&&(ce.current=Q,y(),E(),q())}),[Q]),r.a.useEffect((function(){var e={handleEvent:se};return window.addEventListener("keyup",e),window.removeEventListener.bind(window,"keyup",e)})),r.a.useEffect(oe,[a,K]);var ue=r.a.useMemo((function(){switch(Z){case"found":return[[void 0,C]];case"alpha":return Object.entries(k.a.groupBy(Object(l.a)(C).sort(),"0")).sort((function(e,t){var a=Object(i.a)(e,1)[0],n=Object(i.a)(t,1)[0];return a.localeCompare(n)}));case"length":return Object.entries(k.a.groupBy(Object(l.a)(C).sort(),"length")).map((function(e){var t=Object(i.a)(e,2),a=t[0],n=t[1];return[Number(a),n]})).sort((function(e,t){return Object(i.a)(e,1)[0]-Object(i.a)(t,1)[0]}))}}),[C,Z]);function je(e){j.includes(e)&&g([].concat(Object(l.a)(v),[e]))}var de,be,fe=function(){var e=v.join("");if(C.includes(e))alert("Already found!");else if(null===a||void 0===a?void 0:a.words.includes(e))S([].concat(Object(l.a)(C),[e]));else{var t;alert(null!==(t=de)&&void 0!==t?t:"Not a word!"),J([].concat(Object(l.a)(T),[e]))}g([])};return a?v.length<4?(de="Play",be="Too Short"):v.includes(a.island)?C.includes(v.join(""))?de="Already Played":T.includes(v.join(""))&&(de="Already Tried"):de="No ".concat(a.island.toUpperCase()):de="No Puzzle",Object(P.jsxs)("div",{onMouseDown:function(e){return e.preventDefault()},children:[Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill",onClick:le}),Object(P.jsx)(p.a,{xs:"auto",children:Object(P.jsxs)(m.a,{children:[Object(P.jsx)("span",{className:"rack-letter",children:"\xa0"}),v.map((function(e,t){return Object(P.jsx)("span",{className:"rack-letter ".concat(e===a.island?"rack-letter-island":""),onClick:function(e){v.splice(t,1),g(Object(l.a)(v))},children:e},t)})),Object(P.jsx)("span",{className:"rack-letter",children:"\xa0"})]})}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill",onClick:le})]}),a&&Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsxs)(p.a,{xs:"auto",className:"board-container",children:[Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"}),Object(P.jsx)(R,{board:j,play:je}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"})]}),Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"}),Object(P.jsxs)(p.a,{xs:"auto",children:[Object(P.jsx)(m.a,{className:"mb-2 justify-content-center",children:Object(P.jsx)(O.a,{variant:"primary",disabled:void 0!==de,title:be,onClick:fe,children:null!==(t=de)&&void 0!==t?t:"Play"})}),Object(P.jsxs)(m.a,{children:[Object(P.jsxs)(p.a,{xs:"auto",className:"flex-fill",children:[Object(P.jsx)(O.a,{size:"sm",variant:"light",onClick:function(){return window.confirm("Reset?")&&V(Q+1)},children:Object(P.jsx)(A.f,{title:"Reset"})}),Object(P.jsx)(O.a,{size:"sm",variant:"light",onClick:$.bind(null,K+1),children:Object(P.jsx)(A.h,{title:"Shuffle"})})]}),Object(P.jsxs)(z.a,{as:p.a,xs:"auto",children:[Object(P.jsx)(O.a,{size:"lg",variant:"light",disabled:0===v.length,onClick:g.bind(null,[]),children:Object(P.jsx)(A.g,{title:"Reset"})}),Object(P.jsx)(O.a,{size:"lg",variant:"light",disabled:0===v.length,onClick:le,children:Object(P.jsx)(A.d,{title:"Delete"})}),Object(P.jsx)(O.a,{size:"lg",variant:"light",disabled:0===C.length,onClick:ie,children:Object(P.jsx)(A.c,{title:"Ditto"})})]}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill",children:Object(P.jsxs)(z.a,{children:[Object(P.jsx)(O.a,{size:"sm",variant:"light",onClick:n,children:Object(P.jsx)(A.a,{title:"Previous Puzzle"})}),Object(P.jsx)(O.a,{size:"sm",variant:"light",onClick:c,children:Object(P.jsx)(A.b,{title:"Next Puzzle"})})]})})]})]}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"})]})]}),Object(P.jsxs)(p.a,{xs:"auto",className:"flex-fill",children:[Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"}),Object(P.jsx)(p.a,{xs:"auto",children:Object(P.jsx)(z.a,{size:"sm",children:I.map((function(e){return Object(P.jsx)(O.a,{variant:Z===e?"primary":"outline-primary",onClick:ee.bind(null,e),children:e},e)}))})}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"})]}),Object(P.jsx)(m.a,{className:h("word-list",Z),children:ue.map((function(e){var t=Object(i.a)(e,2),a=t[0],n=t[1];return Object(P.jsxs)(P.Fragment,{children:[void 0!==a&&Object(P.jsx)("div",{className:h("group",Z,a.toString()),children:a}),n.map((function(e){var t=D(e)?"globetrotter":void 0;if(v.length>0){var a=v.join("");t=e.startsWith(a)?e===a?"already-played":"matches-prefix":"does-not-match-prefix"}return Object(P.jsx)("div",{className:t,children:e},e)}))]})}))})]}),Object(P.jsxs)(p.a,{md:4,children:[Object(P.jsxs)(m.a,{className:"mb-2",children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"}),Object(P.jsx)(p.a,{xs:"auto",children:Object(P.jsx)(z.a,{size:"sm",children:M.map((function(e){return Object(P.jsx)(O.a,{variant:ne===e?"primary":"outline-primary",onClick:re.bind(null,e),children:e},e)}))})}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"})]}),Object(P.jsxs)(m.a,{children:[Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"}),Object(P.jsx)(p.a,{xs:"auto",children:"length"===ne?Object(P.jsx)(Oe,{}):"overall"===ne?Object(P.jsx)(xe,{}):"cheat"===ne?Object(P.jsx)(pe,{}):Object(P.jsx)(he,{})}),Object(P.jsx)(p.a,{xs:"auto",className:"flex-fill"})]})]})]})]});function xe(){if(!a)return null;var e=_(a.words),t=_(C),n=e;return Object(P.jsx)(P.Fragment,{children:["Matey","Swabby","Ensign","Coxwain","First Mate","Captain","Commodore","Admiral","Enlightened"].reverse().map((function(e,a){var r=n,c=Math.floor(n*(2/3));n=c-1;var s=c<=t&&t<=r,l=c<t;return Object(P.jsxs)(m.a,{className:s?"rank-current":l?"rank-past":"rank-future",children:[Object(P.jsx)(p.a,{children:c}),Object(P.jsx)(p.a,{children:s?t:""}),Object(P.jsx)(p.a,{children:r}),Object(P.jsx)(p.a,{children:e})]},a)}))})}function he(){return a?Object(P.jsxs)(P.Fragment,{children:[C.filter(D).length," / ",a.words.filter(D).length]}):null}function Oe(){var e,t=[];null===a||void 0===a||a.words.forEach((function(e){var a=e.length;a in t||(t[a]={total:0,found:0,length:a}),t[a].total+=1})),C.forEach((function(e){var a=e.length;t[a].found+=1}));for(var n=null!==(e=k.a.max(k.a.map(t,"total")))&&void 0!==e?e:0,r=[],c=0;c<n;c++)r[c]=c;return Object(P.jsx)(P.Fragment,{children:t.sort().map((function(e,t){var a=e.total,n=e.found,c=e.length;return Object(P.jsxs)(m.a,{children:[Object(P.jsx)(p.a,{xs:1,children:c}),r.map((function(e){return Object(P.jsx)(p.a,{className:e<n?"marker-found":e<a?"marker-unfound":"marker-blank"},e)}))]},t)}))})}function pe(){return Object(P.jsx)(P.Fragment,{children:null===a||void 0===a?void 0:a.words.map((function(e){return Object(P.jsx)("span",{className:"m-1",children:e})}))})}}function F(e){return[e.island].concat(Object(l.a)(e.board)).join("")}function R(e){var t=e.board,a=e.play;return Object(P.jsxs)(p.a,{xs:"auto",className:"board",children:[Object(P.jsxs)(m.a,{className:"board-row-1",children:[Object(P.jsx)(B,{type:"sea",letter:t[0],play:a}),Object(P.jsx)(B,{type:"sea",letter:t[1],play:a}),Object(P.jsx)(B,{type:"sea",letter:t[2],play:a})]}),Object(P.jsxs)(m.a,{className:"board-row-2",children:[Object(P.jsx)(p.a,{className:"sea"}),Object(P.jsx)(B,{type:"island",letter:t[3],play:a}),Object(P.jsx)(p.a,{className:"sea"})]}),Object(P.jsxs)(m.a,{className:"board-row-3",children:[Object(P.jsx)(B,{type:"sea",letter:t[4],play:a}),Object(P.jsx)(B,{type:"sea",letter:t[5],play:a}),Object(P.jsx)(B,{type:"sea",letter:t[6],play:a})]})]})}function B(e){var t=e.type,a=e.play,n=e.letter;return Object(P.jsx)(p.a,{className:t,onClick:a.bind(null,n),onKeyUp:console.log,children:n},n)}function _(e){return Array.isArray(e)?k.a.sumBy(e,_):e.length<=4?1:e.length-3+(D(e)?7:0)}function D(e){return 7===k.a.uniq(e).length}var T=function(){var e=r.a.useState({}),t=Object(i.a)(e,2),a=t[0],n=t[1],c=x("puzzle",void 0),s=Object(i.a)(c,2),u=s[0],j=s[1],d=x("visitedPuzzleIds",[]),b=Object(i.a)(d,2),f=b[0],h=b[1],v=x("favoritePuzzleIds",[]),g=Object(i.a)(v,2),y=g[0],N=g[1],z=r.a.useRef({done:!1});r.a.useEffect((function(){if(u){var e=F(u);f.includes(e)||h([].concat(Object(l.a)(f),[e]))}}),[u,f,h]),z.current.done||(z.current.done=!0,function(){return w.apply(this,arguments)}().then(n));var I=r.a.useCallback((function(){return a?k.a.flatten(Object.values(a)):[]}),[a]),M={favoritePuzzles:y};return Object(P.jsxs)("div",{className:"fixed",children:[u&&Object(P.jsx)(U,{puzzle:u,prevPuzzle:function(){if(u){var e=f.indexOf(F(u));if(e>0){var t=R(f[e-1]);return j(t)}}j(k.a.shuffle(I()).pop())},nextPuzzle:function(){if(u){var e=f.indexOf(F(u));if(e>0&&e<f.length-1){var t=f[e+1],a=I().find((function(e){return t===F(e)}));return j(a)}}j(k.a.shuffle(I()).pop())}}),Object(P.jsx)("hr",{}),Object(P.jsxs)(m.a,{children:[Object(P.jsx)(p.a,{children:Object(P.jsx)(S.a,{title:"All Puzzles",children:Object.entries(a).map((function(e,t){return Object(i.a)(e,2)[1].map((function(e){var a=e.board,n=e.island,r=e.words;return Object(P.jsxs)(C.a.Item,{onSelect:j.bind(null,e),children:[n.toUpperCase(),"+",a.join("").toUpperCase()," (",r.length," words)"]},"".concat(t,".").concat(n))}))}))})}),Object(P.jsx)(p.a,{children:Object(P.jsx)(S.a,{title:"In-Progress",children:k.a.compact(f.map(R)).map((function(e){var t=e.board,a=e.island,n=e.words;return Object(P.jsxs)(C.a.Item,{onSelect:j.bind(null,e),children:[a.toUpperCase(),"+",t.join("").toUpperCase()," (",n.length," words)"]},F(e))}))})}),Object(P.jsx)(p.a,{children:Object(P.jsxs)(E.a,{children:[Object(P.jsx)(E.a.Prepend,{children:u&&Object(P.jsx)(O.a,{variant:y.includes(F(u))?"success":"outline-dark",onClick:function(){Object(o.arraySetToggle)(M,"favoritePuzzles",F(u)),N(Object(l.a)(y))},children:Object(P.jsx)(A.e,{})})}),Object(P.jsx)(E.a.Append,{children:Object(P.jsx)(S.a,{variant:"success",title:"Favorites",children:k.a.compact(y.map(R)).map((function(e){var t=e.board,a=e.island,n=e.words;return Object(P.jsxs)(C.a.Item,{onSelect:j.bind(null,e),children:[a.toUpperCase(),"+",t.join("").toUpperCase()," (",n.length," words)"]},F(e))}))})})]})})]})]});function R(e){return I().find((function(t){return e===F(t)}))}};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(Object(P.jsx)(r.a.StrictMode,{children:Object(P.jsx)(T,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[68,1,2]]]);
//# sourceMappingURL=main.50146cdc.chunk.js.map