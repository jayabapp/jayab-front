const splashStyles = `
#app-splash{position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;background-color:#3886e5;contain:layout paint style;transition:opacity 500ms ease-in-out,transform 500ms ease-in-out}
#app-splash::before{content:"";position:absolute;width:300px;height:300px;border-radius:9999px;background:radial-gradient(circle closest-side,rgba(255,255,255,.3),rgba(255,255,255,.15) 45%,rgba(255,255,255,0) 100%);transform:scale(0);opacity:0;animation:splash-glow 1s ease-out alternate 10}
#app-splash .splash-logo{position:relative;z-index:10;width:10rem;height:10rem;color:#fff;animation:splash-logo-pop .7s cubic-bezier(.34,1.56,.64,1) forwards}
#app-splash.app-splash--leaving{opacity:0;transform:scale(1.05);pointer-events:none}
#app-splash.app-splash--done{display:none}
@keyframes splash-glow{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes splash-logo-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){#app-splash,#app-splash::before,#app-splash .splash-logo{animation:none;transition-duration:1ms}#app-splash::before,#app-splash .splash-logo{opacity:1;transform:none}}
`;

export default splashStyles;
