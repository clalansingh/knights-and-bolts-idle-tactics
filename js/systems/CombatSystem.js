import { TacticsEngine } from './TacticsEngine.js';

export class CombatSystem {
    constructor(party, enemies) {
        this.party = party;
        this.enemies = enemies;
        this.tacticsEngine = new TacticsEngine();
        this.turnOrder = [];
        this.currentTurnIndex = 0;
        this.log = [];
    }

    startCombat() {
        // Calculate initiative
        const allCombatants = [...this.party.members, ...this.enemies];
        // Sort by Agility (descending) - simplified for now
        this.turnOrder = allCombatants.sort((a, b) => (b.attributes?.Agility || 10) - (a.attributes?.Agility || 10));
        this.currentTurnIndex = 0;
        this.log.push("Combat Started!");
    }

    nextTurn() {
        if (this.isCombatOver()) return;

        const currentActor = this.turnOrder[this.currentTurnIndex];
        this.log.push(`Turn: ${currentActor.name}`);

        if (this.isPlayerCharacter(currentActor)) {
            // Execute Tactics
            const battleState = {
                allies: this.party.members,
                enemies: this.enemies
            };
            const decision = this.tacticsEngine.evaluate(currentActor, battleState);
            this.executeAction(currentActor, decision);
        } else {
            // Enemy AI
            this.executeEnemyAI(currentActor);
        }

        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
    }

    executeAction(actor, decision) {
        this.log.push(`${actor.name} uses ${decision.action} on ${decision.target.name}`);
        // Apply damage/healing logic here
        // Simplified damage
        if (decision.action.includes('Attack')) {
            const damage = 10; // Placeholder
            decision.target.hp -= damage;
            this.log.push(`${decision.target.name} takes ${damage} damage!`);
            if (decision.target.hp <= 0) {
                this.log.push(`${decision.target.name} is defeated!`);
                this.handleDeath(decision.target);
            }
        }
    }

    executeEnemyAI(enemy) {
        // Simple attack random target
        const target = this.party.members[Math.floor(Math.random() * this.party.members.length)];
        if (target) {
            this.log.push(`${enemy.name} attacks ${target.name}`);
            target.hp -= 5;
            if (target.hp <= 0) {
                this.log.push(`${target.name} is defeated!`);
                this.handleDeath(target);
            }
        }
    }

    handleDeath(combatant) {
        // Remove from lists, etc.
        if (this.isPlayerCharacter(combatant)) {
            const idx = this.party.members.indexOf(combatant);
            if (idx > -1) this.party.members.splice(idx, 1);
        } else {
            const idx = this.enemies.indexOf(combatant);
            if (idx > -1) this.enemies.splice(idx, 1);
        }
        // Re-calculate turn order to remove dead combatants
        this.turnOrder = this.turnOrder.filter(c => c !== combatant);
    }

    isPlayerCharacter(actor) {
        return this.party.members.includes(actor);
    }

    isCombatOver() {
        return this.party.members.length === 0 || this.enemies.length === 0;
    }
}
