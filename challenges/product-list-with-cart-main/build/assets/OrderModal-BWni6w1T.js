import{j as r,a as m,t as c,B as h,i as u}from"./index-BBXt9MN5.js";import{L as p}from"./LineWhoAppear-D6W3I3sK.js";import{T as x}from"./TotalPrice-DpWyh25v.js";function _({image:e,name:o}){return e.thumbnail?r.jsx("img",{className:"order-product__thumbnail",src:e.thumbnail,alt:"",width:"50",height:"50","aria-hidden":"true"}):r.jsx("div",{children:"Invalid image object"})}function j({data:e}){const{name:o,count:s,price:d,image:t,id:i,totalPrice:n}=e,a={hidden:{x:-100,opacity:0,scale:.5},show:{x:0,opacity:1,scale:1,transition:{when:"beforeChildren"}}},l={name:o,count:s,price:d,totalPrice:n};return r.jsxs(m.div,{className:"order-product pos-relative",initial:"hidden",whileInView:"show",viewport:{once:!0},variants:a,children:[r.jsx("div",{className:"order-product__thumbnail-container",children:r.jsx(_,{image:t,name:o})}),r.jsx(N,{...l}),r.jsx(p,{})]})}function N(e){const{name:o,count:s,price:d,totalPrice:t}=e;return r.jsxs("div",{className:"order-product__content",children:[r.jsxs("div",{className:"order-product__info",children:[r.jsx("h3",{className:"order-product__name",children:o}),r.jsxs("div",{className:"order-product__count",children:[s,"x"]}),r.jsxs("div",{className:"order-product__price-container",children:[r.jsx("span",{className:"order-product__sign",children:"@"}),r.jsx("span",{className:"order-product__price",children:c(d)})]})]}),r.jsx("div",{className:"order-product__total-price",children:c(t)})]})}function P({productsInCart:e,visible:o,newOrder:s,discount:d,totalPrice:t}){function i(a){u(a)||s()}const n={className:"order-modal__button",onPointerUp:i,onKeyDown:i};return r.jsx("div",{className:"modal-background",children:r.jsxs("div",{className:`order-modal ${o?"order-modal--show":""}`,children:[r.jsx("img",{className:"order-modal__icon",src:"./assets/images/icon-order-confirmed.svg",alt:"","aria-hidden":"true",width:"50",height:"50"}),r.jsx("h2",{className:"order-modal__title",children:"Order Confirmed"}),r.jsx("p",{className:"order-modal__text",children:"We hope you enjoy your food!"}),r.jsxs("div",{className:"order-modal__info",children:[r.jsx("div",{className:"order-modal__products",children:o&&e.map(a=>r.jsx(j,{data:a},a.id))}),r.jsxs("div",{className:"order-modal__total",children:[r.jsx("div",{className:"total__text",children:"Order Total"}),r.jsx(x,{price:t,discount:d,amount:20})]})]}),r.jsx(h,{text:"Start New Order",props:n})]})})}export{P as default};
