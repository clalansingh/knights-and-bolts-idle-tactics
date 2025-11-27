extends SceneTree

const Character = preload("res://scripts/character.gd")
const CombatManager = preload("res://scripts/combat_manager.gd")
const Tactic = preload("res://scripts/tactic.gd")

func _init():
	print("Generating Main Scene...")
	
	var root_node = Node2D.new()
	root_node.name = "Main"
	root_node.set_script(load("res://scripts/main.gd"))
	
	# Add CombatManager
	var combat_manager = CombatManager.new()
	combat_manager.name = "CombatManager"
	root_node.add_child(combat_manager)
	combat_manager.owner = root_node
	
	# Add Camera
	var camera = Camera2D.new()
	camera.name = "Camera2D"
	root_node.add_child(camera)
	camera.owner = root_node
	
	# Add UI
	var canvas_layer = CanvasLayer.new()
	canvas_layer.name = "UI"
	root_node.add_child(canvas_layer)
	canvas_layer.owner = root_node
	
	var label = Label.new()
	label.name = "StatusLabel"
	label.text = "Combat Log"
	label.position = Vector2(10, 10)
	canvas_layer.add_child(label)
	label.owner = root_node
	
	# Save Scene
	var scene = PackedScene.new()
	var result = scene.pack(root_node)
	if result == OK:
		var error = ResourceSaver.save(scene, "res://scenes/Main.tscn")
		if error == OK:
			print("Main.tscn saved successfully.")
		else:
			print("Error saving scene: ", error)
	else:
		print("Error packing scene: ", result)
		
	quit()
