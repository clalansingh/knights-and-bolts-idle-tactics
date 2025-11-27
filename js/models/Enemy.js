export class Enemy {
    constructor(name, type, level) {
        this.name = name;
        this.type = type; // e.g., 'Goblin', 'Dragon'
        this.level = level;

        this.hp = 50 + (level * 10);
        this.maxHp = this.hp;

        this.position = { x: 0, y: 0 }; // Enemies also on a grid or rows
        this.statuses = [];

        // Simple AI for now (random or basic pattern)
        this.aiType = 'BASIC';
    }
}
