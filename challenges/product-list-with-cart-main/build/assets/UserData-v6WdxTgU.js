const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ToggleThemeButton-v-tu0wUC.js","./index-BBXt9MN5.js","./index-CUdZuQ5l.css","./ToggleThemeButton-vqqCXyGQ.css"])))=>i.map(i=>d[i]);
import{j as t,a as l,r as c,d as j,_ as b}from"./index-BBXt9MN5.js";import{T as g}from"./TotalPrice-DpWyh25v.js";function T({visible:e,productsCount:s,totalPrice:r,discount:u}){const i={hidden:{opacity:0,scale:.5,y:"-150%"},show:{opacity:1,scale:1}};return t.jsxs(l.div,{initial:"show",animate:"show",variants:i,role:"status","aria-live":"polite","aria-atomic":"true",className:"user-order",children:[t.jsxs("div",{children:["Products:"," ",t.jsx("span",{className:"user-order__products-count",children:s})]}),t.jsxs("div",{children:["Total Price:"," ",t.jsx(g,{price:r,discount:u,amount:20,totalClassName:" user-order__total-price"})]})]})}const p=c.lazy(()=>b(()=>import("./ToggleThemeButton-v-tu0wUC.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));function R(e){e.theme;const s=c.useRef(null),r=j.any(),[u,i]=c.useState(!1),h={root:null,rootMargin:"0px",threshold:[.2,.4]},n=new IntersectionObserver(f,h);function f(d,_){for(const m of d){const o=_.thresholds,a=m.intersectionRatio;if(a<=0||!m.isIntersecting)return!1;a>=o[0]&&a<o[1]&&(s.current.style.bottom="0",s.current.style.top="unset"),a>=o[1]&&a>o[0]&&(s.current.style.bottom="unset",s.current.style.top="0"),i(!0)}}c.useEffect(()=>(r==="mobile"&&n.observe(e.cartRef.current),()=>{r==="mobile"&&n.disconnect(e.cartRef.current)}),[e.cartRef.current,n.observe,n.disconnect,r]);const v={totalPrice:e.totalPrice,productsCount:e.productsCount,visible:e.productsFetched,discount:e.discount},y={hidden:{opacity:0,scale:0},show:{opacity:1,scale:1}},x={hidden:{opacity:0,y:"150%"},show:{opacity:1,y:"0%"},move:{opacity:[0,1],transition:{duration:.3},transitionEnd(d){setTimeout(()=>{i(!1)},50)}}};return t.jsx(l.div,{className:"user-data",ref:s,initial:"hidden",animate:["show",u?"move":""],variants:x,transition:{delay:.2,duration:.5,ease:"easeInOut"},children:t.jsx(l.div,{className:"user-data__container",initial:"hidden",animate:"show",transition:{duration:.3},variants:y,children:e.productsFetched&&t.jsxs(t.Fragment,{children:[t.jsx(T,{...v}),t.jsx(p,{theme:e.theme,toggleTheme:e.toggleTheme})]})})})}export{R as default};
