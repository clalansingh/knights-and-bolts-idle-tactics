# Knights & Bolts

## Executive Summary

### Game Concept
A single-player fantasy role-playing game (RPG) focusing on tactical party management and the utilization of a user-programmable system to pre-plan how characters will move, attack and use their abilities based on if/then triggers.

### Platform
HTML5 and JavaScript

### Look and Feel
Make the game with 2D graphics and pixel sprites.

## Gameplay and Core Loop

### Core Loop
Player creates a party, composes their Tactics (pre-programmed actions for their party members to take when certain conditions occur using if/else statements) selects a dungeon/area to adventure in, watches their party execute their Tactics, collects loot, and returns to a base/hub for upgrades and new adventures.

### Player Experience Goals
Strategic depth in selecting which abilities and spells are gained upon levelling up, what gear to equip to their characters, what character attributes to put points into, and most importantly what Tactics to prepare for characters.

### Key Features
- Party creation and management
- Turn-based combat
- Player programmed Tactics to define what a character will do on their turn using a series of if/else statements

## Setting and Story

### World Overview
High Fantasy
High Magic
Generic Setting

### Primary Conflict/Story
Players must protect the realm from all manner of nefarious evils such as demons, zombies, vampires, necromancers, dragons, orcs, etc.

### Locations/Areas
- Giant citadels
- Ice wastes
- Fey Isles
- Fjords
- Steppes
- The Gate
- Cyclopean Ruins
- Coast Raiders
- Mead Hall
- Wild Hills
- Blasted Heath
- Ancient Wall
- Castle Chivalry
- Bucolic Farms
- Gothica
- Meatmouth
- Borderlands
- Castle Grim
- Heroic Hamlet
- Bridgetown
- Swamptown
- Badlands
- Poison swamps
- Worselands
- Dark fores
- Tradeport
- Whalers
- Sunken city
- Marble Palace
- Ambitious Wizards
- Malevolent Tower
- Placid Monastery
- Jungle
- Ghoul Barrows
- Wise Kingdoms
- Buried Statues
- Turreted City
- Oasis
- Sandaltown
- Buried City
- Geometric Tombs
- Dragonmount
- Flying City
- Stormy Sea
- Whirlpool
- Pirate Isles
- Skull Island
- Huge River
- Immortal Empire
- Far Kingdoms

## Characters and Party System

### Character Classes
There are 4 power sources and there are 4 roles, resulting in 16 different character classes.

#### Power Sources
Martial: Related to physical prowess and combat training.

Primal: Related to connection to the spirits of the natural world or ancient tradition.

Divine: Related to worship of a diety or adherence to a moral code.

Arcane: Related to deep study or inherent access to magical energies.

#### Roles
Controller: Handles crowds by spreading debuff conditions, dealing damage over multiple enemies, creating hazardous terrain or repositioning enemies.

Defender: Primarily holds the focus on enemy fire by taunting, holds enemies back from other party members, and punishing enemies who attack other party members.

Leader: Inspire, heal and aid other characters in the party, have good defenses, and use powers to buff fellow party members.

Striker: Specialize in dealing high amounts of damage to one enemy at a time, relying on mobility, trickery or magic to move around tough foes and single out the enemy they want to attack.

#### Classes

- Hunter
  - Role: Controller
  - Power source: Martial
- Druid
  - Role: Controller
  - Power source: Primal
- Invoker
  - Role: Controller
  - Power source: Divine
- Wizard
  - Role: Controller
  - Power source: Arcane

- Fighter
  - Role: Defender
  - Power source: Martial
- Warden
  - Role: Defender
  - Power source: Primal
- Paladin
  - Role: Defender
  - Power source: Divine
- Swordmage
  - Role: Defender
  - Power source: Arcane

- Warlord
  - Role: Leader
  - Power source: Martial
- Shaman
  - Role: Leader
  - Power source: Primal
- Cleric
  - Role: Leader
  - Power source: Divine
- Bard
  - Role: Leader
  - Power source: Arcane

- Rogue
  - Role: Striker
  - Power source: Martial
- Barbarian
  - Role: Striker
  - Power source: Primal
- Avenger
  - Role: Striker
  - Power source: Divine
- Sorcerer
  - Role: Striker
  - Power source: Arcane

### Attributes and Stats
There are 8 attributes, each of which has three components which set them apart from one another:
- Strength: physical, force, attack
- Constitution: physical, force, defence
- Dexterity: physical, grace, attack
- Agility: physical, grace, defence
- Intelligence: mental, force, attack
- Willpower: mental, force, defence
- Charisma: mental, grace, attack
- Wisdom: mental, grace, defence

### Party Size and Formation
Parties are composed of exactly three characters.

Each character will begin either on the left, right or middle, and either in the front, back or middle (i.e. all 3 must be placed somewhere within a 3x3 grid for starting formation).

## Combat System

### Combat Flow
Each round of combat sees each player character and enemy move and attack once. Initiative is calculated in between each round, and factors in the characters' Agility attribute.

