const playerShip = document.querySelector("#player");
const game = document.querySelector("#main-game-container");
const intro = document.querySelector('.instrucoes');
const btnIntro = document.querySelector('#start-button');
const pontos = document.querySelector('#pontos');
const balas = document.querySelector('#balas');
const aliensSrc = ['img/monster-1.png','img/monster-2.png','img/monster-3.png'];

var tiros;
var point;

function moveShip(event){
    if(event.key === 'ArrowUp' || event.key === 'w'){
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown' || event.key === 's'){
        event.preventDefault();
        moveDown();
    } else if (event.key === ' ' || event.key === 'ArrowRight' || event.key === 'd'){
        event.preventDefault();
        shoot();
    }
}

function moveUp(){
    let posicaoCima = parseInt(getComputedStyle(playerShip).getPropertyValue('top'));
    if(posicaoCima <= 25){
        return;
    }else{
        posicaoCima -= 25;
        playerShip.style.top = `${posicaoCima}px`;
    }
}

function moveDown(){
    let posicaoBaixo = parseInt(playerShip.style.top);

    if(posicaoBaixo >= 510){
        return;
    }else{
        posicaoBaixo += 25;
        playerShip.style.top = `${posicaoBaixo}px`;
    }
}

function shoot(){
    if(tiros >= 1){
        criarLaser();
    }
}

function criarLaser(){

    let x = parseInt(getComputedStyle(playerShip).getPropertyValue('left'));
    let y = parseInt(getComputedStyle(playerShip).getPropertyValue('top'));

    let laser = document.createElement('img');
    laser.src = 'img/shoot.png';
    laser.classList.add('laser');
    laser.style.left = `${x}px`;
    laser.style.top = `${y - 10}px`;
    tiros--;
    balas.innerHTML = `Balas: ${tiros}`;
    game.appendChild(laser);

    let laserInterval = setInterval(() => {
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if(colisaoLaser(laser, alien)){
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                point++;
                pontos.innerHTML = `Pontos: ${point}`;
            }
        });

        if(x >= 510){
            clearInterval(laserInterval);
            game.removeChild(laser);
        }else{
            x += 10;
            laser.style.left = `${x}px`;
        }
    }, 20);
}

function gerarAlien(){
    let alien = document.createElement('img');
    let sorteio = aliensSrc[Math.floor(Math.random() * aliensSrc.length)];
    alien.src = sorteio;
    alien.classList.add('alien');
    alien.classList.add('alien-transition');
    alien.style.left = '370px';
    alien.style.top = `${Math.floor((Math.random() * 330) + 30)}px`;
    moverAlien(alien);
}

function moverAlien(alien){
    game.appendChild(alien);
    let alienLeft = parseInt(getComputedStyle(alien).getPropertyValue('left'));

    let moveAlien = setInterval(() => {
        if(alienLeft <= 30){
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            }else{
                gameOver();
            }
        }else{
            alienLeft -= 4;
            alien.style.left = `${alienLeft}px`;
        }
    }, 30)
}

function colisaoLaser(laser, alien){
    laserTop = parseInt(getComputedStyle(laser).getPropertyValue('top'));
    laserLeft = parseInt(getComputedStyle(laser).getPropertyValue('left'));
    laserBot = laserTop - 20;
    alienTop = parseInt(getComputedStyle(alien).getPropertyValue('top'));
    alienLeft = parseInt(getComputedStyle(alien).getPropertyValue('left'));
    alienBot = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBot){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }

}

function startGame(){
    window.addEventListener('keydown', moveShip);
    game.removeChild(intro);
    game.removeChild(btnIntro);
    tiros = 3;
    point = 0;
    balas.innerHTML = `Balas: ${tiros}`;
    pontos.innerHTML = `Pontos: ${point}`;

    let gerarAlienInterval = setInterval(gerarAlien, 2000);
}

function gameOver(){
    alert("Game over!");
}

let carregaTiro = setInterval(() => {
    if (tiros < 3) {
        tiros++;
        balas.innerHTML = `Balas: ${tiros}`;
    }
}, 1500);
