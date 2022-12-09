"use strict"

let canvas = document.getElementById('circles');
let ctx = canvas.getContext('2d');

canvas.addEventListener('click', startTick)

const ResetButton = document.getElementById("clearButton");
const PlotButton = document.getElementById("plotButton");

let robot= new Arm(282.8427, 282.8427, Math.PI/4, 0, 800, 800, 400, 400);

let timer= null;
let timerLength= 24;


function Clear(canvasName) 
{
   ctx.beginPath();
   ctx.clearRect(0,0,canvas.width, canvas.height);
   ctx.stroke();
}

function Axis(canvasName)  
{
   let cx = canvas.width;
   let cy = canvas.height;

   ctx.strokeStyle = "black";
   ctx.lineWidth = 1;
   ctx.beginPath();

   for (let i=0; i < 8;i++) 
   {
      ctx.moveTo(0,cy * i/8);
      ctx.lineTo(10,cy * i/8);

      ctx.moveTo(cx * i/8,cy-5);
      ctx.lineTo(cx * i/8,cy);
   }

   ctx.stroke();
}

function Reset() 
{
   Clear("circles");
   Axis("circles");
}

function canvasTick()
{
   if(robot.timerPosition < (1000/timerLength))
   {
      robot.timerPosition++;
      robot.tick(timerLength);
      Reset();
      robot.drawArm(canvas);
   }
   else {stopTick()};
}

function startTick(evnt)
{
   console.log(evnt.offsetX);
   if(timer == null)
   {
      robot.x= evnt.offsetX; robot.y= canvas.height- evnt.offsetY;
      robot.inverseKinematics();
      timer= setInterval(canvasTick, timerLength);
   }
}

function stopTick()
{
   if(timer != null)
   {
      clearInterval(timer);
      timer= null;
      robot.timerPosition= 0;
   }
}

Reset();
robot.drawArm(canvas);