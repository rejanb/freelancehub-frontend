import{i as S}from"./chunk-LBDSJBCK.js";import{$ as C,Aa as c,wa as z,ya as d}from"./chunk-SFRASIIN.js";import{Ab as v,Sa as $,Tb as p,U as r,Ub as y,V as f,Vc as I,_ as l,ab as s,bb as b,ca as g,da as m,ea as M,jb as a,lb as h,oa as o,rc as D,xb as F,zb as x}from"./chunk-D3OC6ZHD.js";var N=({dt:e})=>`
.p-iconfield {
    position: relative;
    display: block;
}

.p-inputicon {
    position: absolute;
    top: 50%;
    margin-top: calc(-1 * (${e("icon.size")} / 2));
    color: ${e("iconfield.icon.color")};
    line-height: 1;
}

.p-iconfield .p-inputicon:first-child {
    inset-inline-start: ${e("form.field.padding.x")};
}

.p-iconfield .p-inputicon:last-child {
    inset-inline-end: ${e("form.field.padding.x")};
}

.p-iconfield .p-inputtext:not(:first-child) {
    padding-inline-start: calc((${e("form.field.padding.x")} * 2) + ${e("icon.size")});
}

.p-iconfield .p-inputtext:not(:last-child) {
    padding-inline-end: calc((${e("form.field.padding.x")} * 2) + ${e("icon.size")});
}

.p-iconfield:has(.p-inputfield-sm) .p-inputicon {
    font-size: ${e("form.field.sm.font.size")};
    width: ${e("form.field.sm.font.size")};
    height: ${e("form.field.sm.font.size")};
    margin-top: calc(-1 * (${e("form.field.sm.font.size")} / 2));
}

.p-iconfield:has(.p-inputfield-lg) .p-inputicon {
    font-size: ${e("form.field.lg.font.size")};
    width: ${e("form.field.lg.font.size")};
    height: ${e("form.field.lg.font.size")};
    margin-top: calc(-1 * (${e("form.field.lg.font.size")} / 2));
}
`,E={root:"p-iconfield"},j=(()=>{class e extends d{name="iconfield";theme=N;classes=E;static \u0275fac=(()=>{let i;return function(t){return(i||(i=o(e)))(t||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var H=["*"],ee=(()=>{class e extends c{iconPosition="left";get _styleClass(){return this.styleClass}styleClass;_componentStyle=l(j);static \u0275fac=(()=>{let i;return function(t){return(i||(i=o(e)))(t||e)}})();static \u0275cmp=g({type:e,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostAttrs:[1,"p-iconfield"],hostVars:6,hostBindings:function(n,t){n&2&&(h(t._styleClass),a("p-iconfield-left",t.iconPosition==="left")("p-iconfield-right",t.iconPosition==="right"))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},standalone:!0,features:[p([j]),s,y],ngContentSelectors:H,decls:1,vars:0,template:function(n,t){n&1&&(x(),v(0))},dependencies:[I],encapsulation:2,changeDetection:0})}return e})();var V={root:"p-inputicon"},w=(()=>{class e extends d{name="inputicon";classes=V;static \u0275fac=(()=>{let i;return function(t){return(i||(i=o(e)))(t||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})(),J=["*"],ge=(()=>{class e extends c{styleClass;get hostClasses(){return this.styleClass}_componentStyle=l(w);static \u0275fac=(()=>{let i;return function(t){return(i||(i=o(e)))(t||e)}})();static \u0275cmp=g({type:e,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:4,hostBindings:function(n,t){n&2&&(h(t.hostClasses),a("p-inputicon",!0))},inputs:{styleClass:"styleClass"},standalone:!0,features:[p([w]),s,y],ngContentSelectors:J,decls:1,vars:0,template:function(n,t){n&1&&(x(),v(0))},dependencies:[I,z],encapsulation:2,changeDetection:0})}return e})();var A=({dt:e})=>`
.p-inputtext {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${e("inputtext.color")};
    background: ${e("inputtext.background")};
    padding-block: ${e("inputtext.padding.y")};
    padding-inline: ${e("inputtext.padding.x")};
    border: 1px solid ${e("inputtext.border.color")};
    transition: background ${e("inputtext.transition.duration")}, color ${e("inputtext.transition.duration")}, border-color ${e("inputtext.transition.duration")}, outline-color ${e("inputtext.transition.duration")}, box-shadow ${e("inputtext.transition.duration")};
    appearance: none;
    border-radius: ${e("inputtext.border.radius")};
    outline-color: transparent;
    box-shadow: ${e("inputtext.shadow")};
}

.p-inputtext.ng-invalid.ng-dirty {
    border-color: ${e("inputtext.invalid.border.color")};
}

.p-inputtext:enabled:hover {
    border-color: ${e("inputtext.hover.border.color")};
}

.p-inputtext:enabled:focus {
    border-color: ${e("inputtext.focus.border.color")};
    box-shadow: ${e("inputtext.focus.ring.shadow")};
    outline: ${e("inputtext.focus.ring.width")} ${e("inputtext.focus.ring.style")} ${e("inputtext.focus.ring.color")};
    outline-offset: ${e("inputtext.focus.ring.offset")};
}

.p-inputtext.p-invalid {
    border-color: ${e("inputtext.invalid.border.color")};
}

.p-inputtext.p-variant-filled {
    background: ${e("inputtext.filled.background")};
}

.p-inputtext.p-variant-filled:enabled:focus {
    background: ${e("inputtext.filled.focus.background")};
}

.p-inputtext:disabled {
    opacity: 1;
    background: ${e("inputtext.disabled.background")};
    color: ${e("inputtext.disabled.color")};
}

.p-inputtext::placeholder {
    color: ${e("inputtext.placeholder.color")};
}

.p-inputtext.ng-invalid.ng-dirty::placeholder {
    color: ${e("inputtext.invalid.placeholder.color")};
}

.p-inputtext-sm {
    font-size: ${e("inputtext.sm.font.size")};
    padding-block: ${e("inputtext.sm.padding.y")};
    padding-inline: ${e("inputtext.sm.padding.x")};
}

.p-inputtext-lg {
    font-size: ${e("inputtext.lg.font.size")};
    padding-block: ${e("inputtext.lg.padding.y")};
    padding-inline: ${e("inputtext.lg.padding.x")};
}

.p-inputtext-fluid {
    width: 100%;
}
`,_={root:({instance:e,props:u})=>["p-inputtext p-component",{"p-filled":e.filled,"p-inputtext-sm":u.size==="small","p-inputtext-lg":u.size==="large","p-invalid":u.invalid,"p-variant-filled":u.variant==="filled","p-inputtext-fluid":u.fluid}]},P=(()=>{class e extends d{name="inputtext";theme=A;classes=_;static \u0275fac=(()=>{let i;return function(t){return(i||(i=o(e)))(t||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var Ce=(()=>{class e extends c{ngModel;variant="outlined";fluid;pSize;filled;_componentStyle=l(P);get hasFluid(){let n=this.el.nativeElement.closest("p-fluid");return C(this.fluid)?!!n:this.fluid}constructor(i){super(),this.ngModel=i}ngAfterViewInit(){super.ngAfterViewInit(),this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(n){return new(n||e)($(S,8))};static \u0275dir=M({type:e,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component"],hostVars:14,hostBindings:function(n,t){n&1&&F("input",function(T){return t.onInput(T)}),n&2&&a("p-filled",t.filled)("p-variant-filled",t.variant==="filled"||t.config.inputStyle()==="filled"||t.config.inputVariant()==="filled")("p-inputtext-fluid",t.hasFluid)("p-inputtext-sm",t.pSize==="small")("p-inputfield-sm",t.pSize==="small")("p-inputtext-lg",t.pSize==="large")("p-inputfield-lg",t.pSize==="large")},inputs:{variant:"variant",fluid:[2,"fluid","fluid",D],pSize:"pSize"},standalone:!0,features:[p([P]),b,s]})}return e})(),ze=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=m({type:e});static \u0275inj=f({})}return e})();export{ee as a,ge as b,Ce as c,ze as d};
