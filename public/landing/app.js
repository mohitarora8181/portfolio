import * as THREE from 'three';

const DATA_URL='/api/portfolio';
const COLORS={paper:0xe8dfcd,paper2:0xf3ecdf,ink:0x292824,red:0xc95039,blue:0x3f7188,green:0x527253,ochre:0xc38a32};
const ACCENTS={projects:COLORS.red,experience:COLORS.blue,profile:COLORS.green,education:COLORS.ochre,skills:COLORS.red,research:COLORS.blue,achievements:COLORS.green,open_source:COLORS.ochre,contact:COLORS.red};
const WORLD_THEMES={
  light:{paper:0xe8dfcd,paper2:0xf3ecdf,ink:0x292824,canvas:0xe8dfcd,fog:0xe8dfcd},
  dark:{paper:0x222622,paper2:0x303530,ink:0xf0ece4,canvas:0x101210,fog:0x151815}
};
const ROOM_INFO={
  hall:{name:'The Journey',progress:'00 / 09'},
  projects:{name:'Projects',number:'01',progress:'01 / 09',description:'Select a framed project to see its purpose, stack, and working links.'},
  experience:{name:'Experience',number:'02',progress:'02 / 09',description:'Roles, responsibilities, progression, and the systems built along the way.'},
  profile:{name:'Profile',number:'03',progress:'03 / 09',description:'Mohit’s background, engineering focus, contact details, and professional profiles.'},
  education:{name:'Education',number:'04',progress:'04 / 09',description:'Academic history, institution, timeline, and performance.'},
  skills:{name:'Skills',number:'05',progress:'05 / 09',description:'Technical capabilities organized by discipline, platform, and infrastructure.'},
  research:{name:'Research',number:'06',progress:'06 / 09',description:'Current investigations, methods, technical stacks, and research outcomes.'},
  achievements:{name:'Achievements',number:'07',progress:'07 / 09',description:'Recognition, leadership positions, and competition milestones.'},
  open_source:{name:'Open Source',number:'08',progress:'08 / 09',description:'Community contributions, repositories, demos, and collaborative work.'},
  contact:{name:'Contact',number:'09',progress:'09 / 09',description:'Start a conversation or continue through Mohit’s professional profiles.'}
};
let CHAPTER_TARGETS={projects:6,experience:-18,profile:-36,education:-50,skills:-64,research:-80,achievements:-96,open_source:-112,contact:-128};
const fallback={meta:{name:'',tagline:'',avatar:'',email:'',phone:'',resume_url:'',links:{}},projects:[],experience:[],education:[],research:[],achievements:[],open_source:[],skills:{}};

let data=fallback,currentRoom='hall',hovered=null,targetZ=9,targetX=0,targetYaw=0,targetRoll=0,transitioning=false,started=false;
let activeTheme=document.documentElement.dataset.theme==='dark'?'dark':'light';
let renderer,scene,camera,raycaster,pointer,clock,paperTexture;
let interactables=[],animated=[],audioContext,ambientGain;
const canvas=document.querySelector('#world');
const $=s=>document.querySelector(s);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const escapeText=value=>String(value??'').slice(0,170);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function makePaperTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#e8dfcd';x.fillRect(0,0,512,512);
  x.globalAlpha=.1;x.strokeStyle='#5b554b';x.lineWidth=.6;
  for(let i=0;i<850;i++){const px=Math.random()*512,py=Math.random()*512,l=Math.random()*18+2;x.beginPath();x.moveTo(px,py);x.lineTo(px+l,py+(Math.random()-.5)*2);x.stroke()}
  x.globalAlpha=.035;for(let i=0;i<3500;i++){x.fillStyle=Math.random()>.5?'#000':'#fff';x.fillRect(Math.random()*512,Math.random()*512,1,1)}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.colorSpace=THREE.SRGBColorSpace;return t;
}

function material(color=COLORS.paper,map=paperTexture){const role=color===COLORS.paper?'paper':color===COLORS.paper2?'paper2':null,isAccent=Object.values(ACCENTS).includes(color);const m=new THREE.MeshStandardMaterial({color:role?WORLD_THEMES[activeTheme][role]:color,map,roughness:.95,metalness:0,side:THREE.DoubleSide});if(role)m.userData.themeRole=role;if(isAccent){m.userData.accentColor=color;m.emissive.setHex(activeTheme==='dark'?color:0x000000);m.emissiveIntensity=activeTheme==='dark'?.38:0}return m}
function inkMaterial(){const m=new THREE.LineBasicMaterial({color:WORLD_THEMES[activeTheme].ink,transparent:true,opacity:activeTheme==='dark'?.94:.72});m.userData.themeRole='ink';return m}
function outlinedBox(w,h,d,color=COLORS.paper){
  const g=new THREE.BoxGeometry(w,h,d),m=new THREE.Mesh(g,material(color));m.castShadow=true;m.receiveShadow=true;
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(g,18),inkMaterial());e.scale.setScalar(1.002);m.add(e);return m;
}
function outlinedPlane(w,h,color=COLORS.paper){return outlinedBox(w,h,.055,color)}
function setPosterTexture(mesh,texture){const m=mesh.material;m.map=texture;m.userData.isPoster=true;m.emissiveMap=texture;m.emissive.setHex(activeTheme==='dark'?0xffffff:0x000000);m.emissiveIntensity=activeTheme==='dark'?.48:0;m.needsUpdate=true}

