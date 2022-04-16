let score = 0;
const Snake = document.createElement('span');
const Apple = document.createElement('span');
const gameBoard = document.getElementById('gameBoard');
const pauseMenu = document.getElementById('pauseMenu');
let snakeX = 14;
let snakeY = 7;
let lastSnakeX = snakeX;
let lastSnakeY = snakeY;
let appleX = 5;
let appleY = 7;
const snakeBody = [];
let direction;
let paused = false;
let t = 200;
let endGameCalled = false;



createInterval();
    
function createInterval(){  
    document.addEventListener('keydown', (event) => {
        if(event.key === 'w' || event.key === 'ArrowUp'){
            if(direction !== 'down'){
                direction = 'up';
                removeMovement();
            }            
        }
        else if(event.key === 'a' || event.key === 'ArrowLeft'){
            if(direction !== 'right'){
                direction = 'left';
                removeMovement();
            }             
        }
        else if(event.key === 's' || event.key === 'ArrowDown'){
            if(direction !== 'up'){
                direction = 'down';
                removeMovement();
            }             
        }
        else if(event.key === 'd' || event.key === 'ArrowRight'){
            if(direction !== 'left'){
                direction = 'right';
                removeMovement();  
            } 
        }
        else if(event.key === 'p' || event.key === 'Escape' && paused === false){
            pauseGame();
        } 
        else if(event.key === 'p' || event.key === 'Escape' && paused === true){
            resumeGame();
        } 
    }); 
}
    
function showGrid(){
    const Grid = document.getElementById('snakeGrid');
    Grid.classList.add('flex');
    Grid.classList.remove('hide');
}

function removeMovement(){
    const movementMenu = document.getElementById('movementMenu');
    movementMenu.classList.remove('show');
    movementMenu.classList.add('hide');
}

function hideMenu(){
    const startMenu = document.getElementById('startMenu');
    startMenu.classList.add('hide');
}

function retryGame(){
    location.reload();
}

function snakeBoundaries(){
    if(endGameCalled === true){
        return
    }
    if(snakeX < 0){
        setTimeout(endGame, t);
        endGameCalled = true;
    }
    if(snakeX > 19){
        setTimeout(endGame, t);
        endGameCalled = true;
    }
    if(snakeY < 0){
        setTimeout(endGame, t);
        endGameCalled = true;
    }
    if(snakeY > 15){
        setTimeout(endGame, t);
        endGameCalled = true;
    }
}
function startGame(){
    topScore();
    showGrid();
    hideMenu();
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.append(Snake);
    Snake.innerText = 'o o';
    Snake.style.color = 'white';
    Snake.style.textAlign = 'center';
    
    const appleWrapper = document.getElementById('appleWrapper');
    gameBoard.append(appleWrapper);
    appleWrapper.append(Apple);
    Apple.classList.add('appleScale');
    Apple.innerHTML = '&#127822;'
    
    appleWrapper.classList.add('appleVisible');
    draw(appleWrapper, appleX, appleY);
    
    scoreBoard.classList.add('hide');

    interval = setInterval(frame, t);
    setTimeout(() => {
        Snake.classList.add('snakeVisible');
    }, 230);
    console.log('Game Started');
    console.log(t);
}

function frame(){
   
    const scoreBox = document.getElementById('score');
    const endScore = document.getElementById('endScore');

    if(paused === true || endGameCalled === true){
        return;
    }
    let angle;
    newSnake();
    
    if(direction === 'up'){
        snakeY -= 1;
        angle = 0;
    }
    if(direction === 'left'){
        snakeX -= 1;
        angle = 270; 
    }
    if(direction === 'down'){
        snakeY += 1;
        angle = 180; 
    }
    if(direction === 'right'){
        snakeX += 1;
        angle = 90;
    }
    
    draw(Snake, snakeX, snakeY, angle);
    snakeBoundaries();
    for(let i =0; i < snakeBody.length; i++){
        if(snakeX === snakeBody[i].x && snakeY === snakeBody[i].y){
            setTimeout(endGame, t);
            break;
        }
    }

    if(snakeX === appleX && snakeY === appleY){
        score ++;
        scoreBox.innerText = score;
        endScore.innerText = score;

        if(score % 5 === 0){
            t = Math.floor(t * 0.95);
            clearInterval(interval);
            interval = setInterval(frame, t);
            Snake.style.transitionDuration = `${t}ms`;
            for(let i = 0; i < snakeBody.length; i++){
                snakeBody[i].element.style.transitionDuration = `${t}ms`;
            }
            console.log(`${t}ms`);
        }
        buildSnake();

        appleX = getRandomInt(0, 20);
        appleY = getRandomInt(0,16);
        
        while(checkApple(appleX, appleY)){
            appleX = getRandomInt(0, 20);
            appleY = getRandomInt(0, 16);
        }
        draw(appleWrapper, appleX, appleY);
    }
}

