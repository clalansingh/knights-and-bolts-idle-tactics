class_name HealAbility
extends Ability

@export var heal_amount: int = 10

func execute(user: Character, targets: Array[Character]):
	print(user.character_name + " casts " + ability_name)
	if user.use_mana(mana_cost):
		for target in targets:
			target.heal(heal_amount)
			print(target.character_name + " is healed for " + str(heal_amount))
	else:
		print(user.character_name + " does not have enough mana!")