function labelTexture(text,options={}){
  const {w=700,h=150,size=72,color=activeTheme==='dark'?'#e9e4da':'#252522',accent=null,align='center'}=options;
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.clearRect(0,0,w,h);x.textAlign=align;x.textBaseline='middle';x.fillStyle=color;x.font=`700 ${size}px Caveat, cursive`;
  const px=align==='center'?w/2:align==='left'?18:w-18;x.fillText(text,px,h*.48);
  if(accent){x.strokeStyle=accent;x.lineWidth=7;x.beginPath();x.moveTo(w*.2,h*.82);x.quadraticCurveTo(w*.5,h*.74,w*.8,h*.83);x.stroke()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function skillLabelTexture(text){
  const c=document.createElement('canvas');c.width=512;c.height=120;const x=c.getContext('2d');let size=40;x.textAlign='center';x.textBaseline='middle';x.fillStyle=activeTheme==='dark'?'#f0ece4':'#252522';
  do{x.font=`700 ${size}px Manrope, sans-serif`;size-=1}while(x.measureText(text).width>460&&size>24);
  x.fillText(text,256,60);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;return t;
}
function textPlane(text,w,h,pos,rotation={x:0,y:0,z:0},options={}){
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:labelTexture(text,options),transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  mesh.position.copy(pos);mesh.rotation.set(rotation.x||0,rotation.y||0,rotation.z||0);mesh.userData.themeText={text,options};scene.add(mesh);return mesh;
}
function posterTexture(title,subtitle,tags=[],accent='#c95039',imageUrl=''){
  const c=document.createElement('canvas');c.width=720;c.height=900;const x=c.getContext('2d');x.fillStyle='#eee6d6';x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='#282721';x.lineWidth=7;x.strokeRect(15,15,690,870);x.font='700 82px Caveat';x.fillStyle='#282721';x.fillText(title.toUpperCase(),45,105);
  x.strokeStyle=accent;x.lineWidth=8;x.beginPath();x.moveTo(45,132);x.lineTo(400,125);x.stroke();
  x.fillStyle='#d9d1c1';x.fillRect(45,175,630,360);x.strokeStyle='#282721';x.lineWidth=4;x.strokeRect(45,175,630,360);
  x.globalAlpha=.25;for(let i=0;i<14;i++){x.beginPath();x.moveTo(70,210+i*21);x.lineTo(650,198+i*23);x.stroke()}x.globalAlpha=1;
  x.font='600 35px Caveat';x.fillStyle='#4f4b43';wrapCanvasText(x,subtitle,48,605,620,42);
  x.font='700 24px Inter';tags.slice(0,4).forEach((tag,i)=>{const tx=48+i%2*300,ty=765+Math.floor(i/2)*50;x.strokeStyle='#282721';x.lineWidth=2;x.strokeRect(tx,ty-24,265,35);x.fillStyle='#282721';x.fillText(tag,tx+12,ty)});
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function wrapCanvasText(x,text,left,top,maxWidth,lineHeight){const words=escapeText(text).split(' ');let line='';for(const word of words){const test=line+word+' ';if(x.measureText(test).width>maxWidth&&line){x.fillText(line,left,top);line=word+' ';top+=lineHeight}else line=test}x.fillText(line,left,top)}

function updateRoomUI(room){
  const info=ROOM_INFO[room]||ROOM_INFO.hall;
  $('#roomName').textContent=info.name;
  $('#roomProgress').textContent=info.progress;
  const isIntro=room==='hall';
  $('#roomContext').classList.toggle('visible',started&&!isIntro);
  $('#contentIndex').classList.toggle('visible',started&&!isIntro);
  $('#journeyRail').classList.toggle('visible',started);
  $('#availability').classList.remove('hidden');
  $('#availability span').textContent=room==='contact'?'Available for opportunities':isIntro?'Available for selected projects':`Exploring ${info.name.toLowerCase()}`;
  document.querySelectorAll('[data-guide-room]').forEach(button=>{const active=button.dataset.guideRoom===room;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
  if(!isIntro){$('#roomNumber').textContent=info.number;$('#roomTitle').textContent=info.name;$('#roomDescription').textContent=info.description}
  populateContentIndex(room);
}
function populateContentIndex(room){
  const index=$('#contentIndex'),groups=[];
  const add=(label,items)=>{if(items.length)groups.push({label,items})};
  if(room==='projects')add('Projects',(data.projects||[]).map(item=>({label:item.name,kind:'project',item})));
  if(room==='experience')add('Experience',(data.experience||[]).map(item=>({label:item.company,kind:'experience',item})));
  if(room==='profile')add('Profile',[{label:data.meta?.name||'Profile',kind:'profile',item:data.meta||{}}]);
  if(room==='education')add('Education',(data.education||[]).map(item=>({label:item.degree,kind:'education',item})));
  if(room==='skills')add('Skills',Object.values(data.skills||{}).map(item=>({label:item.label,kind:'skill',item})));
  if(room==='research')add('Research',(data.research||[]).map(item=>({label:item.title,kind:'research',item})));
  if(room==='achievements')add('Achievements',(data.achievements||[]).map(item=>({label:item.title,kind:'achievement',item})));
  if(room==='open_source')add('Open source',(data.open_source||[]).map(item=>({label:item.name,kind:'open_source',item})));
  if(room==='contact')add('Contact',[{label:'Contact & profiles',kind:'profile',item:data.meta||{}}]);
  const nodes=[];let number=0;
  groups.forEach(group=>{const heading=document.createElement('p');heading.className='content-index-group';heading.textContent=group.label;nodes.push(heading);group.items.forEach(entry=>{number+=1;const button=document.createElement('button'),count=document.createElement('span');count.textContent=String(number).padStart(2,'0');button.append(count,document.createTextNode(entry.label));button.addEventListener('click',()=>showPanel(entry.kind,entry.item));nodes.push(button)})});
  index.replaceChildren(...nodes);
}

function clearWorld(){while(scene.children.length)scene.remove(scene.children[0]);interactables=[];animated=[];hovered=null;closePanel();}
function addLights(){scene.add(new THREE.HemisphereLight(0xfff8e8,0x786f61,2.1));const key=new THREE.DirectionalLight(0xfff4dd,2.7);key.position.set(2,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key)}
function addRoomShell(depth=24,width=11){
  const floor=outlinedBox(width,.16,depth,COLORS.paper2);floor.position.set(0,-.1,-depth/2+4);floor.receiveShadow=true;scene.add(floor);
  const ceiling=outlinedBox(width,.12,depth,COLORS.paper);ceiling.position.set(0,5.2,-depth/2+4);scene.add(ceiling);
  const left=outlinedBox(.12,5.3,depth,COLORS.paper);left.position.set(-width/2,2.55,-depth/2+4);scene.add(left);
  const right=left.clone();right.position.x=width/2;scene.add(right);
  const back=outlinedBox(width,5.3,.12,COLORS.paper);back.position.set(0,2.55,4-depth);scene.add(back);
  for(let z=2;z>4-depth;z-=5){const beam=outlinedBox(width,.16,.18,COLORS.paper2);beam.position.set(0,5.03,z);scene.add(beam);const lamp=outlinedBox(.72,.16,.72,0x7f7669);lamp.position.set(0,4.75,z-.7);scene.add(lamp)}
}

function addDoor({room,label,side,z,accent}){
  const group=new THREE.Group();const x=side==='left'?-5.38:5.38;group.position.set(x,0,z);group.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;
  const frame=outlinedBox(3.15,4.8,.3,COLORS.paper2);frame.position.y=2.36;group.add(frame);
  const door=outlinedBox(2.65,4.35,.34,accent);door.position.set(0,2.17,.18);door.userData={type:'door',room,label,baseColor:accent};group.add(door);interactables.push(door);
  const knob=new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),material(0x7d6844));knob.position.set(side==='left'?-1:1,2.12,.41);door.add(knob);
  const signOptions={accent:'#'+accent.toString(16).padStart(6,'0')};const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.3,.9),new THREE.MeshBasicMaterial({map:labelTexture(label,signOptions),transparent:true,side:THREE.DoubleSide}));sign.position.set(0,4.95,.18);sign.userData.themeText={text:label,options:signOptions};group.add(sign);
  scene.add(group);animated.push({object:door,kind:'door'});return group;
}
function addWallNote(text,side,z,y=2.4){const p=outlinedPlane(1.9,2.1,COLORS.paper2);p.position.set(side==='left'?-5.39:5.39,y,z);p.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;scene.add(p);const t=textPlane(text,1.65,1.1,new THREE.Vector3(p.position.x+(side==='left'?.035:-.035),y,z),{y:p.rotation.y},{w:500,h:330,size:48,align:'center'});t.renderOrder=2}

function addJourneyMarker(room,z,side){
  const info=ROOM_INFO[room],accent=ACCENTS[room];
  const floorBand=outlinedBox(10.65,.035,.18,accent);floorBand.position.set(0,.02,z+2.1);scene.add(floorBand);
  const ceilingBand=outlinedBox(10.65,.11,.16,accent);ceilingBand.position.set(0,5.02,z+2.1);scene.add(ceilingBand);
  const x=side==='left'?-5.39:5.39,rotationY=side==='left'?Math.PI/2:-Math.PI/2;
  textPlane(`${info.number}  ${info.name.toUpperCase()}`,3.8,.82,new THREE.Vector3(x,3.72,z),{y:rotationY},{w:820,h:170,size:68,align:'center',accent:'#'+accent.toString(16).padStart(6,'0')});
}

function addJourneyCard({kind,item,title,subtitle='',tags=[],side='left',z,accent}){
  const x=side==='left'?-5.36:5.36,rotationY=side==='left'?Math.PI/2:-Math.PI/2;
  const card=outlinedPlane(3.55,3.8,accent);card.position.set(x,2.55,z);card.rotation.y=rotationY;
  setPosterTexture(card,posterTexture(title,subtitle,tags,'#'+accent.toString(16).padStart(6,'0')));
  card.userData={type:'panel',panelKind:kind,item,label:`Open ${item.name||item.company||item.title||item.degree||item.label||kind}`};
  scene.add(card);interactables.push(card);animated.push({object:card,kind:'poster',baseX:x});return card;
}

function addFrontSkillField(baseZ=-70.2){
  const groups=Object.values(data.skills||fallback.skills),entries=[],maxItems=Math.max(0,...groups.map(group=>(group.items||[]).length));
  for(let itemIndex=0;itemIndex<maxItems;itemIndex+=1)groups.forEach((group,groupIndex)=>{const name=group.items?.[itemIndex];if(name)entries.push({name,group,groupIndex})});
  const columns=7,spacingX=1.43,spacingY=.59,startX=-4.29,startY=4.28,colors=[COLORS.red,COLORS.blue,COLORS.green,COLORS.ochre];
  entries.forEach((entry,index)=>{const column=index%columns,row=Math.floor(index/columns),x=startX+column*spacingX,y=startY-row*spacingY,z=baseZ-(index%3)*.035,tilt=((index*7)%5-2)*.008;
    const tile=outlinedPlane(1.31,.45,COLORS.paper2);tile.position.set(x,y,z);tile.rotation.z=tilt;tile.userData={type:'panel',panelKind:'skill',item:entry.group,label:`Open ${entry.name}`};scene.add(tile);interactables.push(tile);
    const label=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.31),new THREE.MeshBasicMaterial({map:skillLabelTexture(entry.name),transparent:true,depthWrite:false,side:THREE.DoubleSide}));label.position.set(x,y,z+.034);label.rotation.z=tilt;label.renderOrder=2;label.userData.themeSkill=entry.name;scene.add(label);
    const band=new THREE.Mesh(new THREE.PlaneGeometry(1.08,.022),new THREE.MeshBasicMaterial({color:colors[entry.groupIndex%colors.length],side:THREE.DoubleSide}));band.position.set(x,y-.17,z+.038);band.rotation.z=tilt;band.renderOrder=3;scene.add(band)
  });
}

