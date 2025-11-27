export class Party {
    constructor() {
        this.members = []; // Max 3
        this.gold = 0;
        this.inventory = [];
    }

    addMember(character) {
        if (this.members.length < 3) {
            this.members.push(character);
            return true;
        }
        return false;
    }

    removeMember(index) {
        if (index >= 0 && index < this.members.length) {
            this.members.splice(index, 1);
        }
    }

    getMember(index) {
        return this.members[index];
    }
}
