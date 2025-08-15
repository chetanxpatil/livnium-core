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
if(a[b]!==t){A.hv(b)}a[b]=s}var r=a[b]
a[c]=function(){return r}
return r}}function makeConstList(a,b){if(b!=null)A.l(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var t=0;t<a.length;++t){convertToFastObject(a[t])}}var y=0
function instanceTearOffGetter(a,b){var t=null
return a?function(c){if(t===null)t=A.cJ(b)
return new t(c,this)}:function(){if(t===null)t=A.cJ(b)
return new t(this,null)}}function staticTearOffGetter(a){var t=null
return function(){if(t===null)t=A.cJ(a).prototype
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
cP(a,b,c,d){return{i:a,p:b,e:c,x:d}},
ca(a){var t,s,r,q,p,o=a[v.dispatchPropertyName]
if(o==null)if($.cN==null){A.he()
o=a[v.dispatchPropertyName]}if(o!=null){t=o.p
if(!1===t)return o.i
if(!0===t)return a
s=Object.getPrototypeOf(a)
if(t===s)return o.i
if(o.e===s)throw A.a(A.d9("Return interceptor for "+A.f(t(a,o))))}r=a.constructor
if(r==null)q=null
else{p=$.bX
if(p==null)p=$.bX=v.getIsolateTag("_$dart_js")
q=r[p]}if(q!=null)return q
q=A.hk(a)
if(q!=null)return q
if(typeof a=="function")return B.D
t=Object.getPrototypeOf(a)
if(t==null)return B.u
if(t===Object.prototype)return B.u
if(typeof r=="function"){p=$.bX
if(p==null)p=$.bX=v.getIsolateTag("_$dart_js")
Object.defineProperty(r,p,{value:B.f,enumerable:false,writable:true,configurable:true})
return B.f}return B.f},
d1(a,b){if(a<0||a>4294967295)throw A.a(A.b7(a,0,4294967295,"length",null))
return J.ef(new Array(a),b)},
d0(a,b){if(a<0)throw A.a(A.a3("Length must be a non-negative integer: "+a))
return A.l(new Array(a),b.i("e<0>"))},
ef(a,b){var t=A.l(a,b.i("e<0>"))
t.$flags=1
return t},
P(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.al.prototype
return J.b_.prototype}if(typeof a=="string")return J.a5.prototype
if(a==null)return J.am.prototype
if(typeof a=="boolean")return J.aZ.prototype
if(Array.isArray(a))return J.e.prototype
if(typeof a!="object"){if(typeof a=="function")return J.J.prototype
if(typeof a=="symbol")return J.a7.prototype
if(typeof a=="bigint")return J.a6.prototype
return a}if(a instanceof A.c)return a
return J.ca(a)},
dM(a){if(typeof a=="string")return J.a5.prototype
if(a==null)return a
if(Array.isArray(a))return J.e.prototype
if(typeof a!="object"){if(typeof a=="function")return J.J.prototype
if(typeof a=="symbol")return J.a7.prototype
if(typeof a=="bigint")return J.a6.prototype
return a}if(a instanceof A.c)return a
return J.ca(a)},
bi(a){if(a==null)return a
if(Array.isArray(a))return J.e.prototype
if(typeof a!="object"){if(typeof a=="function")return J.J.prototype
if(typeof a=="symbol")return J.a7.prototype
if(typeof a=="bigint")return J.a6.prototype
return a}if(a instanceof A.c)return a
return J.ca(a)},
h9(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.J.prototype
if(typeof a=="symbol")return J.a7.prototype
if(typeof a=="bigint")return J.a6.prototype
return a}if(a instanceof A.c)return a
return J.ca(a)},
bl(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.P(a).q(a,b)},
e1(a){return J.h9(a).a9(a)},
cp(a,b){return J.bi(a).A(a,b)},
A(a){return J.P(a).gj(a)},
cq(a){return J.bi(a).gD(a)},
e2(a){return J.dM(a).gk(a)},
e3(a){return J.P(a).gu(a)},
e4(a,b,c){return J.bi(a).ad(a,b,c)},
e5(a,b){return J.P(a).ae(a,b)},
aS(a){return J.P(a).h(a)},
aX:function aX(){},
aZ:function aZ(){},
am:function am(){},
ap:function ap(){},
L:function L(){},
b3:function b3(){},
az:function az(){},
J:function J(){},
a6:function a6(){},
a7:function a7(){},
e:function e(a){this.$ti=a},
aY:function aY(){},
by:function by(a){this.$ti=a},
aT:function aT(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
an:function an(){},
al:function al(){},
b_:function b_(){},
a5:function a5(){}},A={cs:function cs(){},
N(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
bK(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
fT(a,b,c){return a},
cO(a){var t,s
for(t=$.a1.length,s=0;s<t;++s)if(a===$.a1[s])return!0
return!1},
er(a,b,c,d){A.cu(b,"start")
A.cu(c,"end")
if(b>c)A.aP(A.b7(b,0,c,"start",null))
return new A.ay(a,b,c,d.i("ay<0>"))},
ed(){return new A.b8("No element")},
b0:function b0(a){this.a=a},
bH:function bH(){},
aj:function aj(){},
y:function y(){},
ay:function ay(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
a8:function a8(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
M:function M(a,b,c){this.a=a
this.b=b
this.$ti=c},
aW:function aW(){},
H:function H(a,b){this.a=a
this.$ti=b},
R:function R(a){this.a=a},
dW(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
hR(a,b){var t
if(b!=null){t=b.x
if(t!=null)return t}return u.p.b(a)},
f(a){var t
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
t=J.aS(a)
return t},
b4(a){var t,s=$.d5
if(s==null)s=$.d5=Symbol("identityHashCode")
t=a[s]
if(t==null){t=Math.random()*0x3fffffff|0
a[s]=t}return t},
b5(a){var t,s,r,q
if(a instanceof A.c)return A.z(A.a_(a),null)
t=J.P(a)
if(t===B.C||t===B.E||u.A.b(a)){s=B.i(a)
if(s!=="Object"&&s!=="")return s
r=a.constructor
if(typeof r=="function"){q=r.name
if(typeof q=="string"&&q!=="Object"&&q!=="")return q}}return A.z(A.a_(a),null)},
d6(a){var t,s,r
if(a==null||typeof a=="number"||A.cH(a))return J.aS(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.V)return a.h(0)
if(a instanceof A.aF)return a.a7(!0)
t=$.e0()
for(s=0;s<1;++s){r=t[s].aJ(a)
if(r!=null)return r}return"Instance of '"+A.b5(a)+"'"},
Q(a,b,c){var t,s,r={}
r.a=0
t=[]
s=[]
r.a=b.length
B.b.a8(t,b)
r.b=""
if(c!=null&&c.a!==0)c.G(0,new A.bF(r,s,t))
return J.e5(a,new A.bw(B.L,0,t,s,0))},
em(a,b,c){var t,s,r
if(Array.isArray(b))t=c==null||c.a===0
else t=!1
if(t){s=b.length
if(s===0){if(!!a.$0)return a.$0()}else if(s===1){if(!!a.$1)return a.$1(b[0])}else if(s===2){if(!!a.$2)return a.$2(b[0],b[1])}else if(s===3){if(!!a.$3)return a.$3(b[0],b[1],b[2])}else if(s===4){if(!!a.$4)return a.$4(b[0],b[1],b[2],b[3])}else if(s===5)if(!!a.$5)return a.$5(b[0],b[1],b[2],b[3],b[4])
r=a[""+"$"+s]
if(r!=null)return r.apply(a,b)}return A.el(a,b,c)},
el(a,b,c){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(Array.isArray(b))t=b
else t=A.a9(b,u.z)
s=t.length
r=a.$R
if(s<r)return A.Q(a,t,c)
q=a.$D
p=q==null
o=!p?q():null
n=J.P(a)
m=n.$C
if(typeof m=="string")m=n[m]
if(p){if(c!=null&&c.a!==0)return A.Q(a,t,c)
if(s===r)return m.apply(a,t)
return A.Q(a,t,c)}if(Array.isArray(o)){if(c!=null&&c.a!==0)return A.Q(a,t,c)
l=r+o.length
if(s>l)return A.Q(a,t,null)
if(s<l){k=o.slice(s-r)
if(t===b)t=A.a9(t,u.z)
B.b.a8(t,k)}return m.apply(a,t)}else{if(s>r)return A.Q(a,t,c)
if(t===b)t=A.a9(t,u.z)
j=Object.keys(o)
if(c==null)for(p=j.length,i=0;i<j.length;j.length===p||(0,A.aO)(j),++i){h=o[j[i]]
if(B.k===h)return A.Q(a,t,c)
B.b.W(t,h)}else{for(p=j.length,g=0,i=0;i<j.length;j.length===p||(0,A.aO)(j),++i){f=j[i]
if(c.X(f)){++g
B.b.W(t,c.l(0,f))}else{h=o[f]
if(B.k===h)return A.Q(a,t,c)
B.b.W(t,h)}}if(g!==c.a)return A.Q(a,t,c)}return m.apply(a,t)}},
dL(a,b){var t,s="index"
if(!A.dB(b))return new A.a2(!0,b,s,null)
t=J.e2(a)
if(b<0||b>=t)return A.cr(b,t,a,s)
return new A.b6(null,null,!0,b,s,"Value not in range")},
dI(a){return new A.a2(!0,a,null,null)},
a(a){return A.p(a,new Error())},
p(a,b){var t
if(a==null)a=new A.bM()
b.dartException=a
t=A.hx
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:t})
b.name=""}else b.toString=t
return b},
hx(){return J.aS(this.dartException)},
aP(a,b){throw A.p(a,b==null?new Error():b)},
h(a,b,c){var t
if(b==null)b=0
if(c==null)c=0
t=Error()
A.aP(A.f8(a,b,c),t)},
f8(a,b,c){var t,s,r,q,p,o,n,m,l
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
return new A.b9("'"+t+"': Cannot "+p+" "+m+l+o)},
aO(a){throw A.a(A.W(a))},
dO(a){if(a==null)return J.A(a)
if(typeof a=="object")return A.b4(a)
return J.A(a)},
h7(a,b){var t,s,r,q=a.length
for(t=0;t<q;t=r){s=t+1
r=s+1
b.E(0,a[t],a[s])}return b},
fh(a,b,c,d,e,f){switch(b){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.a(new A.bW("Unsupported number of arguments for wrapped closure"))},
fV(a,b){var t=a.$identity
if(!!t)return t
t=A.fW(a,b)
a.$identity=t
return t},
fW(a,b){var t
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.fh)},
ec(a1){var t,s,r,q,p,o,n,m,l,k,j=a1.co,i=a1.iS,h=a1.iI,g=a1.nDA,f=a1.aI,e=a1.fs,d=a1.cs,c=e[0],b=d[0],a=j[c],a0=a1.fT
a0.toString
t=i?Object.create(new A.bI().constructor.prototype):Object.create(new A.ag(null,null).constructor.prototype)
t.$initialize=t.constructor
s=i?function static_tear_off(){this.$initialize()}:function tear_off(a2,a3){this.$initialize(a2,a3)}
t.constructor=s
s.prototype=t
t.$_name=c
t.$_target=a
r=!i
if(r)q=A.cX(c,a,h,g)
else{t.$static_name=c
q=a}t.$S=A.e8(a0,i,h)
t[b]=q
for(p=q,o=1;o<e.length;++o){n=e[o]
if(typeof n=="string"){m=j[n]
l=n
n=m}else l=""
k=d[o]
if(k!=null){if(r)n=A.cX(l,n,h,g)
t[k]=n}if(o===f)p=n}t.$C=p
t.$R=a1.rC
t.$D=a1.dV
return s},
e8(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.a("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.e6)}throw A.a("Error in functionType of tearoff")},
e9(a,b,c,d){var t=A.cW
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,t)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,t)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,t)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,t)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,t)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,t)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,t)}},
cX(a,b,c,d){if(c)return A.eb(a,b,d)
return A.e9(b.length,d,a,b)},
ea(a,b,c,d){var t=A.cW,s=A.e7
switch(b?-1:a){case 0:throw A.a(new A.bG("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,s,t)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,s,t)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,s,t)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,s,t)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,s,t)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,s,t)
default:return function(e,f,g){return function(){var r=[g(this)]
Array.prototype.push.apply(r,arguments)
return e.apply(f(this),r)}}(d,s,t)}},
eb(a,b,c){var t,s
if($.cU==null)$.cU=A.cT("interceptor")
if($.cV==null)$.cV=A.cT("receiver")
t=b.length
s=A.ea(t,c,a,b)
return s},
cJ(a){return A.ec(a)},
e6(a,b){return A.aL(v.typeUniverse,A.a_(a.a),b)},
cW(a){return a.a},
e7(a){return a.b},
cT(a){var t,s,r,q=new A.ag("receiver","interceptor"),p=Object.getOwnPropertyNames(q)
p.$flags=1
t=p
for(p=t.length,s=0;s<p;++s){r=t[s]
if(q[r]===a)return r}throw A.a(A.a3("Field name "+a+" not found."))},
ha(a){return v.getIsolateTag(a)},
hk(a){var t,s,r,q,p,o=$.dN.$1(a),n=$.c9[o]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.ce[o]
if(t!=null)return t
s=v.interceptorsByTag[o]
if(s==null){r=$.dG.$2(a,o)
if(r!=null){n=$.c9[r]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.ce[r]
if(t!=null)return t
s=v.interceptorsByTag[r]
o=r}}if(s==null)return null
t=s.prototype
q=o[0]
if(q==="!"){n=A.cg(t)
$.c9[o]=n
Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}if(q==="~"){$.ce[o]=t
return t}if(q==="-"){p=A.cg(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}if(q==="+")return A.dP(a,t)
if(q==="*")throw A.a(A.d9(o))
if(v.leafTags[o]===true){p=A.cg(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}else return A.dP(a,t)},
dP(a,b){var t=Object.getPrototypeOf(a)
Object.defineProperty(t,v.dispatchPropertyName,{value:J.cP(b,t,null,null),enumerable:false,writable:true,configurable:true})
return b},
cg(a){return J.cP(a,!1,null,!!a.$iao)},
hm(a,b,c){var t=b.prototype
if(v.leafTags[a]===true)return A.cg(t)
else return J.cP(t,c,null,null)},
he(){if(!0===$.cN)return
$.cN=!0
A.hf()},
hf(){var t,s,r,q,p,o,n,m
$.c9=Object.create(null)
$.ce=Object.create(null)
A.hd()
t=v.interceptorsByTag
s=Object.getOwnPropertyNames(t)
if(typeof window!="undefined"){window
r=function(){}
for(q=0;q<s.length;++q){p=s[q]
o=$.dQ.$1(p)
if(o!=null){n=A.hm(p,t[p],o)
if(n!=null){Object.defineProperty(o,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
r.prototype=o}}}}for(q=0;q<s.length;++q){p=s[q]
if(/^[A-Za-z_]/.test(p)){m=t[p]
t["!"+p]=m
t["~"+p]=m
t["-"+p]=m
t["+"+p]=m
t["*"+p]=m}}},
hd(){var t,s,r,q,p,o,n=B.w()
n=A.ae(B.x,A.ae(B.y,A.ae(B.j,A.ae(B.j,A.ae(B.z,A.ae(B.A,A.ae(B.B(B.i),n)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){t=dartNativeDispatchHooksTransformer
if(typeof t=="function")t=[t]
if(Array.isArray(t))for(s=0;s<t.length;++s){r=t[s]
if(typeof r=="function")n=r(n)||n}}q=n.getTag
p=n.getUnknownTag
o=n.prototypeForTag
$.dN=new A.cb(q)
$.dG=new A.cc(p)
$.dQ=new A.cd(o)},
ae(a,b){return a(b)||b},
eH(a,b){var t
for(t=0;t<a.length;++t)if(!J.bl(a[t],b[t]))return!1
return!0},
fX(a,b){var t=b.length,s=v.rttc[""+t+";"+a]
if(s==null)return null
if(t===0)return s
if(t===s.length)return s.apply(null,b)
return s(b)},
eg(a,b,c,d,e,f){var t=b?"m":"",s=c?"":"i",r=d?"u":"",q=e?"s":"",p=function(g,h){try{return new RegExp(g,h)}catch(o){return o}}(a,t+s+r+q+f)
if(p instanceof RegExp)return p
throw A.a(A.cY("Illegal RegExp pattern ("+String(p)+")",a))},
be:function be(a,b){this.a=a
this.b=b},
aG:function aG(a,b){this.a=a
this.b=b},
bf:function bf(a){this.a=a},
ai:function ai(a,b){this.a=a
this.$ti=b},
ah:function ah(){},
X:function X(a,b,c){this.a=a
this.b=b
this.$ti=c},
bu:function bu(){},
ak:function ak(a,b){this.a=a
this.$ti=b},
bw:function bw(a,b,c,d,e){var _=this
_.a=a
_.c=b
_.d=c
_.e=d
_.f=e},
bF:function bF(a,b,c){this.a=a
this.b=b
this.c=c},
aw:function aw(){},
V:function V(){},
bn:function bn(){},
bo:function bo(){},
bL:function bL(){},
bI:function bI(){},
ag:function ag(a,b){this.a=a
this.b=b},
bG:function bG(a){this.a=a},
c_:function c_(){},
K:function K(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bz:function bz(a,b){this.a=a
this.b=b
this.c=null},
cb:function cb(a){this.a=a},
cc:function cc(a){this.a=a},
cd:function cd(a){this.a=a},
aF:function aF(){},
bc:function bc(){},
bd:function bd(){},
bx:function bx(a,b){var _=this
_.a=a
_.b=b
_.e=_.c=null},
bY:function bY(a){this.b=a},
hv(a){throw A.p(new A.b0("Field '"+a+"' has been assigned during initialization."),new Error())},
bT(a){var t=new A.bS(a)
return t.b=t},
bS:function bS(a){this.a=a
this.b=null},
f3(a){return a},
ej(a,b,c){var t=new DataView(a,b)
return t},
f4(a,b,c){if(a>>>0!==a||a>=c)throw A.a(A.dL(b,a))},
aa:function aa(){},
at:function at(){},
c2:function c2(a){this.a=a},
b1:function b1(){},
ab:function ab(){},
as:function as(){},
b2:function b2(){},
au:function au(){},
aD:function aD(){},
aE:function aE(){},
cv(a,b){var t=b.c
return t==null?b.c=A.aJ(a,"cZ",[b.x]):t},
d7(a){var t=a.w
if(t===6||t===7)return A.d7(a.x)
return t===11||t===12},
ep(a){return a.as},
ho(a,b){var t,s=b.length
for(t=0;t<s;++t)if(!a[t].b(b[t]))return!1
return!0},
U(a){return A.c1(v.typeUniverse,a,!1)},
hh(a,b){var t,s,r,q,p
if(a==null)return null
t=b.y
s=a.Q
if(s==null)s=a.Q=new Map()
r=b.as
q=s.get(r)
if(q!=null)return q
p=A.T(v.typeUniverse,a.x,t,0)
s.set(r,p)
return p},
T(a0,a1,a2,a3){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.w
switch(a){case 5:case 1:case 2:case 3:case 4:return a1
case 6:t=a1.x
s=A.T(a0,t,a2,a3)
if(s===t)return a1
return A.ds(a0,s,!0)
case 7:t=a1.x
s=A.T(a0,t,a2,a3)
if(s===t)return a1
return A.dr(a0,s,!0)
case 8:r=a1.y
q=A.ad(a0,r,a2,a3)
if(q===r)return a1
return A.aJ(a0,a1.x,q)
case 9:p=a1.x
o=A.T(a0,p,a2,a3)
n=a1.y
m=A.ad(a0,n,a2,a3)
if(o===p&&m===n)return a1
return A.cD(a0,o,m)
case 10:l=a1.x
k=a1.y
j=A.ad(a0,k,a2,a3)
if(j===k)return a1
return A.dt(a0,l,j)
case 11:i=a1.x
h=A.T(a0,i,a2,a3)
g=a1.y
f=A.fA(a0,g,a2,a3)
if(h===i&&f===g)return a1
return A.dq(a0,h,f)
case 12:e=a1.y
a3+=e.length
d=A.ad(a0,e,a2,a3)
p=a1.x
o=A.T(a0,p,a2,a3)
if(d===e&&o===p)return a1
return A.cE(a0,o,d,!0)
case 13:c=a1.x
if(c<a3)return a1
b=a2[c-a3]
if(b==null)return a1
return b
default:throw A.a(A.aU("Attempted to substitute unexpected RTI kind "+a))}},
ad(a,b,c,d){var t,s,r,q,p=b.length,o=A.c3(p)
for(t=!1,s=0;s<p;++s){r=b[s]
q=A.T(a,r,c,d)
if(q!==r)t=!0
o[s]=q}return t?o:b},
fB(a,b,c,d){var t,s,r,q,p,o,n=b.length,m=A.c3(n)
for(t=!1,s=0;s<n;s+=3){r=b[s]
q=b[s+1]
p=b[s+2]
o=A.T(a,p,c,d)
if(o!==p)t=!0
m.splice(s,3,r,q,o)}return t?m:b},
fA(a,b,c,d){var t,s=b.a,r=A.ad(a,s,c,d),q=b.b,p=A.ad(a,q,c,d),o=b.c,n=A.fB(a,o,c,d)
if(r===s&&p===q&&n===o)return b
t=new A.bb()
t.a=r
t.b=p
t.c=n
return t},
l(a,b){a[v.arrayRti]=b
return a},
c8(a){var t=a.$S
if(t!=null){if(typeof t=="number")return A.hc(t)
return a.$S()}return null},
hg(a,b){var t
if(A.d7(b))if(a instanceof A.V){t=A.c8(a)
if(t!=null)return t}return A.a_(a)},
a_(a){if(a instanceof A.c)return A.cF(a)
if(Array.isArray(a))return A.aN(a)
return A.cG(J.P(a))},
aN(a){var t=a[v.arrayRti],s=u.b
if(t==null)return s
if(t.constructor!==s.constructor)return s
return t},
cF(a){var t=a.$ti
return t!=null?t:A.cG(a)},
cG(a){var t=a.constructor,s=t.$ccache
if(s!=null)return s
return A.fg(a,t)},
fg(a,b){var t=a instanceof A.V?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,s=A.eP(v.typeUniverse,t.name)
b.$ccache=s
return s},
hc(a){var t,s=v.types,r=s[a]
if(typeof r=="string"){t=A.c1(v.typeUniverse,r,!1)
s[a]=t
return t}return r},
hb(a){return A.O(A.cF(a))},
cM(a){var t=A.c8(a)
return A.O(t==null?A.a_(a):t)},
cI(a){var t
if(a instanceof A.aF)return A.h5(a.$r,a.T())
t=a instanceof A.V?A.c8(a):null
if(t!=null)return t
if(u.R.b(a))return J.e3(a).a
if(Array.isArray(a))return A.aN(a)
return A.a_(a)},
O(a){var t=a.r
return t==null?a.r=new A.c0(a):t},
h5(a,b){var t,s,r=b,q=r.length
if(q===0)return u.F
t=A.aL(v.typeUniverse,A.cI(r[0]),"@<0>")
for(s=1;s<q;++s)t=A.du(v.typeUniverse,t,A.cI(r[s]))
return A.aL(v.typeUniverse,t,a)},
bj(a){return A.O(A.c1(v.typeUniverse,a,!1))},
ff(a){var t=this
t.b=A.fz(t)
return t.b(a)},
fz(a){var t,s,r,q
if(a===u.K)return A.fn
if(A.a0(a))return A.fr
t=a.w
if(t===6)return A.fd
if(t===1)return A.dD
if(t===7)return A.fi
s=A.fy(a)
if(s!=null)return s
if(t===8){r=a.x
if(a.y.every(A.a0)){a.f="$i"+r
if(r==="i")return A.fl
if(a===u.m)return A.fk
return A.fq}}else if(t===10){q=A.fX(a.x,a.y)
return q==null?A.dD:q}return A.fb},
fy(a){if(a.w===8){if(a===u.S)return A.dB
if(a===u.i||a===u.n)return A.fm
if(a===u.N)return A.fp
if(a===u.y)return A.cH}return null},
fe(a){var t=this,s=A.fa
if(A.a0(t))s=A.f1
else if(t===u.K)s=A.f_
else if(A.af(t)){s=A.fc
if(t===u.w)s=A.eW
else if(t===u.v)s=A.f0
else if(t===u.u)s=A.eS
else if(t===u.x)s=A.eZ
else if(t===u.I)s=A.eU
else if(t===u.D)s=A.eY}else if(t===u.S)s=A.eV
else if(t===u.N)s=A.dx
else if(t===u.y)s=A.eR
else if(t===u.n)s=A.Z
else if(t===u.i)s=A.eT
else if(t===u.m)s=A.eX
t.a=s
return t.a(a)},
fb(a){var t=this
if(a==null)return A.af(t)
return A.hi(v.typeUniverse,A.hg(a,t),t)},
fd(a){if(a==null)return!0
return this.x.b(a)},
fq(a){var t,s=this
if(a==null)return A.af(s)
t=s.f
if(a instanceof A.c)return!!a[t]
return!!J.P(a)[t]},
fl(a){var t,s=this
if(a==null)return A.af(s)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
t=s.f
if(a instanceof A.c)return!!a[t]
return!!J.P(a)[t]},
fk(a){var t=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.c)return!!a[t.f]
return!0}if(typeof a=="function")return!0
return!1},
dC(a){if(typeof a=="object"){if(a instanceof A.c)return u.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
fa(a){var t=this
if(a==null){if(A.af(t))return a}else if(t.b(a))return a
throw A.p(A.dy(a,t),new Error())},
fc(a){var t=this
if(a==null||t.b(a))return a
throw A.p(A.dy(a,t),new Error())},
dy(a,b){return new A.bg("TypeError: "+A.di(a,A.z(b,null)))},
di(a,b){return A.a4(a)+": type '"+A.z(A.cI(a),null)+"' is not a subtype of type '"+b+"'"},
B(a,b){return new A.bg("TypeError: "+A.di(a,b))},
fi(a){var t=this
return t.x.b(a)||A.cv(v.typeUniverse,t).b(a)},
fn(a){return a!=null},
f_(a){if(a!=null)return a
throw A.p(A.B(a,"Object"),new Error())},
fr(a){return!0},
f1(a){return a},
dD(a){return!1},
cH(a){return!0===a||!1===a},
eR(a){if(!0===a)return!0
if(!1===a)return!1
throw A.p(A.B(a,"bool"),new Error())},
eS(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.p(A.B(a,"bool?"),new Error())},
eT(a){if(typeof a=="number")return a
throw A.p(A.B(a,"double"),new Error())},
eU(a){if(typeof a=="number")return a
if(a==null)return a
throw A.p(A.B(a,"double?"),new Error())},
dB(a){return typeof a=="number"&&Math.floor(a)===a},
eV(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.p(A.B(a,"int"),new Error())},
eW(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.p(A.B(a,"int?"),new Error())},
fm(a){return typeof a=="number"},
Z(a){if(typeof a=="number")return a
throw A.p(A.B(a,"num"),new Error())},
eZ(a){if(typeof a=="number")return a
if(a==null)return a
throw A.p(A.B(a,"num?"),new Error())},
fp(a){return typeof a=="string"},
dx(a){if(typeof a=="string")return a
throw A.p(A.B(a,"String"),new Error())},
f0(a){if(typeof a=="string")return a
if(a==null)return a
throw A.p(A.B(a,"String?"),new Error())},
eX(a){if(A.dC(a))return a
throw A.p(A.B(a,"JSObject"),new Error())},
eY(a){if(a==null)return a
if(A.dC(a))return a
throw A.p(A.B(a,"JSObject?"),new Error())},
dE(a,b){var t,s,r
for(t="",s="",r=0;r<a.length;++r,s=", ")t+=s+A.z(a[r],b)
return t},
fx(a,b){var t,s,r,q,p,o,n=a.x,m=a.y
if(""===n)return"("+A.dE(m,b)+")"
t=m.length
s=n.split(",")
r=s.length-t
for(q="(",p="",o=0;o<t;++o,p=", "){q+=p
if(r===0)q+="{"
q+=A.z(m[o],b)
if(r>=0)q+=" "+s[r];++r}return q+"})"},
dz(a0,a1,a2){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=", ",a=null
if(a2!=null){t=a2.length
if(a1==null)a1=A.l([],u.s)
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
if(n===8){q=A.fD(a.x)
p=a.y
return p.length>0?q+("<"+A.dE(p,b)+">"):q}if(n===10)return A.fx(a,b)
if(n===11)return A.dz(a,b,null)
if(n===12)return A.dz(a.x,b,a.y)
if(n===13){o=a.x
return b[b.length-1-o]}return"?"},
fD(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
eQ(a,b){var t=a.tR[b]
for(;typeof t=="string";)t=a.tR[t]
return t},
eP(a,b){var t,s,r,q,p,o=a.eT,n=o[b]
if(n==null)return A.c1(a,b,!1)
else if(typeof n=="number"){t=n
s=A.aK(a,5,"#")
r=A.c3(t)
for(q=0;q<t;++q)r[q]=s
p=A.aJ(a,b,r)
o[b]=p
return p}else return n},
eO(a,b){return A.dv(a.tR,b)},
eN(a,b){return A.dv(a.eT,b)},
c1(a,b,c){var t,s=a.eC,r=s.get(b)
if(r!=null)return r
t=A.dm(A.dk(a,null,b,!1))
s.set(b,t)
return t},
aL(a,b,c){var t,s,r=b.z
if(r==null)r=b.z=new Map()
t=r.get(c)
if(t!=null)return t
s=A.dm(A.dk(a,b,c,!0))
r.set(c,s)
return s},
du(a,b,c){var t,s,r,q=b.Q
if(q==null)q=b.Q=new Map()
t=c.as
s=q.get(t)
if(s!=null)return s
r=A.cD(a,b,c.w===9?c.y:[c])
q.set(t,r)
return r},
S(a,b){b.a=A.fe
b.b=A.ff
return b},
aK(a,b,c){var t,s,r=a.eC.get(c)
if(r!=null)return r
t=new A.D(null,null)
t.w=b
t.as=c
s=A.S(a,t)
a.eC.set(c,s)
return s},
ds(a,b,c){var t,s=b.as+"?",r=a.eC.get(s)
if(r!=null)return r
t=A.eL(a,b,s,c)
a.eC.set(s,t)
return t},
eL(a,b,c,d){var t,s,r
if(d){t=b.w
s=!0
if(!A.a0(b))if(!(b===u.P||b===u.T))if(t!==6)s=t===7&&A.af(b.x)
if(s)return b
else if(t===1)return u.P}r=new A.D(null,null)
r.w=6
r.x=b
r.as=c
return A.S(a,r)},
dr(a,b,c){var t,s=b.as+"/",r=a.eC.get(s)
if(r!=null)return r
t=A.eJ(a,b,s,c)
a.eC.set(s,t)
return t},
eJ(a,b,c,d){var t,s
if(d){t=b.w
if(A.a0(b)||b===u.K)return b
else if(t===1)return A.aJ(a,"cZ",[b])
else if(b===u.P||b===u.T)return u.Q}s=new A.D(null,null)
s.w=7
s.x=b
s.as=c
return A.S(a,s)},
eM(a,b){var t,s,r=""+b+"^",q=a.eC.get(r)
if(q!=null)return q
t=new A.D(null,null)
t.w=13
t.x=b
t.as=r
s=A.S(a,t)
a.eC.set(r,s)
return s},
aI(a){var t,s,r,q=a.length
for(t="",s="",r=0;r<q;++r,s=",")t+=s+a[r].as
return t},
eI(a){var t,s,r,q,p,o=a.length
for(t="",s="",r=0;r<o;r+=3,s=","){q=a[r]
p=a[r+1]?"!":":"
t+=s+q+p+a[r+2].as}return t},
aJ(a,b,c){var t,s,r,q=b
if(c.length>0)q+="<"+A.aI(c)+">"
t=a.eC.get(q)
if(t!=null)return t
s=new A.D(null,null)
s.w=8
s.x=b
s.y=c
if(c.length>0)s.c=c[0]
s.as=q
r=A.S(a,s)
a.eC.set(q,r)
return r},
cD(a,b,c){var t,s,r,q,p,o
if(b.w===9){t=b.x
s=b.y.concat(c)}else{s=c
t=b}r=t.as+(";<"+A.aI(s)+">")
q=a.eC.get(r)
if(q!=null)return q
p=new A.D(null,null)
p.w=9
p.x=t
p.y=s
p.as=r
o=A.S(a,p)
a.eC.set(r,o)
return o},
dt(a,b,c){var t,s,r="+"+(b+"("+A.aI(c)+")"),q=a.eC.get(r)
if(q!=null)return q
t=new A.D(null,null)
t.w=10
t.x=b
t.y=c
t.as=r
s=A.S(a,t)
a.eC.set(r,s)
return s},
dq(a,b,c){var t,s,r,q,p,o=b.as,n=c.a,m=n.length,l=c.b,k=l.length,j=c.c,i=j.length,h="("+A.aI(n)
if(k>0){t=m>0?",":""
h+=t+"["+A.aI(l)+"]"}if(i>0){t=m>0?",":""
h+=t+"{"+A.eI(j)+"}"}s=o+(h+")")
r=a.eC.get(s)
if(r!=null)return r
q=new A.D(null,null)
q.w=11
q.x=b
q.y=c
q.as=s
p=A.S(a,q)
a.eC.set(s,p)
return p},
cE(a,b,c,d){var t,s=b.as+("<"+A.aI(c)+">"),r=a.eC.get(s)
if(r!=null)return r
t=A.eK(a,b,c,s,d)
a.eC.set(s,t)
return t},
eK(a,b,c,d,e){var t,s,r,q,p,o,n,m
if(e){t=c.length
s=A.c3(t)
for(r=0,q=0;q<t;++q){p=c[q]
if(p.w===1){s[q]=p;++r}}if(r>0){o=A.T(a,b,s,0)
n=A.ad(a,c,s,0)
return A.cE(a,o,n,c!==n)}}m=new A.D(null,null)
m.w=12
m.x=b
m.y=c
m.as=d
return A.S(a,m)},
dk(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
dm(a){var t,s,r,q,p,o,n,m=a.r,l=a.s
for(t=m.length,s=0;s<t;){r=m.charCodeAt(s)
if(r>=48&&r<=57)s=A.eC(s+1,r,m,l)
else if((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124)s=A.dl(a,s,m,l,!1)
else if(r===46)s=A.dl(a,s,m,l,!0)
else{++s
switch(r){case 44:break
case 58:l.push(!1)
break
case 33:l.push(!0)
break
case 59:l.push(A.Y(a.u,a.e,l.pop()))
break
case 94:l.push(A.eM(a.u,l.pop()))
break
case 35:l.push(A.aK(a.u,5,"#"))
break
case 64:l.push(A.aK(a.u,2,"@"))
break
case 126:l.push(A.aK(a.u,3,"~"))
break
case 60:l.push(a.p)
a.p=l.length
break
case 62:A.eE(a,l)
break
case 38:A.eD(a,l)
break
case 63:q=a.u
l.push(A.ds(q,A.Y(q,a.e,l.pop()),a.n))
break
case 47:q=a.u
l.push(A.dr(q,A.Y(q,a.e,l.pop()),a.n))
break
case 40:l.push(-3)
l.push(a.p)
a.p=l.length
break
case 41:A.eB(a,l)
break
case 91:l.push(a.p)
a.p=l.length
break
case 93:p=l.splice(a.p)
A.dn(a.u,a.e,p)
a.p=l.pop()
l.push(p)
l.push(-1)
break
case 123:l.push(a.p)
a.p=l.length
break
case 125:p=l.splice(a.p)
A.eG(a.u,a.e,p)
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
return A.Y(a.u,a.e,n)},
eC(a,b,c,d){var t,s,r=b-48
for(t=c.length;a<t;++a){s=c.charCodeAt(a)
if(!(s>=48&&s<=57))break
r=r*10+(s-48)}d.push(r)
return a},
dl(a,b,c,d,e){var t,s,r,q,p,o,n=b+1
for(t=c.length;n<t;++n){s=c.charCodeAt(n)
if(s===46){if(e)break
e=!0}else{if(!((((s|32)>>>0)-97&65535)<26||s===95||s===36||s===124))r=s>=48&&s<=57
else r=!0
if(!r)break}}q=c.substring(b,n)
if(e){t=a.u
p=a.e
if(p.w===9)p=p.x
o=A.eQ(t,p.x)[q]
if(o==null)A.aP('No "'+q+'" in "'+A.ep(p)+'"')
d.push(A.aL(t,p,o))}else d.push(q)
return n},
eE(a,b){var t,s=a.u,r=A.dj(a,b),q=b.pop()
if(typeof q=="string")b.push(A.aJ(s,q,r))
else{t=A.Y(s,a.e,q)
switch(t.w){case 11:b.push(A.cE(s,t,r,a.n))
break
default:b.push(A.cD(s,t,r))
break}}},
eB(a,b){var t,s,r,q=a.u,p=b.pop(),o=null,n=null
if(typeof p=="number")switch(p){case-1:o=b.pop()
break
case-2:n=b.pop()
break
default:b.push(p)
break}else b.push(p)
t=A.dj(a,b)
p=b.pop()
switch(p){case-3:p=b.pop()
if(o==null)o=q.sEA
if(n==null)n=q.sEA
s=A.Y(q,a.e,p)
r=new A.bb()
r.a=t
r.b=o
r.c=n
b.push(A.dq(q,s,r))
return
case-4:b.push(A.dt(q,b.pop(),t))
return
default:throw A.a(A.aU("Unexpected state under `()`: "+A.f(p)))}},
eD(a,b){var t=b.pop()
if(0===t){b.push(A.aK(a.u,1,"0&"))
return}if(1===t){b.push(A.aK(a.u,4,"1&"))
return}throw A.a(A.aU("Unexpected extended operation "+A.f(t)))},
dj(a,b){var t=b.splice(a.p)
A.dn(a.u,a.e,t)
a.p=b.pop()
return t},
Y(a,b,c){if(typeof c=="string")return A.aJ(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.eF(a,b,c)}else return c},
dn(a,b,c){var t,s=c.length
for(t=0;t<s;++t)c[t]=A.Y(a,b,c[t])},
eG(a,b,c){var t,s=c.length
for(t=2;t<s;t+=3)c[t]=A.Y(a,b,c[t])},
eF(a,b,c){var t,s,r=b.w
if(r===9){if(c===0)return b.x
t=b.y
s=t.length
if(c<=s)return t[c-1]
c-=s
b=b.x
r=b.w}else if(c===0)return b
if(r!==8)throw A.a(A.aU("Indexed base must be an interface type"))
t=b.y
if(c<=t.length)return t[c-1]
throw A.a(A.aU("Bad index "+c+" for "+b.h(0)))},
hi(a,b,c){var t,s=b.d
if(s==null)s=b.d=new Map()
t=s.get(c)
if(t==null){t=A.j(a,b,null,c,null)
s.set(c,t)}return t},
j(a,b,c,d,e){var t,s,r,q,p,o,n,m,l,k,j
if(b===d)return!0
if(A.a0(d))return!0
t=b.w
if(t===4)return!0
if(A.a0(b))return!1
if(b.w===1)return!0
s=t===13
if(s)if(A.j(a,c[b.x],c,d,e))return!0
r=d.w
q=u.P
if(b===q||b===u.T){if(r===7)return A.j(a,b,c,d.x,e)
return d===q||d===u.T||r===6}if(d===u.K){if(t===7)return A.j(a,b.x,c,d,e)
return t!==6}if(t===7){if(!A.j(a,b.x,c,d,e))return!1
return A.j(a,A.cv(a,b),c,d,e)}if(t===6)return A.j(a,q,c,d,e)&&A.j(a,b.x,c,d,e)
if(r===7){if(A.j(a,b,c,d.x,e))return!0
return A.j(a,b,c,A.cv(a,d),e)}if(r===6)return A.j(a,b,c,q,e)||A.j(a,b,c,d.x,e)
if(s)return!1
q=t!==11
if((!q||t===12)&&d===u._)return!0
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
if(!A.j(a,k,c,j,e)||!A.j(a,j,e,k,c))return!1}return A.dA(a,b.x,c,d.x,e)}if(r===11){if(b===u.g)return!0
if(q)return!1
return A.dA(a,b,c,d,e)}if(t===8){if(r!==8)return!1
return A.fj(a,b,c,d,e)}if(p&&r===10)return A.fo(a,b,c,d,e)
return!1},
dA(a2,a3,a4,a5,a6){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(!A.j(a2,a3.x,a4,a5.x,a6))return!1
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
if(!A.j(a2,q[i],a6,h,a4))return!1}for(i=0;i<n;++i){h=m[i]
if(!A.j(a2,q[p+i],a6,h,a4))return!1}for(i=0;i<j;++i){h=m[n+i]
if(!A.j(a2,l[i],a6,h,a4))return!1}g=t.c
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
if(!A.j(a2,f[b+2],a6,h,a4))return!1
break}}for(;c<e;){if(g[c+1])return!1
c+=3}return!0},
fj(a,b,c,d,e){var t,s,r,q,p,o=b.x,n=d.x
for(;o!==n;){t=a.tR[o]
if(t==null)return!1
if(typeof t=="string"){o=t
continue}s=t[n]
if(s==null)return!1
r=s.length
q=r>0?new Array(r):v.typeUniverse.sEA
for(p=0;p<r;++p)q[p]=A.aL(a,b,s[p])
return A.dw(a,q,null,c,d.y,e)}return A.dw(a,b.y,null,c,d.y,e)},
dw(a,b,c,d,e,f){var t,s=b.length
for(t=0;t<s;++t)if(!A.j(a,b[t],d,e[t],f))return!1
return!0},
fo(a,b,c,d,e){var t,s=b.y,r=d.y,q=s.length
if(q!==r.length)return!1
if(b.x!==d.x)return!1
for(t=0;t<q;++t)if(!A.j(a,s[t],c,r[t],e))return!1
return!0},
af(a){var t=a.w,s=!0
if(!(a===u.P||a===u.T))if(!A.a0(a))if(t!==6)s=t===7&&A.af(a.x)
return s},
a0(a){var t=a.w
return t===2||t===3||t===4||t===5||a===u.X},
dv(a,b){var t,s,r=Object.keys(b),q=r.length
for(t=0;t<q;++t){s=r[t]
a[s]=b[s]}},
c3(a){return a>0?new Array(a):v.typeUniverse.sEA},
D:function D(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
bb:function bb(){this.c=this.b=this.a=null},
c0:function c0(a){this.a=a},
bV:function bV(){},
bg:function bg(a){this.a=a},
dp(a,b,c){return 0},
aH:function aH(a){var _=this
_.a=a
_.e=_.d=_.c=_.b=null},
ac:function ac(a,b){this.a=a
this.$ti=b},
ct(a,b,c){return A.h7(a,new A.K(b.i("@<0>").M(c).i("K<1,2>")))},
eh(a,b){return new A.K(a.i("@<0>").M(b).i("K<1,2>"))},
bA(a){var t,s
if(A.cO(a))return"{...}"
t=new A.ax("")
try{s={}
$.a1.push(a)
t.a+="{"
s.a=!0
a.G(0,new A.bB(s,t))
t.a+="}"}finally{$.a1.pop()}s=t.a
return s.charCodeAt(0)==0?s:s},
G:function G(){},
aq:function aq(){},
bB:function bB(a,b){this.a=a
this.b=b},
bh:function bh(){},
ar:function ar(){},
aA:function aA(){},
aM:function aM(){},
ex(a,b){var t,s,r=$.t(),q=a.length,p=4-q%4
if(p===4)p=0
for(t=0,s=0;s<q;++s){t=t*10+a.charCodeAt(s)-48;++p
if(p===4){r=r.a_(0,$.cR()).O(0,A.aB(t))
t=0
p=0}}if(b)return r.B(0)
return r},
da(a){if(48<=a&&a<=57)return a-48
return(a|32)-97+10},
ey(a,b,c){var t,s,r,q,p,o,n,m=a.length,l=m-b,k=B.d.az(l/4),j=new Uint16Array(k),i=k-1,h=l-i*4
for(t=b,s=0,r=0;r<h;++r,t=q){q=t+1
p=A.da(a.charCodeAt(t))
if(p>=16)return null
s=s*16+p}o=i-1
j[i]=s
for(;t<m;o=n){for(s=0,r=0;r<4;++r,t=q){q=t+1
p=A.da(a.charCodeAt(t))
if(p>=16)return null
s=s*16+p}n=o-1
j[o]=s}if(k===1&&j[0]===0)return $.t()
m=A.v(k,j)
return new A.k(m===0?!1:c,j,m)},
eA(a,b){var t,s,r,q,p
if(a==="")return null
t=$.dY().aB(a)
if(t==null)return null
s=t.b
r=s[1]==="-"
q=s[4]
p=s[3]
if(q!=null)return A.ex(q,r)
if(p!=null)return A.ey(p,2,r)
return null},
v(a,b){while(!0){if(!(a>0&&b[a-1]===0))break;--a}return a},
cB(a,b,c,d){var t,s=new Uint16Array(d),r=c-b
for(t=0;t<r;++t)s[t]=a[b+t]
return s},
cx(a){var t
if(a===0)return $.t()
if(a===1)return $.aR()
if(a===2)return $.dZ()
if(Math.abs(a)<4294967296)return A.aB(B.a.N(a))
t=A.eu(a)
return t},
aB(a){var t,s,r,q,p=a<0
if(p){if(a===-9223372036854776e3){t=new Uint16Array(4)
t[3]=32768
s=A.v(4,t)
return new A.k(s!==0,t,s)}a=-a}if(a<65536){t=new Uint16Array(1)
t[0]=a
s=A.v(1,t)
return new A.k(s===0?!1:p,t,s)}if(a<=4294967295){t=new Uint16Array(2)
t[0]=a&65535
t[1]=B.a.I(a,16)
s=A.v(2,t)
return new A.k(s===0?!1:p,t,s)}s=B.a.n(B.a.gaa(a)-1,16)+1
t=new Uint16Array(s)
for(r=0;a!==0;r=q){q=r+1
t[r]=a&65535
a=B.a.n(a,65536)}s=A.v(s,t)
return new A.k(s===0?!1:p,t,s)},
eu(a){var t,s,r,q,p,o,n,m
if(isNaN(a)||a==1/0||a==-1/0)throw A.a(A.a3("Value must be finite: "+a))
a=Math.floor(a)
if(a===0)return $.t()
t=$.dX()
for(s=t.$flags|0,r=0;r<8;++r){s&2&&A.h(t)
t[r]=0}s=J.e1(B.I.gaw(t))
s.$flags&2&&A.h(s,13)
s.setFloat64(0,a,!0)
s=t[7]
q=t[6]
p=(s<<4>>>0)+(q>>>4)-1075
o=new Uint16Array(4)
o[0]=(t[1]<<8>>>0)+t[0]
o[1]=(t[3]<<8>>>0)+t[2]
o[2]=(t[5]<<8>>>0)+t[4]
o[3]=q&15|16
n=new A.k(!1,o,4)
if(p<0)m=n.F(0,-p)
else m=p>0?n.C(0,p):n
return m},
cC(a,b,c,d){var t,s,r
if(b===0)return 0
if(c===0&&d===a)return b
for(t=b-1,s=d.$flags|0;t>=0;--t){r=a[t]
s&2&&A.h(d)
d[t+c]=r}for(t=c-1;t>=0;--t){s&2&&A.h(d)
d[t]=0}return b+c},
dg(a,b,c,d){var t,s,r,q,p,o=B.a.n(c,16),n=B.a.v(c,16),m=16-n,l=B.a.C(1,m)-1
for(t=b-1,s=d.$flags|0,r=0;t>=0;--t){q=a[t]
p=B.a.F(q,m)
s&2&&A.h(d)
d[t+o+1]=(p|r)>>>0
r=B.a.C((q&l)>>>0,n)}s&2&&A.h(d)
d[o]=r},
db(a,b,c,d){var t,s,r,q,p=B.a.n(c,16)
if(B.a.v(c,16)===0)return A.cC(a,b,p,d)
t=b+p+1
A.dg(a,b,c,d)
for(s=d.$flags|0,r=p;--r,r>=0;){s&2&&A.h(d)
d[r]=0}q=t-1
return d[q]===0?q:t},
ez(a,b,c,d){var t,s,r,q,p=B.a.n(c,16),o=B.a.v(c,16),n=16-o,m=B.a.C(1,o)-1,l=B.a.F(a[p],o),k=b-p-1
for(t=d.$flags|0,s=0;s<k;++s){r=a[s+p+1]
q=B.a.C((r&m)>>>0,n)
t&2&&A.h(d)
d[s]=(q|l)>>>0
l=B.a.F(r,o)}t&2&&A.h(d)
d[k]=l},
bP(a,b,c,d){var t,s=b-d
if(s===0)for(t=b-1;t>=0;--t){s=a[t]-c[t]
if(s!==0)return s}return s},
ev(a,b,c,d,e){var t,s,r
for(t=e.$flags|0,s=0,r=0;r<d;++r){s+=a[r]+c[r]
t&2&&A.h(e)
e[r]=s&65535
s=B.a.I(s,16)}for(r=d;r<b;++r){s+=a[r]
t&2&&A.h(e)
e[r]=s&65535
s=B.a.I(s,16)}t&2&&A.h(e)
e[b]=s},
ba(a,b,c,d,e){var t,s,r
for(t=e.$flags|0,s=0,r=0;r<d;++r){s+=a[r]-c[r]
t&2&&A.h(e)
e[r]=s&65535
s=0-(B.a.I(s,16)&1)}for(r=d;r<b;++r){s+=a[r]
t&2&&A.h(e)
e[r]=s&65535
s=0-(B.a.I(s,16)&1)}},
dh(a,b,c,d,e,f){var t,s,r,q,p,o
if(a===0)return
for(t=d.$flags|0,s=0;--f,f>=0;e=p,c=r){r=c+1
q=a*b[c]+d[e]+s
p=e+1
t&2&&A.h(d)
d[e]=q&65535
s=B.a.n(q,65536)}for(;s!==0;e=p){o=d[e]+s
p=e+1
t&2&&A.h(d)
d[e]=o&65535
s=B.a.n(o,65536)}},
ew(a,b,c){var t,s=b[c]
if(s===a)return 65535
t=B.a.ai((s<<16|b[c-1])>>>0,a)
if(t>65535)return 65535
return t},
d2(a,b,c,d){var t,s=J.d1(a,d)
if(a!==0&&b!=null)for(t=0;t<a;++t)s[t]=b
return s},
d3(a,b,c){var t,s,r=A.l([],c.i("e<0>"))
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.aO)(a),++s)r.push(a[s])
if(b)return r
r.$flags=1
return r},
ei(a,b,c){var t
if(b)t=A.a9(a,c)
else{t=A.a9(a,c)
t.$flags=1
t=t}return t},
a9(a,b){var t,s
if(Array.isArray(a))return A.l(a.slice(0),b.i("e<0>"))
t=A.l([],b.i("e<0>"))
for(s=J.cq(a);s.m();)t.push(s.gp())
return t},
eo(a,b){return new A.bx(a,A.eg(a,!1,!1,!1,!1,""))},
d8(a,b,c){var t=J.cq(b)
if(!t.m())return a
if(c.length===0){do a+=A.f(t.gp())
while(t.m())}else{a+=A.f(t.gp())
for(;t.m();)a=a+c+A.f(t.gp())}return a},
d4(a,b){return new A.bC(a,b.gaF(),b.gaH(),b.gaG())},
a4(a){if(typeof a=="number"||A.cH(a)||a==null)return J.aS(a)
if(typeof a=="string")return JSON.stringify(a)
return A.d6(a)},
aU(a){return new A.bm(a)},
a3(a){return new A.a2(!1,null,null,a)},
b7(a,b,c,d,e){return new A.b6(b,c,!0,a,d,"Invalid value")},
en(a,b,c){if(0>a||a>c)throw A.a(A.b7(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.a(A.b7(b,a,c,"end",null))
return b}return c},
cu(a,b){if(a<0)throw A.a(A.b7(a,0,null,b,null))
return a},
cr(a,b,c,d){return new A.bt(b,!0,a,d,"Index out of range")},
cw(a){return new A.b9(a)},
d9(a){return new A.bN(a)},
eq(a){return new A.b8(a)},
W(a){return new A.bp(a)},
cY(a,b){return new A.bs(a,b)},
ee(a,b,c){var t,s
if(A.cO(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}t=A.l([],u.s)
$.a1.push(a)
try{A.fs(a,t)}finally{$.a1.pop()}s=A.d8(b,t,", ")+c
return s.charCodeAt(0)==0?s:s},
d_(a,b,c){var t,s
if(A.cO(a))return b+"..."+c
t=new A.ax(b)
$.a1.push(a)
try{s=t
s.a=A.d8(s.a,a,", ")}finally{$.a1.pop()}t.a+=c
s=t.a
return s.charCodeAt(0)==0?s:s},
fs(a,b){var t,s,r,q,p,o,n,m=a.gD(a),l=0,k=0
while(!0){if(!(l<80||k<3))break
if(!m.m())return
t=A.f(m.gp())
b.push(t)
l+=t.length+2;++k}if(!m.m()){if(k<=5)return
s=b.pop()
r=b.pop()}else{q=m.gp();++k
if(!m.m()){if(k<=4){b.push(A.f(q))
return}s=A.f(q)
r=b.pop()
l+=s.length+2}else{p=m.gp();++k
for(;m.m();q=p,p=o){o=m.gp();++k
if(k>100){while(!0){if(!(l>75&&k>3))break
l-=b.pop().length+2;--k}b.push("...")
return}}r=A.f(q)
s=A.f(p)
l+=s.length+r.length+4}}if(k>b.length+2){l+=5
n="..."}else n=null
while(!0){if(!(l>80&&b.length>3))break
l-=b.pop().length+2
if(n==null){l+=5
n="..."}}if(n!=null)b.push(n)
b.push(r)
b.push(s)},
bE(a,b,c,d){var t
if(B.c===c){t=J.A(a)
b=J.A(b)
return A.bK(A.N(A.N($.bk(),t),b))}if(B.c===d){t=J.A(a)
b=J.A(b)
c=J.A(c)
return A.bK(A.N(A.N(A.N($.bk(),t),b),c))}t=J.A(a)
b=J.A(b)
c=J.A(c)
d=J.A(d)
d=A.bK(A.N(A.N(A.N(A.N($.bk(),t),b),c),d))
return d},
ek(a){var t,s,r=$.bk()
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.aO)(a),++s)r=A.N(r,J.A(a[s]))
return A.bK(r)},
k:function k(a,b,c){this.a=a
this.b=b
this.c=c},
bQ:function bQ(){},
bR:function bR(){},
bD:function bD(a,b){this.a=a
this.b=b},
bU:function bU(){},
bq:function bq(){},
bm:function bm(a){this.a=a},
bM:function bM(){},
a2:function a2(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b6:function b6(a,b,c,d,e,f){var _=this
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
bC:function bC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b9:function b9(a){this.a=a},
bN:function bN(a){this.a=a},
b8:function b8(a){this.a=a},
bp:function bp(a){this.a=a},
bW:function bW(a){this.a=a},
bs:function bs(a,b){this.a=a
this.b=b},
bv:function bv(){},
u:function u(){},
av:function av(){},
c:function c(){},
ax:function ax(a){this.a=a},
E(a){return B.b.aA(A.l(a.split(""),u.s),new A.c7())},
o(a){var t=a.length-1,s=0
while(!0){if(!(s<t&&a.charCodeAt(s)===48))break;++s}return B.e.ag(a,s)},
hw(a){var t,s,r,q,p
if(!A.E(a))return null
if(a.length===0)return $.t()
t=$.t()
for(s=a.split(""),r=s.length,q=0;q<r;++q){p=A.F(s[q])
p.toString
t=t.a_(0,A.cx(27)).O(0,A.cx(p))}return t},
h8(a){var t,s,r,q,p,o,n,m,l
if(a.a)return null
t=$.t()
s=a.J(0,t)
if(s===0)return"0"
r=A.cx(27)
q=A.l([],u.t)
for(s=r.c===0,p=r.a,o=a;o.J(0,t)>0;){if(s)A.aP(B.h)
n=o.a4(r)
if(n.a)n=p?n.K(0,r):n.O(0,r)
q.push(n.N(0))
o=o.a2(r)}for(m=q.length-1,t="";m>=0;--m){l=A.aQ(q[m])
if(l==null)return null
t+=l}return A.o(t.charCodeAt(0)==0?t:t)},
dF(a,b){var t,s,r,q,p,o,n,m,l,k,j,i
if(!A.E(a)||!A.E(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.o(b).length===0?"0":A.o(b)
s=b.length
if(s===0)return A.o(a).length===0?"0":A.o(a)
r=t-1
q=s-1
p=0
t=""
while(!0){s=r>=0
if(!(s||q>=0||p!==0))break
if(s){o=r-1
s=A.F(a[r])
s.toString
n=s
r=o}else n=0
if(q>=0){m=q-1
s=A.F(b[q])
s.toString
l=s
q=m}else l=0
k=n+l+p
p=B.a.n(k,27)
j=A.aQ(B.a.v(k,27))
if(j==null)return null
t+=j}i=A.o(new A.H(A.l((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).H(0))
return i.length===0?"0":i},
fE(a,b){var t,s,r,q,p,o,n,m,l,k,j,i
if(!A.E(a)||!A.E(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.o(b).length===0?"0":A.o(b)
s=b.length
if(s===0)return A.o(a).length===0?"0":A.o(a)
r=t-1
q=s-1
p=0
t=""
while(!0){s=r>=0
if(!(s||q>=0||p!==0))break
if(s){o=r-1
s=A.F(a[r])
s.toString
n=s
r=o}else n=0
if(q>=0){m=q-1
s=A.F(b[q])
s.toString
l=s
q=m}else l=0
k=n+l+p-13
if(k>13){k-=27
p=1}else if(k<-13){k+=27
p=-1}else p=0
j=A.aQ(k+13)
if(j==null)return null
t+=j}i=A.o(new A.H(A.l((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).H(0))
return i.length===0?"0":i},
fG(a,b){var t,s,r,q,p,o,n,m,l,k
if(!A.E(a)||!A.E(b))return null
t=a.length
s=t===0
if(s&&b.length===0)return"0"
if(s)return A.o(b).length===0?"0":A.o(b)
s=b.length
if(s===0)return A.o(a).length===0?"0":A.o(a)
r=t-1
q=s-1
t=""
while(!0){s=r>=0
if(!(s||q>=0))break
if(s){p=r-1
s=A.F(a[r])
s.toString
o=s
r=p}else o=0
if(q>=0){n=q-1
s=A.F(b[q])
s.toString
m=s
q=n}else m=0
l=A.aQ(B.a.v(o+m,27))
if(l==null)return null
t+=l}k=A.o(new A.H(A.l((t.charCodeAt(0)==0?t:t).split(""),u.s),u.H).H(0))
return k.length===0?"0":k},
fF(a,b,a0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
if(!A.E(a)||!A.E(b)||!A.E(a0))return null
t=a.length
if(t===0&&b.length===0&&a0.length===0)return new A.aG("0","0")
s=t-1
r=b.length-1
q=a0.length-1
t=""
p=""
while(!0){o=s>=0
if(!(o||r>=0||q>=0))break
if(o){n=s-1
o=A.F(a[s])
o.toString
m=o
s=n}else m=0
if(r>=0){l=r-1
o=A.F(b[r])
o.toString
k=o
r=l}else k=0
if(q>=0){j=q-1
o=A.F(a0[q])
o.toString
i=o
q=j}else i=0
h=m+k+i
g=B.a.v(h,27)
f=B.a.n(h,27)
o=A.aQ(g)
o.toString
o=t+o
t=A.aQ(f)
t.toString
t=p+t
p=t
t=o}o=u.s
e=u.H
d=A.o(new A.H(A.l((t.charCodeAt(0)==0?t:t).split(""),o),e).H(0))
c=A.o(new A.H(A.l((p.charCodeAt(0)==0?p:p).split(""),o),e).H(0))
t=d.length===0?"0":d
return new A.aG(c.length===0?"0":c,t)},
fY(a,b){if(!A.E(a)||!A.E(b))return null
if(a.length===0&&b.length===0)return"0"
return A.dF(a,b+"0")},
c7:function c7(){},
dK(a,b){var t,s,r=A.h6(a)
if(r<=0)return 0
t=Math.pow(A.hj(a),b.b)
s=t===0?1:t
return b.a*(10.125/r)/s},
hr(a,b){var t,s,r,q,p,o,n,m,l,k=A.l([],u.C)
for(t=new A.aH(A.cK().a());t.m();){s=t.b
if(s.a===0&&s.b===0&&s.c===0)continue
r=s.a
q=r!==0?1:0
p=s.b
o=p!==0?1:0
n=s.c
m=n!==0?1:0
l=q+o+m
if(l<=0)continue
k.push(new A.bf([A.dK(s,a),Math.abs(r)+Math.abs(p)+Math.abs(n),l,s]))}B.b.af(k,new A.cn())
return A.er(k,0,A.fT(b,"count",u.S),u.Y).aI(0,!1)},
fU(a){var t,s,r,q,p,o,n
for(t=a.length,s=0,r=0,q=0;q<a.length;a.length===t||(0,A.aO)(a),++q){p=a[q]
o=p.b*3.141592653589793/180
n=p.a
s+=n*Math.cos(o)
r+=n*Math.sin(o)}return Math.sqrt(s*s+r*r)},
aV:function aV(a,b){this.a=a
this.b=b},
cn:function cn(){},
hq(a){var t,s,r,q,p,o,n,m,l=$.co().length,k=J.d0(l,u.S)
for(t=0;t<l;++t)k[t]=t
s=B.a.v(B.a.v(a.b,4)+4,4)
if(s===0)return k
switch(a.a){case B.l:r=new A.ch()
q=A.dT()
break
case B.m:r=new A.ci()
q=A.dT()
break
case B.o:r=new A.cj()
q=A.dR()
break
case B.n:r=new A.ck()
q=A.dR()
break
case B.p:r=new A.cl()
q=A.dS()
break
case B.q:r=new A.cm()
q=A.dS()
break
default:r=null
q=null}for(t=0;p=$.co(),t<p.length;++t){o=p[t]
if(r.$1(o)){for(n=o,m=0;m<s;++m)n=q.$1(n)
p=$.e_().l(0,n)
p.toString
k[t]=p}}return k},
dH(a,b,c){var t,s,r
if(a.length!==b.length)throw A.a(A.a3("symbols and perm must have same length"))
t=A.d3(a,!0,c)
for(s=J.bi(a),r=0;r<b.length;++r)s.E(a,b[r],t[r])},
I:function I(a){this.b=a},
br:function br(a,b){this.a=a
this.b=b},
ch:function ch(){},
ci:function ci(){},
cj:function cj(){},
ck:function ck(){},
cl:function cl(){},
cm:function cm(){},
q:function q(a,b,c){this.a=a
this.b=b
this.c=c},
fC(a){var t=A.hw(a)
return t==null?null:t.h(0)},
f9(a){var t=A.eA(a,null)
if(t==null)A.aP(A.cY("Could not parse BigInt",a))
return A.h8(t)},
f7(a,b,c){var t=A.fF(a,b,c),s=u.N
return A.ct(["sum",t.b,"carry",t.a],s,s)},
ft(a,b){return A.ct(["tau0",a,"alpha",b],u.N,u.n)},
f6(a,b,c,d){u.f.a(d)
return A.dK(new A.q(a,b,c),new A.aV(A.Z(d.l(0,"tau0")),A.Z(d.l(0,"alpha"))))},
fw(a,b){var t,s
u.f.a(a)
t=A.hr(new A.aV(A.Z(a.l(0,"tau0")),A.Z(a.l(0,"alpha"))),b)
s=A.aN(t).i("M<1,C<d,r>>")
t=A.a9(new A.M(t,new A.c6(),s),s.i("y.E"))
t.$flags=1
return t},
fv(a){var t=J.e4(a,new A.c5(),u.o),s=A.a9(t,t.$ti.i("y.E"))
return A.fU(s)},
fu(a){u.f.a(a)
return A.hq(new A.br(B.b.aC(B.F,new A.c4(A.dx(a.l(0,"face")))),B.d.N(A.Z(a.l(0,"quarterTurns")))))},
hl(){self.livnium={add27:A.m(A.fH()),add27Balanced:A.m(A.fI()),add27Cyclic:A.m(A.fJ()),add27CarrySave3:A.m(A.fM()),csFinish:A.m(A.fK()),toDecimal:A.m(A.fS()),fromDecimal:A.m(A.fN()),symbolEnergy9:A.m(A.h1()),symbolEnergyK:A.m(A.h2()),wordEnergy9:A.m(A.h3()),wordEnergyK:A.m(A.h4()),perFaceUnitEnergy:A.m(A.h0()),equilibriumConstant:A.m(new A.cf()),permutationFor:A.m(A.fP()),applyPerm:A.m(B.v),makeCouplerParams:A.m(A.fO()),couplingAt:A.m(A.fL()),rankTopCouplers:A.m(A.fR()),complexSumMagnitude:A.m(A.fQ()),facesForGlyph:A.m(A.h_())}},
bO:function bO(){},
c6:function c6(){},
c5:function c5(){},
c4:function c4(a){this.a=a},
cf:function cf(){},
f5(a){var t,s=a.$dart_jsFunction
if(s!=null)return s
t=function(b,c){return function(){return b(c,Array.prototype.slice.apply(arguments))}}(A.f2,a)
t[$.cQ()]=a
a.$dart_jsFunction=t
return t},
f2(a,b){return A.em(a,b,null)},
m(a){if(typeof a=="function")return a
else return A.f5(a)},
F(a){if(a.length!==1)return null
return B.H.l(0,a)},
aQ(a){if(a<0||a>=27)return null
return B.G[a]},
cL(a){var t
if(a==="0")return 0
t=A.F(a)
if(t==null)return-1
if(t>=1&&t<=6)return 1
if(t>=7&&t<=18)return 2
if(t>=19&&t<=26)return 3
return-1},
hp(a){if(a<=0||a>3)throw A.a(A.a3("faces must be 1..3"))
return 10.125/a},
dU(a){var t=A.cL(a)
if(t<0)return null
return t/3*27},
hy(a){var t,s,r,q,p
for(t=a.split(""),s=t.length,r=0,q=0;q<s;++q){p=A.dU(t[q])
if(p==null)return null
r+=p}return r},
dV(a){var t=A.cL(a)
if(t<=0)return t===0?0:null
return 10.125*t},
hz(a){var t,s,r,q,p
for(t=a.split(""),s=t.length,r=0,q=0;q<s;++q){p=A.dV(t[q])
if(p==null)return null
r+=p}return r},
cK(){return new A.ac(A.fZ(),u.O)},
fZ(){return function(){var t=0,s=1,r=[],q,p,o
return function $async$cK(a,b,c){if(b===1){r.push(c)
t=s}while(true)switch(t){case 0:q=-1
case 2:if(!(q<=1)){t=4
break}p=-1
case 5:if(!(p<=1)){t=7
break}o=-1
case 8:if(!(o<=1)){t=10
break}t=11
return a.b=new A.q(q,p,o),1
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
h6(a){var t=a.a!==0?1:0,s=a.b!==0?1:0,r=a.c!==0?1:0
return t+s+r},
hj(a){return Math.abs(a.a)+Math.abs(a.b)+Math.abs(a.c)},
hs(a){return new A.q(a.a,-a.c,a.b)},
ht(a){return new A.q(a.c,a.b,-a.a)},
hu(a){return new A.q(-a.b,a.a,a.c)}},B={}
var w=[A,J,B]
var $={}
A.cs.prototype={}
J.aX.prototype={
q(a,b){return a===b},
gj(a){return A.b4(a)},
h(a){return"Instance of '"+A.b5(a)+"'"},
ae(a,b){throw A.a(A.d4(a,b))},
gu(a){return A.O(A.cG(this))}}
J.aZ.prototype={
h(a){return String(a)},
gj(a){return a?519018:218159},
gu(a){return A.O(u.y)},
$in:1}
J.am.prototype={
q(a,b){return null==b},
h(a){return"null"},
gj(a){return 0},
$in:1}
J.ap.prototype={$ix:1}
J.L.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.b3.prototype={}
J.az.prototype={}
J.J.prototype={
h(a){var t=a[$.cQ()]
if(t==null)return this.ah(a)
return"JavaScript function for "+J.aS(t)}}
J.a6.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.a7.prototype={
gj(a){return 0},
h(a){return String(a)}}
J.e.prototype={
W(a,b){a.$flags&1&&A.h(a,29)
a.push(b)},
a8(a,b){a.$flags&1&&A.h(a,"addAll",2)
this.aj(a,b)
return},
aj(a,b){var t,s=b.length
if(s===0)return
if(a===b)throw A.a(A.W(a))
for(t=0;t<s;++t)a.push(b[t])},
ad(a,b,c){return new A.M(a,b,A.aN(a).i("@<1>").M(c).i("M<1,2>"))},
aE(a,b){var t,s=A.d2(a.length,"",!1,u.N)
for(t=0;t<a.length;++t)s[t]=A.f(a[t])
return s.join(b)},
aC(a,b){var t,s,r=a.length
for(t=0;t<r;++t){s=a[t]
if(b.$1(s))return s
if(a.length!==r)throw A.a(A.W(a))}throw A.a(A.ed())},
A(a,b){return a[b]},
aA(a,b){var t,s=a.length
for(t=0;t<s;++t){if(!b.$1(a[t]))return!1
if(a.length!==s)throw A.a(A.W(a))}return!0},
af(a,b){var t,s,r,q,p
a.$flags&2&&A.h(a,"sort")
t=a.length
if(t<2)return
if(t===2){s=a[0]
r=a[1]
if(b.$2(s,r)>0){a[0]=r
a[1]=s}return}q=0
if(A.aN(a).c.b(null))for(p=0;p<a.length;++p)if(a[p]===void 0){a[p]=null;++q}a.sort(A.fV(b,2))
if(q>0)this.aq(a,q)},
aq(a,b){var t,s=a.length
for(;t=s-1,s>0;s=t)if(a[t]===null){a[t]=void 0;--b
if(b===0)break}},
h(a){return A.d_(a,"[","]")},
gD(a){return new J.aT(a,a.length,A.aN(a).i("aT<1>"))},
gj(a){return A.b4(a)},
gk(a){return a.length},
E(a,b,c){a.$flags&2&&A.h(a)
if(!(b>=0&&b<a.length))throw A.a(A.dL(a,b))
a[b]=c},
$ii:1}
J.aY.prototype={
aJ(a){var t,s,r
if(!Array.isArray(a))return null
t=a.$flags|0
if((t&4)!==0)s="const, "
else if((t&2)!==0)s="unmodifiable, "
else s=(t&1)!==0?"fixed, ":""
r="Instance of '"+A.b5(a)+"'"
if(s==="")return r
return r+" ("+s+"length: "+a.length+")"}}
J.by.prototype={}
J.aT.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
m(){var t,s=this,r=s.a,q=r.length
if(s.b!==q)throw A.a(A.aO(r))
t=s.c
if(t>=q){s.d=null
return!1}s.d=r[t]
s.c=t+1
return!0}}
J.an.prototype={
J(a,b){var t
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){t=this.gZ(b)
if(this.gZ(a)===t)return 0
if(this.gZ(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gZ(a){return a===0?1/a<0:a<0},
N(a){var t
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){t=a<0?Math.ceil(a):Math.floor(a)
return t+0}throw A.a(A.cw(""+a+".toInt()"))},
az(a){var t,s
if(a>=0){if(a<=2147483647){t=a|0
return a===t?t:t+1}}else if(a>=-2147483648)return a|0
s=Math.ceil(a)
if(isFinite(s))return s
throw A.a(A.cw(""+a+".ceil()"))},
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
ai(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.a6(a,b)},
n(a,b){return(a|0)===a?a/b|0:this.a6(a,b)},
a6(a,b){var t=a/b
if(t>=-2147483648&&t<=2147483647)return t|0
if(t>0){if(t!==1/0)return Math.floor(t)}else if(t>-1/0)return Math.ceil(t)
throw A.a(A.cw("Result of truncating division is "+A.f(t)+": "+A.f(a)+" ~/ "+b))},
C(a,b){if(b<0)throw A.a(A.dI(b))
return b>31?0:a<<b>>>0},
F(a,b){var t
if(b<0)throw A.a(A.dI(b))
if(a>0)t=this.a5(a,b)
else{t=b>31?31:b
t=a>>t>>>0}return t},
I(a,b){var t
if(a>0)t=this.a5(a,b)
else{t=b>31?31:b
t=a>>t>>>0}return t},
a5(a,b){return b>31?0:a>>>b},
gu(a){return A.O(u.n)},
$iw:1,
$ir:1}
J.al.prototype={
gaa(a){var t,s=a<0?-a-1:a,r=s
for(t=32;r>=4294967296;){r=this.n(r,4294967296)
t+=32}return t-Math.clz32(r)},
gu(a){return A.O(u.S)},
$in:1,
$ib:1}
J.b_.prototype={
gu(a){return A.O(u.i)},
$in:1}
J.a5.prototype={
a0(a,b,c){return a.substring(b,A.en(b,c,a.length))},
ag(a,b){return this.a0(a,b,null)},
h(a){return a},
gj(a){var t,s,r
for(t=a.length,s=0,r=0;r<t;++r){s=s+a.charCodeAt(r)&536870911
s=s+((s&524287)<<10)&536870911
s^=s>>6}s=s+((s&67108863)<<3)&536870911
s^=s>>11
return s+((s&16383)<<15)&536870911},
gu(a){return A.O(u.N)},
gk(a){return a.length},
$in:1,
$id:1}
A.b0.prototype={
h(a){return"LateInitializationError: "+this.a}}
A.bH.prototype={}
A.aj.prototype={}
A.y.prototype={
gD(a){var t=this
return new A.a8(t,t.gk(t),A.cF(t).i("a8<y.E>"))},
H(a){var t,s,r=this,q=r.gk(r)
for(t=0,s="";t<q;++t){s+=A.f(r.A(0,t))
if(q!==r.gk(r))throw A.a(A.W(r))}return s.charCodeAt(0)==0?s:s}}
A.ay.prototype={
gan(){var t=this.a.length,s=this.c
if(s>t)return t
return s},
gau(){var t=this.a.length,s=this.b
if(s>t)return t
return s},
gk(a){var t,s=this.a.length,r=this.b
if(r>=s)return 0
t=this.c
if(t>=s)return s-r
return t-r},
A(a,b){var t=this,s=t.gau()+b,r=t.gan()
if(s>=r)throw A.a(A.cr(b,t.gk(0),t,"index"))
return J.cp(t.a,s)},
aI(a,b){var t,s,r,q,p=this,o=p.b,n=p.a,m=n.length,l=p.c
if(l<m)m=l
t=m-o
if(t<=0){n=J.d1(0,p.$ti.c)
return n}s=J.bi(n)
r=A.d2(t,s.A(n,o),!1,p.$ti.c)
for(q=1;q<t;++q){r[q]=s.A(n,o+q)
if(n.length<m)throw A.a(A.W(p))}return r}}
A.a8.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
m(){var t,s=this,r=s.a,q=J.dM(r),p=q.gk(r)
if(s.b!==p)throw A.a(A.W(r))
t=s.c
if(t>=p){s.d=null
return!1}s.d=q.A(r,t);++s.c
return!0}}
A.M.prototype={
gk(a){return this.a.length},
A(a,b){return this.b.$1(J.cp(this.a,b))}}
A.aW.prototype={}
A.H.prototype={
gk(a){return this.a.length},
A(a,b){var t=this.a
return J.cp(t,t.length-1-b)}}
A.R.prototype={
gj(a){var t=this._hashCode
if(t!=null)return t
t=664597*B.e.gj(this.a)&536870911
this._hashCode=t
return t},
h(a){return'Symbol("'+this.a+'")'},
q(a,b){if(b==null)return!1
return b instanceof A.R&&this.a===b.a},
$ibJ:1}
A.be.prototype={$r:"+(1,2)",$s:1}
A.aG.prototype={$r:"+carry,sum(1,2)",$s:2}
A.bf.prototype={$r:"+C,L,faces,pos(1,2,3,4)",$s:4}
A.ai.prototype={}
A.ah.prototype={
h(a){return A.bA(this)},
$iC:1}
A.X.prototype={
gk(a){return this.b.length},
X(a){if("__proto__"===a)return!1
return this.a.hasOwnProperty(a)},
l(a,b){if(!this.X(b))return null
return this.b[this.a[b]]},
G(a,b){var t,s,r,q=this,p=q.$keys
if(p==null){p=Object.keys(q.a)
q.$keys=p}p=p
t=q.b
for(s=p.length,r=0;r<s;++r)b.$2(p[r],t[r])}}
A.bu.prototype={
q(a,b){if(b==null)return!1
return b instanceof A.ak&&this.a.q(0,b.a)&&A.cM(this)===A.cM(b)},
gj(a){return A.bE(this.a,A.cM(this),B.c,B.c)},
h(a){var t=B.b.aE([A.O(this.$ti.c)],", ")
return this.a.h(0)+" with "+("<"+t+">")}}
A.ak.prototype={
$2(a,b){return this.a.$1$2(a,b,this.$ti.y[0])},
$S(){return A.hh(A.c8(this.a),this.$ti)}}
A.bw.prototype={
gaF(){var t=this.a
if(t instanceof A.R)return t
return this.a=new A.R(t)},
gaH(){var t,s,r,q,p=this
if(p.c===1)return B.r
t=p.d
s=t.length-p.e.length-p.f
if(s===0)return B.r
r=[]
for(q=0;q<s;++q)r.push(t[q])
r.$flags=3
return r},
gaG(){var t,s,r,q,p,o,n=this
if(n.c!==0)return B.t
t=n.e
s=t.length
r=n.d
q=r.length-s-n.f
if(s===0)return B.t
p=new A.K(u.B)
for(o=0;o<s;++o)p.E(0,new A.R(t[o]),r[q+o])
return new A.ai(p,u.Z)}}
A.bF.prototype={
$2(a,b){var t=this.a
t.b=t.b+"$"+a
this.b.push(a)
this.c.push(b);++t.a}}
A.aw.prototype={}
A.V.prototype={
h(a){var t=this.constructor,s=t==null?null:t.name
return"Closure '"+A.dW(s==null?"unknown":s)+"'"},
gaK(){return this},
$C:"$1",
$R:1,
$D:null}
A.bn.prototype={$C:"$0",$R:0}
A.bo.prototype={$C:"$2",$R:2}
A.bL.prototype={}
A.bI.prototype={
h(a){var t=this.$static_name
if(t==null)return"Closure of unknown static method"
return"Closure '"+A.dW(t)+"'"}}
A.ag.prototype={
q(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.ag))return!1
return this.$_target===b.$_target&&this.a===b.a},
gj(a){return(A.dO(this.a)^A.b4(this.$_target))>>>0},
h(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.b5(this.a)+"'")}}
A.bG.prototype={
h(a){return"RuntimeError: "+this.a}}
A.c_.prototype={}
A.K.prototype={
gk(a){return this.a},
X(a){var t=this.b
if(t==null)return!1
return t[a]!=null},
l(a,b){var t,s,r,q,p=null
if(typeof b=="string"){t=this.b
if(t==null)return p
s=t[b]
r=s==null?p:s.b
return r}else if(typeof b=="number"&&(b&0x3fffffff)===b){q=this.c
if(q==null)return p
s=q[b]
r=s==null?p:s.b
return r}else return this.aD(b)},
aD(a){var t,s,r=this.d
if(r==null)return null
t=r[this.ab(a)]
s=this.ac(t,a)
if(s<0)return null
return t[s].b},
E(a,b,c){var t,s,r,q,p,o,n=this
if(typeof b=="string"){t=n.b
n.a1(t==null?n.b=n.U():t,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){s=n.c
n.a1(s==null?n.c=n.U():s,b,c)}else{r=n.d
if(r==null)r=n.d=n.U()
q=n.ab(b)
p=r[q]
if(p==null)r[q]=[n.V(b,c)]
else{o=n.ac(p,b)
if(o>=0)p[o].b=c
else p.push(n.V(b,c))}}},
G(a,b){var t=this,s=t.e,r=t.r
for(;s!=null;){b.$2(s.a,s.b)
if(r!==t.r)throw A.a(A.W(t))
s=s.c}},
a1(a,b,c){var t=a[b]
if(t==null)a[b]=this.V(b,c)
else t.b=c},
V(a,b){var t=this,s=new A.bz(a,b)
if(t.e==null)t.e=t.f=s
else t.f=t.f.c=s;++t.a
t.r=t.r+1&1073741823
return s},
ab(a){return J.A(a)&1073741823},
ac(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.bl(a[s].a,b))return s
return-1},
h(a){return A.bA(this)},
U(){var t=Object.create(null)
t["<non-identifier-key>"]=t
delete t["<non-identifier-key>"]
return t}}
A.bz.prototype={}
A.cb.prototype={
$1(a){return this.a(a)}}
A.cc.prototype={
$2(a,b){return this.a(a,b)}}
A.cd.prototype={
$1(a){return this.a(a)}}
A.aF.prototype={
h(a){return this.a7(!1)},
a7(a){var t,s,r,q,p,o=this.ap(),n=this.T(),m=(a?"Record ":"")+"("
for(t=o.length,s="",r=0;r<t;++r,s=", "){m+=s
q=o[r]
if(typeof q=="string")m=m+q+": "
p=n[r]
m=a?m+A.d6(p):m+A.f(p)}m+=")"
return m.charCodeAt(0)==0?m:m},
ap(){var t,s=this.$s
for(;$.bZ.length<=s;)$.bZ.push(null)
t=$.bZ[s]
if(t==null){t=this.ak()
$.bZ[s]=t}return t},
ak(){var t,s,r,q=this.$r,p=q.indexOf("("),o=q.substring(1,p),n=q.substring(p),m=n==="()"?0:n.replace(/[^,]/g,"").length+1,l=u.K,k=J.d0(m,l)
for(t=0;t<m;++t)k[t]=t
if(o!==""){s=o.split(",")
t=s.length
for(r=m;t>0;){--r;--t
k[r]=s[t]}}k=A.d3(k,!1,l)
k.$flags=3
return k}}
A.bc.prototype={
T(){return[this.a,this.b]},
q(a,b){if(b==null)return!1
return b instanceof A.bc&&this.$s===b.$s&&J.bl(this.a,b.a)&&J.bl(this.b,b.b)},
gj(a){return A.bE(this.$s,this.a,this.b,B.c)}}
A.bd.prototype={
T(){return this.a},
q(a,b){if(b==null)return!1
return b instanceof A.bd&&this.$s===b.$s&&A.eH(this.a,b.a)},
gj(a){return A.bE(this.$s,A.ek(this.a),B.c,B.c)}}
A.bx.prototype={
h(a){return"RegExp/"+this.a+"/"+this.b.flags},
aB(a){var t=this.b.exec(a)
if(t==null)return null
return new A.bY(t)}}
A.bY.prototype={}
A.bS.prototype={
t(){var t=this.b
if(t===this)throw A.a(new A.b0("Field '"+this.a+"' has not been initialized."))
return t}}
A.aa.prototype={
gu(a){return B.M},
av(a,b,c){var t=new DataView(a,b)
return t},
a9(a){return this.av(a,0,null)},
$in:1}
A.at.prototype={
gaw(a){if(((a.$flags|0)&2)!==0)return new A.c2(a.buffer)
else return a.buffer}}
A.c2.prototype={
a9(a){var t=A.ej(this.a,0,null)
t.$flags=3
return t}}
A.b1.prototype={
gu(a){return B.N},
$in:1}
A.ab.prototype={
gk(a){return a.length},
$iao:1}
A.as.prototype={
E(a,b,c){a.$flags&2&&A.h(a)
A.f4(b,a,a.length)
a[b]=c},
$ii:1}
A.b2.prototype={
gu(a){return B.P},
$in:1}
A.au.prototype={
gu(a){return B.Q},
gk(a){return a.length},
$in:1}
A.aD.prototype={}
A.aE.prototype={}
A.D.prototype={
i(a){return A.aL(v.typeUniverse,this,a)},
M(a){return A.du(v.typeUniverse,this,a)}}
A.bb.prototype={}
A.c0.prototype={
h(a){return A.z(this.a,null)}}
A.bV.prototype={
h(a){return this.a}}
A.bg.prototype={}
A.aH.prototype={
gp(){return this.b},
ar(a,b){var t,s,r
a=a
b=b
t=this.a
for(;!0;)try{s=t(this,a,b)
return s}catch(r){b=r
a=1}},
m(){var t,s,r,q,p=this,o=null,n=0
for(;!0;){t=p.d
if(t!=null)try{if(t.m()){p.b=t.gp()
return!0}else p.d=null}catch(s){o=s
n=1
p.d=null}r=p.ar(n,o)
if(1===r)return!0
if(0===r){p.b=null
q=p.e
if(q==null||q.length===0){p.a=A.dp
return!1}p.a=q.pop()
n=0
o=null
continue}if(2===r){n=0
o=null
continue}if(3===r){o=p.c
p.c=null
q=p.e
if(q==null||q.length===0){p.b=null
p.a=A.dp
throw o
return!1}p.a=q.pop()
n=1
continue}throw A.a(A.eq("sync*"))}return!1},
aL(a){var t,s,r=this
if(a instanceof A.ac){t=a.a()
s=r.e
if(s==null)s=r.e=[]
s.push(r.a)
r.a=t
return 2}else{r.d=J.cq(a)
return 2}}}
A.ac.prototype={
gD(a){return new A.aH(this.a())}}
A.G.prototype={
gD(a){return new A.a8(a,a.length,A.a_(a).i("a8<G.E>"))},
A(a,b){return a[b]},
ad(a,b,c){return new A.M(a,b,A.a_(a).i("@<G.E>").M(c).i("M<1,2>"))},
h(a){return A.d_(a,"[","]")}}
A.aq.prototype={
gk(a){return this.a},
h(a){return A.bA(this)},
$iC:1}
A.bB.prototype={
$2(a,b){var t,s=this.a
if(!s.a)this.b.a+=", "
s.a=!1
s=this.b
t=A.f(a)
s.a=(s.a+=t)+": "
t=A.f(b)
s.a+=t}}
A.bh.prototype={}
A.ar.prototype={
l(a,b){return this.a.l(0,b)},
G(a,b){this.a.G(0,b)},
gk(a){return this.a.a},
h(a){return A.bA(this.a)},
$iC:1}
A.aA.prototype={}
A.aM.prototype={}
A.k.prototype={
B(a){var t,s,r=this,q=r.c
if(q===0)return r
t=!r.a
s=r.b
q=A.v(q,s)
return new A.k(q===0?!1:t,s,q)},
al(a){var t,s,r,q,p,o,n=this.c
if(n===0)return $.t()
t=n+a
s=this.b
r=new Uint16Array(t)
for(q=n-1;q>=0;--q)r[q+a]=s[q]
p=this.a
o=A.v(t,r)
return new A.k(o===0?!1:p,r,o)},
am(a){var t,s,r,q,p,o,n,m=this,l=m.c
if(l===0)return $.t()
t=l-a
if(t<=0)return m.a?$.cS():$.t()
s=m.b
r=new Uint16Array(t)
for(q=a;q<l;++q)r[q-a]=s[q]
p=m.a
o=A.v(t,r)
n=new A.k(o===0?!1:p,r,o)
if(p)for(q=0;q<a;++q)if(s[q]!==0)return n.K(0,$.aR())
return n},
C(a,b){var t,s,r,q,p,o=this
if(b<0)throw A.a(A.a3("shift-amount must be posititve "+b))
t=o.c
if(t===0)return o
s=B.a.n(b,16)
if(B.a.v(b,16)===0)return o.al(s)
r=t+s+1
q=new Uint16Array(r)
A.dg(o.b,t,b,q)
t=o.a
p=A.v(r,q)
return new A.k(p===0?!1:t,q,p)},
F(a,b){var t,s,r,q,p,o,n,m,l,k=this
if(b<0)throw A.a(A.a3("shift-amount must be posititve "+b))
t=k.c
if(t===0)return k
s=B.a.n(b,16)
r=B.a.v(b,16)
if(r===0)return k.am(s)
q=t-s
if(q<=0)return k.a?$.cS():$.t()
p=k.b
o=new Uint16Array(q)
A.ez(p,t,b,o)
t=k.a
n=A.v(q,o)
m=new A.k(n===0?!1:t,o,n)
if(t){if((p[s]&B.a.C(1,r)-1)>>>0!==0)return m.K(0,$.aR())
for(l=0;l<s;++l)if(p[l]!==0)return m.K(0,$.aR())}return m},
J(a,b){var t,s=this.a
if(s===b.a){t=A.bP(this.b,this.c,b.b,b.c)
return s?0-t:t}return s?-1:1},
P(a,b){var t,s,r,q=this,p=q.c,o=a.c
if(p<o)return a.P(q,b)
if(p===0)return $.t()
if(o===0)return q.a===b?q:q.B(0)
t=p+1
s=new Uint16Array(t)
A.ev(q.b,p,a.b,o,s)
r=A.v(t,s)
return new A.k(r===0?!1:b,s,r)},
L(a,b){var t,s,r,q=this,p=q.c
if(p===0)return $.t()
t=a.c
if(t===0)return q.a===b?q:q.B(0)
s=new Uint16Array(p)
A.ba(q.b,p,a.b,t,s)
r=A.v(p,s)
return new A.k(r===0?!1:b,s,r)},
O(a,b){var t,s,r=this,q=r.c
if(q===0)return b
t=b.c
if(t===0)return r
s=r.a
if(s===b.a)return r.P(b,s)
if(A.bP(r.b,q,b.b,t)>=0)return r.L(b,s)
return b.L(r,!s)},
K(a,b){var t,s,r=this,q=r.c
if(q===0)return b.B(0)
t=b.c
if(t===0)return r
s=r.a
if(s!==b.a)return r.P(b,s)
if(A.bP(r.b,q,b.b,t)>=0)return r.L(b,s)
return b.L(r,!s)},
a_(a,b){var t,s,r,q,p,o,n,m=this.c,l=b.c
if(m===0||l===0)return $.t()
t=m+l
s=this.b
r=b.b
q=new Uint16Array(t)
for(p=0;p<l;){A.dh(r[p],s,0,q,p,m);++p}o=this.a!==b.a
n=A.v(t,q)
return new A.k(n===0?!1:o,q,n)},
a2(a){var t,s,r,q
if(this.c<a.c)return $.t()
this.a3(a)
t=$.cz.t()-$.aC.t()
s=A.cB($.cy.t(),$.aC.t(),$.cz.t(),t)
r=A.v(t,s)
q=new A.k(!1,s,r)
return this.a!==a.a&&r>0?q.B(0):q},
a4(a){var t,s,r,q=this
if(q.c<a.c)return q
q.a3(a)
t=A.cB($.cy.t(),0,$.aC.t(),$.aC.t())
s=A.v($.aC.t(),t)
r=new A.k(!1,t,s)
if($.cA.t()>0)r=r.F(0,$.cA.t())
return q.a&&r.c>0?r.B(0):r},
a3(a){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.c
if(c===$.dd&&a.c===$.df&&d.b===$.dc&&a.b===$.de)return
t=a.b
s=a.c
r=16-B.a.gaa(t[s-1])
if(r>0){q=new Uint16Array(s+5)
p=A.db(t,s,r,q)
o=new Uint16Array(c+5)
n=A.db(d.b,c,r,o)}else{o=A.cB(d.b,0,c,c+2)
p=s
q=t
n=c}m=q[p-1]
l=n-p
k=new Uint16Array(n)
j=A.cC(q,p,l,k)
i=n+1
h=o.$flags|0
if(A.bP(o,n,k,j)>=0){h&2&&A.h(o)
o[n]=1
A.ba(o,i,k,j,o)}else{h&2&&A.h(o)
o[n]=0}g=new Uint16Array(p+2)
g[p]=1
A.ba(g,p+1,q,p,g)
f=n-1
for(;l>0;){e=A.ew(m,o,f);--l
A.dh(e,g,0,o,l,p)
if(o[f]<e){j=A.cC(g,p,l,k)
A.ba(o,i,k,j,o)
for(;--e,o[f]<e;)A.ba(o,i,k,j,o)}--f}$.dc=d.b
$.dd=c
$.de=t
$.df=s
$.cy.b=o
$.cz.b=i
$.aC.b=p
$.cA.b=r},
gj(a){var t,s,r,q=new A.bQ(),p=this.c
if(p===0)return 6707
t=this.a?83585:429689
for(s=this.b,r=0;r<p;++r)t=q.$2(t,s[r])
return new A.bR().$1(t)},
q(a,b){if(b==null)return!1
return b instanceof A.k&&this.J(0,b)===0},
N(a){var t,s,r
for(t=this.c-1,s=this.b,r=0;t>=0;--t)r=r*65536+s[t]
return this.a?-r:r},
h(a){var t,s,r,q,p,o=this,n=o.c
if(n===0)return"0"
if(n===1){if(o.a)return B.a.h(-o.b[0])
return B.a.h(o.b[0])}t=A.l([],u.s)
n=o.a
s=n?o.B(0):o
for(;s.c>1;){r=$.cR()
if(r.c===0)A.aP(B.h)
q=s.a4(r).h(0)
t.push(q)
p=q.length
if(p===1)t.push("000")
if(p===2)t.push("00")
if(p===3)t.push("0")
s=s.a2(r)}t.push(B.a.h(s.b[0]))
if(n)t.push("-")
return new A.H(t,u.H).H(0)}}
A.bQ.prototype={
$2(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6}}
A.bR.prototype={
$1(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911}}
A.bD.prototype={
$2(a,b){var t=this.b,s=this.a,r=(t.a+=s.a)+a.a
t.a=r
t.a=r+": "
r=A.a4(b)
t.a+=r
s.a=", "}}
A.bU.prototype={
h(a){return this.ao()}}
A.bq.prototype={}
A.bm.prototype={
h(a){var t=this.a
if(t!=null)return"Assertion failed: "+A.a4(t)
return"Assertion failed"}}
A.bM.prototype={}
A.a2.prototype={
gS(){return"Invalid argument"+(!this.a?"(s)":"")},
gR(){return""},
h(a){var t=this,s=t.c,r=s==null?"":" ("+s+")",q=t.d,p=q==null?"":": "+q,o=t.gS()+r+p
if(!t.a)return o
return o+t.gR()+": "+A.a4(t.gY())},
gY(){return this.b}}
A.b6.prototype={
gY(){return this.b},
gS(){return"RangeError"},
gR(){var t,s=this.e,r=this.f
if(s==null)t=r!=null?": Not less than or equal to "+A.f(r):""
else if(r==null)t=": Not greater than or equal to "+A.f(s)
else if(r>s)t=": Not in inclusive range "+A.f(s)+".."+A.f(r)
else t=r<s?": Valid value range is empty":": Only valid value is "+A.f(s)
return t}}
A.bt.prototype={
gY(){return this.b},
gS(){return"RangeError"},
gR(){if(this.b<0)return": index must not be negative"
var t=this.f
if(t===0)return": no indices are valid"
return": index should be less than "+t},
gk(a){return this.f}}
A.bC.prototype={
h(a){var t,s,r,q,p,o,n,m,l=this,k={},j=new A.ax("")
k.a=""
t=l.c
for(s=t.length,r=0,q="",p="";r<s;++r,p=", "){o=t[r]
j.a=q+p
q=A.a4(o)
q=j.a+=q
k.a=", "}l.d.G(0,new A.bD(k,j))
n=A.a4(l.a)
m=j.h(0)
return"NoSuchMethodError: method not found: '"+l.b.a+"'\nReceiver: "+n+"\nArguments: ["+m+"]"}}
A.b9.prototype={
h(a){return"Unsupported operation: "+this.a}}
A.bN.prototype={
h(a){return"UnimplementedError: "+this.a}}
A.b8.prototype={
h(a){return"Bad state: "+this.a}}
A.bp.prototype={
h(a){var t=this.a
if(t==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.a4(t)+"."}}
A.bW.prototype={
h(a){return"Exception: "+this.a}}
A.bs.prototype={
h(a){var t=this.a,s=""!==t?"FormatException: "+t:"FormatException",r=this.b
if(r.length>78)r=B.e.a0(r,0,75)+"..."
return s+"\n"+r}}
A.bv.prototype={
h(a){return"IntegerDivisionByZeroException"}}
A.u.prototype={
gk(a){var t,s=this.gD(this)
for(t=0;s.m();)++t
return t},
A(a,b){var t,s
A.cu(b,"index")
t=this.gD(this)
for(s=b;t.m();){if(s===0)return t.gp();--s}throw A.a(A.cr(b,b-s,this,"index"))},
h(a){return A.ee(this,"(",")")}}
A.av.prototype={
gj(a){return A.c.prototype.gj.call(this,0)},
h(a){return"null"}}
A.c.prototype={$ic:1,
q(a,b){return this===b},
gj(a){return A.b4(this)},
h(a){return"Instance of '"+A.b5(this)+"'"},
ae(a,b){throw A.a(A.d4(this,b))},
gu(a){return A.hb(this)},
toString(){return this.h(this)}}
A.ax.prototype={
gk(a){return this.a.length},
h(a){var t=this.a
return t.charCodeAt(0)==0?t:t}}
A.c7.prototype={
$1(a){return A.F(a)!=null}}
A.aV.prototype={}
A.cn.prototype={
$2(a,b){return B.d.J(b.a[0],a.a[0])}}
A.I.prototype={
ao(){return"Face."+this.b}}
A.br.prototype={}
A.ch.prototype={
$1(a){return a.c===1}}
A.ci.prototype={
$1(a){return a.c===-1}}
A.cj.prototype={
$1(a){return a.a===1}}
A.ck.prototype={
$1(a){return a.a===-1}}
A.cl.prototype={
$1(a){return a.b===1}}
A.cm.prototype={
$1(a){return a.b===-1}}
A.q.prototype={
h(a){return"("+this.a+","+this.b+","+this.c+")"},
q(a,b){if(b==null)return!1
return b instanceof A.q&&this.a===b.a&&this.b===b.b&&this.c===b.c},
gj(a){return A.bE(this.a,this.b,this.c,B.c)}}
A.bO.prototype={}
A.c6.prototype={
$1(a){var t=a.a,s=t[3]
return A.ct(["x",s.a,"y",s.b,"z",s.c,"C",t[0],"L",t[1],"faces",t[2]],u.N,u.n)}}
A.c5.prototype={
$1(a){u.f.a(a)
return new A.be(A.Z(a.l(0,"mag")),A.Z(a.l(0,"phaseDeg")))}}
A.c4.prototype={
$1(a){return a.b===this.a}}
A.cf.prototype={
$0(){return 10.125}};(function aliases(){var t=J.L.prototype
t.ah=t.h})();(function installTearOffs(){var t=hunkHelpers._static_2,s=hunkHelpers.installStaticTearOff,r=hunkHelpers._static_1
t(A,"fH","dF",0)
t(A,"fI","fE",0)
t(A,"fJ","fG",0)
t(A,"fK","fY",0)
s(A,"hn",2,null,["$1$2","$2"],["dH",function(a,b){return A.dH(a,b,u.z)}],4,1)
r(A,"fS","fC",3)
r(A,"fN","f9",3)
s(A,"fM",3,null,["$3"],["f7"],5,0)
t(A,"fO","ft",6)
s(A,"fL",4,null,["$4"],["f6"],7,0)
t(A,"fR","fw",8)
r(A,"fQ","fv",9)
r(A,"fP","fu",10)
r(A,"h_","cL",11)
r(A,"h0","hp",12)
r(A,"h1","dU",1)
r(A,"h3","hy",1)
r(A,"h2","dV",1)
r(A,"h4","hz",1)
r(A,"dR","hs",2)
r(A,"dS","ht",2)
r(A,"dT","hu",2)})();(function inheritance(){var t=hunkHelpers.mixin,s=hunkHelpers.inherit,r=hunkHelpers.inheritMany
s(A.c,null)
r(A.c,[A.cs,J.aX,A.aw,J.aT,A.bq,A.bH,A.u,A.a8,A.aW,A.R,A.aF,A.ar,A.ah,A.V,A.bw,A.c_,A.aq,A.bz,A.bx,A.bY,A.bS,A.c2,A.D,A.bb,A.c0,A.aH,A.G,A.bh,A.k,A.bU,A.bW,A.bs,A.bv,A.av,A.ax,A.aV,A.br,A.q])
r(J.aX,[J.aZ,J.am,J.ap,J.a6,J.a7,J.an,J.a5])
r(J.ap,[J.L,J.e,A.aa,A.at])
r(J.L,[J.b3,J.az,J.J,A.bO])
s(J.aY,A.aw)
s(J.by,J.e)
r(J.an,[J.al,J.b_])
r(A.bq,[A.b0,A.bG,A.bV,A.bm,A.bM,A.a2,A.bC,A.b9,A.bN,A.b8,A.bp])
r(A.u,[A.aj,A.ac])
s(A.y,A.aj)
r(A.y,[A.ay,A.M,A.H])
r(A.aF,[A.bc,A.bd])
r(A.bc,[A.be,A.aG])
s(A.bf,A.bd)
s(A.aM,A.ar)
s(A.aA,A.aM)
s(A.ai,A.aA)
s(A.X,A.ah)
r(A.V,[A.bu,A.bo,A.bn,A.bL,A.cb,A.cd,A.bR,A.c7,A.ch,A.ci,A.cj,A.ck,A.cl,A.cm,A.c6,A.c5,A.c4])
s(A.ak,A.bu)
r(A.bo,[A.bF,A.cc,A.bB,A.bQ,A.bD,A.cn])
r(A.bL,[A.bI,A.ag])
s(A.K,A.aq)
r(A.at,[A.b1,A.ab])
s(A.aD,A.ab)
s(A.aE,A.aD)
s(A.as,A.aE)
r(A.as,[A.b2,A.au])
s(A.bg,A.bV)
r(A.a2,[A.b6,A.bt])
s(A.I,A.bU)
s(A.cf,A.bn)
t(A.aD,A.G)
t(A.aE,A.aW)
t(A.aM,A.bh)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",w:"double",r:"num",d:"String",dJ:"bool",av:"Null",i:"List",c:"Object",C:"Map",x:"JSObject"},mangledNames:{},types:["d?(d,d)","w?(d)","q(q)","d?(d)","~(i<0^>,i<b>)<c?>","c(d,d,d)","c(r,r)","r(b,b,b,c)","i<c>(c,b)","r(i<c>)","i<b>(c)","b(d)","w(b)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.be&&a.b(c.a)&&b.b(c.b),"2;carry,sum":(a,b)=>c=>c instanceof A.aG&&a.b(c.a)&&b.b(c.b),"4;C,L,faces,pos":a=>b=>b instanceof A.bf&&A.ho(a,b.a)}}
A.eO(v.typeUniverse,JSON.parse('{"b3":"L","az":"L","J":"L","bO":"L","hE":"aa","aZ":{"n":[]},"am":{"n":[]},"ap":{"x":[]},"L":{"x":[]},"e":{"i":["1"],"x":[]},"aY":{"aw":[]},"by":{"e":["1"],"i":["1"],"x":[]},"an":{"w":[],"r":[]},"al":{"w":[],"b":[],"r":[],"n":[]},"b_":{"w":[],"r":[],"n":[]},"a5":{"d":[],"n":[]},"aj":{"u":["1"]},"y":{"u":["1"]},"ay":{"y":["1"],"u":["1"],"y.E":"1","u.E":"1"},"M":{"y":["2"],"u":["2"],"y.E":"2","u.E":"2"},"H":{"y":["1"],"u":["1"],"y.E":"1","u.E":"1"},"R":{"bJ":[]},"ai":{"C":["1","2"]},"ah":{"C":["1","2"]},"X":{"C":["1","2"]},"K":{"aq":["1","2"],"C":["1","2"]},"aa":{"x":[],"n":[]},"at":{"x":[]},"b1":{"x":[],"n":[]},"ab":{"ao":["1"],"x":[]},"as":{"G":["b"],"i":["b"],"ao":["b"],"x":[]},"b2":{"G":["b"],"i":["b"],"ao":["b"],"x":[],"n":[],"G.E":"b"},"au":{"G":["b"],"i":["b"],"ao":["b"],"x":[],"n":[],"G.E":"b"},"ac":{"u":["1"],"u.E":"1"},"aq":{"C":["1","2"]},"ar":{"C":["1","2"]},"aA":{"C":["1","2"]},"w":{"r":[]},"b":{"r":[]},"et":{"i":["b"]},"es":{"i":["b"]}}'))
A.eN(v.typeUniverse,JSON.parse('{"aj":1,"aW":1,"ah":2,"ab":1,"aH":1,"bh":2,"ar":2,"aA":2,"aM":2}'))
var u=(function rtii(){var t=A.U
return{Z:t("ai<bJ,@>"),_:t("hD"),C:t("e<+C,L,faces,pos(w,b,b,q)>"),s:t("e<d>"),b:t("e<@>"),t:t("e<b>"),T:t("am"),m:t("x"),g:t("J"),p:t("ao<@>"),B:t("K<bJ,@>"),j:t("i<@>"),f:t("C<@,@>"),P:t("av"),K:t("c"),L:t("hF"),F:t("+()"),o:t("+(w,w)"),Y:t("+C,L,faces,pos(w,b,b,q)"),H:t("H<d>"),N:t("d"),R:t("n"),A:t("az"),O:t("ac<q>"),y:t("dJ"),i:t("w"),z:t("@"),S:t("b"),Q:t("cZ<av>?"),D:t("x?"),X:t("c?"),v:t("d?"),u:t("dJ?"),I:t("w?"),w:t("b?"),x:t("r?"),n:t("r")}})();(function constants(){var t=hunkHelpers.makeConstList
B.C=J.aX.prototype
B.b=J.e.prototype
B.a=J.al.prototype
B.d=J.an.prototype
B.e=J.a5.prototype
B.D=J.J.prototype
B.E=J.ap.prototype
B.I=A.au.prototype
B.u=J.b3.prototype
B.f=J.az.prototype
B.v=new A.ak(A.hn(),A.U("ak<b>"))
B.h=new A.bv()
B.i=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.w=function() {
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
B.B=function(getTagFallback) {
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
B.x=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.A=function(hooks) {
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
B.z=function(hooks) {
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
B.y=function(hooks) {
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
B.j=function(hooks) { return hooks; }

B.c=new A.bH()
B.k=new A.c_()
B.l=new A.I("U")
B.m=new A.I("D")
B.n=new A.I("L")
B.o=new A.I("R")
B.p=new A.I("F")
B.q=new A.I("B")
B.F=t([B.l,B.m,B.n,B.o,B.p,B.q],A.U("e<I>"))
B.G=t(["0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],u.s)
B.r=t([],u.b)
B.J={"0":0,a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26}
B.H=new A.X(B.J,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],A.U("X<d,b>"))
B.K={}
B.t=new A.X(B.K,[],A.U("X<bJ,@>"))
B.L=new A.R("call")
B.M=A.bj("hA")
B.N=A.bj("hB")
B.O=A.bj("c")
B.P=A.bj("es")
B.Q=A.bj("et")})();(function staticFields(){$.bX=null
$.a1=A.l([],A.U("e<c>"))
$.d5=null
$.cV=null
$.cU=null
$.dN=null
$.dG=null
$.dQ=null
$.c9=null
$.ce=null
$.cN=null
$.bZ=A.l([],A.U("e<i<c>?>"))
$.dc=null
$.dd=null
$.de=null
$.df=null
$.cy=A.bT("_lastQuoRemDigits")
$.cz=A.bT("_lastQuoRemUsed")
$.aC=A.bT("_lastRemUsed")
$.cA=A.bT("_lastRem_nsh")})();(function lazyInitializers(){var t=hunkHelpers.lazyFinal,s=hunkHelpers.lazy
t($,"hC","cQ",()=>A.ha("_$dart_dartClosure"))
t($,"hQ","e0",()=>A.l([new J.aY()],A.U("e<aw>")))
t($,"hM","t",()=>A.aB(0))
t($,"hK","aR",()=>A.aB(1))
t($,"hL","dZ",()=>A.aB(2))
t($,"hI","cS",()=>$.aR().B(0))
t($,"hG","cR",()=>A.aB(1e4))
s($,"hJ","dY",()=>A.eo("^\\s*([+-]?)((0x[a-f0-9]+)|(\\d+)|([a-z0-9]+))\\s*$",!1))
t($,"hH","dX",()=>new Uint8Array(A.f3(8)))
t($,"hP","bk",()=>A.dO(B.O))
t($,"hO","co",()=>{var r=A.cK()
return A.ei(r,!1,r.$ti.i("u.E"))})
t($,"hN","e_",()=>{var r,q,p=A.eh(A.U("q"),u.S)
for(r=0;q=$.co(),r<q.length;++r)p.E(0,q[r],r)
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
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.aa,SharedArrayBuffer:A.aa,ArrayBufferView:A.at,DataView:A.b1,Uint16Array:A.b2,Uint8Array:A.au})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Uint16Array:true,Uint8Array:false})
A.ab.$nativeSuperclassTag="ArrayBufferView"
A.aD.$nativeSuperclassTag="ArrayBufferView"
A.aE.$nativeSuperclassTag="ArrayBufferView"
A.as.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var t=document.scripts
function onLoad(b){for(var r=0;r<t.length;++r){t[r].removeEventListener("load",onLoad,false)}a(b.target)}for(var s=0;s<t.length;++s){t[s].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var t=A.hl
if(typeof dartMainRunner==="function"){dartMainRunner(t,[])}else{t([])}})})()
//# sourceMappingURL=livnium_core.js.map
