import{c as T,_ as A,a as R}from"./CLCenidg.js";import{_ as E}from"./DsicDu3-.js";import{_ as W}from"./VU9x9zFa.js";import{C as k,R as M}from"./8nwonuGf.js";import{o as V,E as j,T as w}from"./C90VKeaI.js";import{j as U}from"./BP50QEMB.js";import{j as B}from"./K6UyZF1B.js";import{u as D}from"./DcFt84Vm.js";import{s as z,r as C,m as q,c as F,d as t,w as m,b as a,u as N,F as H,o as L,e as c}from"./CZNRrHyR.js";import"./CrQRUixB.js";import"./Cew7h1kz.js";import"./DRsEvuVH.js";const P={class:"flex gap-4 mt-6 mb-4"},G={class:"mr-4"},Y={class:"flex w-full gap-4"},K={class:"w-1/2"},Q={class:"flex justify-between items-center mb-2"},X={class:"dark:border-gray-700 dark:shadow-xl dark:border rounded-lg overflow-hidden"},Z={class:"w-1/2"},ee={class:"flex justify-between items-center mb-2"},se={class:"dark:border-gray-700 dark:shadow-xl dark:border rounded-lg overflow-hidden"},te={class:"flex justify-between items-center mb-2 mt-4"},ae={class:"dark:border-gray-700 dark:shadow-xl dark:border rounded-lg overflow-hidden"},xe={__name:"json-to-apex",setup(oe){D({title:"JSON To Apex",ogTitle:"JSON To Apex",description:"JSON to Apex converts JSON into Salesforce wrapper classes, simplifying integration and data handling..",ogDescription:"JSON to Apex converts JSON into Salesforce wrapper classes, simplifying integration and data handling.."});const O=[U(),V,j.lineWrapping],_=[B(),V,j.lineWrapping],I=z(),y=n=>{I.value=n.view},i=C("MainClass"),u=C(`${i.value}Test`),f=C(""),l=C(""),v=C(""),J=()=>{i.value="",u.value="",f.value="",l.value="",v.value=""};q(i,n=>{u.value=`${n}Test`});const g=()=>{if(f.value==""){console.log("null value");return}i.value.trim()||(i.value="MainWrapperClass"),u.value.trim()||(u.value=`${i.value}Test`);try{const n=JSON.parse(f.value),e=i.value;l.value=`/*
Class Info Here
*/

public class ${e} {
`;const p={},r=(o,s)=>{s?(p[s]=p[s]||[],p[s].push(o)):l.value+=`    ${o}
`},b=(o,s)=>{for(const d in o){const x=o[d];switch(typeof x){case"object":const S=Array.isArray(x),h=`cls_${d}`;r(`public ${S?`List<${h}>`:h} ${d};`,s),b(S?x[0]:x,d);break;case"string":r(`public String ${d};`,s);break;case"number":r(`public ${Number.isInteger(x)?"Integer":"Double"} ${d};`,s);break;case"boolean":r(`public Boolean ${d};`,s);break}}};b(n,"");for(const o in p)l.value+=`    public class cls_${o} {
`,p[o].forEach(s=>{l.value+=`        ${s}
`}),l.value+=`    }
`;l.value+=`
    public static ${e} parse(String json) {
        return (${e}) System.JSON.deserialize(json, ${e}.class);
    }
}`,v.value=`/*
Test Class for ${e}
Additional Info Here
*/

@isTest
public class ${u.value} {

    @isTest
    public static void wrapperTestMethod() {
        String json = ${JSON.stringify(f.value)};
        ${e} obj = ${e}.parse(json);
        System.assert(obj != null);
    }
}`}catch(n){console.error("error --> "+n),l.value="Invalid Input JSON",v.value="Invalid Input JSON"}},$=async n=>{n=="MainClass"?T(l.value):n=="TestClass"&&T(v.value)};return(n,e)=>{const p=A,r=R,b=E,o=W;return L(),F(H,null,[t(p,{class:"text-2xl font-bold"},{default:m(()=>e[7]||(e[7]=[c("JSON To Apex")])),_:1}),t(r,{class:"text-normal font-thin"},{default:m(()=>e[8]||(e[8]=[c("Convert your JSON into Apex Wrapper Class")])),_:1}),a("div",P,[a("div",G,[t(r,{for:"inpClassName",class:"text-md font-medium"},{default:m(()=>e[9]||(e[9]=[c("Enter Wrapper Class Name")])),_:1}),t(b,{modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=s=>i.value=s),type:"text",id:"inpClassName",placeholder:"Enter Wrapper Class Name",class:"mt-2 p-2 border rounded w-46",onChange:g},null,8,["modelValue"])]),a("div",null,[t(r,{for:"testClassName",class:"text-md font-medium"},{default:m(()=>e[10]||(e[10]=[c("Change Test Class Name")])),_:1}),t(b,{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=s=>u.value=s),type:"text",id:"testClassName",placeholder:"Enter Test Class Name",class:"mt-2 p-2 border rounded w-46",onChange:g},null,8,["modelValue"])])]),a("div",Y,[a("div",K,[a("div",Q,[t(r,{class:"text-md font-medium"},{default:m(()=>e[11]||(e[11]=[c("Paste Your JSON Here")])),_:1}),t(o,{onClick:J,icon:M,isSquare:!1,color:"red",title:"Reset Data",class:"mr-4"})]),a("div",X,[t(N(w),{modelValue:f.value,"onUpdate:modelValue":e[2]||(e[2]=s=>f.value=s),placeholder:"Enter your data line by line",onUpdate:g,style:{height:"600px",borderRadius:"5px",overflow:"hidden"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:O,onReady:y},null,8,["modelValue"])])]),a("div",Z,[a("div",ee,[t(r,{class:"text-md font-medium"},{default:m(()=>e[12]||(e[12]=[c("Wrapper Apex Class")])),_:1}),t(o,{onClick:e[3]||(e[3]=s=>$("MainClass")),icon:k,isSquare:!1,color:"green",title:"Copy Main Wrapper Class"})]),a("div",se,[t(N(w),{modelValue:l.value,"onUpdate:modelValue":e[4]||(e[4]=s=>l.value=s),placeholder:"Enter your data line by line",style:{height:"300px",borderRadius:"5px",overflow:"hidden"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:_,onReady:y},null,8,["modelValue"])]),a("div",null,[a("div",te,[t(r,{class:"text-md font-medium"},{default:m(()=>e[13]||(e[13]=[c("Test Class")])),_:1}),t(o,{onClick:e[5]||(e[5]=s=>$("TestClass")),icon:k,isSquare:!1,color:"green",title:"Copy Test Class"})]),a("div",ae,[t(N(w),{modelValue:v.value,"onUpdate:modelValue":e[6]||(e[6]=s=>v.value=s),placeholder:"Enter your data line by line",style:{height:"235px",borderRadius:"5px",overflow:"hidden"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:_,onReady:y},null,8,["modelValue"])])])])])],64)}}};export{xe as default};