function buildJourney(){
  clearWorld();currentRoom='hall';updateRoomUI('hall');$('#introCard').classList.toggle('hidden',started);$('#controlText').textContent='MOVE TO LOOK  •  SCROLL TO WALK';addLights();
  const chapterEntries={projects:data.projects||[],experience:data.experience||[],profile:[data.meta||fallback.meta],education:data.education||[],skills:Object.values(data.skills||{}),research:data.research||[],achievements:data.achievements||[],open_source:data.open_source||[],contact:[data.meta||fallback.meta]};
  const roomOrder=Object.keys(chapterEntries),layout={};let cursor=3;
  roomOrder.forEach((room,index)=>{const count=room==='skills'?Math.max(1,Math.ceil(chapterEntries.skills.reduce((total,group)=>total+(group.items||[]).length,0)/14)):Math.max(1,chapterEntries[room].length);const depth=Math.max(14,count*4+6);layout[room]={start:cursor,side:index%2?'right':'left'};cursor-=depth});
  CHAPTER_TARGETS=Object.fromEntries(roomOrder.map(room=>[room,layout[room].start-2]));
  addRoomShell(Math.abs(cursor)+12,11);
  roomOrder.forEach(room=>addJourneyMarker(room,layout[room].start,layout[room].side));

  const projects=data.projects||[];projects.forEach((project,i)=>{const side=i%2?'right':'left',x=side==='left'?-5.36:5.36,z=layout.projects.start-3-i*4,ry=side==='left'?Math.PI/2:-Math.PI/2,accent=['#c95039','#3f7188','#527253','#c38a32'][i%4];const frame=outlinedPlane(3.35,4.15,i===0?ACCENTS.projects:COLORS.paper2);frame.position.set(x,2.7,z);frame.rotation.y=ry;setPosterTexture(frame,posterTexture(project.name,project.tagline||project.description,project.tech_stack,accent));frame.userData={type:'project',item:project,label:`Open ${project.name}`};scene.add(frame);interactables.push(frame);animated.push({object:frame,kind:'poster',baseX:x})});

  const jobs=data.experience||[];jobs.forEach((job,i)=>{const side=i%2?'right':'left',x=side==='left'?-5.36:5.36,z=layout.experience.start-3-i*4,ry=side==='left'?Math.PI/2:-Math.PI/2;const card=outlinedPlane(3.7,3.35,i===0?COLORS.blue:COLORS.paper2);card.position.set(x,2.55,z);card.rotation.y=ry;setPosterTexture(card,posterTexture(job.company,`${job.role} · ${job.start_date?.slice?.(0,4)||job.start_date} — ${job.current?'NOW':job.end_date?.slice?.(0,4)||''}`,job.tech_stack,'#3f7188'));card.userData={type:'experience',item:job,label:`Open ${job.company}`};scene.add(card);interactables.push(card);animated.push({object:card,kind:'poster',baseX:x})});

  const profile=data.meta||fallback.meta;addJourneyCard({kind:'profile',item:profile,title:profile.name||'PROFILE',subtitle:profile.tagline,tags:[],side:layout.profile.side,z:layout.profile.start-3,accent:ACCENTS.profile});
  (data.education||[]).forEach((item,i)=>addJourneyCard({kind:'education',item,title:`EDUCATION ${String(i+1).padStart(2,'0')}`,subtitle:`${item.degree} · ${item.institution}`,tags:[`${item.start_year} — ${item.end_year}`,`CGPA ${item.cgpa}`],side:i%2?'left':'right',z:layout.education.start-3-i*4,accent:ACCENTS.education}));
  addFrontSkillField(layout.skills.start-3);
  (data.research||[]).forEach((item,i)=>addJourneyCard({kind:'research',item,title:`RESEARCH ${String(i+1).padStart(2,'0')}`,subtitle:item.title,tags:item.tech_stack||[],side:i%2?'right':'left',z:layout.research.start-3-i*4,accent:ACCENTS.research}));
  (data.achievements||[]).forEach((item,i)=>addJourneyCard({kind:'achievement',item,title:`MILESTONE ${String(i+1).padStart(2,'0')}`,subtitle:item.title,tags:[item.issuer,item.year].filter(Boolean),side:i%2?'left':'right',z:layout.achievements.start-3-i*4,accent:ACCENTS.achievements}));
  (data.open_source||[]).forEach((item,i)=>addJourneyCard({kind:'open_source',item,title:item.name,subtitle:`${item.role||'Contributor'} · Open source`,tags:[],side:i%2?'right':'left',z:layout.open_source.start-3-i*4,accent:ACCENTS.open_source}));

  const envelope=outlinedPlane(5.2,3.2,ACCENTS.contact);envelope.position.set(0,2.35,layout.contact.start-3);envelope.userData={type:'contact',label:'Open contact details'};scene.add(envelope);interactables.push(envelope);textPlane('LET’S BUILD SOMETHING GREAT',4.65,.85,new THREE.Vector3(0,2.9,layout.contact.start-2.94),{}, {w:1000,h:180,size:52});textPlane(data.meta?.email||fallback.meta.email,4.3,.6,new THREE.Vector3(0,1.72,layout.contact.start-2.93),{}, {size:38});
  addWallNote('NINE CHAPTERS\nONE JOURNEY', 'left',layout.contact.start-9,2.7);

  camera.position.set(0,1.68,10);camera.rotation.set(0,0,0);targetZ=started?CHAPTER_TARGETS.projects:10;resetLook();
}

