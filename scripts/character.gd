class_name Character
extends Node2D

# Core Attributes
@export var character_name: String = "Unnamed"
@export var strength: int = 10
@export var constitution: int = 10
@export var dexterity: int = 10
@export var agility: int = 10
@export var intelligence: int = 10
@export var willpower: int = 10
@export var charisma: int = 10
@export var wisdom: int = 10

# Derived Stats
var max_hp: int
var current_hp: int
var max_mana: int
var current_mana: int

# Tactics
var tactics: Array[Tactic] = []

# State
var is_dead: bool = false
var team: int = 0 # 0 for Player, 1 for Enemy

func _ready():
	calculate_derived_stats()
	current_hp = max_hp
	current_mana = max_mana

func calculate_derived_stats():
	# Simple formula for now, can be tuned later
	max_hp = constitution * 5
	max_mana = willpower * 5

func take_damage(amount: int):
	current_hp -= amount
	if current_hp <= 0:
		current_hp = 0
		die()

func heal(amount: int):
	current_hp += amount
	if current_hp > max_hp:
		current_hp = max_hp

func use_mana(amount: int) -> bool:
	if current_mana >= amount:
		current_mana -= amount
		return true
	return false

func die():
	is_dead = true
	print(character_name + " has died!")
