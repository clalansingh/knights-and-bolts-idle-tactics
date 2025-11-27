class_name TacticSystem
extends Node

static func evaluate_tactics(user: Character, tactics: Array[Tactic], allies: Array[Character], enemies: Array[Character]) -> Dictionary:
	# Returns a dictionary with "action", "target", "ability"
	
	for tactic in tactics:
		if check_trigger(user, tactic, allies, enemies):
			return determine_action(user, tactic, allies, enemies)
	
	# Default action if no tactic matches
	return {
		"action": Tactic.ActionType.ATTACK_NEAREST,
		"target": get_nearest_enemy(user, enemies),
		"ability": null
	}

static func check_trigger(user: Character, tactic: Tactic, allies: Array[Character], enemies: Array[Character]) -> bool:
	match tactic.trigger:
		Tactic.TriggerType.ALWAYS:
			return true
		Tactic.TriggerType.HP_LESS_THAN:
			return (float(user.current_hp) / float(user.max_hp)) * 100.0 < tactic.trigger_value
		Tactic.TriggerType.HP_GREATER_THAN:
			return (float(user.current_hp) / float(user.max_hp)) * 100.0 > tactic.trigger_value
		Tactic.TriggerType.MANA_LESS_THAN:
			return (float(user.current_mana) / float(user.max_mana)) * 100.0 < tactic.trigger_value
		# Add more triggers as needed
	return false

static func determine_action(user: Character, tactic: Tactic, allies: Array[Character], enemies: Array[Character]) -> Dictionary:
	var target = null
	
	match tactic.action:
		Tactic.ActionType.ATTACK_NEAREST:
			target = get_nearest_enemy(user, enemies)
		Tactic.ActionType.ATTACK_WEAKEST:
			target = get_weakest_enemy(enemies)
		Tactic.ActionType.USE_ABILITY:
			# Logic to pick target based on ability type (heal ally vs damage enemy)
			if tactic.ability_to_use.target_type == "Ally" or tactic.ability_to_use.target_type == "Self":
				target = get_most_injured_ally(allies)
			else:
				target = get_nearest_enemy(user, enemies)
	
	return {
		"action": tactic.action,
		"target": target,
		"ability": tactic.ability_to_use
	}

static func get_nearest_enemy(user: Character, enemies: Array[Character]) -> Character:
	if enemies.is_empty():
		return null
	# Placeholder: just return the first one since we don't have positions yet
	return enemies[0]

static func get_weakest_enemy(enemies: Array[Character]) -> Character:
	var weakest: Character = null
	var min_hp_percent = 101.0
	
	for enemy in enemies:
		var hp_percent = (float(enemy.current_hp) / float(enemy.max_hp)) * 100.0
		if hp_percent < min_hp_percent:
			min_hp_percent = hp_percent
			weakest = enemy
			
	return weakest

static func get_most_injured_ally(allies: Array[Character]) -> Character:
	var most_injured: Character = null
	var min_hp_percent = 101.0
	
	for ally in allies:
		var hp_percent = (float(ally.current_hp) / float(ally.max_hp)) * 100.0
		if hp_percent < min_hp_percent:
			min_hp_percent = hp_percent
			most_injured = ally
			
	return most_injured