function chapterForPosition(z){
  const chapters=Object.entries(CHAPTER_TARGETS).sort(([,a],[,b])=>b-a);
  for(let index=0;index<chapters.length;index+=1){
    const [room,target]=chapters[index],next=chapters[index+1]?.[1];
    if(next===undefined||z>(target+next)/2)return room;
  }
  return 'contact';
}
function updateJourneyChapter(){if(!started)return;const chapter=chapterForPosition(targetZ);if(chapter!==currentRoom){currentRoom=chapter;updateRoomUI(chapter)}}
function setJourneyAccess(enabled){
  const intro=$('#introCard');
  document.querySelectorAll('body > *').forEach(element=>{if(element===intro)element.inert=enabled;else if(!['loader','SCRIPT','NOSCRIPT'].includes(element.id||element.tagName))element.inert=!enabled});
  intro.setAttribute('aria-hidden',String(enabled));
}
function jumpToChapter(room){if(!CHAPTER_TARGETS[room])return;started=true;setJourneyAccess(true);$('#introCard').classList.add('hidden');closePanel();toggleMenu(false);currentRoom=room;updateRoomUI(room);targetZ=CHAPTER_TARGETS[room];setTimeout(()=>canvas.focus({preventScroll:true}),720)}

function buildHall(){
  clearWorld();currentRoom='hall';updateRoomUI('hall');$('#backButton').classList.remove('visible');$('#controlText').textContent='MOVE TO LOOK  •  SCROLL TO WALK';addLights();addRoomShell(28);
  addDoor({room:'projects',label:'PROJECTS',side:'left',z:1.2,accent:COLORS.red});
  addDoor({room:'experience',label:'EXPERIENCE',side:'left',z:-7,accent:COLORS.blue});
  addDoor({room:'about',label:'ABOUT',side:'right',z:-3.1,accent:COLORS.green});
  addDoor({room:'contact',label:'CONTACT',side:'right',z:-11,accent:COLORS.ochre});
  addWallNote('FULL-STACK\nWEB APPS\n\nReact · Node\nTypeScript', 'left',-2.8);
  addWallNote('ROBOTICS\nAUTOMATION\nIoT', 'right',-7.3);
  addReception();
  camera.position.set(0,1.65,10);camera.rotation.set(0,0,0);targetZ=started?7.5:10;resetLook();
}
function addReception(){const desk=outlinedBox(5,1.25,1.3,COLORS.paper2);desk.position.set(0,.65,-19.8);scene.add(desk);textPlane('MOHIT ARORA',3.8,.7,new THREE.Vector3(0,.85,-19.13),{}, {size:75});textPlane('Pick a door.',3.5,1.1,new THREE.Vector3(0,3,-19.3),{}, {size:82});const head=new THREE.Mesh(new THREE.CircleGeometry(.68,32),material(0xd1b09a));head.position.set(0,2.15,-19.15);scene.add(head);const hair=new THREE.Mesh(new THREE.CircleGeometry(.72,9,0,Math.PI),material(COLORS.ink));hair.position.set(0,2.46,-19.1);scene.add(hair)}

