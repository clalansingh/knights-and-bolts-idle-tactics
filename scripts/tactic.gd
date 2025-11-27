class_name Tactic
extends Resource

enum TriggerType {
	ALWAYS,
	HP_LESS_THAN,
	HP_GREATER_THAN,
	MANA_LESS_THAN,
	ALLY_HP_LESS_THAN,
	ENEMY_HP_LESS_THAN
}

enum ActionType {
	ATTACK_NEAREST,
	ATTACK_WEAKEST,
	USE_ABILITY,
	DEFEND
}

@export var trigger: TriggerType
@export var trigger_value: int = 0 # Percentage or absolute value depending on trigger
@export var action: ActionType
@export var ability_to_use: Ability # If action is USE_ABILITY

func evaluate(user: Character, combat_context: Dictionary) -> bool:
	# This will be implemented in the TacticSystem
	return true
