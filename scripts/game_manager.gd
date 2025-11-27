extends Node

var player_party: Array[Character] = []
var inventory: Array = []
var gold: int = 0

func _ready():
	# Initialize with a dummy party for now if empty
	pass

func add_character_to_party(character: Character):
	if player_party.size() < 3:
		player_party.append(character)
	else:
		print("Party is full!")

func remove_character_from_party(character: Character):
	player_party.erase(character)
