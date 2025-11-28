import React, { useState, useEffect, useRef } from 'react';
import {
  Sword, Shield, Heart, Zap, Play, Pause, RefreshCw,
  ChevronRight, Skull, Activity, Lock, Settings, User,
  Flame, Droplet, Wind, Mountain, Cross, Star, Moon, Sun,
  BookOpen, Target, Edit3, Trash2, Plus, Save, GripVertical,
  Move, Crosshair, Zap as ZapIcon, Users
} from 'lucide-react';

// --- CONSTANTS & DATA ---

const GAME_STATES = {
  MENU: 'MENU',
  PARTY_SELECT: 'PARTY_SELECT',
  TACTICS: 'TACTICS',
  COMBAT: 'COMBAT',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT'
};

const POWER_SOURCES = {
  MARTIAL: { name: 'Martial', color: 'text-red-400', icon: Sword },
  PRIMAL: { name: 'Primal', color: 'text-green-400', icon: Mountain },
  DIVINE: { name: 'Divine', color: 'text-yellow-400', icon: Sun },
  ARCANE: { name: 'Arcane', color: 'text-purple-400', icon: Moon },
};

const ROLE_KEYS = ['CONTROLLER', 'DEFENDER', 'LEADER', 'STRIKER'];

const ROLES = {
  CONTROLLER: { name: 'Controller', desc: 'Debuff & AoE', icon: Wind },
  DEFENDER: { name: 'Defender', desc: 'Tank & Protect', icon: Shield },
  LEADER: { name: 'Leader', desc: 'Heal & Buff', icon: Heart },
  STRIKER: { name: 'Striker', desc: 'Single Target DPS', icon: Zap },
};

const CLASSES = {
  'MARTIAL_CONTROLLER': 'Hunter',
  'PRIMAL_CONTROLLER': 'Druid',
  'DIVINE_CONTROLLER': 'Invoker',
  'ARCANE_CONTROLLER': 'Wizard',

  'MARTIAL_DEFENDER': 'Fighter',
  'PRIMAL_DEFENDER': 'Warden',
  'DIVINE_DEFENDER': 'Paladin',
  'ARCANE_DEFENDER': 'Swordmage',

  'MARTIAL_LEADER': 'Warlord',
  'PRIMAL_LEADER': 'Shaman',
  'DIVINE_LEADER': 'Cleric',
  'ARCANE_LEADER': 'Bard',

  'MARTIAL_STRIKER': 'Rogue',
  'PRIMAL_STRIKER': 'Barbarian',
  'DIVINE_STRIKER': 'Avenger',
  'ARCANE_STRIKER': 'Sorcerer',
};

const STAT_BLOCKS = {
  CONTROLLER: { str: 8, con: 10, dex: 12, int: 14, wil: 14, cha: 10, hp: 80 },
  DEFENDER: { str: 14, con: 14, dex: 10, int: 8, wil: 12, cha: 10, hp: 120 },
  LEADER: { str: 10, con: 12, dex: 10, int: 12, wil: 14, cha: 12, hp: 90 },
  STRIKER: { str: 12, con: 10, dex: 14, int: 10, wil: 8, cha: 12, hp: 70 },
};

// --- NEW GRANULAR TACTICS ---

const TACTIC_TARGETS = [
  { id: 'SELF', label: 'Self' },
  { id: 'ALLY', label: 'Ally' },
  { id: 'ENEMY', label: 'Enemy' },
];

const TACTIC_CONDITIONS = [
  { id: 'ALWAYS', label: 'Always' },
  { id: 'HP_LT_50', label: 'HP < 50%' },
  { id: 'HP_LT_25', label: 'HP < 25%' },
  { id: 'HP_GT_80', label: 'HP > 80%' },
  { id: 'STATUS_ANY', label: 'Any Status' },
  { id: 'IS_ELITE', label: 'Is Elite' },
  { id: 'IS_MINION', label: 'Is Minion' },
  { id: 'EXISTS', label: 'Is Alive' },
];

// Phase 1: Movement
const MOVEMENT_ACTIONS = [
  { id: 'HOLD', label: 'Hold Position' },
  { id: 'MOVE_FORWARD', label: 'Move Forward' },
  { id: 'MOVE_BACK', label: 'Move Back' },
  { id: 'FLANK', label: 'Flank' },
];

