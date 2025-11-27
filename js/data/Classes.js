export const ROLES = {
    CONTROLLER: 'Controller',
    DEFENDER: 'Defender',
    LEADER: 'Leader',
    STRIKER: 'Striker'
};

export const POWER_SOURCES = {
    MARTIAL: 'Martial',
    PRIMAL: 'Primal',
    DIVINE: 'Divine',
    ARCANE: 'Arcane'
};

export const ATTRIBUTES = {
    STRENGTH: 'Strength',
    CONSTITUTION: 'Constitution',
    DEXTERITY: 'Dexterity',
    AGILITY: 'Agility',
    INTELLIGENCE: 'Intelligence',
    WILLPOWER: 'Willpower',
    CHARISMA: 'Charisma',
    WISDOM: 'Wisdom'
};

export const CLASSES = {
    HUNTER: { name: 'Hunter', role: ROLES.CONTROLLER, source: POWER_SOURCES.MARTIAL },
    DRUID: { name: 'Druid', role: ROLES.CONTROLLER, source: POWER_SOURCES.PRIMAL },
    INVOKER: { name: 'Invoker', role: ROLES.CONTROLLER, source: POWER_SOURCES.DIVINE },
    WIZARD: { name: 'Wizard', role: ROLES.CONTROLLER, source: POWER_SOURCES.ARCANE },

    FIGHTER: { name: 'Fighter', role: ROLES.DEFENDER, source: POWER_SOURCES.MARTIAL },
    WARDEN: { name: 'Warden', role: ROLES.DEFENDER, source: POWER_SOURCES.PRIMAL },
    PALADIN: { name: 'Paladin', role: ROLES.DEFENDER, source: POWER_SOURCES.DIVINE },
    SWORDMAGE: { name: 'Swordmage', role: ROLES.DEFENDER, source: POWER_SOURCES.ARCANE },

    WARLORD: { name: 'Warlord', role: ROLES.LEADER, source: POWER_SOURCES.MARTIAL },
    SHAMAN: { name: 'Shaman', role: ROLES.LEADER, source: POWER_SOURCES.PRIMAL },
    CLERIC: { name: 'Cleric', role: ROLES.LEADER, source: POWER_SOURCES.DIVINE },
    BARD: { name: 'Bard', role: ROLES.LEADER, source: POWER_SOURCES.ARCANE },

    ROGUE: { name: 'Rogue', role: ROLES.STRIKER, source: POWER_SOURCES.MARTIAL },
    BARBARIAN: { name: 'Barbarian', role: ROLES.STRIKER, source: POWER_SOURCES.PRIMAL },
    AVENGER: { name: 'Avenger', role: ROLES.STRIKER, source: POWER_SOURCES.DIVINE },
    SORCERER: { name: 'Sorcerer', role: ROLES.STRIKER, source: POWER_SOURCES.ARCANE }
};
