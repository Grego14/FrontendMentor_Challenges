const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./OrderProduct-AHtQTuBu.js","./index-CDa9gCp2.js","./index-Bx_K-weJ.css","./LineWhoAppear-DjLSbyZi.js","./LineWhoAppear-S7-MXh3A.css","./OrderProduct-DUL_2H3x.css"])))=>i.map(i=>d[i]);
import{j as r,r as l,_ as n,i as c}from"./index-CDa9gCp2.js";import{A as m}from"./AppButton-CHZfdK2N.js";const _=l.lazy(()=>n(()=>import("./OrderProduct-AHtQTuBu.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url));function u({productsInCart:s,newOrder:a,totalPrice:p,TotalPriceComponent:d}){function o(e){c(e)||a()}const t={className:"order-modal__button",onPointerUp:o,onKeyDown:o};function i(e){e.target.classList.contains("modal-overlay")&&a()}return r.jsx("div",{className:"modal-overlay",onPointerUp:i,children:r.jsxs("div",{className:"order-modal",children:[r.jsx("img",{className:"order-modal__icon",src:"./assets/images/icon-order-confirmed.svg",alt:"","aria-hidden":"true",width:"50",height:"50",draggable:"false"}),r.jsx("h2",{className:"order-modal__title",children:"Order Confirmed"}),r.jsx("p",{className:"order-modal__text",children:"We hope you enjoy your food!"}),r.jsxs("div",{className:"order-modal__info",children:[r.jsx("div",{className:"order-modal__products","aria-live":"polite",children:s.map(e=>r.jsx(_,{data:e},e.id))}),r.jsxs("div",{className:"order-modal__total",children:[r.jsx("div",{className:"total__text",children:"Order Total"}),r.jsx(d,{})]})]}),r.jsx(m,{props:t,render:"Start New Order"})]})})}export{u as default};