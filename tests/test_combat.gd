extends SceneTree

const Character = preload("res://scripts/character.gd")
const CombatManager = preload("res://scripts/combat_manager.gd")
const Tactic = preload("res://scripts/tactic.gd")
const TacticSystem = preload("res://scripts/tactic_system.gd")
const HealAbility = preload("res://scripts/abilities/heal_ability.gd")

func _init():
	print("Starting Combat Test...")
	
	# Create CombatManager
	var combat_manager = CombatManager.new()
	root.add_child(combat_manager)
	
	# Create Characters
	var hero = Character.new()
	hero.character_name = "Hero"
	hero.strength = 15
	hero.agility = 12
	hero.constitution = 14
	hero.team = 0
	hero._ready() # Initialize derived stats
	
	var goblin = Character.new()
	goblin.character_name = "Goblin"
	goblin.strength = 8
	goblin.agility = 10
	goblin.constitution = 8
	goblin.team = 1
	goblin._ready()
	
	# Setup Tactics for Hero
	var attack_tactic = Tactic.new()
	attack_tactic.trigger = Tactic.TriggerType.ALWAYS
	attack_tactic.action = Tactic.ActionType.ATTACK_NEAREST
	hero.tactics.append(attack_tactic)
	
	# Setup Tactics for Goblin
	var goblin_tactic = Tactic.new()
	goblin_tactic.trigger = Tactic.TriggerType.ALWAYS
	goblin_tactic.action = Tactic.ActionType.ATTACK_NEAREST
	goblin.tactics.append(goblin_tactic)
	
	# Setup Heal Tactic for Hero (Trigger when HP < 50%)
	hero.max_mana = 20
	hero.current_mana = 20
	hero.current_hp = 30 # Start injured to trigger heal
	
	# Create Heal Ability
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
	
	# Add heal tactic BEFORE attack tactic so it checks first
	hero.tactics.insert(0, heal_tactic)
	
	# Connect signals
	combat_manager.combat_ended.connect(_on_combat_ended)
	combat_manager.action_performed.connect(_on_action_performed)
	
	# Start Combat
	print("Hero HP: ", hero.current_hp)
	print("Goblin HP: ", goblin.current_hp)
	combat_manager.start_combat([hero], [goblin])
	
	# Simulate a few turns
	var max_turns = 20
	var turns = 0
	while combat_manager.is_combat_active and turns < max_turns:
		combat_manager.next_turn()
		turns += 1
		
	quit()

func _on_action_performed(user, action_data):
	var target_name = "None"
	if action_data.target:
		target_name = action_data.target.character_name
	print(user.character_name + " performed " + str(action_data.action) + " on " + target_name)

func _on_combat_ended(winner_team):
	print("Combat Ended! Winner Team: ", winner_team)
