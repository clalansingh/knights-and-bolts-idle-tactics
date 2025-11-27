extends Node

var party: Array[Character] = []
var inventory: Array = []
var gold: int = 0
var unlocked_dungeons: Array[String] = ["Goblin Cave"]

# Temporary: Available classes for party creation
var available_classes: Array[CharacterClass] = []

func _ready():
	# Initialize with some dummy data or load from save
	_init_available_classes()

func _init_available_classes():
	# Create some default classes
	var fighter = CharacterClass.new()
	fighter.class_name_str = "Fighter"
	fighter.base_strength = 16
	fighter.base_constitution = 14
	fighter.role = "Defender"
	available_classes.append(fighter)
	
	var wizard = CharacterClass.new()
	wizard.class_name_str = "Wizard"
	wizard.base_intelligence = 16
	wizard.base_willpower = 14
	wizard.role = "Controller"
	available_classes.append(wizard)
	
	var cleric = CharacterClass.new()
	cleric.class_name_str = "Cleric"
	cleric.base_wisdom = 16
	cleric.base_charisma = 14
	cleric.role = "Leader"
	available_classes.append(cleric)
	
	var rogue = CharacterClass.new()
	rogue.class_name_str = "Rogue"
	rogue.base_dexterity = 16
	rogue.base_agility = 14
	rogue.role = "Striker"
	available_classes.append(rogue)

func add_character_to_party(character: Character):
	if party.size() < 3:
		party.append(character)
		return true
	return false

func clear_party():
	party.clear()
