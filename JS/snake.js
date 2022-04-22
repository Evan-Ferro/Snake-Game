let score = 0;
const Snake = document.createElement('span');
const SnakeEyes = document.createElement('p');
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
let current;
let previous;
let paused = false;
let t = 200;
let endGameCalled = false;
let gameStarted = false;
let noHighscore = true;



createInterval();
    
function createInterval(){  
    document.addEventListener('keydown', (event) => {
        if(event.key === 'w' || event.key === 'ArrowUp'){
            if(previous !== 'down'){
                direction = 'up';
                removeMovement();
            }            
        }
        else if(event.key === 'a' || event.key === 'ArrowLeft'){
            if(previous !== 'right'){
                direction = 'left';
                removeMovement();
            }             
        }
        else if(event.key === 's' || event.key === 'ArrowDown'){
            if(previous !== 'up'){
                direction = 'down';
                removeMovement();
            }             
        }
        else if(event.key === 'd' || event.key === 'ArrowRight'){
            if(previous !== 'left'){
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
        SnakeEyes.classList.remove('snakeEyes-left');
        SnakeEyes.classList.remove('snakeEyes-right');
        SnakeEyes.classList.remove('snakeEyes-down');
        SnakeEyes.classList.add('snakeEyes-up');
    }
    if(direction === 'left'){
        snakeX -= 1;
        SnakeEyes.classList.remove('snakeEyes-up');
        SnakeEyes.classList.remove('snakeEyes-right');
        SnakeEyes.classList.remove('snakeEyes-down');
        SnakeEyes.classList.add('snakeEyes-left');
    }
    if(direction === 'down'){
        snakeY += 1;
        SnakeEyes.classList.remove('snakeEyes-left');
        SnakeEyes.classList.remove('snakeEyes-right');
        SnakeEyes.classList.remove('snakeEyes-up');
        SnakeEyes.classList.add('snakeEyes-down'); 
    }
    if(direction === 'right'){
        snakeX += 1;
        SnakeEyes.classList.remove('snakeEyes-left');
        SnakeEyes.classList.remove('snakeEyes-up');
        SnakeEyes.classList.remove('snakeEyes-down');
        SnakeEyes.classList.add('snakeEyes-right');
    }
    previous = direction;

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
            Snake.style.transitionDuration = `${t - 17}ms`;
            for(let i = 0; i < snakeBody.length; i++){
                snakeBody[i].element.style.transitionDuration = `${t - 17}ms`;
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
        snakeColor();
    }
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
    gameStarted = true;

    const gameBoard = document.getElementById('gameBoard');
    SnakeEyes.classList.add('snakeEyes-left');
    SnakeEyes.innerText = 'o o';
    SnakeEyes.style.color = 'white';
    SnakeEyes.style.textAlign = 'center';
    SnakeEyes.style.fontFamily = "cursive";
    Snake.append(SnakeEyes);
    
    
    const appleWrapper = document.getElementById('appleWrapper');
    gameBoard.append(appleWrapper);
    appleWrapper.append(Apple);
    Apple.classList.add('appleScale');
    Apple.setAttribute("id", "scoreIcon");
    Apple.innerHTML = '&#127822;'
    snakeColor();

    const html = document.getElementById('html');
    html.classList.add('mainBackground');
    
    appleWrapper.classList.add('appleVisible');
    draw(appleWrapper, appleX, appleY);
    
    scoreBoard.classList.add('hide');

    interval = setInterval(frame, t);
    setTimeout(() => {
        Snake.classList.add('snakeVisible');
        Snake.classList.add('z-index');
        gameBoard.append(Snake);
    }, 200);

    console.log('Game Started');
    console.log(t);
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

function draw(element, x, y){
    element.style.transform = `translate(${x * 28}px, ${y * 28}px)`;
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
    snake2.style.transitionDuration = `${t - 17}ms`;
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

    const html = document.getElementById('html');
    html.classList.remove('mainBackground');

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
    if(allScores.length === 0){
        topScoreHolder.innerText = 0;
    } else{
        const topScore = allScores[0].score;
        topScoreHolder.innerText = topScore;
    }
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
    allScores = allScores.slice(0, 20);
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
        noHighscore = false;
    }
    if(noHighscore === true){
        const scoreContainer = document.getElementById('high-score-list');
        const highScoreEl = document.createElement('div');
        highScoreEl.innerHTML = `
        <div style="justify-content:center;" class="player-score-wrap">
            <div class="player-name"> <span id="player">You have no High scores</span> </div>
        </div>`

        scoreContainer.append(highScoreEl);
    }
    
}

window.addEventListener('load', (event) => {
    console.log(noHighscore);
    
});

function snakeColor(){
    for(let i = 0; i < snakeBody.length; i++){
        if(document.getElementById('blueSnake').checked){
            snakeBody[i].element.style.backgroundColor="0061ff";  
        }
        if(document.getElementById('greenSnake').checked){
            snakeBody[i].element.style.backgroundColor="darkslategray";
        }
        if(document.getElementById('yellowSnake').checked){
            snakeBody[i].element.style.backgroundColor="goldenrod";
        }
        if(document.getElementById('redSnake').checked){
            snakeBody[i].element.style.backgroundColor="red";
        }
        if(document.getElementById('purpleSnake').checked){
            snakeBody[i].element.style.backgroundColor="#921192";
        }
    }
    const menusnake = document.getElementById('menuSnake');
    const menusnake1 = document.getElementById('menuSnake1');
    const menusnake2 = document.getElementById('menuSnake2');
    const menusnake3 = document.getElementById('menuSnake3');
    const menusnake4 = document.getElementById('menuSnake4');
    const menusnake5 = document.getElementById('menuSnake5');
    const menusnake6 = document.getElementById('menuSnake6');
    const menusnake7 = document.getElementById('menuSnake7');
    const menusnake8 = document.getElementById('menuSnake8');
    
    if(document.getElementById('blueSnake').checked){
        Snake.style.backgroundColor = "#0061ff";
        menusnake.style.backgroundColor="#0061ff";
        menusnake1.style.backgroundColor="#0061ff";
        menusnake2.style.backgroundColor="#0061ff";
        menusnake3.style.backgroundColor="#0061ff";
        menusnake4.style.backgroundColor="#0061ff";
        menusnake5.style.backgroundColor="#0061ff";
        menusnake6.style.backgroundColor="#0061ff";
        menusnake7.style.backgroundColor="#0061ff";
        menusnake8.style.backgroundColor="#0061ff";
    }
    if(document.getElementById('greenSnake').checked){
        Snake.style.backgroundColor = "darkslategray";
        menusnake.style.backgroundColor="darkslategray";
        menusnake1.style.backgroundColor="darkslategray";
        menusnake2.style.backgroundColor="darkslategray";
        menusnake3.style.backgroundColor="darkslategray";
        menusnake4.style.backgroundColor="darkslategray";
        menusnake5.style.backgroundColor="darkslategray";
        menusnake6.style.backgroundColor="darkslategray";
        menusnake7.style.backgroundColor="darkslategray";
        menusnake8.style.backgroundColor="darkslategray";
    }
    if(document.getElementById('yellowSnake').checked){
        Snake.style.backgroundColor = "goldenrod";
        menusnake.style.backgroundColor="goldenrod";
        menusnake1.style.backgroundColor="goldenrod";
        menusnake2.style.backgroundColor="goldenrod";
        menusnake3.style.backgroundColor="goldenrod";
        menusnake4.style.backgroundColor="goldenrod";
        menusnake5.style.backgroundColor="goldenrod";
        menusnake6.style.backgroundColor="goldenrod";
        menusnake7.style.backgroundColor="goldenrod";
        menusnake8.style.backgroundColor="goldenrod";
    }
    if(document.getElementById('redSnake').checked){        
        Snake.style.backgroundColor = "red";
        menusnake.style.backgroundColor="red";
        menusnake1.style.backgroundColor="red";
        menusnake2.style.backgroundColor="red";
        menusnake3.style.backgroundColor="red";
        menusnake4.style.backgroundColor="red";
        menusnake5.style.backgroundColor="red";
        menusnake6.style.backgroundColor="red";
        menusnake7.style.backgroundColor="red";
        menusnake8.style.backgroundColor="red";
    }
    if(document.getElementById('purpleSnake').checked){
        Snake.style.backgroundColor = "#921192";
        menusnake.style.backgroundColor="#921192";
        menusnake1.style.backgroundColor="#921192";
        menusnake2.style.backgroundColor="#921192";
        menusnake3.style.backgroundColor="#921192";
        menusnake4.style.backgroundColor="#921192";
        menusnake5.style.backgroundColor="#921192";
        menusnake6.style.backgroundColor="#921192";
        menusnake7.style.backgroundColor="#921192";
        menusnake8.style.backgroundColor="#921192"; 
    }

    const scoreApple = document.getElementById('scoreIcon');
    const topIcon = document.getElementById('topIcon');
    const apple = '\u{1F34E}';
    const peach = '\u{1F351}';
    const cherry = '\u{1F352}';
    const grape = '\u{1F347}';
    const watermelon = '\u{1F349}';

    const purpleBackground = '#2f6a6b';
    const redBackground = 'rgb(170 116 68)';
    const yellowBackground = 'rgb(47 79 130)';
    const greenBackground = 'rgb(223 177 109)';
    const blueBackground = 'darkolivegreen';
    const everyOther = document.getElementsByClassName('every-other');
    const gridPiece = document.getElementsByClassName('grid-piece');
    
    for(let i=0; i < gridPiece.length; i++){
        if(document.getElementById('blueSnake').checked){
            gridPiece[i].style.backgroundColor=(blueBackground);  
        }
        if(document.getElementById('greenSnake').checked){
            gridPiece[i].style.backgroundColor=(greenBackground);
        }
        if(document.getElementById('yellowSnake').checked){
            gridPiece[i].style.backgroundColor=(yellowBackground);
        }
        if(document.getElementById('redSnake').checked){
            gridPiece[i].style.backgroundColor=(redBackground);
        }
        if(document.getElementById('purpleSnake').checked){
            gridPiece[i].style.backgroundColor=(purpleBackground);
        }
    }

    for(let i=0; i < everyOther.length; i++){
        if(document.getElementById('blueSnake').checked){
            everyOther[i].style.backgroundColor=(blueBackground);  
        }
        if(document.getElementById('greenSnake').checked){
            everyOther[i].style.backgroundColor=(greenBackground);
        }
        if(document.getElementById('yellowSnake').checked){
            everyOther[i].style.backgroundColor=(yellowBackground);
        }
        if(document.getElementById('redSnake').checked){
            everyOther[i].style.backgroundColor=(redBackground);
        }
        if(document.getElementById('purpleSnake').checked){
            everyOther[i].style.backgroundColor=(purpleBackground);
        }
    }

    if(gameStarted === true){
        if(document.getElementById('apple-icon').checked){
            scoreApple.innerHTML=(apple);  
            topIcon.innerHTML=(apple);
        }
        if(document.getElementById('peach-icon').checked){
            scoreApple.innerHTML=(peach);
            topIcon.innerHTML=(peach);
        }
        if(document.getElementById('cherry-icon').checked){
            scoreApple.innerHTML=(cherry);
            topIcon.innerHTML=(cherry);
        }
        if(document.getElementById('grape-icon').checked){
            scoreApple.innerHTML=(grape);
            topIcon.innerHTML=(grape);
        }
        if(document.getElementById('watermelon-icon').checked){
            scoreApple.innerHTML=(watermelon);
            topIcon.innerHTML=(watermelon);
        }
    }
    
}

function settingsMenu(){
    const settingsMenu = document.getElementById('settingsMenu');

    hideMenu();
    settingsMenu.classList.remove('hide');
    settingsMenu.classList.add('show');
}

function hideSettings(){
    const settingsMenu = document.getElementById('settingsMenu');
    const startMenu = document.getElementById('startMenu');

    startMenu.classList.remove('hide');
    startMenu.classList.add('flex');
    settingsMenu.classList.remove('show');
    settingsMenu.classList.add('hide');
}

function settingsStart(){
    startGame();
    const settingsMenu = document.getElementById('settingsMenu');
    settingsMenu.classList.remove('flex');
    settingsMenu.classList.add('hide');
}
    


