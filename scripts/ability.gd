class_name Ability
extends Resource

@export var ability_name: String = "New Ability"
@export var mana_cost: int = 0
@export var damage_multiplier: float = 1.0
@export var target_type: String = "Single" # Single, All, Self, Ally
@export var attribute_used: String = "Strength" # Attribute used for attack roll

func execute(user: Character, targets: Array[Character]):
	print(user.character_name + " uses " + ability_name)
	# Implementation will be handled by CombatManager or individual ability scripts
