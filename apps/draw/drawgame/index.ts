export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
  
        
  
    if (!ctx) {
      return;
    }

   ctx.fillStyle = "rgba(0, 0, 0)"
      ctx.clearRect(0, 0, canvas.width, canvas.height)


let Clicked = false;
let startX = 0;
let startY = 0;

      canvas.addEventListener("mousedown", (e) => {
        Clicked = true;
        startX =  e.clientX
        startY =  e.clientY
      })


      canvas.addEventListener("mouseup", (e) => {
        Clicked = false;
      })


      canvas.addEventListener("mousemove", (e) => {
if(Clicked) {
const width = e.clientX - startX;
const height = e.clientY - startY;
ctx.clearRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = "rgba(0, 0, 0)"
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.strokeStyle = "rgba(255, 255, 255)"
ctx.strokeRect(startX, startY, width, height)
    
}
      })
}