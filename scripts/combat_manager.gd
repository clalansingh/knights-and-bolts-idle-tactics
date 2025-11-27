class_name CombatManager
extends Node

signal combat_ended(winner_team)
signal turn_started(character)
signal action_performed(character, action_data)

var combatants: Array[Character] = []
var current_turn_index: int = 0
var is_combat_active: bool = false

func start_combat(party: Array[Character], enemies: Array[Character]):
	combatants.clear()
	combatants.append_array(party)
	combatants.append_array(enemies)
	
	# Sort by initiative (Agility)
	combatants.sort_custom(func(a, b): return a.agility > b.agility)
	
	current_turn_index = 0
	is_combat_active = true
	process_turn()

func process_turn():
	if !is_combat_active:
		return
		
	var current_character = combatants[current_turn_index]
	
	if current_character.is_dead:
		next_turn()
		return
		
	turn_started.emit(current_character)
	
	# Determine action
	var allies = get_allies(current_character.team)
	var enemies = get_enemies(current_character.team)
	
	# Assuming Character has a 'tactics' property, we need to add that to Character class
	# For now, let's assume it exists or we fetch it from somewhere
	var tactics = [] 
	if "tactics" in current_character:
		tactics = current_character.tactics
		
	var action_data = TacticSystem.evaluate_tactics(current_character, tactics, allies, enemies)
	
	execute_action(current_character, action_data)
	
	# Check win condition
	if check_battle_end():
		is_combat_active = false
		return
		
	# Wait a bit before next turn (can be handled by a timer in the main scene)
	# For now, we just call next_turn directly or let the main loop handle it
	# next_turn() - Let's make this manual or timer based in the scene using this manager

func execute_action(user: Character, action_data: Dictionary):
	action_performed.emit(user, action_data)
	
	var target = action_data.get("target")
	var ability = action_data.get("ability")
	
	if target:
		if ability:
			var targets: Array[Character] = [target]
			ability.execute(user, targets)
		else:
			# Basic attack
			print(user.character_name + " attacks " + target.character_name)
			# Simple damage formula
			var damage = user.strength # Placeholder
			target.take_damage(damage)

func next_turn():
	current_turn_index = (current_turn_index + 1) % combatants.size()
	process_turn()

func get_allies(team: int) -> Array[Character]:
	var allies: Array[Character] = []
	for c in combatants:
		if c.team == team and !c.is_dead:
			allies.append(c)
	return allies

func get_enemies(team: int) -> Array[Character]:
	var enemies: Array[Character] = []
	for c in combatants:
		if c.team != team and !c.is_dead:
			enemies.append(c)
	return enemies

func check_battle_end() -> bool:
	var team_0_alive = false
	var team_1_alive = false
	
	for c in combatants:
		if !c.is_dead:
			if c.team == 0:
				team_0_alive = true
			else:
				team_1_alive = true
				
	if !team_0_alive:
		combat_ended.emit(1)
		return true
	elif !team_1_alive:
		combat_ended.emit(0)
		return true
		
	return false
