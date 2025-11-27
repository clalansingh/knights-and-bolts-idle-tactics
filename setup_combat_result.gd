extends SceneTree

func _init():
	print("Generating Combat Result Scene...")
	
	var root = Control.new()
	root.name = "CombatResult"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.set_script(load("res://scripts/ui/combat_result.gd"))
	
	var vbox = VBoxContainer.new()
	vbox.name = "VBoxContainer"
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	root.add_child(vbox)
	vbox.owner = root
	
	var result_label = Label.new()
	result_label.name = "ResultLabel"
	result_label.text = "RESULT"
	vbox.add_child(result_label)
	result_label.owner = root
	
	var loot_label = Label.new()
	loot_label.name = "LootLabel"
	loot_label.text = "Loot"
	vbox.add_child(loot_label)
	loot_label.owner = root
	
	var return_btn = Button.new()
	return_btn.name = "ReturnButton"
	return_btn.text = "Return to Hub"
	vbox.add_child(return_btn)
	return_btn.owner = root
	
	var scene = PackedScene.new()
	scene.pack(root)
	ResourceSaver.save(scene, "res://scenes/ui/CombatResult.tscn")
	print("CombatResult.tscn saved.")
	quit()
