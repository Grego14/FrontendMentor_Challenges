import{r as n,j as t,B as p,i as x}from"./index-B2VoGPci.js";function N(h){const{message:o,validCode:m,setValid:f,id:i,isValid:C}=h,[j,v]=n.useState(o),[a,y]=n.useState(!1),[D,l]=n.useState(!1);let c;const[b,u]=n.useState(!1);function g(e){l(!0),clearTimeout(c),c=setTimeout(()=>{v(e.target.value),l(!1)},300),u(!1)}function d(e){x(e)||y(!0)}function r(e){x(e)||(u(!0),f(j===m))}const s=b&&!C,k={onPointerUp:r,onKeyDown:r,className:"discount-input-button",disabled:s};return t.jsxs(t.Fragment,{children:[!a&&t.jsxs("div",{className:"discount-text",children:["Discount code?"," ",t.jsx(p,{props:{className:"discount-text-click",onPointerUp:d,onKeyDown:d},bounce:!1,text:"Click here!"})]}),a&&t.jsxs("div",{className:"discount-input-container",children:[t.jsxs("label",{htmlFor:i,value:"discount code",className:"discount-input-label",children:[s?t.jsx("span",{className:"discount-error",children:"Invalid Code"}):"Discount Code",t.jsx("input",{className:`discount-input${s?" invalid":""}`,type:"text",placeholder:o,onChange:g,name:i,id:i})]}),t.jsx(p,{buttonClass:"discount-input-button",props:k,show:!s,text:"Apply"})]})]})}export{N as default};