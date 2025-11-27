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

    createPartyCreationUI(onComplete) {
        this.clearUI();
        const container = document.createElement('div');
        container.className = 'ui-element';
        container.style.position = 'absolute';
        container.style.top = '50px';
        container.style.left = '50px';
        container.style.backgroundColor = 'rgba(0,0,0,0.8)';
        container.style.padding = '20px';
        container.style.color = 'white';

        const title = document.createElement('h2');
        title.innerText = 'Create Your Party';
        container.appendChild(title);

        const party = new Party();
        const slots = [];

        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.style.marginBottom = '10px';

            const nameInput = document.createElement('input');
            nameInput.placeholder = `Hero ${i + 1} Name`;

            const classSelect = document.createElement('select');
            for (const key in CLASSES) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = CLASSES[key].name;
                classSelect.appendChild(option);
            }

            slot.appendChild(nameInput);
            slot.appendChild(classSelect);
            container.appendChild(slot);
            slots.push({ nameInput, classSelect });
        }

        const startButton = document.createElement('button');
        startButton.innerText = 'Start Adventure';
        startButton.onclick = () => {
            party.members = [];
            slots.forEach(slot => {
                const name = slot.nameInput.value || 'Hero';
                const charClass = CLASSES[slot.classSelect.value];
                party.addMember(new Character(name, charClass));
            });
            onComplete(party);
        };
        container.appendChild(startButton);

        this.uiLayer.appendChild(container);
    }

    createTacticsEditorUI(character, onComplete) {
        this.clearUI();
        const container = document.createElement('div');
        container.className = 'ui-element';
        container.style.position = 'absolute';
        container.style.top = '50px';
        container.style.left = '50px';
        container.style.backgroundColor = 'rgba(0,0,0,0.9)';
        container.style.padding = '20px';
        container.style.color = 'white';
        container.style.width = '600px';

        const title = document.createElement('h2');
        title.innerText = `Edit Tactics for ${character.name}`;
        container.appendChild(title);

        const listContainer = document.createElement('div');
        character.tactics.forEach((tactic, index) => {
            const div = document.createElement('div');
            div.innerText = `${index + 1}. IF ${tactic.condition} THEN ${tactic.action}`;
            listContainer.appendChild(div);
        });
        container.appendChild(listContainer);

        // Add new tactic form
        const formDiv = document.createElement('div');
        formDiv.style.marginTop = '20px';
        formDiv.style.borderTop = '1px solid #555';
        formDiv.style.paddingTop = '10px';

        const conditionSelect = document.createElement('select');
        for (const key in CONDITIONS) {
            const opt = document.createElement('option');
            opt.value = CONDITIONS[key];
            opt.innerText = CONDITIONS[key];
            conditionSelect.appendChild(opt);
        }

        const actionSelect = document.createElement('select');
        for (const key in ACTIONS) {
            const opt = document.createElement('option');
            opt.value = ACTIONS[key];
            opt.innerText = ACTIONS[key];
            actionSelect.appendChild(opt);
        }

        const addButton = document.createElement('button');
        addButton.innerText = 'Add Tactic';
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

        const doneButton = document.createElement('button');
        doneButton.innerText = 'Done';
        doneButton.style.marginTop = '20px';
        doneButton.onclick = () => {
            onComplete();
        };
        container.appendChild(doneButton);

        this.uiLayer.appendChild(container);
    }
}
