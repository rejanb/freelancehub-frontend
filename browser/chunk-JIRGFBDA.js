import{Aa as V,va as H,wa as y,ya as J}from"./chunk-SFRASIIN.js";import{Db as s,Fb as v,Gb as d,Ic as N,Jb as E,Jc as R,Oc as q,Ra as o,Tb as Q,U as b,Ub as B,V as C,Vc as P,Wb as _,_ as M,ab as z,ca as $,da as w,eb as c,gb as p,hb as m,hc as j,jb as F,kb as O,lb as S,oa as T,qb as u,rb as f,sb as k,tb as I,ub as D,vb as g,yb as h}from"./chunk-D3OC6ZHD.js";var G=({dt:e})=>`
.p-timeline {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    direction: ltr;
}

.p-timeline-left .p-timeline-event-opposite {
    text-align: right;
}

.p-timeline-left .p-timeline-event-content {
    text-align: left;
}

.p-timeline-right .p-timeline-event {
    flex-direction: row-reverse;
}

.p-timeline-right .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-right .p-timeline-event-content {
    text-align: right;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
    flex-direction: row-reverse;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    text-align: right;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
    text-align: left;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    text-align: right;
}

.p-timeline-vertical .p-timeline-event-opposite,
.p-timeline-vertical .p-timeline-event-content {
    padding: ${e("timeline.vertical.event.content.padding")};
}

.p-timeline-vertical .p-timeline-event-connector {
    width: ${e("timeline.event.connector.size")};
}

.p-timeline-event {
    display: flex;
    position: relative;
    min-height: ${e("timeline.event.min.height")};
}

.p-timeline-event:last-child {
    min-height: 0;
}

.p-timeline-event-opposite {
    flex: 1;
}

.p-timeline-event-content {
    flex: 1;
}

.p-timeline-event-separator {
    flex: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.p-timeline-event-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    align-self: baseline;
    border-width: ${e("timeline.event.marker.border.width")};
    border-style: solid;
    border-color: ${e("timeline.event.marker.border.color")};
    border-radius: ${e("timeline.event.marker.border.radius")};
    width: ${e("timeline.event.marker.size")};
    height: ${e("timeline.event.marker.size")};
    background: ${e("timeline.event.marker.background")};
}

.p-timeline-event-marker::before {
    content: " ";
    border-radius: ${e("timeline.event.marker.content.border.radius")};
    width: ${e("timeline.event.marker.content.size")};
    height:${e("timeline.event.marker.content.size")};
    background: ${e("timeline.event.marker.content.background")};
}

.p-timeline-event-marker::after {
    content: " ";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: ${e("timeline.event.marker.border.radius")};
    box-shadow: ${e("timeline.event.marker.content.inset.shadow")};
}

.p-timeline-event-connector {
    flex-grow: 1;
    background: ${e("timeline.event.connector.color")};
}

.p-timeline-horizontal {
    flex-direction: row;
}

.p-timeline-horizontal .p-timeline-event {
    flex-direction: column;
    flex: 1;
}

.p-timeline-horizontal .p-timeline-event:last-child {
    flex: 0;
}

.p-timeline-horizontal .p-timeline-event-separator {
    flex-direction: row;
}

.p-timeline-horizontal .p-timeline-event-connector {
    width: 100%;
    height: ${e("timeline.event.connector.size")};
}

.p-timeline-horizontal .p-timeline-event-opposite,
.p-timeline-horizontal .p-timeline-event-content {
    padding: ${e("timeline.horizontal.event.content.padding")};
}

.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) {
    flex-direction: column-reverse;
}

.p-timeline-bottom .p-timeline-event {
    flex-direction: column-reverse;
}
`,K={root:({props:e})=>["p-timeline p-component","p-timeline-"+e.align,"p-timeline-"+e.layout],event:"p-timeline-event",eventOpposite:"p-timeline-event-opposite",eventSeparator:"p-timeline-event-separator",eventMarker:"p-timeline-event-marker",eventConnector:"p-timeline-event-connector",eventContent:"p-timeline-event-content"},A=(()=>{class e extends J{name="timeline";theme=G;classes=K;static \u0275fac=(()=>{let n;return function(t){return(n||(n=T(e)))(t||e)}})();static \u0275prov=b({token:e,factory:e.\u0275fac})}return e})();var L=["content"],U=["opposite"],W=["marker"],x=e=>({$implicit:e});function X(e,r){e&1&&g(0)}function Y(e,r){e&1&&g(0)}function Z(e,r){if(e&1&&(I(0),c(1,Y,1,0,"ng-container",4),D()),e&2){let n=h().$implicit,i=h();o(),m("ngTemplateOutlet",i.markerTemplate||i._markerTemplate)("ngTemplateOutletContext",_(2,x,n))}}function ee(e,r){e&1&&k(0,"div",9),e&2&&p("data-pc-section","marker")}function te(e,r){e&1&&k(0,"div",10)}function ne(e,r){e&1&&g(0)}function ie(e,r){if(e&1&&(u(0,"div",2)(1,"div",3),c(2,X,1,0,"ng-container",4),f(),u(3,"div",5),c(4,Z,2,4,"ng-container",6)(5,ee,1,1,"ng-template",null,0,j)(7,te,1,0,"div",7),f(),u(8,"div",8),c(9,ne,1,0,"ng-container",4),f()()),e&2){let n=r.$implicit,i=r.last,t=E(6),l=h();p("data-pc-section","event"),o(),p("data-pc-section","opposite"),o(),m("ngTemplateOutlet",l.oppositeTemplate||l._oppositeTemplate)("ngTemplateOutletContext",_(11,x,n)),o(),p("data-pc-section","separator"),o(),m("ngIf",l.markerTemplate||l._markerTemplate)("ngIfElse",t),o(3),m("ngIf",!i),o(),p("data-pc-section","content"),o(),m("ngTemplateOutlet",l.contentTemplate||l._contentTemplate)("ngTemplateOutletContext",_(13,x,n))}}var le=(()=>{class e extends V{value;style;styleClass;align="left";layout="vertical";contentTemplate;oppositeTemplate;markerTemplate;templates;_contentTemplate;_oppositeTemplate;_markerTemplate;_componentStyle=M(A);get hostClass(){return this.styleClass}getBlockableElement(){return this.el.nativeElement.children[0]}ngAfterContentInit(){this.templates.forEach(n=>{switch(n.getType()){case"content":this._contentTemplate=n.template;break;case"opposite":this._oppositeTemplate=n.template;break;case"marker":this._markerTemplate=n.template;break}})}static \u0275fac=(()=>{let n;return function(t){return(n||(n=T(e)))(t||e)}})();static \u0275cmp=$({type:e,selectors:[["p-timeline"]],contentQueries:function(i,t,l){if(i&1&&(s(l,L,4),s(l,U,4),s(l,W,4),s(l,H,4)),i&2){let a;v(a=d())&&(t.contentTemplate=a.first),v(a=d())&&(t.oppositeTemplate=a.first),v(a=d())&&(t.markerTemplate=a.first),v(a=d())&&(t.templates=a)}},hostVars:24,hostBindings:function(i,t){i&2&&(p("data-pc-section","root")("data-pc-name","timeline"),O(t.style),S(t.hostClass),F("p-timeline",!0)("p-component",!0)("p-timeline-left",t.align==="left")("p-timeline-right",t.align==="right")("p-timeline-top",t.align==="top")("p-timeline-bottom",t.align==="bottom")("p-timeline-alternate",t.align==="alternate")("p-timeline-vertical",t.layout==="vertical")("p-timeline-horizontal",t.layout==="horizontal"))},inputs:{value:"value",style:"style",styleClass:"styleClass",align:"align",layout:"layout"},standalone:!0,features:[Q([A]),z,B],decls:1,vars:1,consts:[["marker",""],["class","p-timeline-event",4,"ngFor","ngForOf"],[1,"p-timeline-event"],[1,"p-timeline-event-opposite"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"p-timeline-event-separator"],[4,"ngIf","ngIfElse"],["class","p-timeline-event-connector",4,"ngIf"],[1,"p-timeline-event-content"],[1,"p-timeline-event-marker"],[1,"p-timeline-event-connector"]],template:function(i,t){i&1&&c(0,ie,10,15,"div",1),i&2&&m("ngForOf",t.value)},dependencies:[P,N,R,q,y],encapsulation:2,changeDetection:0})}return e})(),xe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=w({type:e});static \u0275inj=C({imports:[le,y,y]})}return e})();export{le as a,xe as b};
