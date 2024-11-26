(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{1949:function(e,n,s){Promise.resolve().then(s.bind(s,7685))},7685:function(e,n,s){"use strict";s.r(n),s.d(n,{default:function(){return a}});var t=s(7437),l=s(2265);function r(){let[e,n]=(0,l.useState)(""),[s,r]=(0,l.useState)(!1),[a,c]=(0,l.useState)(null),[i,o]=(0,l.useState)(null),d=async()=>{if(!e){c("Please enter a URL");return}r(!0),c(null),o(null);try{let n=await fetch("http://localhost:8000/classify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:e})});if(!n.ok)throw Error("Failed to analyze URL");let s=await n.json();o(s)}catch(e){c(e instanceof Error?e.message:"An error occurred")}finally{r(!1)}};return(0,t.jsxs)("div",{className:"flex flex-col space-y-4 w-full",children:[(0,t.jsxs)("div",{className:"input-container",children:[(0,t.jsx)("input",{type:"url",value:e,onChange:e=>n(e.target.value),onKeyPress:e=>{"Enter"!==e.key||s||d()},placeholder:"Enter URL to check",disabled:s,className:"url-input"}),(0,t.jsx)("button",{onClick:d,disabled:s,className:"check-button",children:s?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("svg",{className:"animate-spin h-4 w-4",viewBox:"0 0 24 24",children:[(0,t.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4",fill:"none"}),(0,t.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),(0,t.jsx)("span",{children:"Analyzing"})]}):"Check"})]}),a&&(0,t.jsx)("div",{className:"error-container",children:(0,t.jsxs)("div",{className:"flex items-start",children:[(0,t.jsx)("svg",{className:"h-5 w-5 shrink-0 mt-0.5",viewBox:"0 0 20 20",fill:"currentColor",children:(0,t.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),(0,t.jsx)("p",{className:"ml-3 text-sm",children:a})]})}),i&&(0,t.jsxs)("div",{className:"result-container",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)("svg",{className:"h-5 w-5 text-[#10a37f]",viewBox:"0 0 20 20",fill:"currentColor",children:(0,t.jsx)("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),(0,t.jsx)("span",{className:"text-base font-medium",children:i.category})]}),(0,t.jsxs)("span",{className:"confidence-badge ".concat(i.confidence>.8?"confidence-high":i.confidence>.6?"confidence-medium":"confidence-low"),children:[Math.round(100*i.confidence),"% confident"]})]}),i.explanation&&(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-2",children:i.explanation})]})]})}function a(){return(0,t.jsx)("main",{className:"app-container",children:(0,t.jsxs)("div",{className:"w-full h-full p-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,t.jsx)("h1",{className:"text-xl font-semibold",children:"Bookmark AI Organizer"}),(0,t.jsx)("button",{className:"w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center",children:(0,t.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("path",{d:"M6 9l6 6 6-6"})})})]}),(0,t.jsx)(r,{})]})})}},622:function(e,n,s){"use strict";var t=s(2265),l=Symbol.for("react.element"),r=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,c=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function o(e,n,s){var t,r={},o=null,d=null;for(t in void 0!==s&&(o=""+s),void 0!==n.key&&(o=""+n.key),void 0!==n.ref&&(d=n.ref),n)a.call(n,t)&&!i.hasOwnProperty(t)&&(r[t]=n[t]);if(e&&e.defaultProps)for(t in n=e.defaultProps)void 0===r[t]&&(r[t]=n[t]);return{$$typeof:l,type:e,key:o,ref:d,props:r,_owner:c.current}}n.Fragment=r,n.jsx=o,n.jsxs=o},7437:function(e,n,s){"use strict";e.exports=s(622)}},function(e){e.O(0,[971,472,744],function(){return e(e.s=1949)}),_N_E=e.O()}]);