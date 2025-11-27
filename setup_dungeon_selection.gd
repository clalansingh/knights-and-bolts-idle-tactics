extends SceneTree

func _init():
	print("Generating Dungeon Selection Scene...")
	
	var root = Control.new()
	root.name = "DungeonSelection"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.set_script(load("res://scripts/ui/dungeon_selection.gd"))
	
	var vbox = VBoxContainer.new()
	vbox.name = "VBoxContainer"
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	root.add_child(vbox)
	vbox.owner = root
	
	var title = Label.new()
	title.text = "Select Dungeon"
	vbox.add_child(title)
	title.owner = root
	
	var dungeon_list = ItemList.new()
	dungeon_list.name = "DungeonList"
	dungeon_list.custom_minimum_size = Vector2(200, 150)
	vbox.add_child(dungeon_list)
	dungeon_list.owner = root
	
	var start_btn = Button.new()
	start_btn.name = "StartButton"
	start_btn.text = "Start Adventure"
	vbox.add_child(start_btn)
	start_btn.owner = root
	
	var back_btn = Button.new()
	back_btn.name = "BackButton"
	back_btn.text = "Back to Hub"
	vbox.add_child(back_btn)
	back_btn.owner = root
	
	var scene = PackedScene.new()
	scene.pack(root)
	ResourceSaver.save(scene, "res://scenes/ui/DungeonSelection.tscn")
	print("DungeonSelection.tscn saved.")
	quit()