function buildProjectsRoom(){
  clearWorld();currentRoom='projects';setupRoom('PROJECTS ROOM');const projects=data.projects||[];const placements=[[-4.72,2.7,1.2,Math.PI/2],[4.72,2.65,-3,-Math.PI/2],[-4.72,2.55,-7.2,Math.PI/2],[4.72,2.55,-11.2,-Math.PI/2]];
  projects.forEach((project,i)=>{const [x,y,z,ry]=placements[i];const accent=['#c95039','#3f7188','#527253','#c38a32'][i];const frame=outlinedPlane(3.4,4.25,i===0?ACCENTS.projects:COLORS.paper2);frame.position.set(x,y,z);frame.rotation.y=ry;frame.material.map=posterTexture(project.name,project.tagline||project.description,project.tech_stack,accent);frame.material.needsUpdate=true;frame.userData={type:'project',item:project,label:`Open ${project.name}`};scene.add(frame);interactables.push(frame);animated.push({object:frame,kind:'poster',baseX:x})});
  addBackDoor(-15.5);camera.position.set(0,1.7,8.5);targetZ=8.2;targetYaw=0;
}
function setupRoom(name){updateRoomUI(currentRoom);$('#backButton').classList.add('visible');$('#introCard').classList.add('hidden');$('#doorGuide').classList.remove('visible');$('#controlText').textContent='MOVE TO LOOK  •  SELECT A FRAME';resetLook();addLights();addRoomShell(24,10)}
function addBackDoor(z){const door=outlinedBox(2.4,4,.28,COLORS.blue);door.position.set(0,2,z+.1);door.userData={type:'back',label:'Back to hall'};scene.add(door);interactables.push(door);textPlane('BACK TO HALL',3.1,.7,new THREE.Vector3(0,4.55,z+.18),{}, {size:62,accent:'#3f7188'})}

function buildExperienceRoom(){
  clearWorld();currentRoom='experience';setupRoom('EXPERIENCE ROOM');const jobs=data.experience||[];jobs.forEach((job,i)=>{const side=i%2?'right':'left',x=side==='left'?-4.72:4.72,z=1-i*4.15,ry=side==='left'?Math.PI/2:-Math.PI/2;const card=outlinedPlane(3.7,3.5,i===0?COLORS.blue:COLORS.paper2);card.position.set(x,2.6,z);card.rotation.y=ry;card.material.map=posterTexture(job.company,`${job.role} · ${job.start_date?.slice?.(0,4)||job.start_date} — ${job.current?'NOW':job.end_date?.slice?.(0,4)||''}`,job.tech_stack,'#3f7188');card.material.needsUpdate=true;card.userData={type:'experience',item:job,label:`Open ${job.company}`};scene.add(card);interactables.push(card);animated.push({object:card,kind:'poster',baseX:x})});addBackDoor(-15.5);camera.position.set(0,1.7,8);targetZ=6;targetYaw=0;
}

