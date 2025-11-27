import { CLASSES } from '../data/Classes.js';
import { Character } from '../models/Character.js';
import { Party } from '../models/Party.js';
import { CONDITIONS, ACTIONS } from '../models/Tactic.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.uiLayer = document.getElementById('ui-layer');
    }

    clearUI() {
        this.uiLayer.innerHTML = '';
    }

    createMainMenuUI(onStart) {
        this.clearUI();
        const container = document.createElement('div');
        container.className = 'ui-element';
        container.style.textAlign = 'center';
        container.style.maxWidth = '500px';
        container.style.backgroundColor = 'transparent';
        container.style.border = 'none';
        container.style.boxShadow = 'none';

        const title = document.createElement('h1');
        title.innerText = 'KNIGHTS & BOLTS';
        title.style.fontSize = '4rem';
        title.style.marginBottom = '1rem';
        title.style.color = 'var(--accent-color)';
        title.style.textShadow = '0 0 20px rgba(234, 179, 8, 0.5)';
        container.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.innerText = 'Program your party. Watch them fight. Conquer the realm.';
        subtitle.style.color = 'var(--text-muted)';
        subtitle.style.marginBottom = '3rem';
        subtitle.style.fontSize = '1.2rem';
        container.appendChild(subtitle);

        const startButton = document.createElement('button');
        startButton.innerText = 'NEW GAME';
        startButton.style.fontSize = '1.5rem';
        startButton.style.padding = '1rem 3rem';
        startButton.onclick = onStart;
        container.appendChild(startButton);

        const version = document.createElement('p');
        version.innerText = 'v0.9.3 Beta';
        version.style.marginTop = '3rem';
        version.style.color = '#4b5563';
        version.style.fontSize = '0.9rem';
        container.appendChild(version);

        this.uiLayer.appendChild(container);
    }

    createPartyCreationUI(onComplete) {
        this.clearUI();
        const container = document.createElement('div');
        container.className = 'ui-element';

        const title = document.createElement('h2');
        title.innerText = 'Assemble Your Party (3/3)';
        title.style.textAlign = 'center';
        title.style.marginBottom = '2rem';
        container.appendChild(title);

        const party = new Party();
        const slots = [];

        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'party-slot';

            const nameInput = document.createElement('input');
            nameInput.placeholder = `Hero ${i + 1} Name`;
            nameInput.style.flex = '1';

            const classSelect = document.createElement('select');
            classSelect.style.flex = '1';
            for (const key in CLASSES) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = `${CLASSES[key].name} (${CLASSES[key].role})`;
                classSelect.appendChild(option);
            }

            slot.appendChild(nameInput);
            slot.appendChild(classSelect);
            container.appendChild(slot);
            slots.push({ nameInput, classSelect });
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '2rem';

        const startButton = document.createElement('button');
        startButton.innerText = 'Confirm Party';
        startButton.style.width = '100%';
        startButton.onclick = () => {
            party.members = [];
            slots.forEach(slot => {
                const name = slot.nameInput.value || 'Hero';
                const charClass = CLASSES[slot.classSelect.value];
                party.addMember(new Character(name, charClass));
            });
            onComplete(party);
        };
        buttonContainer.appendChild(startButton);
        container.appendChild(buttonContainer);

        this.uiLayer.appendChild(container);
    }

    createTacticsEditorUI(character, onComplete) {
        this.clearUI();
        const container = document.createElement('div');
        container.className = 'ui-element';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '2rem';

        const title = document.createElement('h2');
        title.innerText = `Tactics: ${character.name}`;
        title.style.marginBottom = '0';
        header.appendChild(title);

        const doneButton = document.createElement('button');
        doneButton.innerText = 'To Battle';
        doneButton.style.backgroundColor = '#10b981'; // Green for done
        doneButton.onclick = () => {
            onComplete();
        };
        header.appendChild(doneButton);
        container.appendChild(header);

        const listContainer = document.createElement('div');
        if (character.tactics.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.innerText = 'No tactics set. Add one below.';
            emptyState.style.color = 'var(--text-muted)';
            emptyState.style.fontStyle = 'italic';
            emptyState.style.padding = '1rem';
            listContainer.appendChild(emptyState);
        } else {
            character.tactics.forEach((tactic, index) => {
                const div = document.createElement('div');
                div.className = 'tactic-row';
                div.innerHTML = `
                    <span style="color: var(--text-muted); margin-right: 10px;">${index + 1}.</span>
                    <span style="color: var(--primary-color); font-weight: bold;">IF</span> ${tactic.condition} 
                    <span style="color: var(--primary-color); font-weight: bold; margin-left: 10px;">THEN</span> ${tactic.action}
                `;

                // Add delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = '×';
                deleteBtn.style.padding = '2px 8px';
                deleteBtn.style.marginLeft = 'auto';
                deleteBtn.style.backgroundColor = 'transparent';
                deleteBtn.style.color = 'var(--text-muted)';
                deleteBtn.style.border = '1px solid var(--border-color)';
                deleteBtn.style.float = 'right';
                deleteBtn.onclick = () => {
                    character.tactics.splice(index, 1);
                    this.createTacticsEditorUI(character, onComplete);
                };
                div.appendChild(deleteBtn);

                listContainer.appendChild(div);
            });
        }
        container.appendChild(listContainer);

        // Add new tactic form
        const formDiv = document.createElement('div');
        formDiv.className = 'form-group';

        const conditionSelect = document.createElement('select');
        conditionSelect.style.flex = '1';
        for (const key in CONDITIONS) {
            const opt = document.createElement('option');
            opt.value = CONDITIONS[key];
            opt.innerText = CONDITIONS[key];
            conditionSelect.appendChild(opt);
        }

        const actionSelect = document.createElement('select');
        actionSelect.style.flex = '1';
        for (const key in ACTIONS) {
            const opt = document.createElement('option');
            opt.value = ACTIONS[key];
            opt.innerText = ACTIONS[key];
            actionSelect.appendChild(opt);
        }

        const addButton = document.createElement('button');
        addButton.innerText = '+ Add';
        addButton.onclick = () => {
            character.addTactic(conditionSelect.value, actionSelect.value);
            // Refresh UI
            this.createTacticsEditorUI(character, onComplete);
        };

        formDiv.appendChild(document.createTextNode('IF '));
        formDiv.appendChild(conditionSelect);
        formDiv.appendChild(document.createTextNode(' THEN '));
        formDiv.appendChild(actionSelect);
        formDiv.appendChild(addButton);
        container.appendChild(formDiv);

        this.uiLayer.appendChild(container);
    }

    createCombatUI(party, combatSystem) {
        this.clearUI();

        const layout = document.createElement('div');
        layout.className = 'combat-layout';

        // Left Sidebar: Heroes
        const leftSidebar = document.createElement('div');
        leftSidebar.className = 'combat-sidebar';

        const heroesTitle = document.createElement('h3');
        heroesTitle.innerText = 'HEROES';
        heroesTitle.style.fontSize = '0.8rem';
        heroesTitle.style.color = 'var(--text-muted)';
        heroesTitle.style.marginBottom = '1rem';
        leftSidebar.appendChild(heroesTitle);

        this.heroCards = [];
        party.members.forEach(hero => {
            const card = document.createElement('div');
            card.className = 'hero-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-weight:bold; color:white;">${hero.name}</span>
                    <span style="font-size:0.7rem; background:#333; padding:2px 5px; border-radius:3px;">${hero.charClass.role}</span>
                </div>
                <div class="hp-bar-container">
                    <div class="hp-bar" style="width: ${(hero.hp / hero.maxHp) * 100}%"></div>
                </div>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">HP ${hero.hp}/${hero.maxHp}</div>
            `;
            leftSidebar.appendChild(card);
            this.heroCards.push({ element: card, hero: hero });
        });
        layout.appendChild(leftSidebar);

        // Center Area (Header + Canvas underneath)
        const centerArea = document.createElement('div');
        centerArea.style.position = 'relative';

        const header = document.createElement('div');
        header.className = 'combat-header';
        header.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:var(--danger-color);">💀</span>
                <span style="font-weight:bold;">Floor 1</span>
            </div>
            <div>
                <button class="auto-btn">▶ Auto</button>
            </div>
        `;
        centerArea.appendChild(header);
        layout.appendChild(centerArea);

        // Right Sidebar: Log
        const rightSidebar = document.createElement('div');
        rightSidebar.className = 'combat-sidebar right';

        const logTitle = document.createElement('h3');
        logTitle.innerText = 'COMBAT LOG';
        logTitle.style.fontSize = '0.8rem';
        logTitle.style.color = 'var(--text-muted)';
        logTitle.style.marginBottom = '1rem';
        rightSidebar.appendChild(logTitle);

        this.combatLogContainer = document.createElement('div');
        this.combatLogContainer.className = 'combat-log';
        rightSidebar.appendChild(this.combatLogContainer);

        layout.appendChild(rightSidebar);

        this.uiLayer.appendChild(layout);
    }

    updateCombatUI(combatSystem) {
        // Update Hero HP
        if (this.heroCards) {
            this.heroCards.forEach(item => {
                const hpPercent = Math.max(0, (item.hero.hp / item.hero.maxHp) * 100);
                const bar = item.element.querySelector('.hp-bar');
                const text = item.element.querySelector('div:last-child');
                if (bar) bar.style.width = `${hpPercent}%`;
                if (text) text.innerText = `HP ${Math.max(0, item.hero.hp)}/${item.hero.maxHp}`;
            });
        }

        // Update Log
        if (this.combatLogContainer && combatSystem) {
            // Only append new logs if we track index, or just clear and redraw for prototype simplicity
            // For better performance, we should only append.
            // Let's just show the last 20 lines
            this.combatLogContainer.innerHTML = '';
            combatSystem.log.slice(-20).forEach((line, i) => {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.innerHTML = `<span style="color:#555;">[${i}]</span> ${line}`;
                this.combatLogContainer.appendChild(entry);
            });
            this.combatLogContainer.scrollTop = this.combatLogContainer.scrollHeight;
        }
    }
}