function checkApple(x, y){
    if(snakeX === x && snakeY === y){
        return true;
    }
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeBody[i].x === x && snakeBody[i].y === y){
            return true;
        }
    }
    return false;
}

function draw(element, x, y, angle=0){
    element.style.transform = `translate(${x * 28}px, ${y * 28}px) rotate(${angle}deg)`;
}

function getRandomInt(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min) + min);
    return randomNum;
}

function buildSnake(){
    const gameBoard = document.getElementById('gameBoard');
    const snake2 = document.createElement('span');
    let babySnakeX = 0;
    let babySnakeY = 0;
    
    if(snakeBody.length === 0){
        babySnakeX = snakeX;
        babySnakeY = snakeY;
    }else{
        babySnakeX = snakeBody[snakeBody.length - 1].x;
        babySnakeY = snakeBody[snakeBody.length - 1].y;
    }
    snakeBody.push({element:snake2, x:babySnakeX, y:babySnakeY});

    snake2.classList.add('snakeVisible'); 
    snake2.style.transitionDuration = `${t}ms`;
    gameBoard.append(snake2);
    draw(snake2, babySnakeX, babySnakeY);
}

function newSnake(){

    for(let i = snakeBody.length - 1; i > 0;  i--){
        snakeBody[i].x = snakeBody[i - 1].x;
        snakeBody[i].y = snakeBody[i - 1].y;
        draw(snakeBody[i].element, snakeBody[i].x, snakeBody[i].y);
    }

    if(snakeBody.length !== 0){
        snakeBody[0].x = snakeX;
        snakeBody[0].y = snakeY;
        draw(snakeBody[0].element, snakeBody[0].x, snakeBody[0].y)
    }
}

function endGame(){
    const gameOver = document.getElementById('gameOver');
    gameOver.classList.add('show');
    gameOver.classList.remove('hide');

    const Grid = document.getElementById('snakeGrid');
    Grid.classList.add('hide');
}


function pauseGame(){
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.classList.remove('hide');
    pauseMenu.classList.add('show');
    paused = true;
}

function resumeGame(){
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.classList.remove('show');
    pauseMenu.classList.add('hide');
    paused = false;
}

function highScore(){
    const scoreBoard = document.getElementById('scoreBoard');
    hideMenu();
    scoreBoard.classList.remove('hide');
    scoreBoard.classList.add('show');
    gameOver.classList.remove('show');
    gameOver.classList.add('hide');
}

function topScore(){
    const topScoreHolder = document.getElementById('topScore');
    const savedScores = localStorage.getItem('highscore') || '[]';
    let allScores = JSON.parse(savedScores);
    const topScore = allScores[0].score;
    topScoreHolder.innerText = topScore;
}

function scoreList(){
    highScore();
    const playerName =  document.getElementById('playerName');
    const newPlayer = playerName.value;
    const scoreContainer = document.getElementById('high-score-list');
    
    //Highscore logic
    const result = {newPlayer, score}; 
    const savedScores = localStorage.getItem('highscore') || '[]';
    
    let allScores = JSON.parse(savedScores);
    allScores.push(result);
    allScores.sort((a, b) => b.score - a.score);
    allScores = allScores.slice(0, 5);
    localStorage.setItem('highscore', JSON.stringify(allScores));

    for(let i = 0; i < allScores.length; i++){
        if(allScores[i].score === 0 || allScores[i].newPlayer === ""){
            allScores.splice(i);
            break;
        }
        const highScoreEl = document.createElement('div');
        highScoreEl.innerHTML = `
        <div class="player-score-wrap">
            <div class="player-position"><span id="placement"> #${i + 1} </span></div>
            <div class="player-name"> <span id="player"></span> ${allScores[i].newPlayer} </div>
            <div class="player-score"><span id="mainScore"></span> ${allScores[i].score} </div> 
        </div>`

        scoreContainer.append(highScoreEl);  
    }
    
}
    


