import{j as r,a as l,t as c,g as m,b as h,B as u}from"./index-BfsSDj0Q.js";import{T as p}from"./TotalPrice-Df7gg3QJ.js";import{A as x}from"./index-DlbXDiDn.js";function _({image:e,name:a}){return e.thumbnail?r.jsx("img",{className:"order-product__thumbnail",src:e.thumbnail,alt:"",width:"50",height:"50","aria-hidden":"true"}):r.jsx("div",{children:"Invalid image object"})}function j({data:e}){const{name:a,count:s,price:i,image:t,id:n}=e,d={hidden:{x:-100,opacity:0,scale:.5},show:{x:0,opacity:1,scale:1}};return r.jsxs(l.div,{className:"order-product pos-relative",initial:"hidden",whileInView:"show",viewport:{once:!0},variants:d,children:[r.jsx("div",{className:"order-product__thumbnail-container",children:r.jsx(_,{image:t,name:a})}),r.jsx(N,{name:a,count:s,price:i})]})}function N({name:e,count:a,price:s}){return r.jsxs("div",{className:"order-product__content",children:[r.jsxs("div",{className:"order-product__info",children:[r.jsx("h3",{className:"order-product__name",children:e}),r.jsxs("div",{className:"order-product__count",children:[a,"x"]}),r.jsxs("div",{className:"order-product__price-container",children:[r.jsx("span",{className:"order-product__sign",children:"@"}),r.jsx("span",{className:"order-product__price",children:c(s)})]})]}),r.jsx("div",{className:"order-product__total-price",children:c(m(s,a))})]})}function g({products:e,visible:a,newOrder:s,discount:i}){e.slice();const t=h(e.map(o=>m(o.price,o.count))),n={show:{opacity:1,y:"0%",transition:{duration:.3}}},d={className:"order-modal__button",onPointerUp:s,onKeyDown:s};return r.jsx("div",{className:"modal-background",children:r.jsxs(l.div,{style:{opacity:.5,y:"5%"},className:"order-modal",animate:"show",variants:n,children:[r.jsx("img",{className:"order-modal__icon",src:"./assets/images/icon-order-confirmed.svg",alt:"","aria-hidden":"true",width:"50",height:"50"}),r.jsx("h2",{className:"order-modal__title",children:"Order Confirmed"}),r.jsx("p",{className:"order-modal__text",children:"We hope you enjoy your food!"}),r.jsxs("div",{className:"order-modal__info",children:[r.jsx("div",{className:"order-modal__products",children:r.jsx(x,{children:a&&e.map(o=>r.jsx(j,{data:o},o.id))})}),r.jsxs("div",{className:"order-modal__total",children:[r.jsx("div",{className:"total__text",children:"Order Total"}),r.jsx(p,{price:t,discount:i,amount:20})]})]}),r.jsx(u,{text:"Start New Order",props:d})]},"modal")})}export{g as default};
