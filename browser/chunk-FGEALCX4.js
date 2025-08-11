import{Aa as R,va as J,wa as g,ya as P}from"./chunk-SFRASIIN.js";import{Ab as w,Db as f,Fb as m,Gb as y,Hc as E,Jc as O,Kb as j,Lb as z,Oc as q,Ra as o,Tb as B,U as v,Ub as N,V as h,Vc as A,_ as T,ab as $,bb as M,ca as b,da as C,eb as r,hb as i,kb as k,lb as I,oa as p,qb as d,rb as u,rc as Q,sb as x,tb as D,ub as F,yb as l,zb as S}from"./chunk-D3OC6ZHD.js";var H=({dt:e})=>`
.p-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${e("tag.primary.background")};
    color: ${e("tag.primary.color")};
    font-size: ${e("tag.font.size")};
    font-weight: ${e("tag.font.weight")};
    padding: ${e("tag.padding")};
    border-radius: ${e("tag.border.radius")};
    gap: ${e("tag.gap")};
}

.p-tag-icon {
    font-size: ${e("tag.icon.size")};
    width: ${e("tag.icon.size")};
    height:${e("tag.icon.size")};
}

.p-tag-rounded {
    border-radius: ${e("tag.rounded.border.radius")};
}

.p-tag-success {
    background: ${e("tag.success.background")};
    color: ${e("tag.success.color")};
}

.p-tag-info {
    background: ${e("tag.info.background")};
    color: ${e("tag.info.color")};
}

.p-tag-warn {
    background: ${e("tag.warn.background")};
    color: ${e("tag.warn.color")};
}

.p-tag-danger {
    background: ${e("tag.danger.background")};
    color: ${e("tag.danger.color")};
}

.p-tag-secondary {
    background: ${e("tag.secondary.background")};
    color: ${e("tag.secondary.color")};
}

.p-tag-contrast {
    background: ${e("tag.contrast.background")};
    color: ${e("tag.contrast.color")};
}
`,G={root:({props:e})=>["p-tag p-component",{"p-tag-info":e.severity==="info","p-tag-success":e.severity==="success","p-tag-warn":e.severity==="warn","p-tag-danger":e.severity==="danger","p-tag-secondary":e.severity==="secondary","p-tag-contrast":e.severity==="contrast","p-tag-rounded":e.rounded}],icon:"p-tag-icon",label:"p-tag-label"},V=(()=>{class e extends P{name="tag";theme=H;classes=G;static \u0275fac=(()=>{let t;return function(n){return(t||(t=p(e)))(n||e)}})();static \u0275prov=v({token:e,factory:e.\u0275fac})}return e})();var K=["icon"],L=["*"];function U(e,s){if(e&1&&x(0,"span",4),e&2){let t=l(2);i("ngClass",t.icon)}}function W(e,s){if(e&1&&(D(0),r(1,U,1,1,"span",3),F()),e&2){let t=l();o(),i("ngIf",t.icon)}}function X(e,s){}function Y(e,s){e&1&&r(0,X,0,0,"ng-template")}function Z(e,s){if(e&1&&(d(0,"span",5),r(1,Y,1,0,null,6),u()),e&2){let t=l();o(),i("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)}}var ee=(()=>{class e extends R{get style(){return this._style}set style(t){this._style=t,this.cd.markForCheck()}styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_style;_componentStyle=T(V);ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"icon":this._iconTemplate=t.template;break}})}containerClass(){let t="p-tag p-component";return this.severity&&(t+=` p-tag-${this.severity}`),this.rounded&&(t+=" p-tag-rounded"),this.styleClass&&(t+=` ${this.styleClass}`),t}static \u0275fac=(()=>{let t;return function(n){return(t||(t=p(e)))(n||e)}})();static \u0275cmp=b({type:e,selectors:[["p-tag"]],contentQueries:function(a,n,_){if(a&1&&(f(_,K,4),f(_,J,4)),a&2){let c;m(c=y())&&(n.iconTemplate=c.first),m(c=y())&&(n.templates=c)}},hostVars:4,hostBindings:function(a,n){a&2&&(k(n.style),I(n.containerClass()))},inputs:{style:"style",styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",Q]},standalone:!0,features:[B([V]),M,$,N],ngContentSelectors:L,decls:5,vars:3,consts:[[4,"ngIf"],["class","p-tag-icon",4,"ngIf"],[1,"p-tag-label"],["class","p-tag-icon",3,"ngClass",4,"ngIf"],[1,"p-tag-icon",3,"ngClass"],[1,"p-tag-icon"],[4,"ngTemplateOutlet"]],template:function(a,n){a&1&&(S(),w(0),r(1,W,2,1,"ng-container",0)(2,Z,2,1,"span",1),d(3,"span",2),j(4),u()),a&2&&(o(),i("ngIf",!n.iconTemplate&&!n._iconTemplate),o(),i("ngIf",n.iconTemplate||n._iconTemplate),o(2),z(n.value))},dependencies:[A,E,O,q,g],encapsulation:2,changeDetection:0})}return e})(),_e=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=C({type:e});static \u0275inj=h({imports:[ee,g,g]})}return e})();export{ee as a,_e as b};
