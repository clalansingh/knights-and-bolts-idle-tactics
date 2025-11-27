extends Control

@onready var dungeon_list = $VBoxContainer/DungeonList
@onready var start_button = $VBoxContainer/StartButton
@onready var back_button = $VBoxContainer/BackButton

var selected_dungeon: String = ""

func _ready():
	start_button.pressed.connect(_on_start_button_pressed)
	back_button.pressed.connect(_on_back_button_pressed)
	
	_populate_dungeon_list()

func _populate_dungeon_list():
	dungeon_list.clear()
	for dungeon in GameState.unlocked_dungeons:
		dungeon_list.add_item(dungeon)
	
	dungeon_list.item_selected.connect(_on_dungeon_selected)

func _on_dungeon_selected(index):
	selected_dungeon = GameState.unlocked_dungeons[index]

func _on_start_button_pressed():
	if selected_dungeon == "":
		print("No dungeon selected")
		return
		
	if GameState.party.is_empty():
		print("Party is empty!")
		return
		
	# Transition to Main scene (Combat)
	# We can pass the selected dungeon via GameState or a global variable if needed
	# For now, we assume Main scene handles the combat setup based on GameState
	get_tree().change_scene_to_file("res://scenes/Main.tscn")

func _on_back_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/Hub.tscn")
