const API='/api'
export function token(){return localStorage.getItem('kudo-token')}
export async function request<T>(path:string, options:RequestInit={}):Promise<T>{const res=await fetch(API+path,{...options,headers:{'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`} : {}),...options.headers}});const data=await res.json();if(!res.ok)throw new Error(data.message||'No se pudo completar la solicitud');return data}