function buildAboutRoom(){
  clearWorld();currentRoom='about';setupRoom('ABOUT ROOM');const edu=data.education?.[0]||fallback.education[0];
  const portrait=outlinedPlane(4.2,4.8,COLORS.green);portrait.position.set(-2.5,2.75,-3);portrait.rotation.y=.12;portrait.userData={type:'about',item:edu,label:`About ${data.meta?.name||'profile'}`};scene.add(portrait);interactables.push(portrait);
  portrait.material.map=posterTexture(data.meta?.name||'PROFILE',data.meta?.tagline||fallback.meta.tagline,[edu.degree,`${edu.start_year} — ${edu.end_year}`],'#527253');portrait.material.needsUpdate=true;
  const allSkills=Object.values(data.skills||fallback.skills).flatMap(s=>s.items||[]).slice(0,18);allSkills.forEach((skill,i)=>{const angle=i*.9,z=-1-Math.floor(i/5)*2.2,x=1.2+(i%5)*.73,y=1.15+(i%3)*.95;const p=textPlane(skill,1.8,.55,new THREE.Vector3(x,y,z),{z:(i%3-1)*.08},{size:54,color:['#252522','#c95039','#3f7188','#527253'][i%4]});animated.push({object:p,kind:'float',phase:angle,baseY:y})});addBackDoor(-15.5);camera.position.set(0,1.7,8);targetZ=5;targetYaw=0;
}

function buildContactRoom(){
  clearWorld();currentRoom='contact';setupRoom('CONTACT ROOM');$('#controlText').textContent='SELECT THE ENVELOPE';
  const envelope=outlinedPlane(5.2,3.2,COLORS.ochre);envelope.position.set(0,2.4,-4);envelope.userData={type:'contact',label:'Send Mohit an email'};scene.add(envelope);interactables.push(envelope);textPlane('LET’S BUILD\nSOMETHING GREAT',4.4,1.8,new THREE.Vector3(0,3,-3.94),{}, {w:650,h:300,size:65});textPlane(data.meta?.email||fallback.meta.email,4.3,.6,new THREE.Vector3(0,1.45,-3.93),{}, {size:38});
  for(let i=0;i<9;i++){const plane=textPlane(i%2?'⌁':'➤',.8,.8,new THREE.Vector3(-4+i,1.1+(i%3),-7-i*.6),{z:i*.15},{size:75,color:i%2?'#3f7188':'#c38a32'});animated.push({object:plane,kind:'float',phase:i,baseY:plane.position.y})}addBackDoor(-15.5);camera.position.set(0,1.7,8);targetZ=4;targetYaw=0;
}

function panelList(title,items=[]){return items.length?`<section><h3>${escapeHTML(title)}</h3><ul>${items.map(value=>`<li>${escapeHTML(value)}</li>`).join('')}</ul></section>`:''}
function panelActions(links={}){return Object.entries(links).filter(([,value])=>value).map(([label,value])=>`<a href="${safeUrl(value)}" target="_blank" rel="noreferrer">${escapeHTML(label.replaceAll('_',' '))} ↗</a>`).join('')}
function dateRange(item){return `${item.start_date||item.start_year||''} — ${item.current?'Present':item.end_date||item.end_year||''}`}
function showPanel(kind,item={}){
  const kicker=$('#panelKicker'),title=$('#panelTitle'),meta=$('#panelMeta'),copy=$('#panelCopy'),details=$('#panelDetails'),tags=$('#panelTags'),actions=$('#panelActions'),media=$('#panelMedia');
  let imageUrl='',imageAlt='',imageCaption='',detailHTML='',actionLinks={},tagItems=[];
  kicker.textContent={project:'Selected project',experience:'Career chapter',profile:'Profile',education:'Education',skill:'Skill group',research:'Research',achievement:'Achievement',open_source:'Open source'}[kind]||'Portfolio';
  title.textContent=item.name||item.company||item.title||item.degree||item.label||'Mohit Arora';
  meta.textContent='';copy.textContent='';
  if(kind==='project'){
    meta.textContent=[item.date,item.status,item.type?.replaceAll('_',' '),item.featured?'Featured':null].filter(Boolean).join(' · ');
    copy.textContent=[item.tagline,item.description].filter(Boolean).join(' ');detailHTML=panelList('Highlights',item.highlights);tagItems=item.tech_stack||[];actionLinks=item.links||{};imageUrl=item.images?.[0]?.url||'';imageAlt=item.images?.[0]?.alt||item.name;imageCaption=item.images?.[0]?.caption||'';
  }else if(kind==='experience'){
    meta.textContent=[item.role,item.location,item.type?.replaceAll('_',' '),dateRange(item)].filter(Boolean).join(' · ');
    detailHTML=panelList('Highlights',item.highlights)+panelList('Progression',(item.progression||[]).map(step=>`${step.role} · ${dateRange(step)}`));tagItems=item.tech_stack||[];actionLinks={company:item.company_url};imageUrl=item.images?.[0]?.url||item.company_logo||'';imageAlt=item.images?.[0]?.alt||item.company;imageCaption=item.images?.[0]?.caption||'';
  }else if(kind==='profile'){
    title.textContent=item.name||'Mohit Arora';meta.textContent=item.tagline||'';copy.textContent=[item.email,item.phone].filter(Boolean).join(' · ');imageUrl=item.avatar||'';imageAlt=item.name||'Profile';actionLinks={resume:item.resume_url,email:item.email?`mailto:${item.email}`:'',phone:item.phone?`tel:${item.phone.replace(/\s/g,'')}`:'',...(item.links||{})};
  }else if(kind==='education'){
    title.textContent=item.degree||'Education';meta.textContent=[item.institution,dateRange(item),item.cgpa?`CGPA ${item.cgpa}`:''].filter(Boolean).join(' · ');imageUrl=item.logo||'';imageAlt=item.institution||'Institution';
  }else if(kind==='skill'){
    title.textContent=item.label||'Skills';meta.textContent=`${(item.items||[]).length} technologies`;tagItems=item.items||[];imageUrl=item.images?.[0]?.url||'';imageAlt=item.images?.[0]?.alt||item.label;imageCaption=item.images?.[0]?.caption||'';
  }else if(kind==='research'){
    meta.textContent=[item.role,item.status?.replaceAll('_',' '),dateRange(item),item.venue].filter(Boolean).join(' · ');detailHTML=panelList('Research work',item.highlights);tagItems=item.tech_stack||[];actionLinks={paper:item.paper_url};imageUrl=item.images?.[0]?.url||'';imageAlt=item.images?.[0]?.alt||item.title;imageCaption=item.images?.[0]?.caption||'';
  }else if(kind==='achievement'){
    meta.textContent=[item.issuer,item.year,item.type].filter(Boolean).join(' · ');copy.textContent=item.description||'';actionLinks={view:item.link};imageUrl=item.image||'';imageAlt=item.title;
  }else if(kind==='open_source'){
    meta.textContent=item.role||'';copy.textContent=item.description||'';actionLinks={repository:item.repo_url,demo:item.demo};imageUrl=item.images?.[0]?.url||'';imageAlt=item.images?.[0]?.alt||item.name;imageCaption=item.images?.[0]?.caption||'';
  }
  copy.hidden=!copy.textContent;details.innerHTML=detailHTML;tags.replaceChildren(...tagItems.map(value=>{const tag=document.createElement('span');tag.textContent=value;return tag}));actions.innerHTML=panelActions(actionLinks);
  media.classList.toggle('visible',!!imageUrl);media.replaceChildren();if(imageUrl){const image=new Image();image.src=safeUrl(imageUrl);image.alt=imageAlt||`${title.textContent} preview`;media.append(image);if(imageCaption){const caption=document.createElement('figcaption');caption.textContent=imageCaption;media.append(caption)}}
  $('#roomPanel').scrollTop=0;$('#roomPanel').classList.add('open');
}
function closePanel(){$('#roomPanel')?.classList.remove('open')}
function safeUrl(value){try{const u=new URL(value);return ['http:','https:','mailto:','tel:'].includes(u.protocol)?u.href:'#'}catch{return'#'}}

