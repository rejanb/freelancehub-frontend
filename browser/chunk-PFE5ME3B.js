import{a as ee}from"./chunk-HKVI4RXP.js";import{Aa as Z,a as p,c as Q,p as S,wa as u,ya as X}from"./chunk-SFRASIIN.js";import{Ab as V,Hc as Y,Jb as y,Jc as G,Kb as H,Lb as P,Oa as E,Ra as h,Tb as J,U as c,Ub as q,V as k,Vc as K,Z as j,_ as I,a as $,ab as D,b as C,ca as U,da as w,eb as l,gb as b,h as R,hb as i,hc as x,jb as T,k as M,kb as W,la as A,lb as v,m as o,ma as z,oa as d,qb as f,rb as _,sa as O,sb as F,u as g,wb as B,xb as L,yb as s,zb as N}from"./chunk-D3OC6ZHD.js";var ne=({dt:t})=>`
.p-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${t("avatar.width")};
    height: ${t("avatar.height")};
    font-size: ${t("avatar.font.size")};
    color: ${t("avatar.color")};
    background: ${t("avatar.background")};
    border-radius: ${t("avatar.border.radius")};
}

.p-avatar-image {
    background: transparent;
}

.p-avatar-circle {
    border-radius: 50%;
}

.p-avatar-circle img {
    border-radius: 50%;
}

.p-avatar-icon {
    font-size: ${t("avatar.icon.size")};
    width: ${t("avatar.icon.size")};
    height: ${t("avatar.icon.size")};
}

.p-avatar img {
    width: 100%;
    height: 100%;
}

.p-avatar-lg {
    width: ${t("avatar.lg.width")};
    height: ${t("avatar.lg.width")};
    font-size: ${t("avatar.lg.font.size")};
}

.p-avatar-lg .p-avatar-icon {
    font-size: ${t("avatar.lg.icon.size")};
    width: ${t("avatar.lg.icon.size")};
    height: ${t("avatar.lg.icon.size")};
}

.p-avatar-xl {
    width: ${t("avatar.xl.width")};
    height: ${t("avatar.xl.width")};
    font-size: ${t("avatar.xl.font.size")};
}

.p-avatar-xl .p-avatar-icon {
    font-size: ${t("avatar.xl.font.size")};
}

.p-avatar-group {
    display: flex;
    align-items: center;
}

.p-avatar-group .p-avatar + .p-avatar {
    margin-inline-start: ${t("avatar.group.offset")};
}

.p-avatar-group .p-avatar {
    border: 2px solid ${t("avatar.group.border.color")};
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
    margin-inline-start: ${t("avatar.lg.group.offset")};
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
    margin-inline-start: ${t("avatar.xl.group.offset")};
}
`,se={root:({props:t})=>["p-avatar p-component",{"p-avatar-image":t.image!=null,"p-avatar-circle":t.shape==="circle","p-avatar-lg":t.size==="large","p-avatar-xl":t.size==="xlarge"}],label:"p-avatar-label",icon:"p-avatar-icon"},te=(()=>{class t extends X{name="avatar";theme=ne;classes=se;static \u0275fac=(()=>{let a;return function(n){return(a||(a=d(t)))(n||t)}})();static \u0275prov=c({token:t,factory:t.\u0275fac})}return t})();var ie=["*"];function oe(t,e){if(t&1&&(f(0,"span",3),H(1),_()),t&2){let a=s();h(),P(a.label)}}function ce(t,e){if(t&1&&F(0,"span",5),t&2){let a=s(2);v(a.icon),i("ngClass","p-avatar-icon")}}function le(t,e){if(t&1&&l(0,ce,1,3,"span",4),t&2){let a=s(),r=y(5);i("ngIf",a.icon)("ngIfElse",r)}}function pe(t,e){if(t&1){let a=B();f(0,"img",7),L("error",function(n){A(a);let m=s(2);return z(m.imageError(n))}),_()}if(t&2){let a=s(2);i("src",a.image,E),b("aria-label",a.ariaLabel)}}function ue(t,e){if(t&1&&l(0,pe,1,2,"img",6),t&2){let a=s();i("ngIf",a.image)}}var me=(()=>{class t extends Z{label;icon;image;size="normal";shape="square";style;styleClass;ariaLabel;ariaLabelledBy;onImageError=new O;_componentStyle=I(te);imageError(a){this.onImageError.emit(a)}get hostClass(){return this.styleClass}static \u0275fac=(()=>{let a;return function(n){return(a||(a=d(t)))(n||t)}})();static \u0275cmp=U({type:t,selectors:[["p-avatar"]],hostVars:19,hostBindings:function(r,n){r&2&&(b("data-pc-name","avatar")("aria-label",n.ariaLabel)("aria-labelledby",n.ariaLabelledBy),W(n.style),v(n.hostClass),T("p-avatar",!0)("p-component",!0)("p-avatar-circle",n.shape==="circle")("p-avatar-lg",n.size==="large")("p-avatar-xl",n.size==="xlarge")("p-avatar-image",n.image!=null))},inputs:{label:"label",icon:"icon",image:"image",size:"size",shape:"shape",style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy"},outputs:{onImageError:"onImageError"},standalone:!0,features:[J([te]),D,q],ngContentSelectors:ie,decls:6,vars:2,consts:[["iconTemplate",""],["imageTemplate",""],["class","p-avatar-text",4,"ngIf","ngIfElse"],[1,"p-avatar-text"],[3,"class","ngClass",4,"ngIf","ngIfElse"],[3,"ngClass"],[3,"src","error",4,"ngIf"],[3,"error","src"]],template:function(r,n){if(r&1&&(N(),V(0),l(1,oe,2,1,"span",2)(2,le,1,2,"ng-template",null,0,x)(4,ue,1,1,"ng-template",null,1,x)),r&2){let m=y(3);h(),i("ngIf",n.label)("ngIfElse",m)}},dependencies:[K,Y,G,u],encapsulation:2,changeDetection:0})}return t})(),je=(()=>{class t{static \u0275fac=function(r){return new(r||t)};static \u0275mod=w({type:t});static \u0275inj=k({imports:[me,u,u]})}return t})();var ae=class t{constructor(e){this.http=e;this.loadUnreadCount()}chatRoomsUrl=`${S.API_URL}chats/chatrooms/`;messagesUrl=`${S.API_URL}chats/messages/`;wsUrl="ws://localhost:8000/ws/chat/";socket$;messagesSubject=new o([]);chatRoomsSubject=new o([]);unreadCountSubject=new o(0);typingSubject=new M;onlineUsersSubject=new o([]);messages$=this.messagesSubject.asObservable();chatRooms$=this.chatRoomsSubject.asObservable();unreadCount$=this.unreadCountSubject.asObservable();typing$=this.typingSubject.asObservable();onlineUsers$=this.onlineUsersSubject.asObservable();currentChatRoomId;reconnectAttempts=0;maxReconnectAttempts=5;connectToRoom(e,a){if(this.currentChatRoomId=e,this.disconnectWebSocket(),a||(a=localStorage.getItem("access")||void 0),!a){console.error("No JWT token available for WebSocket connection");return}let r=`${this.wsUrl}${e}/?token=${a}`;console.log("Connecting to chat WebSocket:",r),this.socket$=ee({url:r,openObserver:{next:()=>{console.log("Connected to chat room",e),this.reconnectAttempts=0}},closeObserver:{next:()=>{console.log("Disconnected from chat room",e),this.handleReconnection()}}}),this.socket$.subscribe({next:n=>{this.handleWebSocketMessage(n)},error:n=>{console.error("WebSocket error:",n),this.handleReconnection()}})}handleWebSocketMessage(e){switch(e.type){case"chat_message":e.message&&this.addNewMessage(e.message);break;case"typing_indicator":e.user_id&&e.username!==void 0&&e.is_typing!==void 0&&this.typingSubject.next({user_id:e.user_id,username:e.username,is_typing:e.is_typing});break;case"user_joined":if(e.user_id){let a=this.onlineUsersSubject.value;a.includes(e.user_id)||this.onlineUsersSubject.next([...a,e.user_id])}break;case"user_left":if(e.user_id){let a=this.onlineUsersSubject.value;this.onlineUsersSubject.next(a.filter(r=>r!==e.user_id))}break}}handleReconnection(){if(this.reconnectAttempts<this.maxReconnectAttempts&&this.currentChatRoomId){this.reconnectAttempts++;let e=Math.min(1e3*Math.pow(2,this.reconnectAttempts),3e4);setTimeout(()=>{console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`),this.connectToRoom(this.currentChatRoomId)},e)}}addNewMessage(e){let a=this.messagesSubject.value;a.find(r=>r.id===e.id)||(this.messagesSubject.next([...a,e]),e.read_by.includes(this.getCurrentUserId())||this.unreadCountSubject.next(this.unreadCountSubject.value+1),this.updateChatRoomLastMessage(e))}updateChatRoomLastMessage(e){let r=this.chatRoomsSubject.value.map(n=>n.id===e.chat_room?C($({},n),{last_message:e,updated_at:e.created_at}):n);this.chatRoomsSubject.next(r)}disconnectWebSocket(){this.socket$&&!this.socket$.closed&&this.socket$.complete()}sendMessage(e,a,r){if(r){let n=new FormData;return n.append("chat_room_id",e.toString()),n.append("content",a),n.append("attachment",r),this.http.post(`${this.messagesUrl}send/`,n)}else return this.sendMessageViaWebSocket(a)}sendMessageViaWebSocket(e){return new R(a=>{if(this.socket$&&!this.socket$.closed){this.socket$.next({type:"chat_message",message:e});let r={id:Date.now(),content:e,sender:{id:this.getCurrentUserId(),username:"You",email:""},message_type:"text",attachment:void 0,is_read:!1,read_by:[],chat_room:this.currentChatRoomId||0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};a.next(r),a.complete()}else a.error(new Error("WebSocket not connected"))})}getCurrentUserId(){let e=localStorage.getItem("access");if(e)try{return JSON.parse(atob(e.split(".")[1])).user_id}catch(a){console.error("Error parsing token:",a)}return 0}sendTypingIndicator(e){this.socket$&&!this.socket$.closed&&this.socket$.next({type:"typing",is_typing:e})}getChatRooms(){let e=new p().set("all","true");return this.http.get(this.chatRoomsUrl,{params:e}).pipe(g(a=>a.results?a:{results:a,count:a.length}))}getOrCreateChatRoomWithUser(e){return this.http.post(`${this.chatRoomsUrl}get_or_create_with_user/`,{user_id:e})}getRoomMessages(e){let a=new p().set("all","true");return this.http.get(`${this.chatRoomsUrl}${e}/messages/`,{params:a}).pipe(g(r=>r.results?r.results:{results:r,count:r.length}))}markRoomAsRead(e){return this.http.post(`${this.chatRoomsUrl}${e}/mark_as_read/`,{})}markMessageAsRead(e){return this.http.post(`${this.messagesUrl}${e}/mark_read/`,{})}deleteMessage(e){return this.http.delete(`${this.messagesUrl}${e}/`)}getUnreadCount(){return this.http.get(`${this.messagesUrl}unread_count/`)}loadUnreadCount(){this.getUnreadCount().subscribe({next:e=>{this.unreadCountSubject.next(e.count)},error:e=>{console.error("Error loading unread count:",e)}})}downloadAttachment(e){return this.http.get(`${this.messagesUrl}${e}/download/`,{responseType:"blob"})}searchMessages(e){let a=new p().set("q",e);return this.http.get(`${this.messagesUrl}search/`,{params:a})}setMessages(e){this.messagesSubject.next(e)}setChatRooms(e){this.chatRoomsSubject.next(e)}ngOnDestroy(){this.disconnectWebSocket()}static \u0275fac=function(a){return new(a||t)(j(Q))};static \u0275prov=c({token:t,factory:t.\u0275fac,providedIn:"root"})};export{me as a,je as b,ae as c};
