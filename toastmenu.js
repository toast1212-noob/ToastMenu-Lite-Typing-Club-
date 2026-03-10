javascript:(function(){
  if(!location.href.includes("edclub.com"))return;
  if(document.getElementById("toast-menu"))return;

  /* ---------- helpers ---------- */
  function getText(){ const l=[...document.querySelectorAll(".line")]; return l.length?l.map(e=>e.textContent).join("").replace(/\s+/g," ").trim():null; }
  function getInput(){ return document.querySelector('input[type="text"],textarea'); }

  /* ---------- typing ---------- */
  function type(text,min,max,stop){
    const i=getInput();
    if(!i)return alert("Typing box not found");
    i.focus();
    let n=0;
    let end=stop?Math.floor(text.length*stop):text.length;
    function step(){
      if(n>=end)return;
      const c=text[n];
      i.dispatchEvent(new KeyboardEvent("keydown",{key:c,bubbles:true}));
      i.value+=c;
      i.dispatchEvent(new Event("input",{bubbles:true}));
      i.dispatchEvent(new KeyboardEvent("keyup",{key:c,bubbles:true}));
      let d=min+Math.random()*max;
      if(c===" ") d+=60+Math.random()*120;
      n++;
      setTimeout(step,d);
    }
    step();
  }

  /* ---------- lesson ---------- */
  function skip(){ const m=location.pathname.match(/\/(\d+)\.play$/); if(!m)return; location.href=location.href.replace(/\/\d+\.play$/,"/"+(parseInt(m[1])+1)+".play"); }
  function copy(){ const t=getText(); if(!t)return; navigator.clipboard.writeText(t); }

  /* ---------- appearance ---------- */
  function textColor(){ const c=prompt("Text color (#fff etc)"); if(!c)return; document.querySelectorAll(".token span").forEach(e=>e.style.color=c); document.querySelectorAll("input,textarea").forEach(e=>e.style.color=c); }
  function bgColor(){ const c=prompt("Background color"); if(c)document.body.style.background=c; }
  function bgImage(){ const url=prompt("Image/GIF URL"); if(!url)return; document.body.style.backgroundImage=`url("${url}")`; document.body.style.backgroundSize="cover"; document.body.style.backgroundPosition="center"; document.body.style.backgroundAttachment="fixed"; }

  /* ---------- username ---------- */
  function changeName(){ const el=[...document.querySelectorAll("a.dropdown-toggle")].find(e=>e.querySelector(".caret")); if(!el){alert("Username element not found");return;} const caret=el.querySelector(".caret"); el.innerHTML="ToastMenu User "; el.appendChild(caret); }

  /* ---------- UI ---------- */
  function btn(t,f){ const b=document.createElement("button"); b.textContent=t; Object.assign(b.style,{width:"100%",marginTop:"6px",background:"#000",color:"#fff",border:"1px solid #444",padding:"6px",cursor:"pointer"}); b.onclick=f; return b; }
  function section(title){ const wrapper=document.createElement("div"); const header=document.createElement("div"); header.textContent="▶ "+title; Object.assign(header.style,{marginTop:"10px",fontWeight:"bold",cursor:"pointer",borderBottom:"1px solid #444"}); const content=document.createElement("div"); content.style.display="none"; header.onclick=()=>{ const open=content.style.display==="block"; content.style.display=open?"none":"block"; header.textContent=(open?"▶ ":"▼ ")+title; }; wrapper.appendChild(header); wrapper.appendChild(content); return {wrapper,content}; }

  /* ---------- menu ---------- */
  const menu=document.createElement("div");
  menu.id="toast-menu";
  Object.assign(menu.style,{position:"fixed",right:"10px",top:"50%",transform:"translateY(-50%)",background:"#1b1b1b",color:"#fff",padding:"12px",borderRadius:"8px",zIndex:"999999",fontFamily:"Arial",width:"210px",cursor:"move",textAlign:"center"});

  /* ---------- menu title ---------- */
  const menuTitle=document.createElement("div");
  menuTitle.textContent="ToastMenu Lite";
  Object.assign(menuTitle.style,{fontWeight:"bold",fontSize:"16px",marginBottom:"8px"});
  menu.appendChild(menuTitle);

  /* ---------- drag menu ---------- */
  let drag=false,ox=0,oy=0;
  menu.onmousedown=e=>{drag=true; ox=e.clientX-menu.offsetLeft; oy=e.clientY-menu.offsetTop;};
  document.onmouseup=()=>drag=false;
  document.onmousemove=e=>{ if(!drag)return; menu.style.left=(e.clientX-ox)+"px"; menu.style.top=(e.clientY-oy)+"px"; menu.style.right="auto"; menu.style.transform="none"; };

  /* ---------- typing section ---------- */
  const typing=section("Typing");
  typing.content.appendChild(btn("Fast Auto Type",()=>{const t=getText();if(t)type(t,45,55);}));
  typing.content.appendChild(btn("Auto Type",()=>{const t=getText();if(t)type(t,80,120);}));
  typing.content.appendChild(btn("Slow Auto Type",()=>{const t=getText();if(t)type(t,140,220);}));
  typing.content.appendChild(btn("Smart Auto Type",()=>{const t=getText();if(t)type(t,60,90,.95);}));
  menu.appendChild(typing.wrapper);

  /* ---------- lesson section ---------- */
  const lesson=section("Lesson");
  lesson.content.appendChild(btn("Copy Lesson Text",copy));
  lesson.content.appendChild(btn("Skip Lesson",skip));
  menu.appendChild(lesson.wrapper);

  /* ---------- appearance ---------- */
  const appearance=section("Appearance");
  appearance.content.appendChild(btn("Background Color",bgColor));
  appearance.content.appendChild(btn("Background Image",bgImage));
  appearance.content.appendChild(btn("Text Color",textColor));
  menu.appendChild(appearance.wrapper);

  /* ---------- utilities ---------- */
  const util=section("Utilities");
  util.content.appendChild(btn("Rename to ToastMenu User",changeName));
  menu.appendChild(util.wrapper);

  document.body.appendChild(menu);
})();