function changeRoom(room){jumpToChapter(room)}
function interact(object){const type=object.userData.type;if(type==='project')showPanel('project',object.userData.item);else if(type==='experience')showPanel('experience',object.userData.item);else if(type==='panel')showPanel(object.userData.panelKind,object.userData.item);else if(type==='about')showPanel('profile',data.meta||{});else if(type==='contact')showPanel('profile',data.meta||{})}

function updateRaycast(clientX,clientY,activate=false){pointer.x=clientX/innerWidth*2-1;pointer.y=-(clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(interactables,false)[0]?.object||null;if(hovered!==hit){if(hovered)hovered.scale.setScalar(1);hovered=hit;if(hovered)hovered.scale.setScalar(1.025);$('#crosshair').classList.toggle('active',!!hovered);$('#hotspotLabel').classList.toggle('show',!!hovered);$('#hotspotLabel').textContent=hovered?.userData.label||'';canvas.style.cursor=hovered?'pointer':'grab'}if(activate&&hit)interact(hit)}

function updateLook(clientX){
  if(!finePointer.matches||reducedMotion.matches)return;
  const pointerX=clamp(clientX/innerWidth*2-1,-1,1);
  const easedX=Math.sign(pointerX)*Math.pow(Math.abs(pointerX),1.18);
  targetYaw=-easedX*.35;
  targetX=easedX*.56;
  targetRoll=-easedX*.009;
}
function resetLook(){targetX=0;targetYaw=0;targetRoll=0}

function applyTheme(theme,{persist=true}={}){
  activeTheme=theme==='dark'?'dark':'light';
  document.documentElement.dataset.theme=activeTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',activeTheme==='dark'?'#121412':'#e8dfcd');
  if(persist){try{localStorage.setItem('mohit-portfolio-theme',activeTheme)}catch{}}
  document.querySelectorAll('[data-theme-option]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeOption===activeTheme)));
  if(!renderer||!scene)return;
  const palette=WORLD_THEMES[activeTheme];
  renderer.setClearColor(palette.canvas);
  if(scene.fog)scene.fog.color.setHex(palette.fog);
  scene.traverse(object=>{
    const materials=Array.isArray(object.material)?object.material:[object.material];
    materials.filter(Boolean).forEach(item=>{const role=item.userData?.themeRole;if(role){item.color.setHex(palette[role]);if(role==='ink')item.opacity=activeTheme==='dark'?.94:.72}const accent=item.userData?.accentColor;if(accent&&item.emissive){item.emissive.setHex(activeTheme==='dark'?accent:0x000000);item.emissiveIntensity=activeTheme==='dark'?.38:0}if(item.userData?.isPoster&&item.emissive){item.emissiveMap=item.map;item.emissive.setHex(activeTheme==='dark'?0xffffff:0x000000);item.emissiveIntensity=activeTheme==='dark'?.48:0;item.needsUpdate=true}});
    if(object.userData?.themeText&&object.material){const {text,options}=object.userData.themeText;object.material.map?.dispose();object.material.map=labelTexture(text,options);object.material.needsUpdate=true}
    if(object.userData?.themeSkill&&object.material){object.material.map?.dispose();object.material.map=skillLabelTexture(object.userData.themeSkill);object.material.needsUpdate=true}
  });
}

function setupEvents(){
  let dragging=false,lastX=0,lastY=0,moved=0;
  document.addEventListener('pointerdown',event=>{const panel=$('#roomPanel');if(panel.classList.contains('open')&&!panel.contains(event.target))closePanel()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#roomPanel').classList.contains('open'))closePanel()});
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;moved=0;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{updateRaycast(e.clientX,e.clientY);if(!dragging){updateLook(e.clientX);return}const dx=e.clientX-lastX,dy=e.clientY-lastY;moved+=Math.abs(dx)+Math.abs(dy);lastX=e.clientX;lastY=e.clientY;targetYaw=clamp(targetYaw-dx*.003,-.42,.42);targetX=clamp(targetX+dx*.002,-.65,.65);targetZ=clamp(targetZ+dy*.025,-138,10)});
  canvas.addEventListener('pointerup',e=>{dragging=false;if(moved<10)updateRaycast(e.clientX,e.clientY,true)});
  canvas.addEventListener('pointerleave',()=>{if(!dragging)resetLook()});
  reducedMotion.addEventListener('change',resetLook);
  finePointer.addEventListener('change',resetLook);
  addEventListener('wheel',e=>{if(e.target.closest('.room-panel, .journey-rail, .content-index, .menu')||$('#menu').classList.contains('open')||!started)return;targetZ=clamp(targetZ-e.deltaY*.012,-138,10)},{passive:true});
  addEventListener('resize',resize);
  $('#startButton').addEventListener('click',()=>jumpToChapter('projects'));
  $('.mark').addEventListener('click',()=>jumpToChapter('projects'));$('#panelClose').addEventListener('click',closePanel);
  $('#menuButton').addEventListener('click',()=>toggleMenu());document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>jumpToChapter(b.dataset.room)));document.querySelectorAll('[data-guide-room]').forEach(b=>b.addEventListener('click',()=>jumpToChapter(b.dataset.guideRoom)));
  // $('#soundButton').addEventListener('click',toggleSound);
  document.querySelectorAll('[data-theme-option]').forEach(button=>button.addEventListener('click',()=>applyTheme(button.dataset.themeOption)));
}
function toggleMenu(force){const menu=$('#menu'),open=force??!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));$('#menuButton').setAttribute('aria-expanded',String(open));$('#menuButton span').textContent=open?'CLOSE':'MENU'}
// function toggleSound(){const button=$('#soundButton');if(!audioContext){audioContext=new AudioContext();ambientGain=audioContext.createGain();ambientGain.gain.value=.025;ambientGain.connect(audioContext.destination);[55,82.5].forEach((f,i)=>{const o=audioContext.createOscillator();o.type=i?'sine':'triangle';o.frequency.value=f;o.connect(ambientGain);o.start()})}const on=button.classList.contains('muted')||button.querySelector('span').textContent==='SOUND OFF';ambientGain.gain.setTargetAtTime(on ? .025 : 0,audioContext.currentTime,.25);button.classList.toggle('muted',!on);button.querySelector('span').textContent=on?'SOUND ON':'SOUND OFF'}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))}

