export const readStore=<T,>(key:string,fallback:T):T=>{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}};
export const writeStore=<T,>(key:string,value:T)=>{if(typeof window!=='undefined')localStorage.setItem(key,JSON.stringify(value))};