### Core Mechanics
Attack and Defence are based on attributes for the given attack. All attributes have a component defining if it is related to attack or defence. Abilities will directly reference which attribute is used for the character to attack with it, and what attribute the defending enemy will use to try to block or evade the ability.

### Special Combat Options
Use consumable item: For example, use a potion on yourself or an ally
Rush: Push an enemy 1 square and shift into the vacated space
Coup de grace: Make a critical hit against a helpless enemy
Grab: Sieze hold of an enemy, preventing both the player character and the enemy from moving or attacking until the player character releases, or the enemy breaks free (strength attribute check)

### Magic/Abilities System

All spells and abilities are able to be used either at-will, once per encounter, or once per long-rest.

#### Martial Abilities
Martial abilities are selected from the a pool of abilities at random for the player character to train in. Some abilities are restricted to certain classes, and others are available for all Martial classes.

Mana is determined by willpower attribute.

#### Arcane Magic
Broad spell list of levelless spells which are either utility spells that don't improve, or damage spells which scale the the character's level.

#### Divine Magic
Divine characters must choose a God in character creation.

Aurelius: God of Lawful Good
Vorgath: God of Lawful Evil
Raelis: God of Chaotic Good
Thrull: God of Chaotic Evil

There are four separate spell lists for "Good", "Evil", "Chaotic" and "Lawful". The spells have levels that must be reached in order to aquire them. A character can only select from the two spell lists related to the God they worship.

#### Primal Magic
Primal characters have access to a random selection of spells, similar to Martial abilities. Primal spells also have levels like Divine spells, and are divided into domains:

- Fire
- Water
- Earth
- Air

The more that a character uses spells of a certain domain, the more likely they are to see higher level spells from that domain to choose from when levelling up.

### Status Effects and Conditions
- Blinded
- Dazed
- Deafened
- Muted
- Grabbed
- Helpless
- Immobilized
- Marked
- Petrified
- Restrained
- Slowed
- Stunned
- Unconscious
- Weakened
- Asleep
- Hasted

## Enemies and Monsters

### Enemy Tags
Enemies can have variations with any of these tags, which will control their HP, attack types and behaviour patterns:
- Minion
- Elite
- Artillery
- Brute
- Lurker
- Skirmisher
- Soldier
- Solo
- Melee
- Ranged
- Flying

### Monster list
- Acolyte
- Air Elemental
- Aranea
- Bandit
- Banshee
- Basilisk
- Berserker
- Black Bear
- Black Dragon
- Black Pudding
- Blink Dog
- Blood Elk
- Blue Dragon
- Boar
- Boggart
- Bone Construct
- Bronze Construct
- Bugbear
- Burrowing Horror
- Camel
- Catoblepas
- Cave Locust
- Centaur
- Chimera
- Cobblehounds
- Cockatrice
- Couatl
- Creeping Vines
- Crypt Guardian
- Cyclops
- Deep One
- Dire Wolf
- Djinn
- Draugr
- Driver Ant
- Dryad
- Dwarf
- Earth Elemental
- Elephant
- Elf
- Estrie
- Ettin
- Eye of Terror
- False Dragon
- Fire Beetle
- Fire Elemental
- Fire Giant
- Flesh Construct
- Foxwoman
- Frost Elf
- Frost Giant
- Gargoyle
- Gelatinous Ooze
- Ghost
- Ghoul
- Giant Aquatic Spider
- Giant Centipede
- Giant Crab
- Giant Crocodile
- Giant Mantis
- Giant Phase Spider
- Giant Scorpion
- Giant Draco
- Gnoll
- Gnome
- Goblin
- Golem
- Gorilla
- Great White Shark
- Green Dragon
- Green Slime
- Griffon
- Grizzly Bear
- Halfling
- Harpy
- Hellhound
- Hobgoblin
- Hooded Men
- Hunting Dog
- Hydra
- Ifrit
- Invisible Stalker
- Iron Construct
- Killer Bees
- Kobold
- Kraken
- Lamia
- Lich
- Lion
- Manticore
- Medusa
- Mimic
- Mind Lasher
- Minotaur
- Mummy
- Naga
- Night Cat
- Night Hag
- Nightmare
- Ogre
- Owlbear
- Panther
- Phoenix
- Pixie
- Pseudodragon
- Purple Worm
- Red Cap
- Red Dragon
- Reptilian
- Roc
- Root Goblin
- Root Witch
- Rust Monster
- Sabre-Toothed Cat
- Satyr
- Sea Hag
- Shadow
- Shambling Mound
- Skeleton
- Sky Giant
- Sphinx
- Storm Giant
- Swine Thing
- Tiger
- Titan
- Treant
- Triton
- Troll
- Tyrannosaurus
- Unicorn
- Vampire
- Vampire Bat
- Viper
- Warp Panther
- Warrior Snail
- Water Elemental
- Werewolf
- White Ape
- White Dragon
- Wight
- Will-o-Wisp
- Wolf
- Wood Troll
- Wyvern
- Zombie

