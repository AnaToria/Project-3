class Game {
    constructor() {
        this.userInput = new Input();
        this.userInput.changeDirection();
        this.newCells = 0;      
        this.BOARD_SIZE = 20;
        this.GROWTH_RATE = 1;
        this.SPEED = 10;
        this.lastCall = 0;
        this.gameOver = false;
        this.snakeBody = [
            {x: 16, y: 10},
            {x: 17, y: 10},
            {x: 18, y: 10},
            {x: 19, y: 10}
        ];
        this.apple = this.appleRandPos();
    }

    //#region Accecories
    getLastCall() {
        return this.lastCall;
    }

    setLastCall(val) {
        this.lastCall = val;
    }

    getSpeed() {
        return this.SPEED;
    }

    getResult() {
        return this.gameOver;
    }

    //#endregion


    //#region Game's performance

    updateGame() {
        this.updateApple();
        this.updateSnake();
        this.checkGame();
    }

    drawGame(){
        let myGUI = new GUI();
        myGUI.drawSnake(this.snakeBody, this.BOARD_SIZE);
        myGUI.drawApple(this.apple, this.BOARD_SIZE);
    }

    checkGame() {
        this.gameOver = this.snakeIntersection();
    }

    //#endregion

    
    //#region Snake's properties

    updateSnake() {
        this.addNewCells();
        const direction = this.userInput.getDirection();
    
        // Moving body
        for (let i = this.snakeBody.length - 2; i>= 0; i--) {
            this.snakeBody[i + 1]= {...this.snakeBody[i]}
        }
    
        // Snake's head
        this.snakeBody[0].x += direction.x;
        this.snakeBody[0].y += direction.y;   
    }

    addNewCells() {
        for (let i = 0; i < this.newCells; i++) {
            this.snakeBody.push({...this.snakeBody[this.snakeBody.length - 1]});
        }

        this.newCells = 0;
    }

    growSnake(cellAmount) {
        this.newCells += cellAmount;
    }

    elementOnSnake(pos, {ignoreHead = false} = {}) {
        // console.log(this.snakeBody)
        return this.snakeBody.some((segment, index) => {
            if(ignoreHead && index === 0) return false;
            return (segment.x === pos.x && segment.y === pos.y);
        })
    }

    getHead() {
        return this.snakeBody[0];
    }

    snakeIntersection() {
        return this.elementOnSnake(this.snakeBody[0], {ignoreHead: true})
    }

    //#endregion


    //#region Apple's properties

    updateApple(){
        if(this.elementOnSnake(this.apple)){
            this.growSnake(this.GROWTH_RATE);
            this.apple = this.appleRandPos();
        }
    }

    appleRandPos() {
        let applePos = this.randomPosition();
        while(applePos === null || this.elementOnSnake(applePos)) {
            applePos = this.randomPosition();
        }
        return applePos;
    }

    //#endregion

    
    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.BOARD_SIZE) + 1 ,
            y: Math.floor(Math.random() * this.BOARD_SIZE) + 1 
        }
    }
    
}


class GUI {
    constructor() {
        this.board=document.getElementById('board');
        this.board.innerHTML='';
    }
    
    drawApple(apple, BOARD_SIZE) {
        const myApple = document.createElement("div");
        myApple.style.gridRowStart = apple.y;
        myApple.style.gridColumnStart = apple.x;
        myApple.classList.add("apple");
        board.appendChild(myApple);
    }
   
    drawSnake(snakeBody, BOARD_SIZE) {
        snakeBody.forEach(segment => {
            const mySnake = document.createElement("div");
            while(segment.y < 0) {
                segment.y += BOARD_SIZE + 1;
            }
            while(segment.y > BOARD_SIZE) {
                segment.y -= BOARD_SIZE;
            }

            while(segment.x < 0) {
                segment.x += BOARD_SIZE + 1;
            }
            while(segment.x > BOARD_SIZE){
                segment.x -= BOARD_SIZE;
            }

            mySnake.style.gridRowStart = segment.y;
            mySnake.style.gridColumnStart = segment.x;
            mySnake.classList.add("snake");
            board.appendChild(mySnake);
        })
    }
}


class Input{ 
    constructor(){
        this.Direction={
            Up: { x: 0, y: -1 },
            Down: { x: 0, y: 1 },
            Left: { x: -1, y: 0 },
            Right: { x: 1, y: 0 }
        }
        this.inpDirection = this.Direction.Left; 
        this.prevDirection = this.Direction.Left;
    }

    changeDirection() {  
        console.log(window)
        window.addEventListener('keydown', e => {
            switch(e.key){
                case 'ArrowUp':
                    if (this.prevDirection.y !== 0) 
                        break
                        this.inpDirection = this.Direction.Up;
                    break
                case 'ArrowDown':
                    if (this.prevDirection.y !== 0) 
                        break
                        this.inpDirection = this.Direction.Down;
                    break
                case 'ArrowLeft':
                    if (this.prevDirection.x !== 0) 
                        break
                        this.inpDirection = this.Direction.Left;
                    break
                case 'ArrowRight':
                    if (this.prevDirection.x !== 0) 
                        break
                        this.inpDirection = this.Direction.Right;
                    break
            }
        });
    }
    
    getDirection() {
        this.prevDirection = this.inpDirection;
        return this.inpDirection;
    }

}



const myGame = new Game();

function main(currentTime) {
    if(myGame.getResult()) {
        if(confirm("You lose! Press OK to play again")){
            location.reload();
        }
        return;
    }

    // Creating infinite main loop for game
    window.requestAnimationFrame(main);
    
    // Converting to ms
    const callingInterval = (currentTime - myGame.getLastCall()) / 1000;

    // Check if time intrval is good 
    if(callingInterval < 1 / myGame.getSpeed()) return;

    // Updating last call
    myGame.setLastCall(currentTime);

    
    myGame.updateGame();
    myGame.drawGame();

}

window.requestAnimationFrame(main);
