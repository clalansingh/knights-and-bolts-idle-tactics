export const CONDITIONS = {
    ALWAYS: 'Always',
    HP_LESS_THAN_50: 'HP < 50%',
    ALLY_HP_LESS_THAN_50: 'Ally HP < 50%',
    ENEMY_IS_CASTER: 'Enemy is Caster',
    ENEMY_IS_LOW_HP: 'Enemy HP < 25%'
};

export const ACTIONS = {
    ATTACK_NEAREST: 'Attack Nearest',
    ATTACK_WEAKEST: 'Attack Weakest',
    HEAL_ALLY: 'Heal Ally',
    DEFEND: 'Defend',
    USE_POTION: 'Use Potion'
};

export class Tactic {
    constructor(condition, action, targetType = 'ENEMY') {
        this.condition = condition;
        this.action = action;
        this.targetType = targetType; // 'SELF', 'ALLY', 'ENEMY'
    }
}
