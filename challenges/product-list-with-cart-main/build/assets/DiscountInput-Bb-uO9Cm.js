import{r as s,j as t,B as p,i as x}from"./index-BBXt9MN5.js";function N(h){const{message:o,validCode:m,setValid:f,id:i,isValid:C}=h,[j,v]=s.useState(o),[a,y]=s.useState(!1),[D,c]=s.useState(!1),l=s.useRef(null),[b,u]=s.useState(!1);function g(e){c(!0),clearTimeout(l.current),l.current=setTimeout(()=>{v(e.target.value),c(!1)},300),u(!1)}function r(e){x(e)||y(!0)}function d(e){x(e)||(u(!0),f(j===m))}const n=b&&!C,k={onPointerUp:d,onKeyDown:d,className:"discount-input-button",disabled:n};return t.jsxs(t.Fragment,{children:[!a&&t.jsxs("div",{className:"discount-text",children:["Discount code?"," ",t.jsx(p,{props:{className:"discount-text-click",onPointerUp:r,onKeyDown:r},bounce:!1,text:"Click here!"})]}),a&&t.jsxs("div",{className:"discount-input-container",children:[t.jsxs("label",{htmlFor:i,value:"discount code",className:"discount-input-label",children:[n?t.jsx("span",{className:"discount-error",children:"Invalid Code"}):"Discount Code",t.jsx("input",{className:`discount-input${n?" invalid":""}`,type:"text",placeholder:o,onChange:g,name:i,id:i})]}),t.jsx(p,{buttonClass:"discount-input-button",props:k,show:!n,text:"Apply"})]})]})}export{N as default};