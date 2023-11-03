"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.handler=void 0;var i=require("@aws-sdk/client-cloudwatch-logs");async function l(e,t,r){await r(async()=>{try{let o={logGroupName:e},n=new i.CreateLogGroupCommand(o);await t.send(n)}catch(o){if(o.name==="ResourceAlreadyExistsException")return;throw o}})}async function w(e,t,r){await r(async()=>{try{let o={logGroupName:e},n=new i.DeleteLogGroupCommand(o);await t.send(n)}catch(o){if(o.name==="ResourceNotFoundException")return;throw o}})}async function g(e,t,r,o){await r(async()=>{if(o){let n={logGroupName:e,retentionInDays:o},a=new i.PutRetentionPolicyCommand(n);await t.send(a)}else{let n={logGroupName:e},a=new i.DeleteRetentionPolicyCommand(n);await t.send(a)}})}async function y(e,t){try{console.log(JSON.stringify({...e,ResponseURL:"..."}));let o=e.ResourceProperties.LogGroupName,n=e.ResourceProperties.LogGroupRegion,a=R(e.ResourceProperties.SdkRetry?.maxRetries)??5,s=h(a),d={logger:console,region:n,maxAttempts:Math.max(5,a)},c=new i.CloudWatchLogsClient(d);if((e.RequestType==="Create"||e.RequestType==="Update")&&(await l(o,c,s),await g(o,c,s,R(e.ResourceProperties.RetentionInDays)),e.RequestType==="Create")){let p=new i.CloudWatchLogsClient({logger:console,region:process.env.AWS_REGION});await l(`/aws/lambda/${t.functionName}`,p,s),await g(`/aws/lambda/${t.functionName}`,p,s,1)}e.RequestType==="Delete"&&e.ResourceProperties.RemovalPolicy==="destroy"&&await w(o,c,s),await r("SUCCESS","OK",o)}catch(o){console.log(o),await r("FAILED",o.message,e.ResourceProperties.LogGroupName)}function r(o,n,a){let s=JSON.stringify({Status:o,Reason:n,PhysicalResourceId:a,StackId:e.StackId,RequestId:e.RequestId,LogicalResourceId:e.LogicalResourceId,Data:{LogGroupName:e.ResourceProperties.LogGroupName}});console.log("Responding",s);let d=require("url").parse(e.ResponseURL),c={hostname:d.hostname,path:d.path,method:"PUT",headers:{"content-type":"","content-length":Buffer.byteLength(s,"utf8")}};return new Promise((p,m)=>{try{let u=require("https").request(c,p);u.on("error",m),u.write(s),u.end()}catch(u){m(u)}})}}exports.handler=y;function R(e,t=10){if(e!==void 0)return parseInt(e,t)}function h(e,t=100,r=10*1e3){return async o=>{let n=0;do try{return await o()}catch(a){if(a.name==="OperationAbortedException"||a.name==="ThrottlingException")if(n<e){n++,await new Promise(s=>setTimeout(s,f(n,t,r)));continue}else throw new Error("Out of attempts to change log group");throw a}while(!0)}}function f(e,t,r){return Math.round(Math.random()*Math.min(r,t*2**e))}
