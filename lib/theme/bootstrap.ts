import { THEME_COOKIE_PATTERN, THEME_ENABLED } from "./config";

const script = `(function(){try{var m=document.cookie.match(new RegExp(${JSON.stringify(THEME_COOKIE_PATTERN)})),t=m?m[1]:"system";if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var d=document.documentElement;d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})()`;

export const themeBootstrapScript = THEME_ENABLED ? script : "";
