extends Control

@onready var character_list = $VBoxContainer/CharacterList
@onready var tactics_list = $VBoxContainer/TacticsList
@onready var trigger_option = $VBoxContainer/EditPanel/TriggerOption
@onready var action_option = $VBoxContainer/EditPanel/ActionOption
@onready var add_tactic_button = $VBoxContainer/EditPanel/AddTacticButton
@onready var back_button = $VBoxContainer/BackButton

var selected_character: Character = null

func _ready():
	add_tactic_button.pressed.connect(_on_add_tactic_pressed)
	back_button.pressed.connect(_on_back_button_pressed)
	
	_populate_character_list()
	
	# Populate options
	trigger_option.clear()
	for key in Tactic.TriggerType.keys():
		trigger_option.add_item(key)
		
	action_option.clear()
	for key in Tactic.ActionType.keys():
		action_option.add_item(key)

func _populate_character_list():
	character_list.clear()
	for i in range(GameState.party.size()):
		var char = GameState.party[i]
		character_list.add_item(char.character_name + " (" + char.character_class.class_name_str + ")")
	
	character_list.item_selected.connect(_on_character_selected)

func _on_character_selected(index):
	selected_character = GameState.party[index]
	_update_tactics_list()

func _update_tactics_list():
	tactics_list.clear()
	if selected_character:
		for i in range(selected_character.tactics.size()):
			var tactic = selected_character.tactics[i]
			var trigger_str = Tactic.TriggerType.keys()[tactic.trigger]
			var action_str = Tactic.ActionType.keys()[tactic.action]
			tactics_list.add_item(str(i+1) + ". IF " + trigger_str + " THEN " + action_str)

func _on_add_tactic_pressed():
	if !selected_character:
		return
		
	var new_tactic = Tactic.new()
	new_tactic.trigger = trigger_option.selected
	new_tactic.action = action_option.selected
	# Default values for now
	if new_tactic.trigger == Tactic.TriggerType.HP_LESS_THAN:
		new_tactic.trigger_value = 50
	
	selected_character.tactics.append(new_tactic)
	_update_tactics_list()

func _on_back_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/Hub.tscn")
