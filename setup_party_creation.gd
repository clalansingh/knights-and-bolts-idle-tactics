extends SceneTree

func _init():
	print("Generating Party Creation Scene...")
	
	var root = Control.new()
	root.name = "PartyCreation"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.set_script(load("res://scripts/ui/party_creation.gd"))
	
	var vbox = VBoxContainer.new()
	vbox.name = "VBoxContainer"
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	root.add_child(vbox)
	vbox.owner = root
	
	var title = Label.new()
	title.text = "Create Party"
	vbox.add_child(title)
	title.owner = root
	
	var class_list = ItemList.new()
	class_list.name = "ClassList"
	class_list.custom_minimum_size = Vector2(200, 100)
	vbox.add_child(class_list)
	class_list.owner = root
	
	var name_input = LineEdit.new()
	name_input.name = "NameInput"
	name_input.placeholder_text = "Character Name"
	vbox.add_child(name_input)
	name_input.owner = root
	
	var add_btn = Button.new()
	add_btn.name = "AddButton"
	add_btn.text = "Add to Party"
	vbox.add_child(add_btn)
	add_btn.owner = root
	
	var party_label = Label.new()
	party_label.text = "Current Party:"
	vbox.add_child(party_label)
	party_label.owner = root
	
	var party_list = ItemList.new()
	party_list.name = "PartyList"
	party_list.custom_minimum_size = Vector2(200, 100)
	vbox.add_child(party_list)
	party_list.owner = root
	
	var back_btn = Button.new()
	back_btn.name = "BackButton"
	back_btn.text = "Back to Hub"
	vbox.add_child(back_btn)
	back_btn.owner = root
	
	var scene = PackedScene.new()
	scene.pack(root)
	ResourceSaver.save(scene, "res://scenes/ui/PartyCreation.tscn")
	print("PartyCreation.tscn saved.")
	quit()
