extends SceneTree

const CombatManager = preload("res://scripts/combat_manager.gd")

func _init():
	print("Loaded CombatManager")
	var cm = CombatManager.new()
	print("Instantiated CombatManager")
	quit()
