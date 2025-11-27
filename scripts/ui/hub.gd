extends Control

func _ready():
	# Connect buttons
	$VBoxContainer/PartyButton.pressed.connect(_on_party_button_pressed)
	$VBoxContainer/TacticsButton.pressed.connect(_on_tactics_button_pressed)
	$VBoxContainer/DungeonButton.pressed.connect(_on_dungeon_button_pressed)
	
	update_ui()

func update_ui():
	# Update labels based on GameState
	$VBoxContainer/GoldLabel.text = "Gold: " + str(GameState.gold)
	
	var party_count = GameState.party.size()
	$VBoxContainer/PartyStatusLabel.text = "Party: " + str(party_count) + "/3"

func _on_party_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/PartyCreation.tscn")

func _on_tactics_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/TacticsEditor.tscn")

func _on_dungeon_button_pressed():
	get_tree().change_scene_to_file("res://scenes/ui/DungeonSelection.tscn")
