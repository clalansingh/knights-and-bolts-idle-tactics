import { Enemy } from './models/Enemy.js';
import { CombatSystem } from './systems/CombatSystem.js';

export class StateManager {
    constructor(game) {
        this.game = game;
        this.currentState = null;
        this.states = {};

        // Initialize states
        this.states['MENU'] = {
            update: (dt) => { },
            draw: (ctx) => {
                // UI handles drawing
            },
            enter: () => {
                console.log('Entered Menu State');
                this.game.uiManager.createMainMenuUI(() => {
                    this.changeState('PARTY_CREATION');
                });
            },
            exit: () => {
                this.game.uiManager.clearUI();
            }
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
                if (this.game.combatSystem) {
                    this.game.uiManager.updateCombatUI(this.game.combatSystem);
                }
            },
            draw: (ctx) => {
                // UI handles most things, but we can draw the battlefield on canvas
                // Draw background or grid
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

                // Draw entities (simplified)
                if (this.game.combatSystem) {
                    // Draw enemies
                    this.game.combatSystem.enemies.forEach((enemy, i) => {
                        ctx.fillStyle = 'red';
                        ctx.fillRect(500, 200 + (i * 100), 50, 50);
                        ctx.fillStyle = 'white';
                        ctx.font = '12px Inter';
                        ctx.fillText(enemy.name, 500, 260 + (i * 100));
                    });

                    // Draw party (simplified)
                    this.game.party.members.forEach((member, i) => {
                        ctx.fillStyle = 'blue';
                        ctx.fillRect(300, 200 + (i * 100), 50, 50);
                        ctx.fillStyle = 'white';
                        ctx.fillText(member.name, 300, 260 + (i * 100));
                    });
                }
            },
            enter: () => {
                console.log('Entered Combat State');
                this.game.uiManager.createCombatUI(this.game.party, this.game.combatSystem);
            },
            exit: () => {
                this.game.uiManager.clearUI();
            }
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
            if (e.key === ' ' && this.currentState === this.states['COMBAT']) {
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
