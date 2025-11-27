extends SceneTree

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
	
	# Connect signals
	combat_manager.combat_ended.connect(_on_combat_ended)
	combat_manager.action_performed.connect(_on_action_performed)
	
	# Start Combat
	print("Hero HP: ", hero.current_hp)
	print("Goblin HP: ", goblin.current_hp)
	combat_manager.start_combat([hero], [goblin])
	
	# Simulate a few turns if not auto-running (CombatManager currently runs one turn at a time via process_turn, but we need to trigger next turns)
	# Actually CombatManager.start_combat calls process_turn, which calls execute_action.
	# But we need a loop or timer to continue.
	# For this test, we will manually pump the turns until end.
	
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
