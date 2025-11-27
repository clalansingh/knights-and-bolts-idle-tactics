import { CONDITIONS, ACTIONS } from '../models/Tactic.js';

export class TacticsEngine {
    constructor() { }

    evaluate(character, battleState) {
        // battleState contains { allies: [], enemies: [] }

        for (const tactic of character.tactics) {
            if (this.checkCondition(tactic.condition, character, battleState)) {
                return {
                    action: tactic.action,
                    target: this.selectTarget(tactic, character, battleState)
                };
            }
        }

        // Default action if no tactics match
        return { action: ACTIONS.ATTACK_NEAREST, target: this.getNearestEnemy(character, battleState.enemies) };
    }

    checkCondition(condition, character, battleState) {
        switch (condition) {
            case CONDITIONS.ALWAYS:
                return true;
            case CONDITIONS.HP_LESS_THAN_50:
                return (character.hp / character.maxHp) < 0.5;
            case CONDITIONS.ALLY_HP_LESS_THAN_50:
                return battleState.allies.some(a => a !== character && (a.hp / a.maxHp) < 0.5);
            // ... implement other conditions
            default:
                return false;
        }
    }

    selectTarget(tactic, character, battleState) {
        // Simplified targeting logic
        if (tactic.action === ACTIONS.HEAL_ALLY) {
            return battleState.allies.find(a => (a.hp / a.maxHp) < 0.5) || character;
        }
        if (tactic.action === ACTIONS.ATTACK_WEAKEST) {
            return battleState.enemies.reduce((prev, curr) => prev.hp < curr.hp ? prev : curr);
        }
        return this.getNearestEnemy(character, battleState.enemies);
    }

    getNearestEnemy(character, enemies) {
        // Placeholder for grid distance calculation
        return enemies[0];
    }
}
