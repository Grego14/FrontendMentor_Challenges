import{j as r,af as a}from"./index-CDa9gCp2.js";import{L as t}from"./LineWhoAppear-DjLSbyZi.js";function n({image:e,name:s}){return e.thumbnail?r.jsx("img",{className:"order-product__thumbnail",src:e.thumbnail,alt:"",width:"50",height:"50","aria-hidden":"true",draggable:"false"}):r.jsx("div",{children:"Invalid image object"})}function p({data:e}){const{name:s,count:c,price:d,image:i,totalPrice:o}=e;return r.jsxs("div",{className:"order-product pos-relative",children:[r.jsx(n,{image:i,name:s}),r.jsxs("div",{className:"order-product__content",children:[r.jsxs("div",{className:"order-product__info",children:[r.jsx("h3",{className:"order-product__name",children:s}),r.jsxs("span",{className:"order-product__count",children:[c,"x"]}),r.jsxs("span",{className:"order-product__price-container",children:[r.jsx("span",{className:"order-product__sign",children:"@"}),r.jsx("span",{className:"order-product__price",children:a(d)})]})]}),r.jsx("div",{className:"order-product__total-price",children:a(o)})]}),r.jsx(t,{})]})}export{p as default};
