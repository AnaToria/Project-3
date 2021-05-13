const SPEED = 8;
let lastCall = 0;
const BOARD_SIZE = 20;
let gameOver = false;
const myBoard = document.getElementById('board');


function main(currentTime) {
    if(gameOver) {
        if(confirm("You lose! Press OK to play again")){
            location.reload();
        }
        return;
    }

    // Creating infinite main loop for game
    window.requestAnimationFrame(main);
    
    // Converting to ms
    const callingInterval = (currentTime - lastCall) / 1000;

    // Check if time intrval is good 
    if(callingInterval < 1 / SPEED) return;

    // Updating last call
    lastCall = currentTime;

    updateGame();
    drawGame();

}

window.requestAnimationFrame(main);



//#region Game

function updateGame() {
    updateApple();
    updateSnake();
    checkGame();
}


function drawGame() {
    myBoard.innerHTML='';
    drawSnake(myBoard);
    drawApple(myBoard);
}


function checkGame() {
    gameOver = outsideBoard(getHead()) || snakeIntersection();
}

//#endregion



//#region Snake

const snakeBody =[
    {x: 16, y: 10},
    {x: 17, y: 10},
    {x: 18, y: 10},
    {x: 19, y: 10}
];
let newCells = 0;


function updateSnake() {
    addNewCells();
    const direction = getDirection();

    // Moving body
    for (let i= snakeBody.length - 2; i>= 0; i--) {
        snakeBody[i + 1]= {...snakeBody[i]}
    }

    // Snake's head
    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;   
}


function drawSnake(board) {
    snakeBody.forEach(segment => {
        const mySnake = document.createElement("div");
        mySnake.style.gridRowStart = segment.y;
        mySnake.style.gridColumnStart = segment.x;
        mySnake.classList.add("snake");
        board.appendChild(mySnake);
    })
}


function growSnake(cellAmount) {
    newCells += cellAmount;
}


function elementOnSnake(pos, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if(ignoreHead && index === 0) return false;
        return isEqual(segment, pos);
    })
}


function isEqual(pos1, pos2) {
    return (pos1.x === pos2.x && pos1.y === pos2.y);
}


function addNewCells() {
    for (let i = 0; i < newCells; i++) {
        snakeBody.push({...snakeBody[snakeBody.length - 1]});
    }

    newCells = 0;
}


function getHead() {
    return snakeBody[0];
}


function snakeIntersection() {
    return elementOnSnake(snakeBody[0], {ignoreHead: true})
}

//#endregion



//#region Input

let inpDirection = { x: -1, y: 0 };
let prevDirection = { x: -1, y: 0 };


function getDirection() {
    prevDirection = inpDirection;
    return inpDirection;
}


window.addEventListener('keydown', e => {
    switch(e.key){
        case 'ArrowUp':
            if (prevDirection.y !== 0) 
                break
                inpDirection = { x: 0, y: -1 }
            break
        case 'ArrowDown':
            if (prevDirection.y !== 0) 
                break
                inpDirection = { x: 0, y: 1 }
            break
        case 'ArrowLeft':
            if (prevDirection.x !== 0) 
                break
                inpDirection = { x: -1, y: 0 }
            break
        case 'ArrowRight':
            if (prevDirection.x !== 0) 
                break
                inpDirection = { x: 1, y: 0 }
            break
    }
});

//#endregion



//#region Apple

let apple = appleRandPos();
const GROWTH_RATE = 1;


function updateApple(){
    if(elementOnSnake(apple)){
        growSnake(GROWTH_RATE);
        apple = appleRandPos();
    }
}


function drawApple(board){
    const myApple = document.createElement("div");
    myApple.style.gridRowStart = apple.y;
    myApple.style.gridColumnStart = apple.x;
    myApple.classList.add("apple");
    board.appendChild(myApple);
}


function appleRandPos() {
    let applePos = randomPosition();
    while(applePos === null || elementOnSnake(applePos)) {
        applePos = randomPosition();
    }
    return applePos;
}


//#endregion



//#region Helper functions

function randomPosition() {
    return {
        x: Math.floor(Math.random() * BOARD_SIZE) + 1 ,
        y: Math.floor(Math.random() * BOARD_SIZE) + 1 
    }
}


function outsideBoard(pos) {
    return (
        pos.x < 1 || pos.x > BOARD_SIZE || pos.y < 1 || pos.y > BOARD_SIZE
    )
} 


//#endregion

