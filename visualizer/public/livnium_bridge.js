(function dartProgram(){function copyProperties(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
b[r]=a[r]}}function mixinPropertiesHard(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
if(!b.hasOwnProperty(r)){b[r]=a[r]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var t=function(){}
t.prototype={p:{}}
var s=new t()
if(!(Object.getPrototypeOf(s)&&Object.getPrototypeOf(s).p===t.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var r=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(r))return true}}catch(q){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var t=Object.create(b.prototype)
copyProperties(a.prototype,t)
a.prototype=t}}function inheritMany(a,b){for(var t=0;t<b.length;t++){inherit(b[t],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t){var s=d()
if(a[b]!==t){A.fQ(b)}a[b]=s}var r=a[b]
a[c]=function(){return r}
return r}}function makeConstList(a){a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var t=0;t<a.length;++t){convertToFastObject(a[t])}}var y=0
function instanceTearOffGetter(a,b){var t=null
return a?function(c){if(t===null)t=A.cA(b)
return new t(c,this)}:function(){if(t===null)t=A.cA(b)
return new t(this,null)}}function staticTearOffGetter(a){var t=null
return function(){if(t===null)t=A.cA(a).prototype
return t}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var t=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var s=staticTearOffGetter(t)
a[b]=s}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var t=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var s=instanceTearOffGetter(c,t)
a[b]=s}function setOrUpdateInterceptorsByTag(a){var t=v.interceptorsByTag
if(!t){v.interceptorsByTag=a
return}copyProperties(a,t)}function setOrUpdateLeafTags(a){var t=v.leafTags
if(!t){v.leafTags=a
return}copyProperties(a,t)}function updateTypes(a){var t=v.types
var s=t.length
t.push.apply(t,a)
return s}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var t=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},s=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:t(0,0,null,["$0"],0),_instance_1u:t(0,1,null,["$1"],0),_instance_2u:t(0,2,null,["$2"],0),_instance_0i:t(1,0,null,["$0"],0),_instance_1i:t(1,1,null,["$1"],0),_instance_2i:t(1,2,null,["$2"],0),_static_0:s(0,null,["$0"],0),_static_1:s(1,null,["$1"],0),_static_2:s(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
cF(a,b,c,d){return{i:a,p:b,e:c,x:d}},
c0(a){var t,s,r,q,p,o=a[v.dispatchPropertyName]
if(o==null)if($.cD==null){A.fC()
o=a[v.dispatchPropertyName]}if(o!=null){t=o.p
if(!1===t)return o.i
if(!0===t)return a
s=Object.getPrototypeOf(a)
if(t===s)return o.i
if(o.e===s)throw A.b(A.cY("Return interceptor for "+A.l(t(a,o))))}r=a.constructor
if(r==null)q=null
else{p=$.bR
if(p==null)p=$.bR=v.getIsolateTag("_$dart_js")
q=r[p]}if(q!=null)return q
q=A.fH(a)
if(q!=null)return q
if(typeof a=="function")return B.A
t=Object.getPrototypeOf(a)
if(t==null)return B.r
if(t===Object.prototype)return B.r
if(typeof r=="function"){p=$.bR
if(p==null)p=$.bR=v.getIsolateTag("_$dart_js")
Object.defineProperty(r,p,{value:B.d,enumerable:false,writable:true,configurable:true})
return B.d}return B.d},
cT(a,b){if(a<0||a>4294967295)throw A.b(A.b5(a,0,4294967295,"length",null))
return J.e2(new Array(a),b)},
cS(a,b){if(a<0)throw A.b(A.F("Length must be a non-negative integer: "+a))
return A.p(new Array(a),b.m("c<0>"))},
e2(a,b){var t=A.p(a,b.m("c<0>"))
t.$flags=1
return t},
W(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.ae.prototype
return J.aR.prototype}if(typeof a=="string")return J.a0.prototype
if(a==null)return J.af.prototype
if(typeof a=="boolean")return J.aQ.prototype
if(Array.isArray(a))return J.c.prototype
if(typeof a!="object"){if(typeof a=="function")return J.K.prototype
if(typeof a=="symbol")return J.a2.prototype
if(typeof a=="bigint")return J.a1.prototype
return a}if(a instanceof A.f)return a
return J.c0(a)},
c_(a){if(typeof a=="string")return J.a0.prototype
if(a==null)return a
if(Array.isArray(a))return J.c.prototype
if(typeof a!="object"){if(typeof a=="function")return J.K.prototype
if(typeof a=="symbol")return J.a2.prototype
if(typeof a=="bigint")return J.a1.prototype
return a}if(a instanceof A.f)return a
return J.c0(a)},
dy(a){if(a==null)return a
if(Array.isArray(a))return J.c.prototype
if(typeof a!="object"){if(typeof a=="function")return J.K.prototype
if(typeof a=="symbol")return J.a2.prototype
if(typeof a=="bigint")return J.a1.prototype
return a}if(a instanceof A.f)return a
return J.c0(a)},
fx(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.K.prototype
if(typeof a=="symbol")return J.a2.prototype
if(typeof a=="bigint")return J.a1.prototype
return a}if(a instanceof A.f)return a
return J.c0(a)},
bk(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.W(a).A(a,b)},
dN(a){return J.fx(a).a3(a)},
cI(a,b){return J.dy(a).u(a,b)},
I(a){return J.W(a).gj(a)},
cJ(a){return J.dy(a).gC(a)},
aa(a){return J.c_(a).gi(a)},
dO(a){return J.W(a).gk(a)},
aJ(a){return J.W(a).h(a)},
aP:function aP(){},
aQ:function aQ(){},
af:function af(){},
ah:function ah(){},
P:function P(){},
b2:function b2(){},
ar:function ar(){},
K:function K(){},
a1:function a1(){},
a2:function a2(){},
c:function c(a){this.$ti=a},
bw:function bw(a){this.$ti=a},
aK:function aK(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
ag:function ag(){},
ae:function ae(){},
aR:function aR(){},
a0:function a0(){}},A={ch:function ch(){},
L(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
bD(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
fm(a,b,c){return a},
cE(a){var t,s
for(t=$.Y.length,s=0;s<t;++s)if(a===$.Y[s])return!0
return!1},
ee(a,b,c,d){A.cl(b,"start")
A.cl(c,"end")
if(b>c)A.O(A.b5(b,0,c,"start",null))
return new A.aq(a,b,c,d.m("aq<0>"))},
e0(){return new A.b6("No element")},
aS:function aS(a){this.a=a},
bB:function bB(){},
ac:function ac(){},
A:function A(){},
aq:function aq(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a3:function a3(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
aj:function aj(a,b,c){this.a=a
this.b=b
this.$ti=c},
ad:function ad(){},
G:function G(a,b){this.a=a
this.$ti=b},
dI(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
ha(a,b){var t
if(b!=null){t=b.x
if(t!=null)return t}return u.p.b(a)},
l(a){var t
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
t=J.aJ(a)
return t},
b3(a){var t,s=$.cU
if(s==null)s=$.cU=Symbol("identityHashCode")
t=a[s]
if(t==null){t=Math.random()*0x3fffffff|0
a[s]=t}return t},
bz(a){var t,s,r,q
if(a instanceof A.f)return A.z(A.aG(a),null)
t=J.W(a)
if(t===B.z||t===B.B||u.o.b(a)){s=B.h(a)
if(s!=="Object"&&s!=="")return s
r=a.constructor
if(typeof r=="function"){q=r.name
if(typeof q=="string"&&q!=="Object"&&q!=="")return q}}return A.z(A.aG(a),null)},
cV(a){if(a==null||typeof a=="number"||A.cy(a))return J.aJ(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.R)return a.h(0)
if(a instanceof A.ay)return a.a2(!0)
return"Instance of '"+A.bz(a)+"'"},
ft(a,b){var t,s="index"
if(!A.dp(b))return new A.Z(!0,b,s,null)
t=J.aa(a)
if(b<0||b>=t)return A.cg(b,t,a,s)
return new A.b4(null,null,!0,b,s,"Value not in range")},
du(a){return new A.Z(!0,a,null,null)},
b(a){return A.u(a,new Error())},
u(a,b){var t
if(a==null)a=new A.bF()
b.dartException=a
t=A.fS
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:t})
b.name=""}else b.toString=t
return b},
fS(){return J.aJ(this.dartException)},
O(a,b){throw A.u(a,b==null?new Error():b)},
q(a,b,c){var t
if(b==null)b=0
if(c==null)c=0
t=Error()
A.O(A.eX(a,b,c),t)},
eX(a,b,c){var t,s,r,q,p,o,n,m,l
if(typeof b=="string")t=b
else{s="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
r=s.length
q=b
if(q>r){c=q/r|0
q%=r}t=s[q]}p=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
o=u.j.b(a)?"list":"ByteData"
n=a.$flags|0
m="a "
if((n&4)!==0)l="constant "
else if((n&2)!==0){l="unmodifiable "
m="an "}else l=(n&1)!==0?"fixed-length ":""
return new A.b8("'"+t+"': Cannot "+p+" "+m+l+o)},
ce(a){throw A.b(A.a_(a))},
dA(a){if(a==null)return J.I(a)
if(typeof a=="object")return A.b3(a)
return J.I(a)},
f4(a,b,c,d,e,f){switch(b){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.b(new A.bQ("Unsupported number of arguments for wrapped closure"))},
fo(a,b){var t=a.$identity
if(!!t)return t
t=A.fp(a,b)
a.$identity=t
return t},
fp(a,b){var t
switch(b){case 0:t=a.$0
break
case 1:t=a.$1
break
case 2:t=a.$2
break
case 3:t=a.$3
break
case 4:t=a.$4
break
default:t=null}if(t!=null)return t.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.f4)},
dV(a1){var t,s,r,q,p,o,n,m,l,k,j=a1.co,i=a1.iS,h=a1.iI,g=a1.nDA,f=a1.aI,e=a1.fs,d=a1.cs,c=e[0],b=d[0],a=j[c],a0=a1.fT
a0.toString
t=i?Object.create(new A.bC().constructor.prototype):Object.create(new A.ab(null,null).constructor.prototype)
t.$initialize=t.constructor
s=i?function static_tear_off(){this.$initialize()}:function tear_off(a2,a3){this.$initialize(a2,a3)}
t.constructor=s
s.prototype=t
t.$_name=c
t.$_target=a
r=!i
if(r)q=A.cO(c,a,h,g)
else{t.$static_name=c
q=a}t.$S=A.dR(a0,i,h)
t[b]=q
for(p=q,o=1;o<e.length;++o){n=e[o]
if(typeof n=="string"){m=j[n]
l=n
n=m}else l=""
k=d[o]
if(k!=null){if(r)n=A.cO(l,n,h,g)
t[k]=n}if(o===f)p=n}t.$C=p
t.$R=a1.rC
t.$D=a1.dV
return s},
dR(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.b("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.dP)}throw A.b("Error in functionType of tearoff")},
dS(a,b,c,d){var t=A.cN
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,t)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,t)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,t)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,t)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,t)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,t)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,t)}},
cO(a,b,c,d){if(c)return A.dU(a,b,d)
return A.dS(b.length,d,a,b)},
dT(a,b,c,d){var t=A.cN,s=A.dQ
switch(b?-1:a){case 0:throw A.b(new A.bA("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,s,t)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,s,t)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,s,t)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,s,t)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,s,t)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,s,t)
default:return function(e,f,g){return function(){var r=[g(this)]
Array.prototype.push.apply(r,arguments)
return e.apply(f(this),r)}}(d,s,t)}},
dU(a,b,c){var t,s
if($.cL==null)$.cL=A.cK("interceptor")
if($.cM==null)$.cM=A.cK("receiver")
t=b.length
s=A.dT(t,c,a,b)
return s},
cA(a){return A.dV(a)},
dP(a,b){return A.aE(v.typeUniverse,A.aG(a.a),b)},
cN(a){return a.a},
dQ(a){return a.b},
cK(a){var t,s,r,q=new A.ab("receiver","interceptor"),p=Object.getOwnPropertyNames(q)
p.$flags=1
t=p
for(p=t.length,s=0;s<p;++s){r=t[s]
if(q[r]===a)return r}throw A.b(A.F("Field name "+a+" not found."))},
fy(a){return v.getIsolateTag(a)},
fH(a){var t,s,r,q,p,o=$.dz.$1(a),n=$.bZ[o]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.c4[o]
if(t!=null)return t
s=v.interceptorsByTag[o]
if(s==null){r=$.dt.$2(a,o)
if(r!=null){n=$.bZ[r]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.c4[r]
if(t!=null)return t
s=v.interceptorsByTag[r]
o=r}}if(s==null)return null
t=s.prototype
q=o[0]
if(q==="!"){n=A.c6(t)
$.bZ[o]=n
Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}if(q==="~"){$.c4[o]=t
return t}if(q==="-"){p=A.c6(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}if(q==="+")return A.dB(a,t)
if(q==="*")throw A.b(A.cY(o))
if(v.leafTags[o]===true){p=A.c6(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}else return A.dB(a,t)},
dB(a,b){var t=Object.getPrototypeOf(a)
Object.defineProperty(t,v.dispatchPropertyName,{value:J.cF(b,t,null,null),enumerable:false,writable:true,configurable:true})
return b},
c6(a){return J.cF(a,!1,null,!!a.$iy)},
fJ(a,b,c){var t=b.prototype
if(v.leafTags[a]===true)return A.c6(t)
else return J.cF(t,c,null,null)},
fC(){if(!0===$.cD)return
$.cD=!0
A.fD()},
fD(){var t,s,r,q,p,o,n,m
$.bZ=Object.create(null)
$.c4=Object.create(null)
A.fB()
t=v.interceptorsByTag
s=Object.getOwnPropertyNames(t)
if(typeof window!="undefined"){window
r=function(){}
for(q=0;q<s.length;++q){p=s[q]
o=$.dC.$1(p)
if(o!=null){n=A.fJ(p,t[p],o)
if(n!=null){Object.defineProperty(o,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
r.prototype=o}}}}for(q=0;q<s.length;++q){p=s[q]
if(/^[A-Za-z_]/.test(p)){m=t[p]
t["!"+p]=m
t["~"+p]=m
t["-"+p]=m
t["+"+p]=m
t["*"+p]=m}}},
fB(){var t,s,r,q,p,o,n=B.t()
n=A.a8(B.u,A.a8(B.v,A.a8(B.i,A.a8(B.i,A.a8(B.w,A.a8(B.x,A.a8(B.y(B.h),n)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){t=dartNativeDispatchHooksTransformer
if(typeof t=="function")t=[t]
if(Array.isArray(t))for(s=0;s<t.length;++s){r=t[s]
if(typeof r=="function")n=r(n)||n}}q=n.getTag
p=n.getUnknownTag
o=n.prototypeForTag
$.dz=new A.c1(q)
$.dt=new A.c2(p)
$.dC=new A.c3(o)},
a8(a,b){return a(b)||b},
ew(a,b){var t
for(t=0;t<a.length;++t)if(!J.bk(a[t],b[t]))return!1
return!0},
fq(a,b){var t=b.length,s=v.rttc[""+t+";"+a]
if(s==null)return null
if(t===0)return s
if(t===s.length)return s.apply(null,b)
return s(b)},
e3(a,b,c,d,e,f){var t=b?"m":"",s=c?"":"i",r=d?"u":"",q=e?"s":"",p=function(g,h){try{return new RegExp(g,h)}catch(o){return o}}(a,t+s+r+q+f)
if(p instanceof RegExp)return p
throw A.b(A.cP("Illegal RegExp pattern ("+String(p)+")",a))},
be:function be(a,b){this.a=a
this.b=b},
az:function az(a,b){this.a=a
this.b=b},
bf:function bf(a){this.a=a},
aM:function aM(){},
aN:function aN(a,b,c){this.a=a
this.b=b
this.$ti=c},
R:function R(){},
bm:function bm(){},
bn:function bn(){},
bE:function bE(){},
bC:function bC(){},
ab:function ab(a,b){this.a=a
this.b=b},
bA:function bA(a){this.a=a},
ai:function ai(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bx:function bx(a,b){this.a=a
this.b=b
this.c=null},
c1:function c1(a){this.a=a},
c2:function c2(a){this.a=a},
c3:function c3(a){this.a=a},
ay:function ay(){},
bc:function bc(){},
bd:function bd(){},
bv:function bv(a,b){var _=this
_.a=a
_.b=b
_.e=_.c=null},
bS:function bS(a){this.b=a},
fQ(a){throw A.u(new A.aS("Field '"+a+"' has been assigned during initialization."),new Error())},
bN(a){var t=new A.bM(a)
return t.b=t},
bM:function bM(a){this.a=a
this.b=null},
eW(a){return a},
e8(a,b,c){var t=new DataView(a,b)
return t},
T(a,b,c){if(a>>>0!==a||a>=c)throw A.b(A.ft(b,a))},
aU:function aU(){},
am:function am(){},
bW:function bW(a){this.a=a},
aV:function aV(){},
a4:function a4(){},
ak:function ak(){},
al:function al(){},
aW:function aW(){},
aX:function aX(){},
aY:function aY(){},
aZ:function aZ(){},
b_:function b_(){},
b0:function b0(){},
b1:function b1(){},
an:function an(){},
ao:function ao(){},
au:function au(){},
av:function av(){},
aw:function aw(){},
ax:function ax(){},
cm(a,b){var t=b.c
return t==null?b.c=A.aC(a,"cQ",[b.x]):t},
cW(a){var t=a.w
if(t===6||t===7)return A.cW(a.x)
return t===11||t===12},
ec(a){return a.as},
fK(a,b){var t,s=b.length
for(t=0;t<s;++t)if(!a[t].b(b[t]))return!1
return!0},
aF(a){return A.bV(v.typeUniverse,a,!1)},
U(a0,a1,a2,a3){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.w
switch(a){case 5:case 1:case 2:case 3:case 4:return a1
case 6:t=a1.x
s=A.U(a0,t,a2,a3)
if(s===t)return a1
return A.df(a0,s,!0)
case 7:t=a1.x
s=A.U(a0,t,a2,a3)
if(s===t)return a1
return A.de(a0,s,!0)
case 8:r=a1.y
q=A.a7(a0,r,a2,a3)
if(q===r)return a1
return A.aC(a0,a1.x,q)
case 9:p=a1.x
o=A.U(a0,p,a2,a3)
n=a1.y
m=A.a7(a0,n,a2,a3)
if(o===p&&m===n)return a1
return A.cu(a0,o,m)
case 10:l=a1.x
k=a1.y
j=A.a7(a0,k,a2,a3)
if(j===k)return a1
return A.dg(a0,l,j)
case 11:i=a1.x
h=A.U(a0,i,a2,a3)
g=a1.y
f=A.fg(a0,g,a2,a3)
if(h===i&&f===g)return a1
return A.dd(a0,h,f)
case 12:e=a1.y
a3+=e.length
d=A.a7(a0,e,a2,a3)
p=a1.x
o=A.U(a0,p,a2,a3)
if(d===e&&o===p)return a1
return A.cv(a0,o,d,!0)
case 13:c=a1.x
if(c<a3)return a1
b=a2[c-a3]
if(b==null)return a1
return b
default:throw A.b(A.aL("Attempted to substitute unexpected RTI kind "+a))}},
a7(a,b,c,d){var t,s,r,q,p=b.length,o=A.bX(p)
for(t=!1,s=0;s<p;++s){r=b[s]
q=A.U(a,r,c,d)
if(q!==r)t=!0
o[s]=q}return t?o:b},
fh(a,b,c,d){var t,s,r,q,p,o,n=b.length,m=A.bX(n)
for(t=!1,s=0;s<n;s+=3){r=b[s]
q=b[s+1]
p=b[s+2]
o=A.U(a,p,c,d)
if(o!==p)t=!0
m.splice(s,3,r,q,o)}return t?m:b},
fg(a,b,c,d){var t,s=b.a,r=A.a7(a,s,c,d),q=b.b,p=A.a7(a,q,c,d),o=b.c,n=A.fh(a,o,c,d)
if(r===s&&p===q&&n===o)return b
t=new A.bb()
t.a=r
t.b=p
t.c=n
return t},
p(a,b){a[v.arrayRti]=b
return a},
dw(a){var t=a.$S
if(t!=null){if(typeof t=="number")return A.fA(t)
return a.$S()}return null},
fE(a,b){var t
if(A.cW(b))if(a instanceof A.R){t=A.dw(a)
if(t!=null)return t}return A.aG(a)},
aG(a){if(a instanceof A.f)return A.cw(a)
if(Array.isArray(a))return A.bh(a)
return A.cx(J.W(a))},
bh(a){var t=a[v.arrayRti],s=u.b
if(t==null)return s
if(t.constructor!==s.constructor)return s
return t},
cw(a){var t=a.$ti
return t!=null?t:A.cx(a)},
cx(a){var t=a.constructor,s=t.$ccache
if(s!=null)return s
return A.f3(a,t)},
f3(a,b){var t=a instanceof A.R?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,s=A.eE(v.typeUniverse,t.name)
b.$ccache=s
return s},
fA(a){var t,s=v.types,r=s[a]
if(typeof r=="string"){t=A.bV(v.typeUniverse,r,!1)
s[a]=t
return t}return r},
fz(a){return A.V(A.cw(a))},
cz(a){var t
if(a instanceof A.ay)return A.fu(a.$r,a.O())
t=a instanceof A.R?A.dw(a):null
if(t!=null)return t
if(u.R.b(a))return J.dO(a).a
if(Array.isArray(a))return A.bh(a)
return A.aG(a)},
V(a){var t=a.r
return t==null?a.r=new A.bU(a):t},
fu(a,b){var t,s,r=b,q=r.length
if(q===0)return u.F
t=A.aE(v.typeUniverse,A.cz(r[0]),"@<0>")
for(s=1;s<q;++s)t=A.dh(v.typeUniverse,t,A.cz(r[s]))
return A.aE(v.typeUniverse,t,a)},
E(a){return A.V(A.bV(v.typeUniverse,a,!1))},
f2(a){var t,s,r,q,p=this
if(p===u.K)return A.M(p,a,A.f9)
if(A.X(p))return A.M(p,a,A.fd)
t=p.w
if(t===6)return A.M(p,a,A.f0)
if(t===1)return A.M(p,a,A.dq)
if(t===7)return A.M(p,a,A.f5)
if(p===u.S)s=A.dp
else if(p===u.i||p===u.n)s=A.f8
else if(p===u.N)s=A.fb
else s=p===u.y?A.cy:null
if(s!=null)return A.M(p,a,s)
if(t===8){r=p.x
if(p.y.every(A.X)){p.f="$i"+r
if(r==="h")return A.M(p,a,A.f7)
return A.M(p,a,A.fc)}}else if(t===10){q=A.fq(p.x,p.y)
return A.M(p,a,q==null?A.dq:q)}return A.M(p,a,A.eZ)},
M(a,b,c){a.b=c
return a.b(b)},
f1(a){var t=this,s=A.eY
if(A.X(t))s=A.eQ
else if(t===u.K)s=A.eN
else if(A.a9(t))s=A.f_
if(t===u.S)s=A.dk
else if(t===u.w)s=A.eK
else if(t===u.N)s=A.eO
else if(t===u.v)s=A.eP
else if(t===u.y)s=A.eG
else if(t===u.u)s=A.eH
else if(t===u.n)s=A.eL
else if(t===u.x)s=A.eM
else if(t===u.i)s=A.eI
else if(t===u.I)s=A.eJ
t.a=s
return t.a(a)},
eZ(a){var t=this
if(a==null)return A.a9(t)
return A.fF(v.typeUniverse,A.fE(a,t),t)},
f0(a){if(a==null)return!0
return this.x.b(a)},
fc(a){var t,s=this
if(a==null)return A.a9(s)
t=s.f
if(a instanceof A.f)return!!a[t]
return!!J.W(a)[t]},
f7(a){var t,s=this
if(a==null)return A.a9(s)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
t=s.f
if(a instanceof A.f)return!!a[t]
return!!J.W(a)[t]},
eY(a){var t=this
if(a==null){if(A.a9(t))return a}else if(t.b(a))return a
throw A.u(A.dl(a,t),new Error())},
f_(a){var t=this
if(a==null||t.b(a))return a
throw A.u(A.dl(a,t),new Error())},
dl(a,b){return new A.bg("TypeError: "+A.d6(a,A.z(b,null)))},
d6(a,b){return A.bq(a)+": type '"+A.z(A.cz(a),null)+"' is not a subtype of type '"+b+"'"},
H(a,b){return new A.bg("TypeError: "+A.d6(a,b))},
f5(a){var t=this
return t.x.b(a)||A.cm(v.typeUniverse,t).b(a)},
f9(a){return a!=null},
eN(a){if(a!=null)return a
throw A.u(A.H(a,"Object"),new Error())},
fd(a){return!0},
eQ(a){return a},
dq(a){return!1},
cy(a){return!0===a||!1===a},
eG(a){if(!0===a)return!0
if(!1===a)return!1
throw A.u(A.H(a,"bool"),new Error())},
eH(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.u(A.H(a,"bool?"),new Error())},
eI(a){if(typeof a=="number")return a
throw A.u(A.H(a,"double"),new Error())},
eJ(a){if(typeof a=="number")return a
if(a==null)return a
throw A.u(A.H(a,"double?"),new Error())},
dp(a){return typeof a=="number"&&Math.floor(a)===a},
dk(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.u(A.H(a,"int"),new Error())},
eK(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.u(A.H(a,"int?"),new Error())},
f8(a){return typeof a=="number"},
eL(a){if(typeof a=="number")return a
throw A.u(A.H(a,"num"),new Error())},
eM(a){if(typeof a=="number")return a
if(a==null)return a
throw A.u(A.H(a,"num?"),new Error())},
fb(a){return typeof a=="string"},
eO(a){if(typeof a=="string")return a
throw A.u(A.H(a,"String"),new Error())},
eP(a){if(typeof a=="string")return a
if(a==null)return a
throw A.u(A.H(a,"String?"),new Error())},
dr(a,b){var t,s,r
for(t="",s="",r=0;r<a.length;++r,s=", ")t+=s+A.z(a[r],b)
return t},
ff(a,b){var t,s,r,q,p,o,n=a.x,m=a.y
if(""===n)return"("+A.dr(m,b)+")"
t=m.length
s=n.split(",")
r=s.length-t
for(q="(",p="",o=0;o<t;++o,p=", "){q+=p
if(r===0)q+="{"
q+=A.z(m[o],b)
if(r>=0)q+=" "+s[r];++r}return q+"})"},
dm(a0,a1,a2){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=", ",a=null
if(a2!=null){t=a2.length
if(a1==null)a1=A.p([],u.s)
else a=a1.length
s=a1.length
for(r=t;r>0;--r)a1.push("T"+(s+r))
for(q=u.X,p="<",o="",r=0;r<t;++r,o=b){p=p+o+a1[a1.length-1-r]
n=a2[r]
m=n.w
if(!(m===2||m===3||m===4||m===5||n===q))p+=" extends "+A.z(n,a1)}p+=">"}else p=""
q=a0.x
l=a0.y
k=l.a
j=k.length
i=l.b
h=i.length
g=l.c
f=g.length
e=A.z(q,a1)
for(d="",c="",r=0;r<j;++r,c=b)d+=c+A.z(k[r],a1)
if(h>0){d+=c+"["
for(c="",r=0;r<h;++r,c=b)d+=c+A.z(i[r],a1)
d+="]"}if(f>0){d+=c+"{"
for(c="",r=0;r<f;r+=3,c=b){d+=c
if(g[r+1])d+="required "
d+=A.z(g[r+2],a1)+" "+g[r]}d+="}"}if(a!=null){a1.toString
a1.length=a}return p+"("+d+") => "+e},
z(a,b){var t,s,r,q,p,o,n=a.w
if(n===5)return"erased"
if(n===2)return"dynamic"
if(n===3)return"void"
if(n===1)return"Never"
if(n===4)return"any"
if(n===6){t=a.x
s=A.z(t,b)
r=t.w
return(r===11||r===12?"("+s+")":s)+"?"}if(n===7)return"FutureOr<"+A.z(a.x,b)+">"
if(n===8){q=A.fi(a.x)
p=a.y
return p.length>0?q+("<"+A.dr(p,b)+">"):q}if(n===10)return A.ff(a,b)
if(n===11)return A.dm(a,b,null)
if(n===12)return A.dm(a.x,b,a.y)
if(n===13){o=a.x
return b[b.length-1-o]}return"?"},
fi(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
eF(a,b){var t=a.tR[b]
for(;typeof t=="string";)t=a.tR[t]
return t},
eE(a,b){var t,s,r,q,p,o=a.eT,n=o[b]
if(n==null)return A.bV(a,b,!1)
else if(typeof n=="number"){t=n
s=A.aD(a,5,"#")
r=A.bX(t)
for(q=0;q<t;++q)r[q]=s
p=A.aC(a,b,r)
o[b]=p
return p}else return n},
eD(a,b){return A.di(a.tR,b)},
eC(a,b){return A.di(a.eT,b)},
bV(a,b,c){var t,s=a.eC,r=s.get(b)
if(r!=null)return r
t=A.da(A.d8(a,null,b,!1))
s.set(b,t)
return t},
aE(a,b,c){var t,s,r=b.z
if(r==null)r=b.z=new Map()
t=r.get(c)
if(t!=null)return t
s=A.da(A.d8(a,b,c,!0))
r.set(c,s)
return s},
dh(a,b,c){var t,s,r,q=b.Q
if(q==null)q=b.Q=new Map()
t=c.as
s=q.get(t)
if(s!=null)return s
r=A.cu(a,b,c.w===9?c.y:[c])
q.set(t,r)
return r},
Q(a,b){b.a=A.f1
b.b=A.f2
return b},
aD(a,b,c){var t,s,r=a.eC.get(c)
if(r!=null)return r
t=new A.B(null,null)
t.w=b
t.as=c
s=A.Q(a,t)
a.eC.set(c,s)
return s},
df(a,b,c){var t,s=b.as+"?",r=a.eC.get(s)
if(r!=null)return r
t=A.eA(a,b,s,c)
a.eC.set(s,t)
return t},
eA(a,b,c,d){var t,s,r
if(d){t=b.w
s=!0
if(!A.X(b))if(!(b===u.P||b===u.T))if(t!==6)s=t===7&&A.a9(b.x)
if(s)return b
else if(t===1)return u.P}r=new A.B(null,null)
r.w=6
r.x=b
r.as=c
return A.Q(a,r)},
de(a,b,c){var t,s=b.as+"/",r=a.eC.get(s)
if(r!=null)return r
t=A.ey(a,b,s,c)
a.eC.set(s,t)
return t},
ey(a,b,c,d){var t,s
if(d){t=b.w
if(A.X(b)||b===u.K)return b
else if(t===1)return A.aC(a,"cQ",[b])
else if(b===u.P||b===u.T)return u.Q}s=new A.B(null,null)
s.w=7
s.x=b
s.as=c
return A.Q(a,s)},
eB(a,b){var t,s,r=""+b+"^",q=a.eC.get(r)
if(q!=null)return q
t=new A.B(null,null)
t.w=13
t.x=b
t.as=r
s=A.Q(a,t)
a.eC.set(r,s)
return s},
aB(a){var t,s,r,q=a.length
for(t="",s="",r=0;r<q;++r,s=",")t+=s+a[r].as
return t},
ex(a){var t,s,r,q,p,o=a.length
for(t="",s="",r=0;r<o;r+=3,s=","){q=a[r]
p=a[r+1]?"!":":"
t+=s+q+p+a[r+2].as}return t},
aC(a,b,c){var t,s,r,q=b
if(c.length>0)q+="<"+A.aB(c)+">"
t=a.eC.get(q)
if(t!=null)return t
s=new A.B(null,null)
s.w=8
s.x=b
s.y=c
if(c.length>0)s.c=c[0]
s.as=q
r=A.Q(a,s)
a.eC.set(q,r)
return r},
cu(a,b,c){var t,s,r,q,p,o
if(b.w===9){t=b.x
s=b.y.concat(c)}else{s=c
t=b}r=t.as+(";<"+A.aB(s)+">")
q=a.eC.get(r)
if(q!=null)return q
p=new A.B(null,null)
p.w=9
p.x=t
p.y=s
p.as=r
o=A.Q(a,p)
a.eC.set(r,o)
return o},
dg(a,b,c){var t,s,r="+"+(b+"("+A.aB(c)+")"),q=a.eC.get(r)
if(q!=null)return q
t=new A.B(null,null)
t.w=10
t.x=b
t.y=c
t.as=r
s=A.Q(a,t)
a.eC.set(r,s)
return s},
dd(a,b,c){var t,s,r,q,p,o=b.as,n=c.a,m=n.length,l=c.b,k=l.length,j=c.c,i=j.length,h="("+A.aB(n)
if(k>0){t=m>0?",":""
h+=t+"["+A.aB(l)+"]"}if(i>0){t=m>0?",":""
h+=t+"{"+A.ex(j)+"}"}s=o+(h+")")
r=a.eC.get(s)
if(r!=null)return r
q=new A.B(null,null)
q.w=11
q.x=b
q.y=c
q.as=s
p=A.Q(a,q)
a.eC.set(s,p)
return p},
cv(a,b,c,d){var t,s=b.as+("<"+A.aB(c)+">"),r=a.eC.get(s)
if(r!=null)return r
t=A.ez(a,b,c,s,d)
a.eC.set(s,t)
return t},
ez(a,b,c,d,e){var t,s,r,q,p,o,n,m
if(e){t=c.length
s=A.bX(t)
for(r=0,q=0;q<t;++q){p=c[q]
if(p.w===1){s[q]=p;++r}}if(r>0){o=A.U(a,b,s,0)
n=A.a7(a,c,s,0)
return A.cv(a,o,n,c!==n)}}m=new A.B(null,null)
m.w=12
m.x=b
m.y=c
m.as=d
return A.Q(a,m)},
d8(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
da(a){var t,s,r,q,p,o,n,m=a.r,l=a.s
for(t=m.length,s=0;s<t;){r=m.charCodeAt(s)
if(r>=48&&r<=57)s=A.er(s+1,r,m,l)
else if((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124)s=A.d9(a,s,m,l,!1)
else if(r===46)s=A.d9(a,s,m,l,!0)
else{++s
switch(r){case 44:break
case 58:l.push(!1)
break
case 33:l.push(!0)
break
case 59:l.push(A.S(a.u,a.e,l.pop()))
break
case 94:l.push(A.eB(a.u,l.pop()))
break
case 35:l.push(A.aD(a.u,5,"#"))
break
case 64:l.push(A.aD(a.u,2,"@"))
break
case 126:l.push(A.aD(a.u,3,"~"))
break
case 60:l.push(a.p)
a.p=l.length
break
case 62:A.et(a,l)
break
case 38:A.es(a,l)
break
case 63:q=a.u
l.push(A.df(q,A.S(q,a.e,l.pop()),a.n))
break
case 47:q=a.u
l.push(A.de(q,A.S(q,a.e,l.pop()),a.n))
break
case 40:l.push(-3)
l.push(a.p)
a.p=l.length
break
case 41:A.eq(a,l)
break
case 91:l.push(a.p)
a.p=l.length
break
case 93:p=l.splice(a.p)
A.db(a.u,a.e,p)
a.p=l.pop()
l.push(p)
l.push(-1)
break
case 123:l.push(a.p)
a.p=l.length
break
case 125:p=l.splice(a.p)
A.ev(a.u,a.e,p)
a.p=l.pop()
l.push(p)
l.push(-2)
break
case 43:o=m.indexOf("(",s)
l.push(m.substring(s,o))
l.push(-4)
l.push(a.p)
a.p=l.length
s=o+1
break
default:throw"Bad character "+r}}}n=l.pop()
return A.S(a.u,a.e,n)},
er(a,b,c,d){var t,s,r=b-48
for(t=c.length;a<t;++a){s=c.charCodeAt(a)
if(!(s>=48&&s<=57))break
r=r*10+(s-48)}d.push(r)
return a},
d9(a,b,c,d,e){var t,s,r,q,p,o,n=b+1
for(t=c.length;n<t;++n){s=c.charCodeAt(n)
if(s===46){if(e)break
e=!0}else{if(!((((s|32)>>>0)-97&65535)<26||s===95||s===36||s===124))r=s>=48&&s<=57
else r=!0
if(!r)break}}q=c.substring(b,n)
if(e){t=a.u
p=a.e
if(p.w===9)p=p.x
o=A.eF(t,p.x)[q]
if(o==null)A.O('No "'+q+'" in "'+A.ec(p)+'"')
d.push(A.aE(t,p,o))}else d.push(q)
return n},
et(a,b){var t,s=a.u,r=A.d7(a,b),q=b.pop()
if(typeof q=="string")b.push(A.aC(s,q,r))
else{t=A.S(s,a.e,q)
switch(t.w){case 11:b.push(A.cv(s,t,r,a.n))
break
default:b.push(A.cu(s,t,r))
break}}},
eq(a,b){var t,s,r,q=a.u,p=b.pop(),o=null,n=null
if(typeof p=="number")switch(p){case-1:o=b.pop()
break
case-2:n=b.pop()
break
default:b.push(p)
break}else b.push(p)
t=A.d7(a,b)
p=b.pop()
switch(p){case-3:p=b.pop()
if(o==null)o=q.sEA
if(n==null)n=q.sEA
s=A.S(q,a.e,p)
r=new A.bb()
r.a=t
r.b=o
r.c=n
b.push(A.dd(q,s,r))
return
case-4:b.push(A.dg(q,b.pop(),t))
return
default:throw A.b(A.aL("Unexpected state under `()`: "+A.l(p)))}},
es(a,b){var t=b.pop()
if(0===t){b.push(A.aD(a.u,1,"0&"))
return}if(1===t){b.push(A.aD(a.u,4,"1&"))
return}throw A.b(A.aL("Unexpected extended operation "+A.l(t)))},
d7(a,b){var t=b.splice(a.p)
A.db(a.u,a.e,t)
a.p=b.pop()
return t},
S(a,b,c){if(typeof c=="string")return A.aC(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.eu(a,b,c)}else return c},
db(a,b,c){var t,s=c.length
for(t=0;t<s;++t)c[t]=A.S(a,b,c[t])},
ev(a,b,c){var t,s=c.length
for(t=2;t<s;t+=3)c[t]=A.S(a,b,c[t])},
eu(a,b,c){var t,s,r=b.w
if(r===9){if(c===0)return b.x
t=b.y
s=t.length
if(c<=s)return t[c-1]
c-=s
b=b.x
r=b.w}else if(c===0)return b
if(r!==8)throw A.b(A.aL("Indexed base must be an interface type"))
t=b.y
if(c<=t.length)return t[c-1]
throw A.b(A.aL("Bad index "+c+" for "+b.h(0)))},
fF(a,b,c){var t,s=b.d
if(s==null)s=b.d=new Map()
t=s.get(c)
if(t==null){t=A.n(a,b,null,c,null)
s.set(c,t)}return t},
n(a,b,c,d,e){var t,s,r,q,p,o,n,m,l,k,j
if(b===d)return!0
if(A.X(d))return!0
t=b.w
if(t===4)return!0
if(A.X(b))return!1
if(b.w===1)return!0
s=t===13
if(s)if(A.n(a,c[b.x],c,d,e))return!0
r=d.w
q=u.P
if(b===q||b===u.T){if(r===7)return A.n(a,b,c,d.x,e)
return d===q||d===u.T||r===6}if(d===u.K){if(t===7)return A.n(a,b.x,c,d,e)
return t!==6}if(t===7){if(!A.n(a,b.x,c,d,e))return!1
return A.n(a,A.cm(a,b),c,d,e)}if(t===6)return A.n(a,q,c,d,e)&&A.n(a,b.x,c,d,e)
if(r===7){if(A.n(a,b,c,d.x,e))return!0
return A.n(a,b,c,A.cm(a,d),e)}if(r===6)return A.n(a,b,c,q,e)||A.n(a,b,c,d.x,e)
if(s)return!1
q=t!==11
if((!q||t===12)&&d===u.Z)return!0
p=t===10
if(p&&d===u.L)return!0
if(r===12){if(b===u.g)return!0
if(t!==12)return!1
o=b.y
n=d.y
m=o.length
if(m!==n.length)return!1
c=c==null?o:o.concat(c)
e=e==null?n:n.concat(e)
for(l=0;l<m;++l){k=o[l]
j=n[l]
if(!A.n(a,k,c,j,e)||!A.n(a,j,e,k,c))return!1}return A.dn(a,b.x,c,d.x,e)}if(r===11){if(b===u.g)return!0
if(q)return!1
return A.dn(a,b,c,d,e)}if(t===8){if(r!==8)return!1
return A.f6(a,b,c,d,e)}if(p&&r===10)return A.fa(a,b,c,d,e)
return!1},
dn(a2,a3,a4,a5,a6){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(!A.n(a2,a3.x,a4,a5.x,a6))return!1
t=a3.y
s=a5.y
r=t.a
q=s.a
p=r.length
o=q.length
if(p>o)return!1
n=o-p
m=t.b
l=s.b
k=m.length
j=l.length
if(p+k<o+j)return!1
for(i=0;i<p;++i){h=r[i]
if(!A.n(a2,q[i],a6,h,a4))return!1}for(i=0;i<n;++i){h=m[i]
if(!A.n(a2,q[p+i],a6,h,a4))return!1}for(i=0;i<j;++i){h=m[n+i]
if(!A.n(a2,l[i],a6,h,a4))return!1}g=t.c
f=s.c
e=g.length
d=f.length
for(c=0,b=0;b<d;b+=3){a=f[b]
for(;!0;){if(c>=e)return!1
a0=g[c]
c+=3
if(a<a0)return!1
a1=g[c-2]
if(a0<a){if(a1)return!1
continue}h=f[b+1]
if(a1&&!h)return!1
h=g[c-1]
if(!A.n(a2,f[b+2],a6,h,a4))return!1
break}}for(;c<e;){if(g[c+1])return!1
c+=3}return!0},
f6(a,b,c,d,e){var t,s,r,q,p,o=b.x,n=d.x
for(;o!==n;){t=a.tR[o]
if(t==null)return!1
if(typeof t=="string"){o=t
continue}s=t[n]
if(s==null)return!1
r=s.length
q=r>0?new Array(r):v.typeUniverse.sEA
for(p=0;p<r;++p)q[p]=A.aE(a,b,s[p])
return A.dj(a,q,null,c,d.y,e)}return A.dj(a,b.y,null,c,d.y,e)},
dj(a,b,c,d,e,f){var t,s=b.length
for(t=0;t<s;++t)if(!A.n(a,b[t],d,e[t],f))return!1
return!0},
fa(a,b,c,d,e){var t,s=b.y,r=d.y,q=s.length
if(q!==r.length)return!1
if(b.x!==d.x)return!1
for(t=0;t<q;++t)if(!A.n(a,s[t],c,r[t],e))return!1
return!0},
a9(a){var t=a.w,s=!0
if(!(a===u.P||a===u.T))if(!A.X(a))if(t!==6)s=t===7&&A.a9(a.x)
return s},
X(a){var t=a.w
return t===2||t===3||t===4||t===5||a===u.X},
di(a,b){var t,s,r=Object.keys(b),q=r.length
for(t=0;t<q;++t){s=r[t]
a[s]=b[s]}},
bX(a){return a>0?new Array(a):v.typeUniverse.sEA},
B:function B(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
bb:function bb(){this.c=this.b=this.a=null},
bU:function bU(a){this.a=a},
bP:function bP(){},
bg:function bg(a){this.a=a},
dc(a,b,c){return 0},
aA:function aA(a){var _=this
_.a=a
_.e=_.d=_.c=_.b=null},
a5:function a5(a,b){this.a=a
this.$ti=b},
e4(a,b){return new A.ai(a.m("@<0>").ah(b).m("ai<1,2>"))},
cj(a){var t,s
if(A.cE(a))return"{...}"
t=new A.b7("")
try{s={}
$.Y.push(a)
t.a+="{"
s.a=!0
a.a5(0,new A.by(s,t))
t.a+="}"}finally{$.Y.pop()}s=t.a
return s.charCodeAt(0)==0?s:s},
j:function j(){},
aT:function aT(){},
by:function by(a,b){this.a=a
this.b=b},
em(a,b){var t,s,r=$.v(),q=a.length,p=4-q%4
if(p===4)p=0
for(t=0,s=0;s<q;++s){t=t*10+a.charCodeAt(s)-48;++p
if(p===4){r=r.V(0,$.cG()).K(0,A.as(t))
t=0
p=0}}if(b)return r.B(0)
return r},
cZ(a){if(48<=a&&a<=57)return a-48
return(a|32)-97+10},
en(a,b,c){var t,s,r,q,p,o,n,m=a.length,l=m-b,k=B.p.aH(l/4),j=new Uint16Array(k),i=k-1,h=l-i*4
for(t=b,s=0,r=0;r<h;++r,t=q){q=t+1
p=A.cZ(a.charCodeAt(t))
if(p>=16)return null
s=s*16+p}o=i-1
j[i]=s
for(;t<m;o=n){for(s=0,r=0;r<4;++r,t=q){q=t+1
p=A.cZ(a.charCodeAt(t))
if(p>=16)return null
s=s*16+p}n=o-1
j[o]=s}if(k===1&&j[0]===0)return $.v()
m=A.x(k,j)
return new A.o(m===0?!1:c,j,m)},
ep(a,b){var t,s,r,q,p
if(a==="")return null
t=$.dK().aU(a)
if(t==null)return null
s=t.b
r=s[1]==="-"
q=s[4]
p=s[3]
if(q!=null)return A.em(q,r)
if(p!=null)return A.en(p,2,r)
return null},
x(a,b){while(!0){if(!(a>0&&b[a-1]===0))break;--a}return a},
cs(a,b,c,d){var t,s=new Uint16Array(d),r=c-b
for(t=0;t<r;++t)s[t]=a[b+t]
return s},
co(a){var t
if(a===0)return $.v()
if(a===1)return $.aI()
if(a===2)return $.dL()
if(Math.abs(a)<4294967296)return A.as(B.a.U(a))
t=A.ej(a)
return t},
as(a){var t,s,r,q,p=a<0
if(p){if(a===-9223372036854776e3){t=new Uint16Array(4)
t[3]=32768
s=A.x(4,t)
return new A.o(s!==0,t,s)}a=-a}if(a<65536){t=new Uint16Array(1)
t[0]=a
s=A.x(1,t)
return new A.o(s===0?!1:p,t,s)}if(a<=4294967295){t=new Uint16Array(2)
t[0]=a&65535
t[1]=B.a.G(a,16)
s=A.x(2,t)
return new A.o(s===0?!1:p,t,s)}s=B.a.p(B.a.ga4(a)-1,16)+1
t=new Uint16Array(s)
for(r=0;a!==0;r=q){q=r+1
t[r]=a&65535
a=B.a.p(a,65536)}s=A.x(s,t)
return new A.o(s===0?!1:p,t,s)},
ej(a){var t,s,r,q,p,o,n,m
if(isNaN(a)||a==1/0||a==-1/0)throw A.b(A.F("Value must be finite: "+a))
a=Math.floor(a)
if(a===0)return $.v()
t=$.dJ()
for(s=t.$flags|0,r=0;r<8;++r){s&2&&A.q(t)
t[r]=0}s=J.dN(B.F.gaG(t))
s.$flags&2&&A.q(s,13)
s.setFloat64(0,a,!0)
s=t[7]
q=t[6]
p=(s<<4>>>0)+(q>>>4)-1075
o=new Uint16Array(4)
o[0]=(t[1]<<8>>>0)+t[0]
o[1]=(t[3]<<8>>>0)+t[2]
o[2]=(t[5]<<8>>>0)+t[4]
o[3]=q&15|16
n=new A.o(!1,o,4)
if(p<0)m=n.E(0,-p)
else m=p>0?n.D(0,p):n
return m},
ct(a,b,c,d){var t,s,r
if(b===0)return 0
if(c===0&&d===a)return b
for(t=b-1,s=d.$flags|0;t>=0;--t){r=a[t]
s&2&&A.q(d)
d[t+c]=r}for(t=c-1;t>=0;--t){s&2&&A.q(d)
d[t]=0}return b+c},
d4(a,b,c,d){var t,s,r,q,p,o=B.a.p(c,16),n=B.a.v(c,16),m=16-n,l=B.a.D(1,m)-1
for(t=b-1,s=d.$flags|0,r=0;t>=0;--t){q=a[t]
p=B.a.E(q,m)
s&2&&A.q(d)
d[t+o+1]=(p|r)>>>0
r=B.a.D((q&l)>>>0,n)}s&2&&A.q(d)
d[o]=r},
d_(a,b,c,d){var t,s,r,q,p=B.a.p(c,16)
if(B.a.v(c,16)===0)return A.ct(a,b,p,d)
t=b+p+1
A.d4(a,b,c,d)
for(s=d.$flags|0,r=p;--r,r>=0;){s&2&&A.q(d)
d[r]=0}q=t-1
return d[q]===0?q:t},
eo(a,b,c,d){var t,s,r,q,p=B.a.p(c,16),o=B.a.v(c,16),n=16-o,m=B.a.D(1,o)-1,l=B.a.E(a[p],o),k=b-p-1
for(t=d.$flags|0,s=0;s<k;++s){r=a[s+p+1]
q=B.a.D((r&m)>>>0,n)
t&2&&A.q(d)
d[s]=(q|l)>>>0
l=B.a.E(r,o)}t&2&&A.q(d)
d[k]=l},
bJ(a,b,c,d){var t,s=b-d
if(s===0)for(t=b-1;t>=0;--t){s=a[t]-c[t]
if(s!==0)return s}return s},
ek(a,b,c,d,e){var t,s,r
for(t=e.$flags|0,s=0,r=0;r<d;++r){s+=a[r]+c[r]
t&2&&A.q(e)
e[r]=s&65535
s=B.a.G(s,16)}for(r=d;r<b;++r){s+=a[r]
t&2&&A.q(e)
e[r]=s&65535
s=B.a.G(s,16)}t&2&&A.q(e)
e[b]=s},
ba(a,b,c,d,e){var t,s,r
for(t=e.$flags|0,s=0,r=0;r<d;++r){s+=a[r]-c[r]
t&2&&A.q(e)
e[r]=s&65535
s=0-(B.a.G(s,16)&1)}for(r=d;r<b;++r){s+=a[r]
t&2&&A.q(e)
e[r]=s&65535
s=0-(B.a.G(s,16)&1)}},
d5(a,b,c,d,e,f){var t,s,r,q,p,o
if(a===0)return
for(t=d.$flags|0,s=0;--f,f>=0;e=p,c=r){r=c+1
q=a*b[c]+d[e]+s
p=e+1
t&2&&A.q(d)
d[e]=q&65535
s=B.a.p(q,65536)}for(;s!==0;e=p){o=d[e]+s
p=e+1
t&2&&A.q(d)
d[e]=o&65535
s=B.a.p(o,65536)}},
el(a,b,c){var t,s=b[c]
if(s===a)return 65535
t=B.a.ag((s<<16|b[c-1])>>>0,a)
if(t>65535)return 65535
return t},
e5(a,b,c,d){var t,s=J.cT(a,d)
if(a!==0&&b!=null)for(t=0;t<a;++t)s[t]=b
return s},
e6(a,b,c){var t,s,r=A.p([],c.m("c<0>"))
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.ce)(a),++s)r.push(a[s])
r.$flags=1
return r},
e7(a,b,c){var t
if(b)t=A.ci(a,c)
else{t=A.ci(a,c)
t.$flags=1
t=t}return t},
ci(a,b){var t,s=A.p([],b.m("c<0>"))
for(t=a.gC(a);t.l();)s.push(t.gq())
return s},
eb(a,b){return new A.bv(a,A.e3(a,!1,!1,!1,!1,""))},
cX(a,b,c){var t=J.cJ(b)
if(!t.l())return a
if(c.length===0){do a+=A.l(t.gq())
while(t.l())}else{a+=A.l(t.gq())
for(;t.l();)a=a+c+A.l(t.gq())}return a},
bq(a){if(typeof a=="number"||A.cy(a)||a==null)return J.aJ(a)
if(typeof a=="string")return JSON.stringify(a)
return A.cV(a)},
aL(a){return new A.bl(a)},
F(a){return new A.Z(!1,null,null,a)},
b5(a,b,c,d,e){return new A.b4(b,c,!0,a,d,"Invalid value")},
ea(a,b,c){if(0>a||a>c)throw A.b(A.b5(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.b(A.b5(b,a,c,"end",null))
return b}return c},
cl(a,b){if(a<0)throw A.b(A.b5(a,0,null,b,null))
return a},
cg(a,b,c,d){return new A.bt(b,!0,a,d,"Index out of range")},
cn(a){return new A.b8(a)},
cY(a){return new A.bG(a)},
ed(a){return new A.b6(a)},
a_(a){return new A.bo(a)},
cP(a,b){return new A.bs(a,b)},
e1(a,b,c){var t,s
if(A.cE(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}t=A.p([],u.s)
$.Y.push(a)
try{A.fe(a,t)}finally{$.Y.pop()}s=A.cX(b,t,", ")+c
return s.charCodeAt(0)==0?s:s},
cR(a,b,c){var t,s
if(A.cE(a))return b+"..."+c
t=new A.b7(b)
$.Y.push(a)
try{s=t
s.a=A.cX(s.a,a,", ")}finally{$.Y.pop()}t.a+=c
s=t.a
return s.charCodeAt(0)==0?s:s},
fe(a,b){var t,s,r,q,p,o,n,m=a.gC(a),l=0,k=0
while(!0){if(!(l<80||k<3))break
if(!m.l())return
t=A.l(m.gq())
b.push(t)
l+=t.length+2;++k}if(!m.l()){if(k<=5)return
s=b.pop()
r=b.pop()}else{q=m.gq();++k
if(!m.l()){if(k<=4){b.push(A.l(q))
return}s=A.l(q)
r=b.pop()
l+=s.length+2}else{p=m.gq();++k
for(;m.l();q=p,p=o){o=m.gq();++k
if(k>100){while(!0){if(!(l>75&&k>3))break
l-=b.pop().length+2;--k}b.push("...")
return}}r=A.l(q)
s=A.l(p)
l+=s.length+r.length+4}}if(k>b.length+2){l+=5
n="..."}else n=null
while(!0){if(!(l>80&&b.length>3))break
l-=b.pop().length+2
if(n==null){l+=5
n="..."}}if(n!=null)b.push(n)
b.push(r)
b.push(s)},
ck(a,b,c,d){var t
if(B.b===c){t=B.a.gj(a)
b=J.I(b)
return A.bD(A.L(A.L($.bj(),t),b))}if(B.b===d){t=B.a.gj(a)
b=J.I(b)
c=J.I(c)
return A.bD(A.L(A.L(A.L($.bj(),t),b),c))}t=B.a.gj(a)
b=J.I(b)
c=J.I(c)
d=J.I(d)
d=A.bD(A.L(A.L(A.L(A.L($.bj(),t),b),c),d))
return d},
e9(a){var t,s,r=$.bj()
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.ce)(a),++s)r=A.L(r,J.I(a[s]))
return A.bD(r)},
o:function o(a,b,c){this.a=a
this.b=b
this.c=c},
bK:function bK(){},
bL:function bL(){},
bO:function bO(){},
bp:function bp(){},
bl:function bl(a){this.a=a},
bF:function bF(){},
Z:function Z(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b4:function b4(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
bt:function bt(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
b8:function b8(a){this.a=a},
bG:function bG(a){this.a=a},
b6:function b6(a){this.a=a},
bo:function bo(a){this.a=a},
bQ:function bQ(a){this.a=a},
bs:function bs(a,b){this.a=a
this.b=b},
bu:function bu(){},
w:function w(){},
ap:function ap(){},
f:function f(){},
b7:function b7(a){this.a=a},
C(a){return B.c.aR(A.p(a.split(""),u.s),new A.bY())},
t(a){var t=a.length-1,s=0
while(!0){if(!(s<t&&a.charCodeAt(s)===48))break;++s}return B.q.aa(a,s)},
fR(a){var t,s,r,q,p
if(!A.C(a))return null
if(a.length===0)return $.v()
t=$.v()
for(s=a.split(""),r=s.length,q=0;q<r;++q){p=A.D(s[q])
p.toString
t=t.V(0,A.co(27)).K(0,A.co(p))}return t},
fw(a){var t,s,r,q,p,o,n,m,l
if(a.a)return null
t=$.v()
s=a.H(0,t)
if(s===0)return"0"
r=A.co(27)
q=A.p([],u.t)
for(s=r.c===0,p=r.a,o=a;o.H(0,t)>0;){if(s)A.O(B.f)
n=o.a_(r)
if(n.a)n=p?n.I(0,r):n.K(0,r)
q.push(n.U(0))
o=o.Y(r)}for(m=q.length-1,t="";m>=0;--m){l=A.aH(q[m])
if(l==null)return null
t+=l}return A.t(t.charCodeAt(0)==0?t:t)},
ds(a,b){var t,s,r,q,p,o,n,m,l,k,j,i
if(!A.C(a)||!A.C(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.t(b).length===0?"0":A.t(b)
s=b.length
if(s===0)return A.t(a).length===0?"0":A.t(a)
r=t-1
q=s-1
p=0
t=""
while(!0){s=r>=0
if(!(s||q>=0||p!==0))break
if(s){o=r-1
s=A.D(a[r])
s.toString
n=s
r=o}else n=0
if(q>=0){m=q-1
s=A.D(b[q])
s.toString
l=s
q=m}else l=0
k=n+l+p
p=B.a.p(k,27)
j=A.aH(B.a.v(k,27))
if(j==null)return null
t+=j}i=A.t(new A.G(A.p((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).F(0))
return i.length===0?"0":i},
fj(a,b){var t,s,r,q,p,o,n,m,l,k,j,i
if(!A.C(a)||!A.C(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.t(b).length===0?"0":A.t(b)
s=b.length
if(s===0)return A.t(a).length===0?"0":A.t(a)
r=t-1
q=s-1
p=0
t=""
while(!0){s=r>=0
if(!(s||q>=0||p!==0))break
if(s){o=r-1
s=A.D(a[r])
s.toString
n=s
r=o}else n=0
if(q>=0){m=q-1
s=A.D(b[q])
s.toString
l=s
q=m}else l=0
k=n+l+p-13
if(k>13){k-=27
p=1}else if(k<-13){k+=27
p=-1}else p=0
j=A.aH(k+13)
if(j==null)return null
t+=j}i=A.t(new A.G(A.p((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).F(0))
return i.length===0?"0":i},
fl(a,b){var t,s,r,q,p,o,n,m,l,k
if(!A.C(a)||!A.C(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.t(b).length===0?"0":A.t(b)
s=b.length
if(s===0)return A.t(a).length===0?"0":A.t(a)
r=t-1
q=s-1
t=""
while(!0){s=r>=0
if(!(s||q>=0))break
if(s){p=r-1
s=A.D(a[r])
s.toString
o=s
r=p}else o=0
if(q>=0){n=q-1
s=A.D(b[q])
s.toString
m=s
q=n}else m=0
l=A.aH(B.a.v(o+m,27))
if(l==null)return null
t+=l}k=A.t(new A.G(A.p((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).F(0))
return k.length===0?"0":k},
fk(a,b,a0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
if(!A.C(a)||!A.C(b)||!A.C(a0))return null
t=a.length
if(t===0&&b.length===0&&a0.length===0)return new A.az("0","0")
s=t-1
r=b.length-1
q=a0.length-1
t=""
p=""
while(!0){o=s>=0
if(!(o||r>=0||q>=0))break
if(o){n=s-1
o=A.D(a[s])
o.toString
m=o
s=n}else m=0
if(r>=0){l=r-1
o=A.D(b[r])
o.toString
k=o
r=l}else k=0
if(q>=0){j=q-1
o=A.D(a0[q])
o.toString
i=o
q=j}else i=0
h=m+k+i
g=B.a.v(h,27)
f=B.a.p(h,27)
o=A.aH(g)
o.toString
o=t+o
t=A.aH(f)
t.toString
t=p+t
p=t
t=o}o=u.s
e=u.H
d=A.t(new A.G(A.p((t.charCodeAt(0)==0?t:t).split(""),o),e).F(0))
c=A.t(new A.G(A.p((p.charCodeAt(0)==0?p:p).split(""),o),e).F(0))
t=d.length===0?"0":d
return new A.az(c.length===0?"0":c,t)},
fr(a,b){if(!A.C(a)||!A.C(b))return null
if(a.length===0&&b.length===0)return"0"
return A.ds(a,b+"0")},
bY:function bY(){},
dx(a,b){var t,s,r=A.fv(a)
if(r<=0)return 0
t=Math.pow(A.fG(a),b.b)
s=t===0?1:t
return b.a*(10.125/r)/s},
fM(a,b){var t,s,r,q,p,o,n,m,l,k=A.p([],u.C)
for(t=new A.aA(A.cB().a());t.l();){s=t.b
if(s.a===B.e.a&&s.b===B.e.b&&s.c===B.e.c)continue
r=s.a
q=r!==0?1:0
p=s.b
o=p!==0?1:0
n=s.c
m=n!==0?1:0
l=q+o+m
if(l<=0)continue
k.push(new A.bf([A.dx(s,a),Math.abs(r)+Math.abs(p)+Math.abs(n),l,s]))}B.c.a9(k,new A.cd())
return A.ee(k,0,A.fm(b,"count",u.S),u.Y).b8(0,!1)},
fn(a){var t,s,r,q,p,o,n
for(t=a.length,s=0,r=0,q=0;q<a.length;a.length===t||(0,A.ce)(a),++q){p=a[q]
o=p.b*3.141592653589793/180
n=p.a
s+=n*Math.cos(o)
r+=n*Math.sin(o)}return Math.sqrt(s*s+r*r)},
aO:function aO(a,b){this.a=a
this.b=b},
cd:function cd(){},
fL(a){var t,s,r,q,p,o,n,m,l=$.cf().length,k=J.cS(l,u.S)
for(t=0;t<l;++t)k[t]=t
s=B.a.v(B.a.v(a.b,4)+4,4)
if(s===0)return k
switch(a.a){case B.j:r=new A.c7()
q=A.dF()
break
case B.k:r=new A.c8()
q=A.dF()
break
case B.m:r=new A.c9()
q=A.dD()
break
case B.l:r=new A.ca()
q=A.dD()
break
case B.n:r=new A.cb()
q=A.dE()
break
case B.o:r=new A.cc()
q=A.dE()
break
default:r=null
q=null}for(t=0;p=$.cf(),t<p.length;++t){o=p[t]
if(r.$1(o)){for(n=o,m=0;m<s;++m)n=q.$1(n)
p=$.dM().n(0,n)
p.toString
k[t]=p}}return k},
J:function J(a){this.b=a},
br:function br(a,b){this.a=a
this.b=b},
c7:function c7(){},
c8:function c8(){},
c9:function c9(){},
ca:function ca(){},
cb:function cb(){},
cc:function cc(){},
r:function r(a,b,c){this.a=a
this.b=b
this.c=c},
fI(){v.G.livnium=new A.c5(new A.b9()).$0()},
b9:function b9(){},
bH:function bH(a){this.a=a},
bI:function bI(){},
c5:function c5(a){this.a=a},
N(a){var t
if(typeof a=="function")throw A.b(A.F("Attempting to rewrap a JS function."))
t=function(b,c){return function(d){return b(c,d,arguments.length)}}(A.eS,a)
t[$.bi()]=a
return t},
a6(a){var t
if(typeof a=="function")throw A.b(A.F("Attempting to rewrap a JS function."))
t=function(b,c){return function(d,e){return b(c,d,e,arguments.length)}}(A.eT,a)
t[$.bi()]=a
return t},
eR(a){return a.$0()},
eS(a,b,c){if(c>=1)return a.$1(b)
return a.$0()},
eT(a,b,c,d){if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
eU(a,b,c,d,e){if(e>=3)return a.$3(b,c,d)
if(e===2)return a.$2(b,c)
if(e===1)return a.$1(b)
return a.$0()},
eV(a,b,c,d,e,f){if(f>=4)return a.$4(b,c,d,e)
if(f===3)return a.$3(b,c,d)
if(f===2)return a.$2(b,c)
if(f===1)return a.$1(b)
return a.$0()},
D(a){if(a.length!==1)return null
return B.E.n(0,a)},
aH(a){if(a<0||a>=27)return null
return B.D[a]},
cC(a){var t
if(a==="0")return 0
t=A.D(a)
if(t==null)return-1
if(t>=1&&t<=6)return 1
if(t>=7&&t<=18)return 2
if(t>=19&&t<=26)return 3
return-1},
dG(a){var t=A.cC(a)
if(t<0)return null
return t/3*27},
fT(a){var t,s,r,q,p
for(t=a.split(""),s=t.length,r=0,q=0;q<s;++q){p=A.dG(t[q])
if(p==null)return null
r+=p}return r},
dH(a){var t=A.cC(a)
if(t<=0)return t===0?0:null
return 10.125*t},
fU(a){var t,s,r,q,p
for(t=a.split(""),s=t.length,r=0,q=0;q<s;++q){p=A.dH(t[q])
if(p==null)return null
r+=p}return r},
cB(){return new A.a5(A.fs(),u.O)},
fs(){return function(){var t=0,s=1,r=[],q,p,o
return function $async$cB(a,b,c){if(b===1){r.push(c)
t=s}while(true)switch(t){case 0:q=-1
case 2:if(!(q<=1)){t=4
break}p=-1
case 5:if(!(p<=1)){t=7
break}o=-1
case 8:if(!(o<=1)){t=10
break}t=11
return a.b=new A.r(q,p,o),1
case 11:case 9:++o
t=8
break
case 10:case 6:++p
t=5
break
case 7:case 3:++q
t=2
break
case 4:return 0
case 1:return a.c=r.at(-1),3}}}},
fv(a){var t=a.a!==0?1:0,s=a.b!==0?1:0,r=a.c!==0?1:0
return t+s+r},
fG(a){return Math.abs(a.a)+Math.abs(a.b)+Math.abs(a.c)},
fN(a){return new A.r(a.a,-a.c,a.b)},
fO(a){return new A.r(a.c,a.b,-a.a)},
fP(a){return new A.r(-a.b,a.a,a.c)}},B={}
var w=[A,J,B]
var $={}
A.ch.prototype={}
J.aP.prototype={
A(a,b){return a===b},
gj(a){return A.b3(a)},
h(a){return"Instance of '"+A.bz(a)+"'"},
gk(a){return A.V(A.cx(this))}}
J.aQ.prototype={
h(a){return String(a)},
gj(a){return a?519018:218159},
gk(a){return A.V(u.y)},
$id:1}
J.af.prototype={
A(a,b){return null==b},
h(a){return"null"},
gj(a){return 0},
$id:1}
J.ah.prototype={$ie:1}
J.P.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.b2.prototype={}
J.ar.prototype={}
J.K.prototype={
h(a){var t=a[$.bi()]
if(t==null)return this.ab(a)
return"JavaScript function for "+J.aJ(t)}}
J.a1.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.a2.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.c.prototype={
aV(a,b){var t,s,r=a.length
for(t=0;t<r;++t){s=a[t]
if(b.$1(s))return s
if(a.length!==r)throw A.b(A.a_(a))}throw A.b(A.e0())},
u(a,b){return a[b]},
aR(a,b){var t,s=a.length
for(t=0;t<s;++t){if(!b.$1(a[t]))return!1
if(a.length!==s)throw A.b(A.a_(a))}return!0},
a9(a,b){var t,s,r,q,p
a.$flags&2&&A.q(a,"sort")
t=a.length
if(t<2)return
if(t===2){s=a[0]
r=a[1]
if(b.$2(s,r)>0){a[0]=r
a[1]=s}return}q=0
if(A.bh(a).c.b(null))for(p=0;p<a.length;++p)if(a[p]===void 0){a[p]=null;++q}a.sort(A.fo(b,2))
if(q>0)this.ao(a,q)},
ao(a,b){var t,s=a.length
for(;t=s-1,s>0;s=t)if(a[t]===null){a[t]=void 0;--b
if(b===0)break}},
h(a){return A.cR(a,"[","]")},
gC(a){return new J.aK(a,a.length,A.bh(a).m("aK<1>"))},
gj(a){return A.b3(a)},
gi(a){return a.length},
$ih:1}
J.bw.prototype={}
J.aK.prototype={
gq(){var t=this.d
return t==null?this.$ti.c.a(t):t},
l(){var t,s=this,r=s.a,q=r.length
if(s.b!==q)throw A.b(A.ce(r))
t=s.c
if(t>=q){s.d=null
return!1}s.d=r[t]
s.c=t+1
return!0}}
J.ag.prototype={
H(a,b){var t
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){t=this.gT(b)
if(this.gT(a)===t)return 0
if(this.gT(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gT(a){return a===0?1/a<0:a<0},
U(a){var t
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){t=a<0?Math.ceil(a):Math.floor(a)
return t+0}throw A.b(A.cn(""+a+".toInt()"))},
aH(a){var t,s
if(a>=0){if(a<=2147483647){t=a|0
return a===t?t:t+1}}else if(a>=-2147483648)return a|0
s=Math.ceil(a)
if(isFinite(s))return s
throw A.b(A.cn(""+a+".ceil()"))},
h(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gj(a){var t,s,r,q,p=a|0
if(a===p)return p&536870911
t=Math.abs(a)
s=Math.log(t)/0.6931471805599453|0
r=Math.pow(2,s)
q=t<1?t/r:r/t
return((q*9007199254740992|0)+(q*3542243181176521|0))*599197+s*1259&536870911},
v(a,b){var t=a%b
if(t===0)return 0
if(t>0)return t
return t+b},
ag(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.a1(a,b)},
p(a,b){return(a|0)===a?a/b|0:this.a1(a,b)},
a1(a,b){var t=a/b
if(t>=-2147483648&&t<=2147483647)return t|0
if(t>0){if(t!==1/0)return Math.floor(t)}else if(t>-1/0)return Math.ceil(t)
throw A.b(A.cn("Result of truncating division is "+A.l(t)+": "+A.l(a)+" ~/ "+b))},
D(a,b){if(b<0)throw A.b(A.du(b))
return b>31?0:a<<b>>>0},
E(a,b){var t
if(b<0)throw A.b(A.du(b))
if(a>0)t=this.a0(a,b)
else{t=b>31?31:b
t=a>>t>>>0}return t},
G(a,b){var t
if(a>0)t=this.a0(a,b)
else{t=b>31?31:b
t=a>>t>>>0}return t},
a0(a,b){return b>31?0:a>>>b},
gk(a){return A.V(u.n)},
$ik:1,
$im:1}
J.ae.prototype={
ga4(a){var t,s=a<0?-a-1:a,r=s
for(t=32;r>=4294967296;){r=this.p(r,4294967296)
t+=32}return t-Math.clz32(r)},
gk(a){return A.V(u.S)},
$id:1,
$ia:1}
J.aR.prototype={
gk(a){return A.V(u.i)},
$id:1}
J.a0.prototype={
W(a,b,c){return a.substring(b,A.ea(b,c,a.length))},
aa(a,b){return this.W(a,b,null)},
h(a){return a},
gj(a){var t,s,r
for(t=a.length,s=0,r=0;r<t;++r){s=s+a.charCodeAt(r)&536870911
s=s+((s&524287)<<10)&536870911
s^=s>>6}s=s+((s&67108863)<<3)&536870911
s^=s>>11
return s+((s&16383)<<15)&536870911},
gk(a){return A.V(u.N)},
gi(a){return a.length},
$id:1,
$ii:1}
A.aS.prototype={
h(a){return"LateInitializationError: "+this.a}}
A.bB.prototype={}
A.ac.prototype={}
A.A.prototype={
gC(a){var t=this
return new A.a3(t,t.gi(t),A.cw(t).m("a3<A.E>"))},
F(a){var t,s,r=this,q=r.gi(r)
for(t=0,s="";t<q;++t){s+=A.l(r.u(0,t))
if(q!==r.gi(r))throw A.b(A.a_(r))}return s.charCodeAt(0)==0?s:s}}
A.aq.prototype={
gal(){var t=J.aa(this.a),s=this.c
if(s>t)return t
return s},
gaq(){var t=J.aa(this.a),s=this.b
if(s>t)return t
return s},
gi(a){var t,s=J.aa(this.a),r=this.b
if(r>=s)return 0
t=this.c
if(t>=s)return s-r
return t-r},
u(a,b){var t=this,s=t.gaq()+b,r=t.gal()
if(s>=r)throw A.b(A.cg(b,t.gi(0),t,"index"))
return J.cI(t.a,s)},
b8(a,b){var t,s,r,q=this,p=q.b,o=q.a,n=J.c_(o),m=n.gi(o),l=q.c
if(l<m)m=l
t=m-p
if(t<=0){o=J.cT(0,q.$ti.c)
return o}s=A.e5(t,n.u(o,p),!1,q.$ti.c)
for(r=1;r<t;++r){s[r]=n.u(o,p+r)
if(n.gi(o)<m)throw A.b(A.a_(q))}return s}}
A.a3.prototype={
gq(){var t=this.d
return t==null?this.$ti.c.a(t):t},
l(){var t,s=this,r=s.a,q=J.c_(r),p=q.gi(r)
if(s.b!==p)throw A.b(A.a_(r))
t=s.c
if(t>=p){s.d=null
return!1}s.d=q.u(r,t);++s.c
return!0}}
A.aj.prototype={
gi(a){return J.aa(this.a)},
u(a,b){return this.b.$1(J.cI(this.a,b))}}
A.ad.prototype={}
A.G.prototype={
gi(a){return J.aa(this.a)},
u(a,b){var t=this.a,s=J.c_(t)
return s.u(t,s.gi(t)-1-b)}}
A.be.prototype={$r:"+(1,2)",$s:1}
A.az.prototype={$r:"+carry,sum(1,2)",$s:2}
A.bf.prototype={$r:"+C,L,faces,pos(1,2,3,4)",$s:4}
A.aM.prototype={
h(a){return A.cj(this)}}
A.aN.prototype={
gi(a){return this.b.length},
aK(a){if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
n(a,b){if(!this.aK(b))return null
return this.b[this.a[b]]},
a5(a,b){var t,s,r,q=this,p=q.$keys
if(p==null){p=Object.keys(q.a)
q.$keys=p}p=p
t=q.b
for(s=p.length,r=0;r<s;++r)b.$2(p[r],t[r])}}
A.R.prototype={
h(a){var t=this.constructor,s=t==null?null:t.name
return"Closure '"+A.dI(s==null?"unknown":s)+"'"},
gbd(){return this},
$C:"$1",
$R:1,
$D:null}
A.bm.prototype={$C:"$0",$R:0}
A.bn.prototype={$C:"$2",$R:2}
A.bE.prototype={}
A.bC.prototype={
h(a){var t=this.$static_name
if(t==null)return"Closure of unknown static method"
return"Closure '"+A.dI(t)+"'"}}
A.ab.prototype={
A(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.ab))return!1
return this.$_target===b.$_target&&this.a===b.a},
gj(a){return(A.dA(this.a)^A.b3(this.$_target))>>>0},
h(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.bz(this.a)+"'")}}
A.bA.prototype={
h(a){return"RuntimeError: "+this.a}}
A.ai.prototype={
gi(a){return this.a},
n(a,b){var t,s,r,q,p=null
if(typeof b=="string"){t=this.b
if(t==null)return p
s=t[b]
r=s==null?p:s.b
return r}else if(typeof b=="number"&&(b&0x3fffffff)===b){q=this.c
if(q==null)return p
s=q[b]
r=s==null?p:s.b
return r}else return this.aY(b)},
aY(a){var t,s,r=this.d
if(r==null)return null
t=r[this.a6(a)]
s=this.a7(t,a)
if(s<0)return null
return t[s].b},
a8(a,b,c){var t,s,r,q,p,o,n=this
if(typeof b=="string"){t=n.b
n.X(t==null?n.b=n.P():t,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){s=n.c
n.X(s==null?n.c=n.P():s,b,c)}else{r=n.d
if(r==null)r=n.d=n.P()
q=n.a6(b)
p=r[q]
if(p==null)r[q]=[n.R(b,c)]
else{o=n.a7(p,b)
if(o>=0)p[o].b=c
else p.push(n.R(b,c))}}},
a5(a,b){var t=this,s=t.e,r=t.r
for(;s!=null;){b.$2(s.a,s.b)
if(r!==t.r)throw A.b(A.a_(t))
s=s.c}},
X(a,b,c){var t=a[b]
if(t==null)a[b]=this.R(b,c)
else t.b=c},
R(a,b){var t=this,s=new A.bx(a,b)
if(t.e==null)t.e=t.f=s
else t.f=t.f.c=s;++t.a
t.r=t.r+1&1073741823
return s},
a6(a){return J.I(a)&1073741823},
a7(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.bk(a[s].a,b))return s
return-1},
h(a){return A.cj(this)},
P(){var t=Object.create(null)
t["<non-identifier-key>"]=t
delete t["<non-identifier-key>"]
return t}}
A.bx.prototype={}
A.c1.prototype={
$1(a){return this.a(a)}}
A.c2.prototype={
$2(a,b){return this.a(a,b)}}
A.c3.prototype={
$1(a){return this.a(a)}}
A.ay.prototype={
h(a){return this.a2(!1)},
a2(a){var t,s,r,q,p,o=this.an(),n=this.O(),m=(a?""+"Record ":"")+"("
for(t=o.length,s="",r=0;r<t;++r,s=", "){m+=s
q=o[r]
if(typeof q=="string")m=m+q+": "
p=n[r]
m=a?m+A.cV(p):m+A.l(p)}m+=")"
return m.charCodeAt(0)==0?m:m},
an(){var t,s=this.$s
for(;$.bT.length<=s;)$.bT.push(null)
t=$.bT[s]
if(t==null){t=this.ai()
$.bT[s]=t}return t},
ai(){var t,s,r,q=this.$r,p=q.indexOf("("),o=q.substring(1,p),n=q.substring(p),m=n==="()"?0:n.replace(/[^,]/g,"").length+1,l=u.K,k=J.cS(m,l)
for(t=0;t<m;++t)k[t]=t
if(o!==""){s=o.split(",")
t=s.length
for(r=m;t>0;){--r;--t
k[r]=s[t]}}k=A.e6(k,!1,l)
k.$flags=3
return k}}
A.bc.prototype={
O(){return[this.a,this.b]},
A(a,b){if(b==null)return!1
return b instanceof A.bc&&this.$s===b.$s&&J.bk(this.a,b.a)&&J.bk(this.b,b.b)},
gj(a){return A.ck(this.$s,this.a,this.b,B.b)}}
A.bd.prototype={
O(){return this.a},
A(a,b){if(b==null)return!1
return b instanceof A.bd&&this.$s===b.$s&&A.ew(this.a,b.a)},
gj(a){return A.ck(this.$s,A.e9(this.a),B.b,B.b)}}
A.bv.prototype={
h(a){return"RegExp/"+this.a+"/"+this.b.flags},
aU(a){var t=this.b.exec(a)
if(t==null)return null
return new A.bS(t)}}
A.bS.prototype={}
A.bM.prototype={
t(){var t=this.b
if(t===this)throw A.b(new A.aS("Field '"+this.a+"' has not been initialized."))
return t}}
A.aU.prototype={
gk(a){return B.H},
aF(a,b,c){var t=new DataView(a,b)
return t},
a3(a){return this.aF(a,0,null)},
$id:1}
A.am.prototype={
gaG(a){if(((a.$flags|0)&2)!==0)return new A.bW(a.buffer)
else return a.buffer}}
A.bW.prototype={
a3(a){var t=A.e8(this.a,0,null)
t.$flags=3
return t}}
A.aV.prototype={
gk(a){return B.I},
$id:1}
A.a4.prototype={
gi(a){return a.length},
$iy:1}
A.ak.prototype={
n(a,b){A.T(b,a,a.length)
return a[b]},
$ih:1}
A.al.prototype={$ih:1}
A.aW.prototype={
gk(a){return B.J},
$id:1}
A.aX.prototype={
gk(a){return B.K},
$id:1}
A.aY.prototype={
gk(a){return B.L},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.aZ.prototype={
gk(a){return B.M},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.b_.prototype={
gk(a){return B.N},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.b0.prototype={
gk(a){return B.P},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.b1.prototype={
gk(a){return B.Q},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.an.prototype={
gk(a){return B.R},
gi(a){return a.length},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.ao.prototype={
gk(a){return B.S},
gi(a){return a.length},
n(a,b){A.T(b,a,a.length)
return a[b]},
$id:1}
A.au.prototype={}
A.av.prototype={}
A.aw.prototype={}
A.ax.prototype={}
A.B.prototype={
m(a){return A.aE(v.typeUniverse,this,a)},
ah(a){return A.dh(v.typeUniverse,this,a)}}
A.bb.prototype={}
A.bU.prototype={
h(a){return A.z(this.a,null)}}
A.bP.prototype={
h(a){return this.a}}
A.bg.prototype={}
A.aA.prototype={
gq(){return this.b},
ap(a,b){var t,s,r
a=a
b=b
t=this.a
for(;!0;)try{s=t(this,a,b)
return s}catch(r){b=r
a=1}},
l(){var t,s,r,q,p=this,o=null,n=0
for(;!0;){t=p.d
if(t!=null)try{if(t.l()){p.b=t.gq()
return!0}else p.d=null}catch(s){o=s
n=1
p.d=null}r=p.ap(n,o)
if(1===r)return!0
if(0===r){p.b=null
q=p.e
if(q==null||q.length===0){p.a=A.dc
return!1}p.a=q.pop()
n=0
o=null
continue}if(2===r){n=0
o=null
continue}if(3===r){o=p.c
p.c=null
q=p.e
if(q==null||q.length===0){p.b=null
p.a=A.dc
throw o
return!1}p.a=q.pop()
n=1
continue}throw A.b(A.ed("sync*"))}return!1},
be(a){var t,s,r=this
if(a instanceof A.a5){t=a.a()
s=r.e
if(s==null)s=r.e=[]
s.push(r.a)
r.a=t
return 2}else{r.d=J.cJ(a)
return 2}}}
A.a5.prototype={
gC(a){return new A.aA(this.a())}}
A.j.prototype={
gC(a){return new A.a3(a,this.gi(a),A.aG(a).m("a3<j.E>"))},
u(a,b){return this.n(a,b)},
h(a){return A.cR(a,"[","]")}}
A.aT.prototype={
gi(a){return this.a},
h(a){return A.cj(this)}}
A.by.prototype={
$2(a,b){var t,s=this.a
if(!s.a)this.b.a+=", "
s.a=!1
s=this.b
t=A.l(a)
s.a=(s.a+=t)+": "
t=A.l(b)
s.a+=t}}
A.o.prototype={
B(a){var t,s,r=this,q=r.c
if(q===0)return r
t=!r.a
s=r.b
q=A.x(q,s)
return new A.o(q===0?!1:t,s,q)},
aj(a){var t,s,r,q,p,o,n=this.c
if(n===0)return $.v()
t=n+a
s=this.b
r=new Uint16Array(t)
for(q=n-1;q>=0;--q)r[q+a]=s[q]
p=this.a
o=A.x(t,r)
return new A.o(o===0?!1:p,r,o)},
ak(a){var t,s,r,q,p,o,n,m=this,l=m.c
if(l===0)return $.v()
t=l-a
if(t<=0)return m.a?$.cH():$.v()
s=m.b
r=new Uint16Array(t)
for(q=a;q<l;++q)r[q-a]=s[q]
p=m.a
o=A.x(t,r)
n=new A.o(o===0?!1:p,r,o)
if(p)for(q=0;q<a;++q)if(s[q]!==0)return n.I(0,$.aI())
return n},
D(a,b){var t,s,r,q,p,o=this
if(b<0)throw A.b(A.F("shift-amount must be posititve "+b))
t=o.c
if(t===0)return o
s=B.a.p(b,16)
if(B.a.v(b,16)===0)return o.aj(s)
r=t+s+1
q=new Uint16Array(r)
A.d4(o.b,t,b,q)
t=o.a
p=A.x(r,q)
return new A.o(p===0?!1:t,q,p)},
E(a,b){var t,s,r,q,p,o,n,m,l,k=this
if(b<0)throw A.b(A.F("shift-amount must be posititve "+b))
t=k.c
if(t===0)return k
s=B.a.p(b,16)
r=B.a.v(b,16)
if(r===0)return k.ak(s)
q=t-s
if(q<=0)return k.a?$.cH():$.v()
p=k.b
o=new Uint16Array(q)
A.eo(p,t,b,o)
t=k.a
n=A.x(q,o)
m=new A.o(n===0?!1:t,o,n)
if(t){if((p[s]&B.a.D(1,r)-1)>>>0!==0)return m.I(0,$.aI())
for(l=0;l<s;++l)if(p[l]!==0)return m.I(0,$.aI())}return m},
H(a,b){var t,s=this.a
if(s===b.a){t=A.bJ(this.b,this.c,b.b,b.c)
return s?0-t:t}return s?-1:1},
L(a,b){var t,s,r,q=this,p=q.c,o=a.c
if(p<o)return a.L(q,b)
if(p===0)return $.v()
if(o===0)return q.a===b?q:q.B(0)
t=p+1
s=new Uint16Array(t)
A.ek(q.b,p,a.b,o,s)
r=A.x(t,s)
return new A.o(r===0?!1:b,s,r)},
J(a,b){var t,s,r,q=this,p=q.c
if(p===0)return $.v()
t=a.c
if(t===0)return q.a===b?q:q.B(0)
s=new Uint16Array(p)
A.ba(q.b,p,a.b,t,s)
r=A.x(p,s)
return new A.o(r===0?!1:b,s,r)},
K(a,b){var t,s,r=this,q=r.c
if(q===0)return b
t=b.c
if(t===0)return r
s=r.a
if(s===b.a)return r.L(b,s)
if(A.bJ(r.b,q,b.b,t)>=0)return r.J(b,s)
return b.J(r,!s)},
I(a,b){var t,s,r=this,q=r.c
if(q===0)return b.B(0)
t=b.c
if(t===0)return r
s=r.a
if(s!==b.a)return r.L(b,s)
if(A.bJ(r.b,q,b.b,t)>=0)return r.J(b,s)
return b.J(r,!s)},
V(a,b){var t,s,r,q,p,o,n,m=this.c,l=b.c
if(m===0||l===0)return $.v()
t=m+l
s=this.b
r=b.b
q=new Uint16Array(t)
for(p=0;p<l;){A.d5(r[p],s,0,q,p,m);++p}o=this.a!==b.a
n=A.x(t,q)
return new A.o(n===0?!1:o,q,n)},
Y(a){var t,s,r,q
if(this.c<a.c)return $.v()
this.Z(a)
t=$.cq.t()-$.at.t()
s=A.cs($.cp.t(),$.at.t(),$.cq.t(),t)
r=A.x(t,s)
q=new A.o(!1,s,r)
return this.a!==a.a&&r>0?q.B(0):q},
a_(a){var t,s,r,q=this
if(q.c<a.c)return q
q.Z(a)
t=A.cs($.cp.t(),0,$.at.t(),$.at.t())
s=A.x($.at.t(),t)
r=new A.o(!1,t,s)
if($.cr.t()>0)r=r.E(0,$.cr.t())
return q.a&&r.c>0?r.B(0):r},
Z(a){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.c
if(c===$.d1&&a.c===$.d3&&d.b===$.d0&&a.b===$.d2)return
t=a.b
s=a.c
r=16-B.a.ga4(t[s-1])
if(r>0){q=new Uint16Array(s+5)
p=A.d_(t,s,r,q)
o=new Uint16Array(c+5)
n=A.d_(d.b,c,r,o)}else{o=A.cs(d.b,0,c,c+2)
p=s
q=t
n=c}m=q[p-1]
l=n-p
k=new Uint16Array(n)
j=A.ct(q,p,l,k)
i=n+1
h=o.$flags|0
if(A.bJ(o,n,k,j)>=0){h&2&&A.q(o)
o[n]=1
A.ba(o,i,k,j,o)}else{h&2&&A.q(o)
o[n]=0}g=new Uint16Array(p+2)
g[p]=1
A.ba(g,p+1,q,p,g)
f=n-1
for(;l>0;){e=A.el(m,o,f);--l
A.d5(e,g,0,o,l,p)
if(o[f]<e){j=A.ct(g,p,l,k)
A.ba(o,i,k,j,o)
for(;--e,o[f]<e;)A.ba(o,i,k,j,o)}--f}$.d0=d.b
$.d1=c
$.d2=t
$.d3=s
$.cp.b=o
$.cq.b=i
$.at.b=p
$.cr.b=r},
gj(a){var t,s,r,q=new A.bK(),p=this.c
if(p===0)return 6707
t=this.a?83585:429689
for(s=this.b,r=0;r<p;++r)t=q.$2(t,s[r])
return new A.bL().$1(t)},
A(a,b){if(b==null)return!1
return b instanceof A.o&&this.H(0,b)===0},
U(a){var t,s,r
for(t=this.c-1,s=this.b,r=0;t>=0;--t)r=r*65536+s[t]
return this.a?-r:r},
h(a){var t,s,r,q,p,o=this,n=o.c
if(n===0)return"0"
if(n===1){if(o.a)return B.a.h(-o.b[0])
return B.a.h(o.b[0])}t=A.p([],u.s)
n=o.a
s=n?o.B(0):o
for(;s.c>1;){r=$.cG()
if(r.c===0)A.O(B.f)
q=s.a_(r).h(0)
t.push(q)
p=q.length
if(p===1)t.push("000")
if(p===2)t.push("00")
if(p===3)t.push("0")
s=s.Y(r)}t.push(B.a.h(s.b[0]))
if(n)t.push("-")
return new A.G(t,u.H).F(0)}}
A.bK.prototype={
$2(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6}}
A.bL.prototype={
$1(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911}}
A.bO.prototype={
h(a){return this.am()}}
A.bp.prototype={}
A.bl.prototype={
h(a){var t=this.a
if(t!=null)return"Assertion failed: "+A.bq(t)
return"Assertion failed"}}
A.bF.prototype={}
A.Z.prototype={
gN(){return"Invalid argument"+(!this.a?"(s)":"")},
gM(){return""},
h(a){var t=this,s=t.c,r=s==null?"":" ("+s+")",q=t.d,p=q==null?"":": "+q,o=t.gN()+r+p
if(!t.a)return o
return o+t.gM()+": "+A.bq(t.gS())},
gS(){return this.b}}
A.b4.prototype={
gS(){return this.b},
gN(){return"RangeError"},
gM(){var t,s=this.e,r=this.f
if(s==null)t=r!=null?": Not less than or equal to "+A.l(r):""
else if(r==null)t=": Not greater than or equal to "+A.l(s)
else if(r>s)t=": Not in inclusive range "+A.l(s)+".."+A.l(r)
else t=r<s?": Valid value range is empty":": Only valid value is "+A.l(s)
return t}}
A.bt.prototype={
gS(){return this.b},
gN(){return"RangeError"},
gM(){if(this.b<0)return": index must not be negative"
var t=this.f
if(t===0)return": no indices are valid"
return": index should be less than "+t},
gi(a){return this.f}}
A.b8.prototype={
h(a){return"Unsupported operation: "+this.a}}
A.bG.prototype={
h(a){return"UnimplementedError: "+this.a}}
A.b6.prototype={
h(a){return"Bad state: "+this.a}}
A.bo.prototype={
h(a){var t=this.a
if(t==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.bq(t)+"."}}
A.bQ.prototype={
h(a){return"Exception: "+this.a}}
A.bs.prototype={
h(a){var t=this.a,s=""!==t?"FormatException: "+t:"FormatException",r=this.b
if(r.length>78)r=B.q.W(r,0,75)+"..."
return s+"\n"+r}}
A.bu.prototype={
h(a){return"IntegerDivisionByZeroException"}}
A.w.prototype={
gi(a){var t,s=this.gC(this)
for(t=0;s.l();)++t
return t},
u(a,b){var t,s
A.cl(b,"index")
t=this.gC(this)
for(s=b;t.l();){if(s===0)return t.gq();--s}throw A.b(A.cg(b,b-s,this,"index"))},
h(a){return A.e1(this,"(",")")}}
A.ap.prototype={
gj(a){return A.f.prototype.gj.call(this,0)},
h(a){return"null"}}
A.f.prototype={$if:1,
A(a,b){return this===b},
gj(a){return A.b3(this)},
h(a){return"Instance of '"+A.bz(this)+"'"},
gk(a){return A.fz(this)},
toString(){return this.h(this)}}
A.b7.prototype={
gi(a){return this.a.length},
h(a){var t=this.a
return t.charCodeAt(0)==0?t:t}}
A.bY.prototype={
$1(a){return A.D(a)!=null}}
A.aO.prototype={}
A.cd.prototype={
$2(a,b){return B.p.H(b.a[0],a.a[0])}}
A.J.prototype={
am(){return"Face."+this.b}}
A.br.prototype={}
A.c7.prototype={
$1(a){return a.c===1}}
A.c8.prototype={
$1(a){return a.c===-1}}
A.c9.prototype={
$1(a){return a.a===1}}
A.ca.prototype={
$1(a){return a.a===-1}}
A.cb.prototype={
$1(a){return a.b===1}}
A.cc.prototype={
$1(a){return a.b===-1}}
A.r.prototype={
h(a){return"("+this.a+","+this.b+","+this.c+")"},
A(a,b){if(b==null)return!1
return b instanceof A.r&&this.a===b.a&&this.b===b.b&&this.c===b.c},
gj(a){return A.ck(this.a,this.b,this.c,B.b)}}
A.b9.prototype={
au(a,b){return A.ds(a,b)},
aw(a,b){return A.fj(a,b)},
aC(a,b){return A.fl(a,b)},
aA(a,b,c){var t=A.fk(a,b,c)
return{sum:t.b,carry:t.a}},
aO(a,b){return A.fr(a,b)},
b7(a){var t=A.fR(a)
return t==null?null:t.h(0)},
aX(a){var t=A.ep(a,null)
if(t==null)A.O(A.cP("Could not parse BigInt",a))
return A.fw(t)},
ad(a){return A.dG(a)},
af(a){return A.dH(a)},
ba(a){return A.fT(a)},
bc(a){return A.fU(a)},
b1(a){if(a<=0||a>3)A.O(A.F("faces must be 1..3"))
return 10.125/a},
aQ(){return 10.125},
aT(a){return A.cC(a)},
b3(a){var t,s=A.fL(new A.br(B.c.aV(B.C,new A.bH(a)),a.quarterTurns)),r=new v.G.Array(s.length)
for(t=0;t<s.length;++t)r[t]=s[t]
return r},
aE(a,b){var t,s=b.length,r=new v.G.Array(s)
for(t=0;t<s;++t)r[t]=a[t]
for(t=0;t<s;++t)a[A.dk(b[t])]=r[t]},
b_(a,b){return{tau0:a,alpha:b}},
aM(a,b,c,d){return A.dx(new A.r(a,b,c),new A.aO(d.tau0,d.alpha))},
b5(a,b){var t,s=A.fM(new A.aO(a.tau0,a.alpha),b),r=A.bh(s).m("aj<1,e>"),q=A.ci(new A.aj(s,new A.bI(),r),r.m("A.E")),p=new v.G.Array(q.length)
for(t=0;t<q.length;++t)p[t]=q[t]
return p},
aJ(a){var t,s,r=A.p([],u.f)
for(t=0;t<a.length;++t){s=a[t]
r.push(new A.be(s.mag,s.phaseDeg))}return A.fn(r)}}
A.bH.prototype={
$1(a){return a.b===this.a.face}}
A.bI.prototype={
$1(a){var t=a.a,s=t[3]
return{x:s.a,y:s.b,z:s.c,C:t[0],L:t[1],faces:t[2]}}}
A.c5.prototype={
$0(){var t,s="Attempting to rewrap a JS function.",r=this.a,q=u.m,p=q.a(v.G.Object),o=q.a(p.create.apply(p,[null]))
o.add27=A.a6(r.gar())
o.add27Balanced=A.a6(r.gav())
o.add27Cyclic=A.a6(r.gaB())
p=r.gaz()
if(typeof p=="function")A.O(A.F(s))
t=function(a,b){return function(c,d,e){return a(b,c,d,e,arguments.length)}}(A.eU,p)
q=$.bi()
t[q]=p
o.add27CarrySave3=t
o.csFinish=A.a6(r.gaN())
o.toDecimal=A.N(r.gb6())
o.fromDecimal=A.N(r.gaW())
o.symbolEnergy9=A.N(r.gac())
o.symbolEnergyK=A.N(r.gae())
o.wordEnergy9=A.N(r.gb9())
o.wordEnergyK=A.N(r.gbb())
o.perFaceUnitEnergy=A.N(r.gb0())
p=r.gaP()
if(typeof p=="function")A.O(A.F(s))
t=function(a,b){return function(){return a(b)}}(A.eR,p)
t[q]=p
o.equilibriumConstant=t
o.facesForGlyph=A.N(r.gaS())
o.permutationFor=A.N(r.gb2())
o.applyPerm=A.a6(r.gaD())
o.makeCouplerParams=A.a6(r.gaZ())
p=r.gaL()
if(typeof p=="function")A.O(A.F(s))
t=function(a,b){return function(c,d,e,f){return a(b,c,d,e,f,arguments.length)}}(A.eV,p)
t[q]=p
o.couplingAt=t
o.rankTopCouplers=A.a6(r.gb4())
o.complexSumMagnitude=A.N(r.gaI())
return o}};(function aliases(){var t=J.P.prototype
t.ab=t.h})();(function installTearOffs(){var t=hunkHelpers._instance_2u,s=hunkHelpers.installInstanceTearOff,r=hunkHelpers._instance_1u,q=hunkHelpers._instance_0u,p=hunkHelpers._static_1
var o
t(o=A.b9.prototype,"gar","au",0)
t(o,"gav","aw",0)
t(o,"gaB","aC",0)
s(o,"gaz",0,3,null,["$3"],["aA"],4,0,0)
t(o,"gaN","aO",0)
r(o,"gb6","b7",3)
r(o,"gaW","aX",3)
r(o,"gac","ad",1)
r(o,"gae","af",1)
r(o,"gb9","ba",1)
r(o,"gbb","bc",1)
r(o,"gb0","b1",5)
q(o,"gaP","aQ",6)
r(o,"gaS","aT",7)
r(o,"gb2","b3",8)
t(o,"gaD","aE",9)
t(o,"gaZ","b_",10)
s(o,"gaL",0,4,null,["$4"],["aM"],11,0,0)
t(o,"gb4","b5",12)
r(o,"gaI","aJ",13)
p(A,"dD","fN",2)
p(A,"dE","fO",2)
p(A,"dF","fP",2)})();(function inheritance(){var t=hunkHelpers.mixin,s=hunkHelpers.inherit,r=hunkHelpers.inheritMany
s(A.f,null)
r(A.f,[A.ch,J.aP,J.aK,A.bp,A.bB,A.w,A.a3,A.ad,A.ay,A.aM,A.R,A.aT,A.bx,A.bv,A.bS,A.bM,A.bW,A.B,A.bb,A.bU,A.aA,A.j,A.o,A.bO,A.bQ,A.bs,A.bu,A.ap,A.b7,A.aO,A.br,A.r,A.b9])
r(J.aP,[J.aQ,J.af,J.ah,J.a1,J.a2,J.ag,J.a0])
r(J.ah,[J.P,J.c,A.aU,A.am])
r(J.P,[J.b2,J.ar,J.K])
s(J.bw,J.c)
r(J.ag,[J.ae,J.aR])
r(A.bp,[A.aS,A.bA,A.bP,A.bl,A.bF,A.Z,A.b8,A.bG,A.b6,A.bo])
r(A.w,[A.ac,A.a5])
s(A.A,A.ac)
r(A.A,[A.aq,A.aj,A.G])
r(A.ay,[A.bc,A.bd])
r(A.bc,[A.be,A.az])
s(A.bf,A.bd)
s(A.aN,A.aM)
r(A.R,[A.bm,A.bn,A.bE,A.c1,A.c3,A.bL,A.bY,A.c7,A.c8,A.c9,A.ca,A.cb,A.cc,A.bH,A.bI])
r(A.bE,[A.bC,A.ab])
s(A.ai,A.aT)
r(A.bn,[A.c2,A.by,A.bK,A.cd])
r(A.am,[A.aV,A.a4])
r(A.a4,[A.au,A.aw])
s(A.av,A.au)
s(A.ak,A.av)
s(A.ax,A.aw)
s(A.al,A.ax)
r(A.ak,[A.aW,A.aX])
r(A.al,[A.aY,A.aZ,A.b_,A.b0,A.b1,A.an,A.ao])
s(A.bg,A.bP)
r(A.Z,[A.b4,A.bt])
s(A.J,A.bO)
s(A.c5,A.bm)
t(A.au,A.j)
t(A.av,A.ad)
t(A.aw,A.j)
t(A.ax,A.ad)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{a:"int",k:"double",m:"num",i:"String",dv:"bool",ap:"Null",h:"List",f:"Object",fZ:"Map"},mangledNames:{},types:["i?(i,i)","m?(i)","r(r)","i?(i)","e(i,i,i)","m(a)","m()","a?(i)","c<f?>(e)","~(c<f?>,c<f?>)","e(m,m)","m(a,a,a,e)","c<f?>(e,a)","m(c<f?>)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.be&&a.b(c.a)&&b.b(c.b),"2;carry,sum":(a,b)=>c=>c instanceof A.az&&a.b(c.a)&&b.b(c.b),"4;C,L,faces,pos":a=>b=>b instanceof A.bf&&A.fK(a,b.a)}}
A.eD(v.typeUniverse,JSON.parse('{"b2":"P","ar":"P","K":"P","c":{"h":["1"],"e":[]},"aQ":{"d":[]},"af":{"d":[]},"ah":{"e":[]},"P":{"e":[]},"bw":{"c":["1"],"h":["1"],"e":[]},"ag":{"k":[],"m":[]},"ae":{"k":[],"a":[],"m":[],"d":[]},"aR":{"k":[],"m":[],"d":[]},"a0":{"i":[],"d":[]},"ac":{"w":["1"]},"A":{"w":["1"]},"aq":{"A":["1"],"w":["1"],"A.E":"1","w.E":"1"},"aj":{"A":["2"],"w":["2"],"A.E":"2","w.E":"2"},"G":{"A":["1"],"w":["1"],"A.E":"1","w.E":"1"},"ai":{"aT":["1","2"]},"aU":{"e":[],"d":[]},"am":{"e":[]},"aV":{"e":[],"d":[]},"a4":{"y":["1"],"e":[]},"ak":{"j":["k"],"h":["k"],"y":["k"],"e":[]},"al":{"j":["a"],"h":["a"],"y":["a"],"e":[]},"aW":{"j":["k"],"h":["k"],"y":["k"],"e":[],"d":[],"j.E":"k"},"aX":{"j":["k"],"h":["k"],"y":["k"],"e":[],"d":[],"j.E":"k"},"aY":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"aZ":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"b_":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"b0":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"b1":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"an":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"ao":{"j":["a"],"h":["a"],"y":["a"],"e":[],"d":[],"j.E":"a"},"a5":{"w":["1"],"w.E":"1"},"k":{"m":[]},"a":{"m":[]},"e_":{"h":["a"]},"ei":{"h":["a"]},"eh":{"h":["a"]},"dY":{"h":["a"]},"ef":{"h":["a"]},"dZ":{"h":["a"]},"eg":{"h":["a"]},"dW":{"h":["k"]},"dX":{"h":["k"]}}'))
A.eC(v.typeUniverse,JSON.parse('{"ac":1,"ad":1,"aM":2,"a4":1,"aA":1}'))
var u=(function rtii(){var t=A.aF
return{Z:t("fY"),f:t("c<+(k,k)>"),C:t("c<+C,L,faces,pos(k,a,a,r)>"),s:t("c<i>"),b:t("c<@>"),t:t("c<a>"),T:t("af"),m:t("e"),g:t("K"),p:t("y<@>"),j:t("h<@>"),P:t("ap"),K:t("f"),L:t("h_"),F:t("+()"),Y:t("+C,L,faces,pos(k,a,a,r)"),H:t("G<i>"),N:t("i"),R:t("d"),o:t("ar"),O:t("a5<r>"),y:t("dv"),i:t("k"),S:t("a"),Q:t("cQ<ap>?"),X:t("f?"),v:t("i?"),u:t("dv?"),I:t("k?"),w:t("a?"),x:t("m?"),n:t("m")}})();(function constants(){var t=hunkHelpers.makeConstList
B.z=J.aP.prototype
B.c=J.c.prototype
B.a=J.ae.prototype
B.p=J.ag.prototype
B.q=J.a0.prototype
B.A=J.K.prototype
B.B=J.ah.prototype
B.F=A.ao.prototype
B.r=J.b2.prototype
B.d=J.ar.prototype
B.f=new A.bu()
B.h=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.t=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.y=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.u=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.x=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.w=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.v=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.i=function(hooks) { return hooks; }

B.b=new A.bB()
B.j=new A.J("U")
B.k=new A.J("D")
B.l=new A.J("L")
B.m=new A.J("R")
B.n=new A.J("F")
B.o=new A.J("B")
B.C=A.p(t([B.j,B.k,B.l,B.m,B.n,B.o]),A.aF("c<J>"))
B.D=A.p(t(["0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]),u.s)
B.G={"0":0,a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26}
B.E=new A.aN(B.G,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],A.aF("aN<i,a>"))
B.H=A.E("fV")
B.I=A.E("fW")
B.J=A.E("dW")
B.K=A.E("dX")
B.L=A.E("dY")
B.M=A.E("dZ")
B.N=A.E("e_")
B.O=A.E("f")
B.P=A.E("ef")
B.Q=A.E("eg")
B.R=A.E("eh")
B.S=A.E("ei")
B.e=new A.r(0,0,0)})();(function staticFields(){$.bR=null
$.Y=A.p([],A.aF("c<f>"))
$.cU=null
$.cM=null
$.cL=null
$.dz=null
$.dt=null
$.dC=null
$.bZ=null
$.c4=null
$.cD=null
$.bT=A.p([],A.aF("c<h<f>?>"))
$.d0=null
$.d1=null
$.d2=null
$.d3=null
$.cp=A.bN("_lastQuoRemDigits")
$.cq=A.bN("_lastQuoRemUsed")
$.at=A.bN("_lastRemUsed")
$.cr=A.bN("_lastRem_nsh")})();(function lazyInitializers(){var t=hunkHelpers.lazyFinal,s=hunkHelpers.lazy
t($,"fX","bi",()=>A.fy("_$dart_dartClosure"))
t($,"h6","v",()=>A.as(0))
t($,"h4","aI",()=>A.as(1))
t($,"h5","dL",()=>A.as(2))
t($,"h2","cH",()=>$.aI().B(0))
t($,"h0","cG",()=>A.as(1e4))
s($,"h3","dK",()=>A.eb("^\\s*([+-]?)((0x[a-f0-9]+)|(\\d+)|([a-z0-9]+))\\s*$",!1))
t($,"h1","dJ",()=>new Uint8Array(A.eW(8)))
t($,"h9","bj",()=>A.dA(B.O))
t($,"h8","cf",()=>{var r=A.cB()
return A.e7(r,!1,r.$ti.m("w.E"))})
t($,"h7","dM",()=>{var r,q,p=A.e4(A.aF("r"),u.S)
for(r=0;q=$.cf(),r<q.length;++r)p.a8(0,q[r],r)
return p})})();(function nativeSupport(){!function(){var t=function(a){var n={}
n[a]=1
return Object.keys(hunkHelpers.convertToFastObject(n))[0]}
v.getIsolateTag=function(a){return t("___dart_"+a+v.isolateTag)}
var s="___dart_isolate_tags_"
var r=Object[s]||(Object[s]=Object.create(null))
var q="_ZxYxX"
for(var p=0;;p++){var o=t(q+"_"+p+"_")
if(!(o in r)){r[o]=1
v.isolateTag=o
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.aU,ArrayBufferView:A.am,DataView:A.aV,Float32Array:A.aW,Float64Array:A.aX,Int16Array:A.aY,Int32Array:A.aZ,Int8Array:A.b_,Uint16Array:A.b0,Uint32Array:A.b1,Uint8ClampedArray:A.an,CanvasPixelArray:A.an,Uint8Array:A.ao})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.a4.$nativeSuperclassTag="ArrayBufferView"
A.au.$nativeSuperclassTag="ArrayBufferView"
A.av.$nativeSuperclassTag="ArrayBufferView"
A.ak.$nativeSuperclassTag="ArrayBufferView"
A.aw.$nativeSuperclassTag="ArrayBufferView"
A.ax.$nativeSuperclassTag="ArrayBufferView"
A.al.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$0=function(){return this()}
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var t=document.scripts
function onLoad(b){for(var r=0;r<t.length;++r){t[r].removeEventListener("load",onLoad,false)}a(b.target)}for(var s=0;s<t.length;++s){t[s].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var t=A.fI
if(typeof dartMainRunner==="function"){dartMainRunner(t,[])}else{t([])}})})()
//# sourceMappingURL=livnium_bridge.js.map
