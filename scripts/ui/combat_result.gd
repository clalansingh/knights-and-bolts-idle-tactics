extends Control

@onready var result_label = $VBoxContainer/ResultLabel
@onready var loot_label = $VBoxContainer/LootLabel
@onready var return_button = $VBoxContainer/ReturnButton

func _ready():
	return_button.pressed.connect(_on_return_button_pressed)
	
	# Determine result from GameState or passed parameters
	# For now, we'll assume GameState has a flag or we check party status
	var all_dead = true
	for char in GameState.party:
		if !char.is_dead:
			all_dead = false
			break
			
	if all_dead:
		result_label.text = "DEFEAT"
		loot_label.text = "You lost everything..."
	else:
		result_label.text = "VICTORY"
		var gold_gained = randi_range(10, 50)
		GameState.gold += gold_gained
		loot_label.text = "Found " + str(gold_gained) + " Gold!"
		
	# Heal party after combat for now (simplification)
	for char in GameState.party:
		char.current_hp = char.max_hp
		char.current_mana = char.max_mana
		char.is_dead = false

func _on_return_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/Hub.tscn")
