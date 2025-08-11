import{Aa as D,wa as a,ya as C}from"./chunk-SFRASIIN.js";import{Hc as b,Nc as v,Tb as k,U as l,Ub as S,V as d,Vc as M,_ as c,a as i,ab as u,b as s,ca as p,da as m,gb as f,hb as h,lb as g,oa as r,sb as y}from"./chunk-D3OC6ZHD.js";var F=({dt:e})=>`
.p-skeleton {
    overflow: hidden;
    background: ${e("skeleton.background")};
    border-radius: ${e("skeleton.border.radius")};
}

.p-skeleton::after {
    content: "";
    animation: p-skeleton-animation 1.2s infinite;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), ${e("skeleton.animation.background")}, rgba(255, 255, 255, 0));
}

[dir='rtl'] .p-skeleton::after {
    animation-name: p-skeleton-animation-rtl;
}

.p-skeleton-circle {
    border-radius: 50%;
}

.p-skeleton-animation-none::after {
    animation: none;
}

@keyframes p-skeleton-animation {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}

@keyframes p-skeleton-animation-rtl {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(-100%);
    }
}
`,z={root:{position:"relative"}},I={root:({props:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},w=(()=>{class e extends C{name="skeleton";theme=F;classes=I;inlineStyles=z;static \u0275fac=(()=>{let t;return function(o){return(t||(t=r(e)))(o||e)}})();static \u0275prov=l({token:e,factory:e.\u0275fac})}return e})();var R=(()=>{class e extends D{styleClass;style;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=c(w);containerClass(){return{"p-skeleton p-component":!0,"p-skeleton-circle":this.shape==="circle","p-skeleton-animation-none":this.animation==="none"}}get containerStyle(){let t=this._componentStyle?.inlineStyles.root,n;return this.size?n=s(i(i({},this.style),t),{width:this.size,height:this.size,borderRadius:this.borderRadius}):n=i(s(i({},t),{width:this.width,height:this.height,borderRadius:this.borderRadius}),this.style),n}static \u0275fac=(()=>{let t;return function(o){return(t||(t=r(e)))(o||e)}})();static \u0275cmp=p({type:e,selectors:[["p-skeleton"]],inputs:{styleClass:"styleClass",style:"style",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},standalone:!0,features:[k([w]),u,S],decls:1,vars:7,consts:[[3,"ngClass","ngStyle"]],template:function(n,o){n&1&&y(0,"div",0),n&2&&(g(o.styleClass),h("ngClass",o.containerClass())("ngStyle",o.containerStyle),f("data-pc-name","skeleton")("aria-hidden",!0)("data-pc-section","root"))},dependencies:[M,b,v,a],encapsulation:2,changeDetection:0})}return e})(),H=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=m({type:e});static \u0275inj=d({imports:[R,a,a]})}return e})();export{R as a,H as b};
