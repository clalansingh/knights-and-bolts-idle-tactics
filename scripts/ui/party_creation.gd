extends Control

@onready var class_list = $VBoxContainer/ClassList
@onready var name_input = $VBoxContainer/NameInput
@onready var add_button = $VBoxContainer/AddButton
@onready var party_list = $VBoxContainer/PartyList
@onready var back_button = $VBoxContainer/BackButton

var selected_class_index: int = -1

func _ready():
	add_button.pressed.connect(_on_add_button_pressed)
	back_button.pressed.connect(_on_back_button_pressed)
	
	_populate_class_list()
	_update_party_list()

func _populate_class_list():
	class_list.clear()
	for char_class in GameState.available_classes:
		class_list.add_item(char_class.class_name_str + " (" + char_class.role + ")")
	
	class_list.item_selected.connect(_on_class_selected)

func _on_class_selected(index):
	selected_class_index = index

func _on_add_button_pressed():
	if selected_class_index == -1:
		print("No class selected")
		return
		
	var char_name = name_input.text
	if char_name == "":
		char_name = "Hero"
		
	var char_class = GameState.available_classes[selected_class_index]
	
	var new_char = Character.new()
	new_char.character_name = char_name
	new_char.character_class = char_class
	new_char.team = 0 # Player team
	new_char._ready() # Initialize stats
	
	# Add default attack tactic
	var attack_tactic = Tactic.new()
	attack_tactic.trigger = Tactic.TriggerType.ALWAYS
	attack_tactic.action = Tactic.ActionType.ATTACK_NEAREST
	new_char.tactics.append(attack_tactic)
	
	if GameState.add_character_to_party(new_char):
		print("Added " + char_name + " to party")
		_update_party_list()
		name_input.text = ""
	else:
		print("Party is full")

func _update_party_list():
	party_list.clear()
	for member in GameState.party:
		party_list.add_item(member.character_name + " - " + member.character_class.class_name_str)

func _on_back_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/Hub.tscn")