function animate(){
requestAnimationFrame(animate);
const dt = Math.min(clock.getDelta(), .1);
const elapsed = clock.elapsedTime;
camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4.2, dt);
camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4.8, dt);
camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, targetYaw, 5.2, dt);
camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, targetRoll, 4.8, dt);
camera.position.y = 1.68 + (reducedMotion.matches ? 0 : Math.sin(elapsed * .8) * .018);
updateJourneyChapter();
animated.forEach(a => {
  if (a.kind === 'float') {
    a.object.position.y = a.baseY + (reducedMotion.matches ? 0 : Math.sin(elapsed * 1.2 + a.phase) * .08);
  } else if (a.kind === 'poster' && a.object === hovered) {
    a.object.position.x = a.baseX + (a.baseX < 0 ? .11 : -.11);
  }
});
renderer.render(scene, camera);
}
async function loadData(){try{const response=await fetch(DATA_URL,{signal:AbortSignal.timeout(5000)});if(response.ok){const remote=await response.json();if(remote&&typeof remote==='object'){data=remote;if(!started)buildJourney();else populateContentIndex(currentRoom)}}}catch(error){console.warn('Live portfolio data unavailable; using bundled fallback.',error)}const links=data.meta?.links||fallback.meta.links;$('#menuLinks').innerHTML=Object.entries(links).filter(([,value])=>value).map(([key,value])=>`<a href="${safeUrl(value)}" target="_blank" rel="noreferrer">${escapeHTML(key)} ↗</a>`).join('')}
async function preload(){
  const loader=$('#loader'),firstVisit=!sessionStorage.getItem('mohit-world-seen');loader.classList.toggle('returning',!firstVisit);
  const minimum=new Promise(resolve=>setTimeout(resolve,firstVisit?1750:260));let progress=firstVisit?3:58;
  const statuses=['Initializing the scene','Laying out the journey','Framing selected work','Opening the gallery'];
  const timer=setInterval(()=>{progress=Math.min(94,progress+(firstVisit?Math.ceil(Math.random()*5):12));$('#loaderValue').textContent=String(progress).padStart(2,'0');$('#loaderProgress').style.transform=`scaleX(${progress/100})`;$('#loaderStatus').textContent=statuses[Math.min(statuses.length-1,Math.floor(progress/25))]},firstVisit?90:45);
  const fontBudget=Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,700))]);loadData();await Promise.all([fontBudget,minimum]);clearInterval(timer);$('#loaderValue').textContent='100';$('#loaderProgress').style.transform='scaleX(1)';$('#loaderStatus').textContent='Ready to explore';sessionStorage.setItem('mohit-world-seen','1');
  setTimeout(()=>{document.body.classList.add('ready');setTimeout(()=>{loader?.remove();if(!started)$('#startButton').focus({preventScroll:true})},1200)},firstVisit?260:80);
}
function init(){const palette=WORLD_THEMES[activeTheme];renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setClearColor(palette.canvas);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;scene=new THREE.Scene();scene.fog=new THREE.FogExp2(palette.fog,.02);camera=new THREE.PerspectiveCamera(61,innerWidth/innerHeight,.1,100);raycaster=new THREE.Raycaster();pointer=new THREE.Vector2();clock=new THREE.Clock();paperTexture=makePaperTexture();resize();buildJourney();setupEvents();setJourneyAccess(false);applyTheme(activeTheme,{persist:false});animate();preload()}

init();
