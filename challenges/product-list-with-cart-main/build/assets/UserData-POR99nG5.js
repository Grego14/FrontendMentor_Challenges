import{r as c,d as _,j as e,a as g}from"./index-B2VoGPci.js";function D(r){const{productsCount:u,productsFetched:n,TotalPriceComponent:f,cartRef:o}=r,t=c.useRef(null),d=_.any(),[m,l]=c.useState(!1),[v,p]=c.useState(!1),x={root:null,rootMargin:"0px",threshold:[.2,.4]},a=new IntersectionObserver(j,x);function j(w,O){for(const h of w){const i=O.thresholds,s=h.intersectionRatio;if(s<=0||!h.isIntersecting)return!1;s>=i[0]&&s<i[1]&&(t.current.style.bottom="0",t.current.style.top="unset"),s>=i[1]&&s>i[0]&&(t.current.style.bottom="unset",t.current.style.top="0"),l(!0)}}c.useEffect(()=>(d==="mobile"&&o.current&&a.observe(o.current),()=>{a.disconnect(o.current)}),[o.current,a.observe,a.disconnect,d]);const y={productsCount:u,TotalPriceComponent:f,visible:v},b={hidden:{opacity:0,y:"150%"},show:{opacity:1,y:"0%",transitionEnd(){p(!0)}},move:{opacity:[0,1],transitionEnd(){setTimeout(()=>{l(!1)},50)},transition:{delay:.2,duration:.5,ease:"easeInOut"}}};return e.jsx(g.div,{className:"user-data",ref:t,initial:"hidden",animate:["show",m?"move":""],variants:b,children:e.jsx("div",{className:`user-data__container${n?" user-data__container--show":""}`,children:n&&e.jsxs(e.Fragment,{children:[e.jsx(E,{...y}),r.children]})})})}function E({visible:r,productsCount:u,TotalPriceComponent:n}){return e.jsxs("div",{role:"status","aria-live":"polite","aria-atomic":"true",className:`user-order${r?" user-order--show":""}`,children:[e.jsxs("div",{children:["Products:"," ",e.jsx("span",{className:"user-order__products-count",children:u})]}),e.jsxs("div",{children:["Total Price: ",e.jsx(n,{})]})]})}export{D as default};