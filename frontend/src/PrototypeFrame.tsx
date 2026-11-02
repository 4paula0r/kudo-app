import {useCallback,useEffect,useRef} from 'react'
type Props={src:string,title:string}

/** Loads one of the user's original responsive HTML screens inside the React route. */
export default function PrototypeFrame({src,title}:Props){
  const frame=useRef<HTMLIFrameElement>(null)
  const fitFrame=useCallback(()=>{
    const doc=frame.current?.contentDocument
    if(!doc)return
    const resize=()=>{
      const height=Math.max(doc.documentElement.scrollHeight,doc.body?.scrollHeight||0,720)
      if(frame.current)frame.current.style.height=`${height}px`
    }
    resize()
    window.setTimeout(resize,250)
  },[])
  useEffect(()=>{
    window.addEventListener('resize',fitFrame)
    return()=>window.removeEventListener('resize',fitFrame)
  },[fitFrame])
  return <iframe ref={frame} className="prototype-frame" src={src} title={title} onLoad={fitFrame} />
}
