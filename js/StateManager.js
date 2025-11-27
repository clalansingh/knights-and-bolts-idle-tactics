import { Enemy } from './models/Enemy.js';
import { CombatSystem } from './systems/CombatSystem.js';

export class StateManager {
    constructor(game) {
        this.game = game;
        this.currentState = null;
        this.states = {};

        // Initialize states (placeholders for now)
        this.states['MENU'] = {
            update: (dt) => { },
            draw: (ctx) => {
                ctx.fillStyle = 'white';
                ctx.font = '30px Arial';
                ctx.fillText('Main Menu - Press Enter to Start', 200, 300);
            },
            enter: () => console.log('Entered Menu State'),
            exit: () => { }
        };

        this.states['PARTY_CREATION'] = {
            update: (dt) => { },
            draw: (ctx) => {
                // UI handles drawing
            },
            enter: () => {
                console.log('Entered Party Creation');
                this.game.uiManager.createPartyCreationUI((party) => {
                    this.game.party = party;
                    this.game.uiManager.clearUI();
                    // Initialize dummy combat for now
                    this.initDummyCombat();
                    this.changeState('COMBAT');
                });
            },
            exit: () => {
                this.game.uiManager.clearUI();
            }
        };

        this.states['COMBAT'] = {
            update: (dt) => {
                // In a real game, we'd probably have a timer for turns or wait for animations
                // For this prototype, we might step manually or slow it down
            },
            draw: (ctx) => {
                ctx.fillStyle = 'white';
                ctx.fillText('Combat In Progress', 300, 50);
                // Draw combat log
                if (this.game.combatSystem) {
                    let y = 100;
                    this.game.combatSystem.log.slice(-10).forEach(line => {
                        ctx.fillText(line, 50, y);
                        y += 30;
                    });
                }
            },
            enter: () => {
                console.log('Entered Combat State');
                // Setup dummy combat
                // In reality, this would be passed from the dungeon state
            },
            exit: () => { }
        };

        this.states['TACTICS_EDIT'] = {
            update: (dt) => { },
            draw: (ctx) => { },
            enter: () => {
                console.log('Entered Tactics Edit');
                // For prototype, just edit the first party member
                const char = this.game.party.members[0];
                if (char) {
                    this.game.uiManager.createTacticsEditorUI(char, () => {
                        this.game.uiManager.clearUI();
                        this.changeState('COMBAT');
                    });
                } else {
                    this.changeState('COMBAT');
                }
            },
            exit: () => {
                this.game.uiManager.clearUI();
            }
        };

        // Simple input listener for testing state switching
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.currentState === this.states['MENU']) {
                this.changeState('PARTY_CREATION');
            } else if (e.key === ' ' && this.currentState === this.states['COMBAT']) {
                // Space to advance turn
                if (this.game.combatSystem) {
                    this.game.combatSystem.nextTurn();
                }
            } else if (e.key === 't' && this.currentState === this.states['COMBAT']) {
                this.changeState('TACTICS_EDIT');
            }
        });
    }

    initDummyCombat() {
        // Create some dummy enemies
        const enemies = [
            new Enemy('Goblin 1', 'Goblin', 1),
            new Enemy('Goblin 2', 'Goblin', 1)
        ];

        this.game.combatSystem = new CombatSystem(this.game.party, enemies);
        this.game.combatSystem.startCombat();
    }

    changeState(stateName) {
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }

        this.currentState = this.states[stateName];

        if (this.currentState && this.currentState.enter) {
            this.currentState.enter();
        }
    }

    update(deltaTime) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(deltaTime);
        }
    }

    draw(ctx) {
        if (this.currentState && this.currentState.draw) {
            this.currentState.draw(ctx);
        }
    }
}
