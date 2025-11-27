extends SceneTree

const Character = preload("res://scripts/character.gd")
const CharacterClass = preload("res://scripts/character_class.gd")

func _init():
	print("Starting Character Class Test...")
	
	# Create a Class
	var fighter_class = CharacterClass.new()
	fighter_class.class_name_str = "Fighter"
	fighter_class.base_strength = 18
	fighter_class.base_constitution = 16
	fighter_class.base_agility = 12
	
	# Create Character
	var hero = Character.new()
	hero.character_name = "Hero"
	hero.character_class = fighter_class
	
	# Initialize
	hero._ready()
	
	# Verify Stats
	print("Hero Strength: ", hero.strength)
	print("Hero Constitution: ", hero.constitution)
	print("Hero Max HP: ", hero.max_hp)
	
	if hero.strength == 18 and hero.constitution == 16:
		print("Stats applied correctly.")
	else:
		print("Stats NOT applied correctly.")
		
	quit()
