const fs=require("fs"),zlib=require("zlib"),path=require("path");
const out=path.join(__dirname,"icons");fs.mkdirSync(out,{recursive:true});
const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?(0xedb88320^(n>>>1)):(n>>>1);return n>>>0;});
function crc(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(data.length);c.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([n,t,data,c]);}
function segment(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function png(size){const raw=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++){const p=y*(size*4+1);raw[p]=0;for(let x=0;x<size;x++){const u=x/size,v=y/size;let r=14,g=23,b=24;const route=Math.min(segment(u,v,.25,.70,.5,.54),segment(u,v,.5,.54,.72,.28));const node=Math.min(Math.hypot(u-.25,v-.70),Math.hypot(u-.72,v-.28));if(route<.044||node<.092){r=213;g=250;b=105;}else if(node<.126){r=60;g=91;b=64;}const i=p+1+x*4;raw[i]=r;raw[i+1]=g;raw[i+2]=b;raw[i+3]=255;}}const ih=Buffer.alloc(13);ih.writeUInt32BE(size,0);ih.writeUInt32BE(size,4);ih[8]=8;ih[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("IDAT",zlib.deflateSync(raw,9)),chunk("IEND",Buffer.alloc(0))]);}
for(const size of [192,512]){const target=path.join(out,"icon-"+size+".png");fs.writeFileSync(target,png(size));console.log("Generated "+target);}
