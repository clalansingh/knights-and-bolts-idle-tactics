extends SceneTree

func _init():
	print("Generating Hub Scene...")
	
	var root = Control.new()
	root.name = "Hub"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.set_script(load("res://scripts/ui/hub.gd"))
	
	var vbox = VBoxContainer.new()
	vbox.name = "VBoxContainer"
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	root.add_child(vbox)
	vbox.owner = root
	
	var title = Label.new()
	title.text = "Knights & Bolts - Hub"
	vbox.add_child(title)
	title.owner = root
	
	var gold_label = Label.new()
	gold_label.name = "GoldLabel"
	gold_label.text = "Gold: 0"
	vbox.add_child(gold_label)
	gold_label.owner = root
	
	var party_status = Label.new()
	party_status.name = "PartyStatusLabel"
	party_status.text = "Party: 0/3"
	vbox.add_child(party_status)
	party_status.owner = root
	
	var party_btn = Button.new()
	party_btn.name = "PartyButton"
	party_btn.text = "Manage Party"
	vbox.add_child(party_btn)
	party_btn.owner = root
	
	var tactics_btn = Button.new()
	tactics_btn.name = "TacticsButton"
	tactics_btn.text = "Edit Tactics"
	vbox.add_child(tactics_btn)
	tactics_btn.owner = root
	
	var dungeon_btn = Button.new()
	dungeon_btn.name = "DungeonButton"
	dungeon_btn.text = "Select Dungeon"
	vbox.add_child(dungeon_btn)
	dungeon_btn.owner = root
	
	var scene = PackedScene.new()
	scene.pack(root)
	ResourceSaver.save(scene, "res://scenes/ui/Hub.tscn")
	print("Hub.tscn saved.")
	quit()
