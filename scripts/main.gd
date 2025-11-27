extends Node2D

const Character = preload("res://scripts/character.gd")
const CharacterClass = preload("res://scripts/character_class.gd")
const Tactic = preload("res://scripts/tactic.gd")

@onready var combat_manager = $CombatManager
@onready var status_label = $UI/StatusLabel

func _ready():
	print("Game Starting...")
	status_label.text = "Initializing Combat..."
	
	# Load Party from GameState
	var party = GameState.party
	if party.is_empty():
		print("No party found! Creating default hero.")
		var hero = Character.new()
		hero.character_name = "Default Hero"
		hero.strength = 15
		hero.constitution = 14
		hero.team = 0
		hero._ready()
		party.append(hero)
	
	# Generate Enemies (Simple logic for now)
	var enemies: Array[Character] = []
	var goblin = Character.new()
	goblin.character_name = "Goblin"
	goblin.strength = 8
	goblin.agility = 10
	goblin.constitution = 8
	goblin.team = 1
	goblin._ready()
	
	var goblin_tactic = Tactic.new()
	goblin_tactic.trigger = Tactic.TriggerType.ALWAYS
	goblin_tactic.action = Tactic.ActionType.ATTACK_NEAREST
	goblin.tactics.append(goblin_tactic)
	enemies.append(goblin)
	
	# Connect signals to update UI
	combat_manager.action_performed.connect(_on_action_performed)
	combat_manager.combat_ended.connect(_on_combat_ended)
	
	# Start Combat
	combat_manager.start_combat(party, enemies)
	
	# Start a timer to process turns automatically
	var timer = Timer.new()
	timer.wait_time = 1.0
	timer.autostart = true
	timer.timeout.connect(_on_turn_timer)
	add_child(timer)

func _on_turn_timer():
	if combat_manager.is_combat_active:
		combat_manager.next_turn()

func _on_action_performed(user, action_data):
	var target_name = "None"
	if action_data.target:
		target_name = action_data.target.character_name
	
	var action_desc = ""
	if action_data.action == Tactic.ActionType.ATTACK_NEAREST:
		action_desc = "attacks"
	elif action_data.action == Tactic.ActionType.USE_ABILITY:
		action_desc = "uses " + action_data.ability.ability_name + " on"
		
	var log_text = user.character_name + " " + action_desc + " " + target_name
	print(log_text)
	status_label.text = log_text

func _on_combat_ended(winner_team):
	var winner_text = "Player Wins!" if winner_team == 0 else "Enemy Wins!"
	print("Combat Ended: " + winner_text)
	status_label.text = winner_text
	
	# Wait a moment then go to results
	await get_tree().create_timer(2.0).timeout
	get_tree().change_scene_to_file("res://scenes/ui/CombatResult.tscn")
