class_name CharacterClass
extends Resource

@export var class_name_str: String = "Class"
@export var role: String = "Striker" # Controller, Defender, Leader, Striker
@export var power_source: String = "Martial" # Martial, Primal, Divine, Arcane

# Base Attributes
@export var base_strength: int = 10
@export var base_constitution: int = 10
@export var base_dexterity: int = 10
@export var base_agility: int = 10
@export var base_intelligence: int = 10
@export var base_willpower: int = 10
@export var base_charisma: int = 10
@export var base_wisdom: int = 10

# Starting Abilities
@export var starting_abilities: Array[Ability] = []
