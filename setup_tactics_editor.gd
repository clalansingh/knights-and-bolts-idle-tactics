extends SceneTree

func _init():
	print("Generating Tactics Editor Scene...")
	
	var root = Control.new()
	root.name = "TacticsEditor"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.set_script(load("res://scripts/ui/tactics_editor.gd"))
	
	var vbox = VBoxContainer.new()
	vbox.name = "VBoxContainer"
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	root.add_child(vbox)
	vbox.owner = root
	
	var title = Label.new()
	title.text = "Tactics Editor"
	vbox.add_child(title)
	title.owner = root
	
	var char_label = Label.new()
	char_label.text = "Select Character:"
	vbox.add_child(char_label)
	char_label.owner = root
	
	var char_list = ItemList.new()
	char_list.name = "CharacterList"
	char_list.custom_minimum_size = Vector2(200, 80)
	vbox.add_child(char_list)
	char_list.owner = root
	
	var tactics_label = Label.new()
	tactics_label.text = "Current Tactics:"
	vbox.add_child(tactics_label)
	tactics_label.owner = root
	
	var tactics_list = ItemList.new()
	tactics_list.name = "TacticsList"
	tactics_list.custom_minimum_size = Vector2(300, 150)
	vbox.add_child(tactics_list)
	tactics_list.owner = root
	
	var edit_panel = HBoxContainer.new()
	edit_panel.name = "EditPanel"
	vbox.add_child(edit_panel)
	edit_panel.owner = root
	
	var trigger_opt = OptionButton.new()
	trigger_opt.name = "TriggerOption"
	edit_panel.add_child(trigger_opt)
	trigger_opt.owner = root
	
	var action_opt = OptionButton.new()
	action_opt.name = "ActionOption"
	edit_panel.add_child(action_opt)
	action_opt.owner = root
	
	var add_btn = Button.new()
	add_btn.name = "AddTacticButton"
	add_btn.text = "Add Tactic"
	edit_panel.add_child(add_btn)
	add_btn.owner = root
	
	var back_btn = Button.new()
	back_btn.name = "BackButton"
	back_btn.text = "Back to Hub"
	vbox.add_child(back_btn)
	back_btn.owner = root
	
	var scene = PackedScene.new()
	scene.pack(root)
	ResourceSaver.save(scene, "res://scenes/ui/TacticsEditor.tscn")
	print("TacticsEditor.tscn saved.")
	quit()
