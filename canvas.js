const canvas = document.getElementById('canvas-mouse');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x:null,
    y:null,
    positionTopImg:true,
    positionBottomImg:false
};
const particleColor= 'rgba(1,248,152,1)'
const dx= canvas.height/canvas.width;


//evenlisteners
addEventListener('mousemove', (e)=>{
    mouse.x = e.x;
    mouse.y = e.y;
    console.log(mouse)
});
addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});
setInterval(()=>{
    mouse.x = undefined;
    mouse.y = undefined;
},200);

//variables
let particleArray;
const maxParticles = 60;

//class

class Particle{
    constructor(x,y,size,color1,color2,weight){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color1 = color1;
        this.color2=color2;
        this.weight = weight;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.size,0,Math.PI*2,false);
        if(mouse.y>-dx*mouse.x +canvas.height ){
            c.fillStyle = this.color2 ;                    
        }else c.fillStyle = this.color1;
        c.fill();
    }
    update(){
        this.draw();
        this.size-=0.05;
        if(this.size <0){
            this.x = mouse.x +(( Math.random() - 0.5)*50);
            this.y = mouse.y + ((Math.random() - 0.5)*50);    
            this.size = Math.random() *8;
            this.weight = (Math.random() *2);
        }
        this.y += this.weight;
        this.weight +=0.03;
        if(this.y > canvas.height - this.size){
            this.weight *=-0.4;
        }
    }
}


//implementation
function init(){
    particleArray = [];
    for(let i = 0; i<maxParticles;i++){
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;
        let size = Math.random()*8;
        let weight = Math.random();
        let color1 = particleColor;
        let color2 = 'black';
        particleArray.push(new Particle(x,y,size,color1,color2,weight));
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.beginPath();
    c.moveTo(0,0);
    c.lineTo(canvas.width,0);
    c.lineTo(0,canvas.height);
    c.fillStyle = 'black'
    c.fill();
    c.beginPath();
    c.moveTo(canvas.width,0);
    c.lineTo(canvas.width,canvas.height);
    c.lineTo(0,canvas.height);
    c.fillStyle = particleColor;
    c.fill();

    if(mouse.y>-dx*mouse.x +canvas.height ){
        mouse.positionBottomImg=true;
        mouse.positionTopImg=false;
    }
    else if(mouse.y<=-dx*mouse.x +canvas.height ){
        mouse.positionBottomImg=false;
        mouse.positionTopImg = true;
    }
    particleArray.forEach(particle =>{
        particle.update();
    });
    connect() 
}

init();
animate();

function distanceBetween(x1,y1,x2,y2){
    const xDist = x1-x2;
    const yDist = y1-y2;
    return Math.sqrt(xDist*xDist + yDist*yDist);
}

function connect(){
    let opacityValue = 1;
    for(let i = 0; i< maxParticles; i++){
        for(let j = i; j< maxParticles;j++){
            let distance = distanceBetween(particleArray[i].x,particleArray[i].y,
                                    particleArray[j].x,particleArray[j].y);
            if(distance < 100){
                opacityValue = 1 - (distance/1000);
                if(mouse.positionBottomImg){
                    c.strokeStyle = `rgba(0,0,0,${opacityValue})`;                    
                }
                if(mouse.positionTopImg) c.strokeStyle = `rgba(1,248,151,${opacityValue})`;
                c.beginPath();
                c.lineWidth = 1;
                c.moveTo(particleArray[i].x,particleArray[i].y);
                c.lineTo(particleArray[j].x,particleArray[j].y);
                c.stroke();
            }
        }
    }
}
