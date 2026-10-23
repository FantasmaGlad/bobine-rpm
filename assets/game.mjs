export function newGame(kind,random=Math.random) {
 return {kind,random,score:0,lives:3,t:0,lane:1,target:Math.floor(random()*3),y:0,x:240,ballX:240,ballY:260,vx:135,vy:-150,bricks:Array(18).fill(true),ended:false};
}
export function step(s,dt) {
 if(s.ended)return;
 if(s.kind==='catch'){
  s.y+=dt*75;
  if(s.y>=270){if(s.target===s.lane)s.score++;else s.lives--;s.y=0;s.target=Math.floor(s.random()*3);}
 }else{
  s.ballX+=s.vx*dt;s.ballY+=s.vy*dt;
  if(s.ballX<7||s.ballX>473){s.ballX=Math.max(7,Math.min(473,s.ballX));s.vx=-s.vx;}
  if(s.ballY<7){s.ballY=7;s.vy=Math.abs(s.vy);}
  if(s.ballY>=279&&s.ballY<=292&&s.vy>0&&Math.abs(s.ballX-s.x)<50){s.vy=-Math.abs(s.vy);s.ballY=278;}
  for(let i=0;i<18;i++){if(!s.bricks[i])continue;const x=12+(i%6)*78,y=20+Math.floor(i/6)*28;if(s.ballX>x-6&&s.ballX<x+72&&s.ballY>y-6&&s.ballY<y+25){s.bricks[i]=false;s.score++;s.vy=-s.vy;break;}}
  if(s.ballY>326){s.lives--;s.ballX=s.x;s.ballY=260;s.vy=-150;}
 }
 s.ended=s.lives<=0||s.score>=18;
}
if(typeof document!=='undefined'){
 const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),play=document.querySelector('[data-play]'),pause=document.querySelector('[data-pause]'),status=document.querySelector('[role=status]');
 const fr=document.documentElement.lang==='fr',kind=canvas.dataset.kind;let game=newGame(kind),active=false,previous=0,frame=0,lastReport='';
 const styles=getComputedStyle(document.documentElement),ink=styles.getPropertyValue('--text-main').trim(),accent=styles.getPropertyValue('--accent-primary').trim(),bg=styles.getPropertyValue('--bg-canvas').trim();
 function report(){const text=(fr?'Score':'Score')+' : '+game.score+' / 18 · '+(fr?'Vies':'Lives')+' : '+game.lives+(game.ended?(game.score>=18?(fr?' · Bravo !':' · Well done!'):(fr?' · Partie terminée':' · Game over')):'');if(text!==lastReport){status.textContent=text;lastReport=text;}}
 function draw(){ctx.fillStyle=bg;ctx.fillRect(0,0,480,320);ctx.fillStyle=ink;if(kind==='catch'){ctx.strokeStyle=ink;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(i*160,0);ctx.lineTo(i*160,320);ctx.stroke();}ctx.beginPath();ctx.arc(game.target*160+80,game.y+12,10,0,Math.PI*2);ctx.fill();ctx.fillStyle=accent;ctx.fillRect(game.lane*160+40,285,80,12);}else{game.bricks.forEach((on,i)=>{if(on)ctx.fillRect(12+i%6*78,20+Math.floor(i/6)*28,66,18);});ctx.beginPath();ctx.arc(game.ballX,game.ballY,6,0,Math.PI*2);ctx.fill();ctx.fillRect(game.x-45,287,90,10);}}
 function tick(now){if(!active)return;step(game,Math.min((now-previous)/1000,.035));previous=now;draw();report();if(game.ended){stop();return;}frame=requestAnimationFrame(tick);}
 function stop(){active=false;cancelAnimationFrame(frame);pause.disabled=true;play.textContent=fr?'Reprendre':'Resume';}
 function start(){if(game.ended)game=newGame(kind);if(active)return;active=true;previous=performance.now();pause.disabled=false;play.textContent=fr?'En cours':'Playing';canvas.focus();frame=requestAnimationFrame(tick);}
 function move(dir){if(kind==='catch')game.lane=Math.max(0,Math.min(2,game.lane+dir));else game.x=Math.max(45,Math.min(435,game.x+dir*30));draw();}
 play.addEventListener('click',start);pause.addEventListener('click',stop);document.querySelector('[data-reset]').addEventListener('click',()=>{stop();game=newGame(kind);draw();report();play.textContent=fr?'Jouer':'Play';});
 document.querySelector('[data-left]').addEventListener('click',()=>move(-1));document.querySelector('[data-right]').addEventListener('click',()=>move(1));
 canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}else if(e.key===' '||e.key==='Enter'){e.preventDefault();active?stop():start();}else if(e.key==='Escape')stop();});
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.buttons===0)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*480/r.width;if(kind==='catch')game.lane=Math.max(0,Math.min(2,Math.floor(x/160)));else game.x=Math.max(45,Math.min(435,x));draw();});
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*480/r.width;if(kind==='catch')game.lane=Math.max(0,Math.min(2,Math.floor(x/160)));else game.x=Math.max(45,Math.min(435,x));draw();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('blur',stop);draw();report();
}