// Phase 2: Targeting
const TARGETING_ACTIONS = [
  { id: 'TARGET_CLOSEST', label: 'Focus Closest' },
  { id: 'TARGET_FURTHEST', label: 'Focus Furthest' },
  { id: 'TARGET_WEAKEST', label: 'Focus Weakest' },
  { id: 'TARGET_STRONGEST', label: 'Focus Strongest' },
  { id: 'TARGET_LEADER', label: 'Focus Boss/Elite' },
  { id: 'TARGET_RANDOM', label: 'Focus Random' },
  { id: 'TARGET_ALLY_LOWEST', label: 'Focus Low HP Ally' },
];

// Phase 3: Action
const COMBAT_ACTIONS = [
  { id: 'ATTACK', label: 'Attack', type: 'OFFENSIVE', cost: 0 },
  { id: 'HEAL', label: 'Heal', type: 'SUPPORT', cost: 10 },
  { id: 'FIREBALL', label: 'Fireball', type: 'OFFENSIVE', cost: 15 },
  { id: 'TAUNT', label: 'Taunt', type: 'DEFENSIVE', cost: 5 },
  { id: 'STRONG_STRIKE', label: 'Power Strike', type: 'OFFENSIVE', cost: 8 },
  { id: 'QUICK_STAB', label: 'Quick Stab', type: 'OFFENSIVE', cost: 4 },
  { id: 'DEFEND', label: 'Defend', type: 'DEFENSIVE', cost: 0 },
];

// --- HELPER FUNCTIONS ---

const generateHero = (powerSourceKey, roleKey, id) => {
  const className = CLASSES[`${powerSourceKey}_${roleKey}`];
  const stats = STAT_BLOCKS[roleKey];

  // Default Tactics Setup (Updated Structure)
  // Structure: { targetType: 'SELF', condition: 'HP_LT_50', action: 'MOVE_BACK' }

  const movementTactics = [
    { targetType: 'SELF', condition: 'HP_LT_25', action: 'MOVE_BACK' },
    { targetType: 'SELF', condition: 'ALWAYS', action: 'HOLD' }
  ];

  const targetingTactics = [
    { targetType: 'ENEMY', condition: 'IS_ELITE', action: 'TARGET_LEADER' },
    { targetType: 'ENEMY', condition: 'ALWAYS', action: 'TARGET_CLOSEST' }
  ];

  let actionTactics = [];
  if (roleKey === 'LEADER') {
    actionTactics.push({ targetType: 'ALLY', condition: 'HP_LT_50', action: 'HEAL' });
  }
  if (roleKey === 'DEFENDER') {
    actionTactics.push({ targetType: 'ENEMY', condition: 'IS_ELITE', action: 'TAUNT' });
  }
  if (roleKey === 'CONTROLLER') {
    actionTactics.push({ targetType: 'ENEMY', condition: 'IS_MINION', action: 'FIREBALL' });
  }
  actionTactics.push({ targetType: 'ENEMY', condition: 'ALWAYS', action: 'ATTACK' });

  return {
    id: `hero-${id}`,
    name: className,
    className: className,
    role: roleKey,
    powerSource: powerSourceKey,
    level: 1,
    maxHp: stats.hp,
    currentHp: stats.hp,
    maxMp: 30 + (stats.wil * 2),
    currentMp: 30 + (stats.wil * 2),
    stats: { ...stats },
    movementTactics,
    targetingTactics,
    actionTactics,
    isPlayer: true,
    initiative: 0,
    status: []
  };
};

