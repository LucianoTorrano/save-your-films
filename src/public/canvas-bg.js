const bodyElement = document.getElementById('body')
const canvas = document.getElementById('canvas-bg');
const c = canvas.getContext('2d');

// Variables
const pi = Math.PI;
const colors = [
    '#D6D58E',
    '#9FC131',
    '#005C53',
    '#F2F2F2',
    '#591C21',
];

canvas.height = bodyElement.offsetHeight;
canvas.width = bodyElement.offsetWidth;

addEventListener('resize', ()=>{
    canvas.height = bodyElement.offsetHeight;
    canvas.width = bodyElement.offsetWidth;
    init();
})

let mouseDown = false
addEventListener('mousedown',()=>{
    mouseDown = true;
})

addEventListener('mouseup', ()=>{
    mouseDown = false;
})

// Class

class Star{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,pi*2,false);
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    update(){
        this.draw();
    }
}



// Implementation
let stars
const maxStars = 500;
const maxRadius = 2;
function init(){
    stars = [];
    for(let i = 0; i < maxStars; i++){
        const canvasWidth = canvas.width +500;
        const canvasHeight = canvas.height +500;
        const x = (Math.random()*canvasWidth - canvasWidth/2);
        const y = (Math.random()*canvasHeight - canvasHeight/2);
        const radius = Math.random() * maxRadius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        stars.push(new Star(x,y,radius,color));
    }
}

// Animation

let radians = 0;
let alpha = 1;
function animate(){
    requestAnimationFrame(animate);
    c.fillStyle = `rgba(8,8,8,${alpha})`
    c.fillRect(0,0,canvas.width,canvas.height)

    c.save()
    c.translate(canvas.width/2,canvas.height/2);
    c.rotate(radians);
    stars.forEach(star =>{
        star.update();
    });
    c.restore();

    radians += 0.001;
    if(mouseDown){
        if(alpha >= 0.1){
           alpha -= 0.009; 
           radians +=0.005
        }
        if(alpha > 0.05 && alpha < 0.1){
            alpha -= 0.0002;
            radians += 0.01;
        }
        if(alpha < 0.05 && alpha > 0.03){
            alpha -= 0.0005;
            radians += 0.05;
        }
        if(alpha < 0.03 && alpha > 0.001){
            alpha -= 0.0002;
            radians += 0.025;
        }

    }else if(!mouseDown && alpha < 1){
        alpha += 0.01;
    }
}

init();
animate();