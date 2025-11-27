extends Node2D

const Character = preload("res://scripts/character.gd")
const CharacterClass = preload("res://scripts/character_class.gd")
const Tactic = preload("res://scripts/tactic.gd")
const HealAbility = preload("res://scripts/abilities/heal_ability.gd")

@onready var combat_manager = $CombatManager
@onready var status_label = $UI/StatusLabel

func _ready():
	print("Game Starting...")
	status_label.text = "Initializing Combat..."
	
	# Create Hero
	var hero = Character.new()
	hero.character_name = "Hero"
	hero.strength = 15
	hero.agility = 12
	hero.constitution = 14
	hero.team = 0
	hero._ready()
	
	# Give Hero some mana and a heal ability
	hero.max_mana = 20
	hero.current_mana = 20
	hero.current_hp = 30 # Start injured
	
	var heal_ability = HealAbility.new()
	heal_ability.ability_name = "Minor Heal"
	heal_ability.mana_cost = 5
	heal_ability.heal_amount = 15
	heal_ability.target_type = "Self"
	
	var heal_tactic = Tactic.new()
	heal_tactic.trigger = Tactic.TriggerType.HP_LESS_THAN
	heal_tactic.trigger_value = 50
	heal_tactic.action = Tactic.ActionType.USE_ABILITY
	heal_tactic.ability_to_use = heal_ability
	
	var attack_tactic = Tactic.new()
	attack_tactic.trigger = Tactic.TriggerType.ALWAYS
	attack_tactic.action = Tactic.ActionType.ATTACK_NEAREST
	
	hero.tactics.append(heal_tactic)
	hero.tactics.append(attack_tactic)
	
	# Create Goblin
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
	
	# Connect signals to update UI
	combat_manager.action_performed.connect(_on_action_performed)
	combat_manager.combat_ended.connect(_on_combat_ended)
	
	# Start Combat
	var party: Array[Character] = [hero]
	var enemies: Array[Character] = [goblin]
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