const generateEnemy = (level, difficulty) => {
  const types = [
    { name: 'Goblin Minion', hp: 20, dmg: 5, spd: 12, tag: 'MINION' },
    { name: 'Orc Brute', hp: 60, dmg: 12, spd: 8, tag: 'SOLDIER' },
    { name: 'Skeleton Archer', hp: 30, dmg: 8, spd: 14, tag: 'ARTILLERY' },
    { name: 'Dark Cultist', hp: 40, dmg: 10, spd: 10, tag: 'CONTROLLER' },
    { name: 'Ogre', hp: 120, dmg: 20, spd: 6, tag: 'ELITE' },
    { name: 'Red Dragon', hp: 300, dmg: 35, spd: 10, tag: 'SOLO' },
  ];

  let pool = types.filter(t => t.tag !== 'SOLO');
  if (difficulty > 3) pool = types;
  if (difficulty === 10) pool = [types[5]];

  const template = pool[Math.floor(Math.random() * pool.length)];

  return {
    id: `enemy-${Date.now()}-${Math.random()}`,
    name: template.name,
    tag: template.tag,
    level: level,
    maxHp: Math.floor(template.hp * (1 + level * 0.1)),
    currentHp: Math.floor(template.hp * (1 + level * 0.1)),
    stats: { str: 10 + level, dex: template.spd, wil: 10 },
    damage: template.dmg + level,
    isPlayer: false,
    initiative: 0,
    status: []
  };
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800 border-2 border-slate-600 rounded p-4 shadow-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, disabled, variant = 'primary', className = "" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800 active:border-b-0 active:mt-1",
    secondary: "bg-slate-600 hover:bg-slate-500 text-white border-b-4 border-slate-800 active:border-b-0 active:mt-1",
    danger: "bg-red-600 hover:bg-red-500 text-white border-b-4 border-red-800 active:border-b-0 active:mt-1",
    success: "bg-green-600 hover:bg-green-500 text-white border-b-4 border-green-800 active:border-b-0 active:mt-1",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 font-bold uppercase text-sm tracking-wider rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- MAIN APP COMPONENT ---

export default function KnightsAndBolts() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [party, setParty] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [combatLog, setCombatLog] = useState([]);
  const [level, setLevel] = useState(1);
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('ACTION');
  const [autoPlay, setAutoPlay] = useState(false);
  const [turnQueue, setTurnQueue] = useState([]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragListType = useRef(null);

  // --- GAME LOGIC ---

  const startGame = () => {
    setGameState(GAME_STATES.PARTY_SELECT);
    setParty([]);
  };

  const addHeroToParty = (pSource, role) => {
    if (party.length >= 3) return;
    const newHero = generateHero(pSource, role, party.length);
    setParty([...party, newHero]);
  };

  const finalizeParty = () => {
    if (party.length === 3) {
      setGameState(GAME_STATES.TACTICS);
    }
  };

  const startCombat = () => {
    const enemyCount = 1 + Math.floor(Math.random() * 3);
    const newEnemies = Array(enemyCount).fill(null).map(() => generateEnemy(level, level));
    const healedParty = party.map(h => ({ ...h, currentHp: h.maxHp, currentMp: h.maxMp }));
    setParty(healedParty);
    setEnemies(newEnemies);
    setCombatLog(["Combat Started!", `Encounter Level ${level}`]);
    setGameState(GAME_STATES.COMBAT);
    setTurnQueue([]);
    setAutoPlay(false);
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleSort = (listType) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragListType.current !== listType) return;

    const listKey = listType === 'MOVEMENT' ? 'movementTactics' :
      listType === 'TARGETING' ? 'targetingTactics' : 'actionTactics';

    let _list = [...party[selectedHeroIndex][listKey]];
    const draggedItemContent = _list.splice(dragItem.current, 1)[0];
    _list.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    dragListType.current = null;

    const newParty = [...party];
    newParty[selectedHeroIndex][listKey] = _list;
    setParty(newParty);
  };

  // --- COMBAT ENGINE ---

  const executeTurn = () => {
    let queue = [...turnQueue];
    const allCombatants = [...party, ...enemies].filter(c => c.currentHp > 0);

    if (allCombatants.length === 0) return;

    if (queue.length === 0) {
      queue = allCombatants.sort((a, b) => {
        const initA = (a.stats?.dex || 10) + Math.random() * 20;
        const initB = (b.stats?.dex || 10) + Math.random() * 20;
        return initB - initA;
      });
    }

    const actor = queue.shift();
    setTurnQueue(queue);

    if (!actor || actor.currentHp <= 0) return;

    let logEntry = "";

    if (actor.isPlayer) {
      // --- PLAYER AI PHASE ---
      let moveChoice = "HOLD";
      let targetChoice = null;
      let actionChoice = null;
      let actionDef = null;

      // PHASE 1: MOVEMENT
      for (let tactic of actor.movementTactics) {
        if (checkGranularCondition(tactic, actor, party, enemies)) {
          moveChoice = tactic.action;
          break;
        }
      }

      // PHASE 2: TARGETING
      for (let tactic of actor.targetingTactics) {
        if (checkGranularCondition(tactic, actor, party, enemies)) {
          targetChoice = resolveTarget(tactic.action, actor, party, enemies);
          break;
        }
      }
      if (!targetChoice) targetChoice = resolveTarget('TARGET_CLOSEST', actor, party, enemies);

      // PHASE 3: ACTION
      for (let tactic of actor.actionTactics) {
        if (checkGranularCondition(tactic, actor, party, enemies)) {
          const def = COMBAT_ACTIONS.find(a => a.id === tactic.action);
          if (actor.currentMp >= def.cost) {
            actionChoice = tactic.action;
            actionDef = def;
            break;
          }
        }
      }

      if (!actionChoice) {
        actionChoice = 'ATTACK';
        actionDef = COMBAT_ACTIONS.find(a => a.id === 'ATTACK');
      }

      const result = performCombatAction(actionChoice, actionDef, targetChoice, actor, party, enemies);

      let moveText = moveChoice !== 'HOLD' ? `[${moveChoice}] ` : '';
      logEntry = `${actor.name}: ${moveText}${result.text}`;
      updateCombatState(result.updates);

    } else {
      // --- ENEMY AI ---
      const livingPlayers = party.filter(p => p.currentHp > 0);
      if (livingPlayers.length > 0) {
        const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
        const dmg = Math.max(1, actor.damage - Math.floor((target.stats?.con || 10) / 2));

        const isCrit = Math.random() > 0.9;
        const finalDmg = isCrit ? dmg * 2 : dmg;

        logEntry = `${actor.name} attacks ${target.name} for ${finalDmg} damage!${isCrit ? ' (CRIT!)' : ''}`;
        updateCombatState([{ id: target.id, hpChange: -finalDmg }]);
      } else {
        logEntry = `${actor.name} roars in victory!`;
      }
    }

    setCombatLog(prev => [logEntry, ...prev].slice(0, 10));
    checkWinCondition();
  };

  // --- NEW GRANULAR CHECKER ---
  const checkGranularCondition = (tactic, actor, allies, hostiles) => {
    const { targetType, condition } = tactic;

    // 1. Determine Scope
    let scopeList = [];
    if (targetType === 'SELF') scopeList = [actor];
    else if (targetType === 'ALLY') scopeList = allies.filter(a => a.currentHp > 0);
    else if (targetType === 'ENEMY') scopeList = hostiles.filter(e => e.currentHp > 0);

    // 2. Check Condition against Scope
    if (condition === 'ALWAYS') return true;
    if (scopeList.length === 0) return false;

    // "Does ANYONE in the scope match the condition?"
    return scopeList.some(target => {
      const hpPct = target.currentHp / target.maxHp;
      switch (condition) {
        case 'HP_LT_50': return hpPct < 0.5;
        case 'HP_LT_25': return hpPct < 0.25;
        case 'HP_GT_80': return hpPct > 0.8;
        case 'IS_ELITE': return ['ELITE', 'SOLO'].includes(target.tag);
        case 'IS_MINION': return target.tag === 'MINION';
        case 'EXISTS': return target.currentHp > 0;
        case 'STATUS_ANY': return target.status && target.status.length > 0;
        default: return false;
      }
    });
  };

  const resolveTarget = (targetMode, actor, allies, hostiles) => {
    const livingAllies = allies.filter(a => a.currentHp > 0);
    const livingEnemies = hostiles.filter(e => e.currentHp > 0);
    if (livingEnemies.length === 0) return null;

    switch (targetMode) {
      case 'TARGET_CLOSEST': return livingEnemies[0];
      case 'TARGET_FURTHEST': return livingEnemies[livingEnemies.length - 1];
      case 'TARGET_WEAKEST': return [...livingEnemies].sort((a, b) => a.currentHp - b.currentHp)[0];
      case 'TARGET_STRONGEST': return [...livingEnemies].sort((a, b) => b.currentHp - a.currentHp)[0];
      case 'TARGET_LEADER': return livingEnemies.find(e => ['ELITE', 'SOLO'].includes(e.tag)) || livingEnemies[0];
      case 'TARGET_RANDOM': return livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
      case 'TARGET_ALLY_LOWEST': return [...livingAllies].sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];
      default: return livingEnemies[0];
    }
  };

  const performCombatAction = (actionId, actionDef, primaryTarget, actor, allies, hostiles) => {
    let updates = [{ id: actor.id, mpChange: -actionDef.cost }];
    let text = "";

    let actualTarget = primaryTarget;
    if (actionDef.type === 'SUPPORT' && (!primaryTarget || !primaryTarget.isPlayer)) {
      const livingAllies = allies.filter(a => a.currentHp > 0);
      actualTarget = livingAllies.sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];
    }

    if (!actualTarget) return { text: "Stood still (No Target)", updates };

    if (actionId === 'HEAL') {
      const healAmt = 15 + (actor.stats.int || 10);
      updates.push({ id: actualTarget.id, hpChange: healAmt });
      text = `Heals ${actualTarget.name} (+${healAmt} HP)`;

    } else if (actionId === 'FIREBALL') {
      const dmg = 8 + Math.floor((actor.stats.int || 10) / 2);
      hostiles.filter(e => e.currentHp > 0).forEach(e => {
        updates.push({ id: e.id, hpChange: -dmg });
      });
      text = `Fireball! All enemies take ${dmg} dmg.`;

    } else if (actionId === 'TAUNT') {
      text = `Taunts ${actualTarget.name}!`;

    } else if (actionId === 'DEFEND') {
      text = `takes a Defensive Stance.`;

    } else {
      let baseDmg = actor.stats.str || 10;
      if (actionId === 'STRONG_STRIKE') baseDmg *= 1.5;
      if (actionId === 'QUICK_STAB') baseDmg = (actor.stats.dex || 10) * 1.2;

      const dmg = Math.floor(Math.max(1, baseDmg - (actualTarget.stats?.dex || 5) / 2));
      updates.push({ id: actualTarget.id, hpChange: -dmg });
      text = `Uses ${actionDef.label} on ${actualTarget.name} for ${dmg} dmg`;
    }

    return { text, updates };
  };

  const updateCombatState = (updates) => {
    const process = (list) => list.map(char => {
      const update = updates.find(u => u.id === char.id);
      if (!update) return char;
      let newHp = char.currentHp;
      let newMp = char.currentMp || 0;
      if (update.hpChange) newHp = Math.min(char.maxHp, Math.max(0, char.currentHp + update.hpChange));
      if (update.mpChange) newMp = Math.max(0, char.currentMp + update.mpChange);
      return { ...char, currentHp: newHp, currentMp: newMp };
    });
    setParty(process(party));
    setEnemies(process(enemies));
  };

  const checkWinCondition = () => {
    const pAlive = party.some(p => p.currentHp > 0);
    const eAlive = enemies.some(e => e.currentHp > 0);
    if (!pAlive) {
      setGameState(GAME_STATES.DEFEAT);
      setAutoPlay(false);
    } else if (!eAlive) {
      setGameState(GAME_STATES.VICTORY);
      setAutoPlay(false);
    }
  };

  useEffect(() => {
    let interval;
    if (gameState === GAME_STATES.COMBAT && autoPlay) {
      interval = setInterval(() => {
        const pAlive = party.some(p => p.currentHp > 0);
        const eAlive = enemies.some(e => e.currentHp > 0);
        if (!pAlive || !eAlive) {
          checkWinCondition();
          return;
        }
        executeTurn();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, autoPlay, turnQueue, party, enemies]);


  // --- UI RENDERERS ---

  const renderMainMenu = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
      <h1 className="text-6xl font-black text-yellow-500 tracking-tighter drop-shadow-lg text-center">
        KNIGHTS <span className="text-white">&</span> BOLTS
      </h1>
      <p className="text-xl text-slate-400 max-w-md text-center">
        Program your party. Watch them fight. Conquer the realm.
      </p>
      <div className="flex gap-4">
        <Button onClick={startGame} className="text-xl px-8 py-4">New Game</Button>
      </div>
      <div className="mt-8 text-xs text-slate-600">v0.9.3 Beta</div>
    </div>
  );

  const renderPartySelect = () => (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-white border-b border-slate-700 pb-4">
        Assemble Your Party ({party.length}/3)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 overflow-y-auto">
          <h3 className="text-xl text-slate-300 mb-4 flex items-center gap-2"><BookOpen size={20} /> Select Class</h3>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-1"></div>
            {ROLE_KEYS.map(rkey => (
              <div key={rkey} className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{ROLES[rkey].name}</div>
            ))}

            {Object.entries(POWER_SOURCES).map(([pkey, pval]) => (
              <React.Fragment key={pkey}>
                <div className={`flex items-center justify-end pr-2 font-bold ${pval.color}`}>
                  <pval.icon size={16} className="mr-1" /> {pval.name}
                </div>
                {ROLE_KEYS.map(rkey => {
                  const className = CLASSES[`${pkey}_${rkey}`];
                  const isPicked = party.some(p => p.className === className);
                  return (
                    <button
                      key={className}
                      disabled={party.length >= 3 || isPicked}
                      onClick={() => addHeroToParty(pkey, rkey)}
                      className={`p-2 text-xs border rounded transition-all hover:scale-105
                         ${isPicked ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-white'}
                       `}
                    >
                      {className}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {party.map((hero, idx) => (
            <Card key={idx} className="flex justify-between items-center bg-slate-800/80">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-900 border-2 ${POWER_SOURCES[hero.powerSource].color.replace('text', 'border')}`}>
                  {React.createElement(POWER_SOURCES[hero.powerSource].icon, { size: 24 })}
                </div>
                <div>
                  <div className="font-bold text-lg">{hero.name}</div>
                  <div className="text-xs text-slate-400">{hero.powerSource} {ROLES[hero.role].name}</div>
                </div>
              </div>
              <button
                onClick={() => setParty(party.filter((_, i) => i !== idx))}
                className="text-red-500 hover:text-red-400 p-2"
              >
                <Trash2 size={20} />
              </button>
            </Card>
          ))}
          {party.length < 3 && (
            <div className="border-2 border-dashed border-slate-700 rounded-lg h-24 flex items-center justify-center text-slate-600">
              Select {3 - party.length} more hero(es)
            </div>
          )}
          <div className="mt-auto">
            <Button onClick={finalizeParty} disabled={party.length !== 3} className="w-full py-4 text-lg" variant="success">
              Confirm Party
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTacticsEditor = () => {
    const hero = party[selectedHeroIndex];

    let currentList = [];
    let listKey = '';
    let actionOptions = [];

    if (activeTab === 'MOVEMENT') {
      currentList = hero.movementTactics;
      listKey = 'movementTactics';
      actionOptions = MOVEMENT_ACTIONS;
    } else if (activeTab === 'TARGETING') {
      currentList = hero.targetingTactics;
      listKey = 'targetingTactics';
      actionOptions = TARGETING_ACTIONS;
    } else {
      currentList = hero.actionTactics;
      listKey = 'actionTactics';
      actionOptions = COMBAT_ACTIONS;
    }

    const updateTactic = (tacticIndex, field, value) => {
      const newList = [...currentList];
      newList[tacticIndex] = { ...newList[tacticIndex], [field]: value };
      const newParty = [...party];
      newParty[selectedHeroIndex][listKey] = newList;
      setParty(newParty);
    };

    const addTactic = () => {
      const newParty = [...party];
      let defAction = 'ATTACK';
      if (activeTab === 'MOVEMENT') defAction = 'MOVE_FORWARD';
      if (activeTab === 'TARGETING') defAction = 'TARGET_CLOSEST';

      newParty[selectedHeroIndex][listKey].unshift({ targetType: 'SELF', condition: 'ALWAYS', action: defAction });
      setParty(newParty);
    };

    const removeTactic = (idx) => {
      const newParty = [...party];
      newParty[selectedHeroIndex][listKey].splice(idx, 1);
      setParty(newParty);
    };

    return (
      <div className="flex flex-col h-full bg-slate-900">
        <div className="flex bg-slate-800 p-2 gap-2 border-b border-slate-700">
          {party.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedHeroIndex(idx)}
              className={`px-4 py-2 rounded font-bold flex items-center gap-2 ${idx === selectedHeroIndex ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
              {React.createElement(POWER_SOURCES[p.powerSource].icon, { size: 16 })} {p.name}
            </button>
          ))}
          <div className="flex-1"></div>
          <Button onClick={startCombat} variant="success" className="flex items-center gap-2"><Sword size={18} /> To Battle</Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 bg-slate-800 border-r border-slate-700 flex flex-col pt-4">
            <button
              onClick={() => setActiveTab('MOVEMENT')}
              className={`p-4 text-left font-bold flex items-center gap-2 ${activeTab === 'MOVEMENT' ? 'bg-slate-700 text-white border-l-4 border-blue-500' : 'text-slate-400 hover:bg-slate-750'}`}
            >
              <Move size={18} /> Movement
            </button>
            <button
              onClick={() => setActiveTab('TARGETING')}
              className={`p-4 text-left font-bold flex items-center gap-2 ${activeTab === 'TARGETING' ? 'bg-slate-700 text-white border-l-4 border-amber-500' : 'text-slate-400 hover:bg-slate-750'}`}
            >
              <Crosshair size={18} /> Targeting
            </button>
            <button
              onClick={() => setActiveTab('ACTION')}
              className={`p-4 text-left font-bold flex items-center gap-2 ${activeTab === 'ACTION' ? 'bg-slate-700 text-white border-l-4 border-red-500' : 'text-slate-400 hover:bg-slate-750'}`}
            >
              <ZapIcon size={18} /> Actions
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-slate-900">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{activeTab} TACTICS</h2>
                <p className="text-slate-400 text-sm">
                  Customize logic with <span className="text-blue-400">Target</span>, <span className="text-amber-400">Condition</span>, and <span className="text-red-400">Action</span>.
                </p>
              </div>

              <button
                onClick={addTactic}
                className="w-full mb-4 py-3 border-2 border-dashed border-slate-700 rounded text-slate-500 hover:border-slate-500 hover:text-slate-300 flex items-center justify-center gap-2 font-bold"
              >
                <Plus size={16} /> Add {activeTab.toLowerCase()} Tactic
              </button>

              <div className="space-y-3">
                {currentList.map((tactic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-800 p-3 rounded border border-slate-700 shadow-sm animate-fade-in-up cursor-grab active:cursor-grabbing text-sm"
                    draggable
                    onDragStart={(e) => {
                      dragItem.current = idx;
                      dragListType.current = activeTab;
                    }}
                    onDragEnter={(e) => dragOverItem.current = idx}
                    onDragEnd={() => handleSort(activeTab)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="text-slate-600 cursor-grab hover:text-slate-400">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-6 text-center font-mono text-slate-500">{idx + 1}</div>

                    {/* IF TARGET... */}
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-2 rounded text-blue-400 font-mono border border-slate-700">
                      <span className="text-slate-500 font-sans text-[10px] uppercase">If</span>
                      <select
                        value={tactic.targetType}
                        onChange={(e) => updateTactic(idx, 'targetType', e.target.value)}
                        className="bg-transparent outline-none cursor-pointer hover:text-blue-300 w-20"
                      >
                        {TACTIC_TARGETS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </select>
                    </div>

                    {/* HAS CONDITION... */}
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-2 rounded text-amber-400 font-mono border border-slate-700">
                      <span className="text-slate-500 font-sans text-[10px] uppercase">Has</span>
                      <select
                        value={tactic.condition}
                        onChange={(e) => updateTactic(idx, 'condition', e.target.value)}
                        className="bg-transparent outline-none cursor-pointer hover:text-amber-300 w-28"
                      >
                        {TACTIC_CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>

                    <div className="text-slate-600"><ChevronRight size={16} /></div>

                    {/* THEN ACTION... */}
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-2 rounded text-red-400 font-mono border border-slate-700 flex-1">
                      <span className="text-slate-500 font-sans text-[10px] uppercase">Then</span>
                      <select
                        value={tactic.action}
                        onChange={(e) => updateTactic(idx, 'action', e.target.value)}
                        className="bg-transparent outline-none cursor-pointer w-full hover:text-red-300"
                      >
                        {actionOptions.map(a => <option key={a.id} value={a.id}>{a.label} {a.cost ? `(${a.cost} MP)` : ''}</option>)}
                      </select>
                    </div>

                    <button onClick={() => removeTactic(idx)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
                {currentList.length === 0 && <div className="text-slate-600 italic text-center py-8">No tactics defined. Character will do nothing in this phase.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCombat = () => (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between shadow-md z-10">
        <div className="font-bold text-slate-200 flex items-center gap-2">
          <Skull size={20} className="text-red-500" /> Floor {level}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => executeTurn()}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded"
            title="Next Step"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded font-bold flex items-center gap-2 w-32 justify-center ${autoPlay ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
          >
            {autoPlay ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Auto</>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Heroes</h3>
          {party.map(hero => (
            <div key={hero.id} className={`bg-slate-800 p-3 rounded border-l-4 ${hero.currentHp === 0 ? 'border-slate-600 opacity-50 grayscale' : 'border-blue-500'} shadow`}>
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-white">{hero.name}</div>
                <div className="text-[10px] bg-slate-700 px-1 rounded text-slate-300">{ROLES[hero.role].name}</div>
              </div>
              <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden mb-1">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(hero.currentHp / hero.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>HP {hero.currentHp}/{hero.maxHp}</span>
              </div>
              <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(hero.currentMp / hero.maxMp) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
          <div className="flex justify-center gap-8 mb-16 w-full">
            {enemies.map((enemy, i) => (
              <div key={enemy.id} className={`relative group transition-all duration-500 ${enemy.currentHp <= 0 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <div className="absolute -top-6 left-0 right-0 h-1 bg-slate-700 rounded">
                  <div className="h-full bg-red-500 transition-all" style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}></div>
                </div>
                <div className="w-24 h-24 bg-red-900/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center text-red-500 animate-pulse-slow">
                  <Skull size={48} />
                </div>
                <div className="text-center mt-2 font-bold text-red-200 text-sm shadow-black drop-shadow-md">
                  {enemy.name}
                </div>
                <div className="text-center text-[10px] text-red-400 uppercase tracking-widest">{enemy.tag}</div>
              </div>
            ))}
          </div>

          <div className="text-slate-700 font-black text-4xl opacity-20 my-4">VS</div>

          <div className="flex justify-center gap-8 mt-8 w-full">
            {party.map((hero, i) => (
              <div key={hero.id} className={`flex flex-col items-center transition-all ${hero.currentHp <= 0 ? 'opacity-25 grayscale' : ''}`}>
                <div className={`w-20 h-20 bg-blue-900/20 border-2 border-blue-500/50 rounded-lg flex items-center justify-center ${POWER_SOURCES[hero.powerSource].color}`}>
                  {React.createElement(POWER_SOURCES[hero.powerSource].icon, { size: 40 })}
                </div>
                <div className="mt-2 text-center text-xs font-bold text-blue-100">{hero.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/4 bg-slate-900 border-l border-slate-800 flex flex-col">
          <div className="p-2 bg-slate-800 text-xs font-bold text-slate-400 uppercase border-b border-slate-700">Combat Log</div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
            {combatLog.map((entry, i) => (
              <div key={i} className={`pb-1 border-b border-slate-800 ${i === 0 ? 'text-white font-bold' : 'text-slate-400'}`}>
                <span className="opacity-50 mr-2">[{i}]</span> {entry}
              </div>
            ))}
            {combatLog.length === 0 && <div className="text-slate-600 italic">Waiting for orders...</div>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVictory = () => (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in space-y-6">
      <Star size={64} className="text-yellow-400 mb-4 animate-bounce" />
      <h2 className="text-4xl font-bold text-white">Victory!</h2>
      <p className="text-slate-400">The enemy has been vanquished.</p>
      <div className="flex gap-4">
        <Button onClick={() => {
          setGameState(GAME_STATES.TACTICS);
          setParty(party.map(p => ({ ...p, currentHp: p.maxHp, currentMp: p.maxMp, level: p.level + 1 })));
          setLevel(level + 1);
        }} variant="primary">Next Floor (Lvl {level + 1})</Button>
      </div>
    </div>
  );

  const renderDefeat = () => (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in space-y-6 bg-red-950/20">
      <Skull size={64} className="text-red-500 mb-4" />
      <h2 className="text-4xl font-bold text-white">Defeat</h2>
      <p className="text-slate-400">Your party has fallen.</p>
      <div className="flex gap-4">
        <Button onClick={startGame} variant="secondary">Return to Menu</Button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto:wght@400;700&display=swap');
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .animate-fade-in { animation: fadeIn 0.5s ease-out; }
          .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
       `}} />

      <div className="flex-1 relative">
        {gameState === GAME_STATES.MENU && renderMainMenu()}
        {gameState === GAME_STATES.PARTY_SELECT && renderPartySelect()}
        {gameState === GAME_STATES.TACTICS && renderTacticsEditor()}
        {gameState === GAME_STATES.COMBAT && renderCombat()}
        {gameState === GAME_STATES.VICTORY && renderVictory()}
        {gameState === GAME_STATES.DEFEAT && renderDefeat()}
      </div>
    </div>
  );
}
