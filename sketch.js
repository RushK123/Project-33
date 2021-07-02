const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope, fruitLink, fruit, fruitOptions;
var backgroundImg, rabbitImg, melonImg, rabbit, sadAnimation, blinkAnimation, eatAnimation;
var cutButton, cutButton2, cutButton3, eatSound, sadSound, bgSound, ropeCutSound, airSound, balloon, mutebutton;
var rope2, rope3, fruitLink2;
var bubbleImg, bubble;



function preload(){
  backgroundImg = loadImage("background.png");
  rabbitImg = loadImage("Rabbit-01.png");
  melonImg = loadImage("melon.png");
  sadAnimation = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  blinkAnimation = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eatAnimation = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png");
  blinkAnimation.playing = true;
  sadAnimation.playing = true;
  eatAnimation.playing = true;
  blinkAnimation.framedelay = 20;
  sadAnimation.framedelay = 20;
  eatAnimation.framedelay = 10;
  eatAnimation.looping = false;
  sadAnimation.looping = false;
  eatSound = loadSound("eating_sound.mp3");
  sadSound = loadSound("sad.wav");
  ropeCutSound = loadSound("rope_cut.mp3");
  bgSound = loadSound("sound1.mp3");
  airSound = loadSound("air.wav");
  bubbleImg = loadImage("bubble.png")
}



function setup() 
{
  //bgSound.play();
  //bgSound.setVolume(0.2);
  createCanvas(500,700);
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW=displayWidth;
    canH= displayHeight;
    createCanvas(displayWidth,displayHeight);

  }else{
    canW= windowWidth;
    canH= windowHeight;
    createCanvas(windowWidth,windowHeight);
  }
  //frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,canH-10,2*canW,20);
  rope = new Rope(6,{x:220, y:290})
  rope2 = new Rope(6,{x:30, y:400})
  textSize(50);

  fruitOptions = {
    density : 0.001 
  }
  fruit = Bodies.circle(100, 450, 15,fruitOptions);
  Composite.add(rope.body,fruit);
  fruitLink = new Link(rope,fruit);
  fruitLink2 = new Link(rope2,fruit);

  rabbit = createSprite(300, 100, 10, 10);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.1;

  bubble = createSprite(300, 460, 10,10);
  bubble.addImage(bubbleImg);
  bubble.scale = 0.1;

  cutButton = createImg("cut_btn.png");
  cutButton.position(200, 290);
  cutButton.size(50,50);
  cutButton.mouseClicked(drop);

  cutButton2 = createImg("cut_btn.png");
  cutButton2.position(30, 400);
  cutButton2.size(50,50);
  cutButton2.mouseClicked(drop2);


  mutebutton = createImg("mute.png");
  mutebutton.position(400, 50);
  mutebutton.size(70,70);
  mutebutton.mouseClicked(mute);


  rabbit.addAnimation("eat", eatAnimation);
  rabbit.addAnimation("sad", sadAnimation);
  rabbit.addAnimation("blink", blinkAnimation);
  rabbit.changeAnimation("blink");




}




function draw() 
{

  background(backgroundImg);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  Engine.update(engine);



  ground.show();
  rope.show();
  rope2.show();


  if (fruit != null){
    image(melonImg,fruit.position.x, fruit.position.y,60,60);
  }

  

  if (collide(fruit, rabbit)){
    rabbit.changeAnimation("eat"); 
    eatSound.play();
    fruit = null;
  }
  if (fruit!= null && fruit.position.y >= (canH-50)){
    rabbit.changeAnimation("sad");
    fruit = null;
    bgSound.stop();
    sadSound.play();
  }
  if (collide(bubble, rabbit,80)){
    if (fruit!=null){
      breakrope();
      bubble.visible = false;
      rabbit.changeAnimation("eat"); 
      eatSound.play();
      fruit = null;  

    }

  }

  if (collide(fruit, bubble,40)){
    bubble.position.x = fruit.position.x;
    bubble.position.y = fruit.position.y;
    engine.world.gravity.y = -1;
    
  }
  drawSprites();
 
   
}

function drop(){
  rope.break();
  fruitLink.detached();
  fruitLink = null;
  

}

function drop2(){
  rope2.break();
  fruitLink2.detached();
  fruitLink2 = null;
  

}




function collide(fruit, sprite, distance){
  if (fruit!==null){

    var d = dist(fruit.position.x, fruit.position.y, sprite.position.x, sprite.position.y);

    if (d <= distance){
      World.remove(world, fruit);
      fruit= null;
      return true;
    }else{
      return false;
    }
  }
}


function airblow(){
  Body.applyForce(fruit,{x:0, y:0}, {x:0.02, y:0});

}

function mute(){
  if (bgSound.isPlaying()){
    bgSound.stop();

  }else{
    bgSound.play();
  }
  
}

function breakrope(){
  if (fruit!=null){
    rope.break();
    fruitLink.detached();
    fruitLink = null;
  }
}