import{j as t,a as p,t as i}from"./index-BBXt9MN5.js";import{L as u}from"./LineWhoAppear-D6W3I3sK.js";function f({handleRemoveProduct:r,productsInCart:c}){return t.jsx("div",{className:"cart__products",onPointerUp:r,onKeyDown:r,children:c.map(a=>t.jsx(m,{data:a},a.id))})}function m({data:r}){const{name:c,count:a,price:s,id:n,initial:o,totalPrice:d}=r,l={hidden:{opacity:0,scale:0,x:"-150%"},show(e){return{x:"0%",opacity:1,scale:1,transition:{delay:e.initial?.2+e.id/(e.id>5?15:5):.2,when:"beforeChildren"}}}};return t.jsxs(p.div,{initial:"hidden",animate:"show",custom:{initial:o,id:n},variants:l,className:"cart-product",id:`cart-product-${n}`,children:[t.jsx(x,{name:c,count:a,price:s,totalPrice:d}),t.jsx(h,{}),t.jsx(u,{})]})}function x({name:r,count:c,price:a,totalPrice:s}){return t.jsxs("div",{className:"cart-product__wrapper--content",children:[t.jsx("h3",{className:"cart-product__name",children:r}),t.jsxs("div",{className:"cart-product__info",children:[t.jsxs("span",{className:"cart-product__count",children:[c,"x"]}),t.jsxs("div",{className:"cart-product__price-container",children:[t.jsx("span",{className:"cart-product__price-sign",children:"@"}),t.jsx("span",{className:"cart-product__price",children:i(a)})]}),t.jsx("span",{className:"cart-product__total-price",children:i(s)})]})]})}function h(){return t.jsx("div",{className:"cart-product__wrapper--button",children:t.jsx("button",{className:"cart-product__button cart-product__button--remove","aria-label":"remove product from cart","data-action":"cart",type:"button",children:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"10",height:"10",fill:"none",viewBox:"0 0 10 10",children:[t.jsx("title",{children:"remove product from cart"}),t.jsx("path",{fill:"#CAAFA7",d:"M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"})]})})})}export{f as default};
