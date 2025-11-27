import { StateManager } from './StateManager.js';
import { UIManager } from './ui/UIManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lastTime = 0;
        this.uiManager = new UIManager(this);
        this.stateManager = new StateManager(this);
        this.party = null;
        this.combatSystem = null;
    }

    start() {
        this.stateManager.changeState('MENU');
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        this.stateManager.update(deltaTime);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stateManager.draw(this.ctx);
    }
}
