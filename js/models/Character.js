import { ATTRIBUTES } from '../data/Classes.js';

export class Character {
    constructor(name, charClass) {
        this.name = name;
        this.charClass = charClass;
        this.level = 1;
        this.xp = 0;

        // Base stats
        this.attributes = {};
        for (const key in ATTRIBUTES) {
            this.attributes[ATTRIBUTES[key]] = 10; // Base value
        }

        this.hp = 100;
        this.maxHp = 100;
        this.mana = 50;
        this.maxMana = 50;

        this.tactics = []; // List of (Condition, Action) pairs
        this.abilities = [];
        this.inventory = [];

        // Combat state
        this.position = { x: 0, y: 0 }; // 0-2, 0-2 grid
        this.statuses = [];
    }

    addTactic(condition, action) {
        this.tactics.push({ condition, action });
    }
}
