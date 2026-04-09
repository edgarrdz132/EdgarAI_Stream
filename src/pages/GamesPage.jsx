import React, { useState, useRef } from 'react'
import { Maximize2, ArrowLeft, Gamepad2, Search } from 'lucide-react'

const CONSOLES = [
  { id: 'nes',     label: 'NES',             emoji: '🎮', color: '#e50914', core: 'nes',      frame: 'nes' },
  { id: 'snes',    label: 'Super Nintendo',   emoji: '🕹️', color: '#7c3aed', core: 'snes',     frame: 'snes' },
  { id: 'n64',     label: 'Nintendo 64',      emoji: '🎯', color: '#059669', core: 'n64',      frame: 'n64' },
  { id: 'gba',     label: 'Game Boy Advance', emoji: '👾', color: '#d97706', core: 'gba',      frame: 'gba' },
  { id: 'ps1',     label: 'PlayStation 1',    emoji: '💿', color: '#2563eb', core: 'psx',      frame: 'ps1' },
  { id: 'genesis', label: 'Sega Genesis',     emoji: '⚡', color: '#0891b2', core: 'segaMD',   frame: 'genesis' },
  { id: 'arcade',  label: 'Arcade',           emoji: '🕹️', color: '#dc2626', core: 'mame2003', frame: 'arcade' },
  { id: 'neogeo',  label: 'Neo Geo',          emoji: '🔴', color: '#b45309', core: 'fbneo',    frame: 'arcade' },
]

const GAMES = {
  nes: [
    { name: 'Super Mario Bros', rom: 'https://archive.org/download/ROMS-NES/Super%20Mario%20Bros.%20%28USA%29.zip' },
    { name: 'Super Mario Bros 2', rom: 'https://archive.org/download/ROMS-NES/Super%20Mario%20Bros.%202%20%28USA%29.zip' },
    { name: 'Super Mario Bros 3', rom: 'https://archive.org/download/ROMS-NES/Super%20Mario%20Bros.%203%20%28USA%29.zip' },
    { name: 'Contra', rom: 'https://archive.org/download/ROMS-NES/Contra%20%28USA%29.zip' },
    { name: 'Mega Man 2', rom: 'https://archive.org/download/ROMS-NES/Mega%20Man%202%20%28USA%29.zip' },
    { name: 'Mega Man 3', rom: 'https://archive.org/download/ROMS-NES/Mega%20Man%203%20%28USA%29.zip' },
    { name: 'Castlevania', rom: 'https://archive.org/download/ROMS-NES/Castlevania%20%28USA%29.zip' },
    { name: 'Metroid', rom: 'https://archive.org/download/ROMS-NES/Metroid%20%28USA%29.zip' },
    { name: 'Zelda', rom: 'https://archive.org/download/ROMS-NES/Legend%20of%20Zelda%2C%20The%20%28USA%29.zip' },
    { name: 'Donkey Kong', rom: 'https://archive.org/download/ROMS-NES/Donkey%20Kong%20%28USA%29.zip' },
    { name: 'Pac-Man', rom: 'https://archive.org/download/ROMS-NES/Pac-Man%20%28USA%29.zip' },
    { name: 'Tetris', rom: 'https://archive.org/download/ROMS-NES/Tetris%20%28USA%29.zip' },
    { name: 'Duck Tales', rom: 'https://archive.org/download/ROMS-NES/DuckTales%20%28USA%29.zip' },
    { name: 'Ninja Gaiden', rom: 'https://archive.org/download/ROMS-NES/Ninja%20Gaiden%20%28USA%29.zip' },
    { name: 'Mike Tyson Punch-Out', rom: 'https://archive.org/download/ROMS-NES/Mike%20Tyson%27s%20Punch-Out%21%21%20%28USA%29.zip' },
    { name: 'Battletoads', rom: 'https://archive.org/download/ROMS-NES/Battletoads%20%28USA%29.zip' },
    { name: 'Double Dragon', rom: 'https://archive.org/download/ROMS-NES/Double%20Dragon%20%28USA%29.zip' },
    { name: 'Kirby Adventure', rom: 'https://archive.org/download/ROMS-NES/Kirby%27s%20Adventure%20%28USA%29.zip' },
    { name: 'Ghosts n Goblins', rom: 'https://archive.org/download/ROMS-NES/Ghosts%20%27N%20Goblins%20%28USA%29.zip' },
    { name: 'TMNT', rom: 'https://archive.org/download/ROMS-NES/Teenage%20Mutant%20Ninja%20Turtles%20%28USA%29.zip' },
    { name: 'TMNT 2', rom: 'https://archive.org/download/ROMS-NES/Teenage%20Mutant%20Ninja%20Turtles%20II%20-%20The%20Arcade%20Game%20%28USA%29.zip' },
    { name: 'Duck Hunt', rom: 'https://archive.org/download/ROMS-NES/Duck%20Hunt%20%28USA%29.zip' },
    { name: 'Excitebike', rom: 'https://archive.org/download/ROMS-NES/Excitebike%20%28USA%29.zip' },
    { name: 'Chip n Dale', rom: 'https://archive.org/download/ROMS-NES/Chip%20%27N%20Dale%20Rescue%20Rangers%20%28USA%29.zip' },
    { name: 'Bionic Commando', rom: 'https://archive.org/download/ROMS-NES/Bionic%20Commando%20%28USA%29.zip' },
    { name: 'Mega Man', rom: 'https://archive.org/download/ROMS-NES/Mega%20Man%20%28USA%29.zip' },
    { name: 'Zelda 2', rom: 'https://archive.org/download/ROMS-NES/Zelda%20II%20-%20The%20Adventure%20of%20Link%20%28USA%29.zip' },
    { name: 'Castlevania 2', rom: 'https://archive.org/download/ROMS-NES/Castlevania%20II%20-%20Simon%27s%20Quest%20%28USA%29.zip' },
    { name: 'Balloon Fight', rom: 'https://archive.org/download/ROMS-NES/Balloon%20Fight%20%28USA%29.zip' },
    { name: 'Ninja Gaiden 2', rom: 'https://archive.org/download/ROMS-NES/Ninja%20Gaiden%20II%20-%20The%20Dark%20Sword%20of%20Chaos%20%28USA%29.zip' },
  ],
  snes: [
    { name: 'Super Mario World', rom: 'https://archive.org/download/ROMS-SNES/Super%20Mario%20World%20%28USA%29.zip' },
    { name: 'Super Mario Kart', rom: 'https://archive.org/download/ROMS-SNES/Super%20Mario%20Kart%20%28USA%29.zip' },
    { name: 'Super Mario RPG', rom: 'https://archive.org/download/ROMS-SNES/Super%20Mario%20RPG%20-%20Legend%20of%20the%20Seven%20Stars%20%28USA%29.zip' },
    { name: 'Zelda: Link to the Past', rom: 'https://archive.org/download/ROMS-SNES/Legend%20of%20Zelda%2C%20The%20-%20A%20Link%20to%20the%20Past%20%28USA%29.zip' },
    { name: 'Donkey Kong Country', rom: 'https://archive.org/download/ROMS-SNES/Donkey%20Kong%20Country%20%28USA%29.zip' },
    { name: 'Donkey Kong Country 2', rom: 'https://archive.org/download/ROMS-SNES/Donkey%20Kong%20Country%202%20-%20Diddy%27s%20Kong%20Quest%20%28USA%29.zip' },
    { name: 'Street Fighter 2 Turbo', rom: 'https://archive.org/download/ROMS-SNES/Street%20Fighter%20II%20Turbo%20-%20Hyper%20Fighting%20%28USA%29.zip' },
    { name: 'Mortal Kombat', rom: 'https://archive.org/download/ROMS-SNES/Mortal%20Kombat%20%28USA%29.zip' },
    { name: 'Mortal Kombat 2', rom: 'https://archive.org/download/ROMS-SNES/Mortal%20Kombat%20II%20%28USA%29.zip' },
    { name: 'Chrono Trigger', rom: 'https://archive.org/download/ROMS-SNES/Chrono%20Trigger%20%28USA%29.zip' },
    { name: 'Final Fantasy 3', rom: 'https://archive.org/download/ROMS-SNES/Final%20Fantasy%20III%20%28USA%29.zip' },
    { name: 'Final Fantasy 2', rom: 'https://archive.org/download/ROMS-SNES/Final%20Fantasy%20II%20%28USA%29.zip' },
    { name: 'Secret of Mana', rom: 'https://archive.org/download/ROMS-SNES/Secret%20of%20Mana%20%28USA%29.zip' },
    { name: 'Mega Man X', rom: 'https://archive.org/download/ROMS-SNES/Mega%20Man%20X%20%28USA%29.zip' },
    { name: 'Mega Man X2', rom: 'https://archive.org/download/ROMS-SNES/Mega%20Man%20X2%20%28USA%29.zip' },
    { name: 'Mega Man X3', rom: 'https://archive.org/download/ROMS-SNES/Mega%20Man%20X3%20%28USA%29.zip' },
    { name: 'Super Metroid', rom: 'https://archive.org/download/ROMS-SNES/Super%20Metroid%20%28USA%29.zip' },
    { name: 'Contra 3', rom: 'https://archive.org/download/ROMS-SNES/Contra%20III%20-%20The%20Alien%20Wars%20%28USA%29.zip' },
    { name: 'Super Castlevania 4', rom: 'https://archive.org/download/ROMS-SNES/Super%20Castlevania%20IV%20%28USA%29.zip' },
    { name: 'TMNT 4 Turtles in Time', rom: 'https://archive.org/download/ROMS-SNES/Teenage%20Mutant%20Ninja%20Turtles%20IV%20-%20Turtles%20in%20Time%20%28USA%29.zip' },
    { name: 'Earthbound', rom: 'https://archive.org/download/ROMS-SNES/EarthBound%20%28USA%29.zip' },
    { name: 'Star Fox', rom: 'https://archive.org/download/ROMS-SNES/Star%20Fox%20%28USA%29.zip' },
    { name: 'F-Zero', rom: 'https://archive.org/download/ROMS-SNES/F-Zero%20%28USA%29.zip' },
    { name: 'Super Punch-Out', rom: 'https://archive.org/download/ROMS-SNES/Super%20Punch-Out%21%21%20%28USA%29.zip' },
    { name: 'Kirby Super Star', rom: 'https://archive.org/download/ROMS-SNES/Kirby%20Super%20Star%20%28USA%29.zip' },
    { name: 'Yoshi Island', rom: 'https://archive.org/download/ROMS-SNES/Super%20Mario%20World%202%20-%20Yoshi%27s%20Island%20%28USA%29.zip' },
    { name: 'NBA Jam', rom: 'https://archive.org/download/ROMS-SNES/NBA%20Jam%20-%20Tournament%20Edition%20%28USA%29.zip' },
    { name: 'Pilotwings', rom: 'https://archive.org/download/ROMS-SNES/Pilotwings%20%28USA%29.zip' },
    { name: 'Kirby Dream Course', rom: 'https://archive.org/download/ROMS-SNES/Kirby%27s%20Dream%20Course%20%28USA%29.zip' },
    { name: 'Castlevania Dracula X', rom: 'https://archive.org/download/ROMS-SNES/Castlevania%20-%20Dracula%20X%20%28USA%29.zip' },
  ],
  n64: [
    { name: 'Super Mario 64', rom: 'https://archive.org/download/ROMS-N64/Super%20Mario%2064%20%28USA%29.zip' },
    { name: 'Mario Kart 64', rom: 'https://archive.org/download/ROMS-N64/Mario%20Kart%2064%20%28USA%29.zip' },
    { name: 'Zelda Ocarina of Time', rom: 'https://archive.org/download/ROMS-N64/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20%28USA%29.zip' },
    { name: 'Zelda Majoras Mask', rom: 'https://archive.org/download/ROMS-N64/Legend%20of%20Zelda%2C%20The%20-%20Majora%27s%20Mask%20%28USA%29.zip' },
    { name: 'Donkey Kong 64', rom: 'https://archive.org/download/ROMS-N64/Donkey%20Kong%2064%20%28USA%29.zip' },
    { name: 'Banjo Kazooie', rom: 'https://archive.org/download/ROMS-N64/Banjo-Kazooie%20%28USA%29.zip' },
    { name: 'Banjo Tooie', rom: 'https://archive.org/download/ROMS-N64/Banjo-Tooie%20%28USA%29.zip' },
    { name: 'GoldenEye 007', rom: 'https://archive.org/download/ROMS-N64/GoldenEye%20007%20%28USA%29.zip' },
    { name: 'Perfect Dark', rom: 'https://archive.org/download/ROMS-N64/Perfect%20Dark%20%28USA%29.zip' },
    { name: 'Star Fox 64', rom: 'https://archive.org/download/ROMS-N64/Star%20Fox%2064%20%28USA%29.zip' },
    { name: 'F-Zero X', rom: 'https://archive.org/download/ROMS-N64/F-Zero%20X%20%28USA%29.zip' },
    { name: 'Diddy Kong Racing', rom: 'https://archive.org/download/ROMS-N64/Diddy%20Kong%20Racing%20%28USA%29.zip' },
    { name: 'Super Smash Bros', rom: 'https://archive.org/download/ROMS-N64/Super%20Smash%20Bros.%20%28USA%29.zip' },
    { name: 'Mortal Kombat 4', rom: 'https://archive.org/download/ROMS-N64/Mortal%20Kombat%204%20%28USA%29.zip' },
    { name: 'Mortal Kombat Trilogy', rom: 'https://archive.org/download/ROMS-N64/Mortal%20Kombat%20Trilogy%20%28USA%29.zip' },
    { name: 'Conkers Bad Fur Day', rom: 'https://archive.org/download/ROMS-N64/Conker%27s%20Bad%20Fur%20Day%20%28USA%29.zip' },
    { name: 'Kirby 64', rom: 'https://archive.org/download/ROMS-N64/Kirby%2064%20-%20The%20Crystal%20Shards%20%28USA%29.zip' },
    { name: 'Pokemon Snap', rom: 'https://archive.org/download/ROMS-N64/Pokemon%20Snap%20%28USA%29.zip' },
    { name: 'Pokemon Stadium', rom: 'https://archive.org/download/ROMS-N64/Pokemon%20Stadium%20%28USA%29.zip' },
    { name: 'Paper Mario', rom: 'https://archive.org/download/ROMS-N64/Paper%20Mario%20%28USA%29.zip' },
    { name: 'Mario Party', rom: 'https://archive.org/download/ROMS-N64/Mario%20Party%20%28USA%29.zip' },
    { name: 'Mario Party 2', rom: 'https://archive.org/download/ROMS-N64/Mario%20Party%202%20%28USA%29.zip' },
    { name: 'Mario Party 3', rom: 'https://archive.org/download/ROMS-N64/Mario%20Party%203%20%28USA%29.zip' },
    { name: 'Turok', rom: 'https://archive.org/download/ROMS-N64/Turok%20-%20Dinosaur%20Hunter%20%28USA%29.zip' },
    { name: 'Castlevania 64', rom: 'https://archive.org/download/ROMS-N64/Castlevania%20%28USA%29.zip' },
    { name: 'Wave Race 64', rom: 'https://archive.org/download/ROMS-N64/Wave%20Race%2064%20%28USA%29.zip' },
    { name: 'Yoshi Story', rom: 'https://archive.org/download/ROMS-N64/Yoshi%27s%20Story%20%28USA%29.zip' },
    { name: 'Mega Man 64', rom: 'https://archive.org/download/ROMS-N64/Mega%20Man%2064%20%28USA%29.zip' },
    { name: 'NFL Blitz', rom: 'https://archive.org/download/ROMS-N64/NFL%20Blitz%20%28USA%29.zip' },
    { name: 'NBA Courtside', rom: 'https://archive.org/download/ROMS-N64/NBA%20Courtside%20%28USA%29.zip' },
  ],
  gba: [
    { name: 'Pokemon FireRed', rom: 'https://archive.org/download/ROMS-GBA/Pokemon%20-%20Fire%20Red%20Version%20%28USA%29.zip' },
    { name: 'Pokemon Emerald', rom: 'https://archive.org/download/ROMS-GBA/Pokemon%20-%20Emerald%20Version%20%28USA%29.zip' },
    { name: 'Pokemon Ruby', rom: 'https://archive.org/download/ROMS-GBA/Pokemon%20-%20Ruby%20Version%20%28USA%29.zip' },
    { name: 'Pokemon Sapphire', rom: 'https://archive.org/download/ROMS-GBA/Pokemon%20-%20Sapphire%20Version%20%28USA%29.zip' },
    { name: 'Zelda Minish Cap', rom: 'https://archive.org/download/ROMS-GBA/Legend%20of%20Zelda%2C%20The%20-%20The%20Minish%20Cap%20%28USA%29.zip' },
    { name: 'Mario Kart Super Circuit', rom: 'https://archive.org/download/ROMS-GBA/Mario%20Kart%20-%20Super%20Circuit%20%28USA%29.zip' },
    { name: 'Super Mario Advance', rom: 'https://archive.org/download/ROMS-GBA/Super%20Mario%20Advance%20%28USA%29.zip' },
    { name: 'Super Mario Advance 2', rom: 'https://archive.org/download/ROMS-GBA/Super%20Mario%20Advance%202%20-%20Super%20Mario%20World%20%28USA%29.zip' },
    { name: 'Super Mario Advance 4', rom: 'https://archive.org/download/ROMS-GBA/Super%20Mario%20Advance%204%20-%20Super%20Mario%20Bros.%203%20%28USA%29.zip' },
    { name: 'Mega Man Zero', rom: 'https://archive.org/download/ROMS-GBA/Mega%20Man%20Zero%20%28USA%29.zip' },
    { name: 'Mega Man Zero 2', rom: 'https://archive.org/download/ROMS-GBA/Mega%20Man%20Zero%202%20%28USA%29.zip' },
    { name: 'Castlevania Aria of Sorrow', rom: 'https://archive.org/download/ROMS-GBA/Castlevania%20-%20Aria%20of%20Sorrow%20%28USA%29.zip' },
    { name: 'Metroid Fusion', rom: 'https://archive.org/download/ROMS-GBA/Metroid%20Fusion%20%28USA%29.zip' },
    { name: 'Metroid Zero Mission', rom: 'https://archive.org/download/ROMS-GBA/Metroid%20-%20Zero%20Mission%20%28USA%29.zip' },
    { name: 'Final Fantasy 1 & 2', rom: 'https://archive.org/download/ROMS-GBA/Final%20Fantasy%20I%20%26%20II%20-%20Dawn%20of%20Souls%20%28USA%29.zip' },
    { name: 'Final Fantasy 6', rom: 'https://archive.org/download/ROMS-GBA/Final%20Fantasy%20VI%20Advance%20%28USA%29.zip' },
    { name: 'Golden Sun', rom: 'https://archive.org/download/ROMS-GBA/Golden%20Sun%20%28USA%29.zip' },
    { name: 'Golden Sun Lost Age', rom: 'https://archive.org/download/ROMS-GBA/Golden%20Sun%20-%20The%20Lost%20Age%20%28USA%29.zip' },
    { name: 'Fire Emblem', rom: 'https://archive.org/download/ROMS-GBA/Fire%20Emblem%20%28USA%29.zip' },
    { name: 'Kirby Nightmare in Dreamland', rom: 'https://archive.org/download/ROMS-GBA/Kirby%20-%20Nightmare%20in%20Dream%20Land%20%28USA%29.zip' },
    { name: 'Sonic Advance', rom: 'https://archive.org/download/ROMS-GBA/Sonic%20Advance%20%28USA%29.zip' },
    { name: 'Sonic Advance 2', rom: 'https://archive.org/download/ROMS-GBA/Sonic%20Advance%202%20%28USA%29.zip' },
    { name: 'Street Fighter Alpha 3', rom: 'https://archive.org/download/ROMS-GBA/Street%20Fighter%20Alpha%203%20%28USA%29.zip' },
    { name: 'Advance Wars', rom: 'https://archive.org/download/ROMS-GBA/Advance%20Wars%20%28USA%29.zip' },
    { name: 'Yoshi Island', rom: 'https://archive.org/download/ROMS-GBA/Yoshi%27s%20Island%20-%20Super%20Mario%20Advance%203%20%28USA%29.zip' },
    { name: 'Castlevania Harmony', rom: 'https://archive.org/download/ROMS-GBA/Castlevania%20-%20Harmony%20of%20Dissonance%20%28USA%29.zip' },
    { name: 'Tony Hawk Pro Skater 2', rom: 'https://archive.org/download/ROMS-GBA/Tony%20Hawk%27s%20Pro%20Skater%202%20%28USA%29.zip' },
    { name: 'Kirby Amazing Mirror', rom: 'https://archive.org/download/ROMS-GBA/Kirby%20%26%20the%20Amazing%20Mirror%20%28USA%29.zip' },
    { name: 'Zelda Link to the Past', rom: 'https://archive.org/download/ROMS-GBA/Legend%20of%20Zelda%2C%20The%20-%20A%20Link%20to%20the%20Past%20%26%20Four%20Swords%20%28USA%29.zip' },
    { name: 'Mortal Kombat Deadly Alliance', rom: 'https://archive.org/download/ROMS-GBA/Mortal%20Kombat%20-%20Deadly%20Alliance%20%28USA%29.zip' },
  ],
  ps1: [
    { name: 'Crash Bandicoot', rom: 'https://archive.org/download/chd_psx/Crash%20Bandicoot%20%28USA%29.chd' },
    { name: 'Crash Bandicoot 2', rom: 'https://archive.org/download/chd_psx/Crash%20Bandicoot%202%20-%20Cortex%20Strikes%20Back%20%28USA%29.chd' },
    { name: 'Crash Bandicoot 3', rom: 'https://archive.org/download/chd_psx/Crash%20Bandicoot%203%20-%20Warped%20%28USA%29.chd' },
    { name: 'Spyro the Dragon', rom: 'https://archive.org/download/chd_psx/Spyro%20the%20Dragon%20%28USA%29.chd' },
    { name: 'Spyro 2', rom: 'https://archive.org/download/chd_psx/Spyro%202%20-%20Ripto%27s%20Rage%21%20%28USA%29.chd' },
    { name: 'Final Fantasy 7', rom: 'https://archive.org/download/chd_psx/Final%20Fantasy%20VII%20%28USA%29.chd' },
    { name: 'Final Fantasy 8', rom: 'https://archive.org/download/chd_psx/Final%20Fantasy%20VIII%20%28USA%29.chd' },
    { name: 'Final Fantasy 9', rom: 'https://archive.org/download/chd_psx/Final%20Fantasy%20IX%20%28USA%29.chd' },
    { name: 'Tekken 3', rom: 'https://archive.org/download/chd_psx/Tekken%203%20%28USA%29.chd' },
    { name: 'Tekken 2', rom: 'https://archive.org/download/chd_psx/Tekken%202%20%28USA%29.chd' },
    { name: 'Street Fighter Alpha 3', rom: 'https://archive.org/download/chd_psx/Street%20Fighter%20Alpha%203%20%28USA%29.chd' },
    { name: 'Metal Gear Solid', rom: 'https://archive.org/download/chd_psx/Metal%20Gear%20Solid%20%28USA%29.chd' },
    { name: 'Resident Evil', rom: 'https://archive.org/download/chd_psx/Resident%20Evil%20%28USA%29.chd' },
    { name: 'Resident Evil 2', rom: 'https://archive.org/download/chd_psx/Resident%20Evil%202%20%28USA%29.chd' },
    { name: 'Castlevania SOTN', rom: 'https://archive.org/download/chd_psx/Castlevania%20-%20Symphony%20of%20the%20Night%20%28USA%29.chd' },
    { name: 'Mega Man X4', rom: 'https://archive.org/download/chd_psx/Mega%20Man%20X4%20%28USA%29.chd' },
    { name: 'Mega Man X5', rom: 'https://archive.org/download/chd_psx/Mega%20Man%20X5%20%28USA%29.chd' },
    { name: 'Tomb Raider', rom: 'https://archive.org/download/chd_psx/Tomb%20Raider%20%28USA%29.chd' },
    { name: 'Gran Turismo', rom: 'https://archive.org/download/chd_psx/Gran%20Turismo%20%28USA%29.chd' },
    { name: 'Gran Turismo 2', rom: 'https://archive.org/download/chd_psx/Gran%20Turismo%202%20%28USA%29.chd' },
    { name: 'Tony Hawk Pro Skater 2', rom: 'https://archive.org/download/chd_psx/Tony%20Hawk%27s%20Pro%20Skater%202%20%28USA%29.chd' },
    { name: 'Twisted Metal 2', rom: 'https://archive.org/download/chd_psx/Twisted%20Metal%202%20%28USA%29.chd' },
    { name: 'Ape Escape', rom: 'https://archive.org/download/chd_psx/Ape%20Escape%20%28USA%29.chd' },
    { name: 'Medievil', rom: 'https://archive.org/download/chd_psx/MediEvil%20%28USA%29.chd' },
    { name: 'Xenogears', rom: 'https://archive.org/download/chd_psx/Xenogears%20%28USA%29.chd' },
    { name: 'Chrono Cross', rom: 'https://archive.org/download/chd_psx/Chrono%20Cross%20%28USA%29.chd' },
    { name: 'Syphon Filter', rom: 'https://archive.org/download/chd_psx/Syphon%20Filter%20%28USA%29.chd' },
    { name: 'Mortal Kombat 4', rom: 'https://archive.org/download/chd_psx/Mortal%20Kombat%204%20%28USA%29.chd' },
    { name: 'Mega Man 8', rom: 'https://archive.org/download/chd_psx/Mega%20Man%208%20%28USA%29.chd' },
    { name: 'Parappa the Rapper', rom: 'https://archive.org/download/chd_psx/PaRappa%20the%20Rapper%20%28USA%29.chd' },
  ],
  genesis: [
    { name: 'Sonic the Hedgehog', rom: 'https://archive.org/download/ROMS-Genesis/Sonic%20the%20Hedgehog%20%28USA%2C%20Europe%29.zip' },
    { name: 'Sonic the Hedgehog 2', rom: 'https://archive.org/download/ROMS-Genesis/Sonic%20the%20Hedgehog%202%20%28World%29.zip' },
    { name: 'Sonic the Hedgehog 3', rom: 'https://archive.org/download/ROMS-Genesis/Sonic%20the%20Hedgehog%203%20%28USA%29.zip' },
    { name: 'Streets of Rage', rom: 'https://archive.org/download/ROMS-Genesis/Streets%20of%20Rage%20%28USA%2C%20Europe%29.zip' },
    { name: 'Streets of Rage 2', rom: 'https://archive.org/download/ROMS-Genesis/Streets%20of%20Rage%202%20%28USA%2C%20Europe%29.zip' },
    { name: 'Streets of Rage 3', rom: 'https://archive.org/download/ROMS-Genesis/Streets%20of%20Rage%203%20%28USA%29.zip' },
    { name: 'Mortal Kombat', rom: 'https://archive.org/download/ROMS-Genesis/Mortal%20Kombat%20%28USA%29.zip' },
    { name: 'Mortal Kombat 2', rom: 'https://archive.org/download/ROMS-Genesis/Mortal%20Kombat%20II%20%28USA%29.zip' },
    { name: 'Mortal Kombat 3', rom: 'https://archive.org/download/ROMS-Genesis/Mortal%20Kombat%203%20%28USA%29.zip' },
    { name: 'Street Fighter 2 CE', rom: 'https://archive.org/download/ROMS-Genesis/Street%20Fighter%20II%20-%20Champion%20Edition%20%28USA%29.zip' },
    { name: 'Castlevania Bloodlines', rom: 'https://archive.org/download/ROMS-Genesis/Castlevania%20-%20Bloodlines%20%28USA%29.zip' },
    { name: 'TMNT HyperStone Heist', rom: 'https://archive.org/download/ROMS-Genesis/Teenage%20Mutant%20Ninja%20Turtles%20-%20The%20HyperStone%20Heist%20%28USA%29.zip' },
    { name: 'Contra Hard Corps', rom: 'https://archive.org/download/ROMS-Genesis/Contra%20-%20Hard%20Corps%20%28USA%29.zip' },
    { name: 'Earthworm Jim', rom: 'https://archive.org/download/ROMS-Genesis/Earthworm%20Jim%20%28USA%29.zip' },
    { name: 'Earthworm Jim 2', rom: 'https://archive.org/download/ROMS-Genesis/Earthworm%20Jim%202%20%28USA%29.zip' },
    { name: 'Aladdin', rom: 'https://archive.org/download/ROMS-Genesis/Aladdin%20%28USA%29.zip' },
    { name: 'Lion King', rom: 'https://archive.org/download/ROMS-Genesis/Lion%20King%2C%20The%20%28USA%29.zip' },
    { name: 'NBA Jam', rom: 'https://archive.org/download/ROMS-Genesis/NBA%20Jam%20-%20Tournament%20Edition%20%28USA%29.zip' },
    { name: 'Comix Zone', rom: 'https://archive.org/download/ROMS-Genesis/Comix%20Zone%20%28USA%2C%20Europe%29.zip' },
    { name: 'Shinobi 3', rom: 'https://archive.org/download/ROMS-Genesis/Shinobi%20III%20-%20Return%20of%20the%20Ninja%20Master%20%28USA%29.zip' },
    { name: 'Golden Axe', rom: 'https://archive.org/download/ROMS-Genesis/Golden%20Axe%20%28USA%2C%20Europe%29.zip' },
    { name: 'Golden Axe 2', rom: 'https://archive.org/download/ROMS-Genesis/Golden%20Axe%20II%20%28USA%2C%20Europe%29.zip' },
    { name: 'Vectorman', rom: 'https://archive.org/download/ROMS-Genesis/Vectorman%20%28USA%29.zip' },
    { name: 'Phantasy Star 4', rom: 'https://archive.org/download/ROMS-Genesis/Phantasy%20Star%20IV%20%28USA%29.zip' },
    { name: 'Gunstar Heroes', rom: 'https://archive.org/download/ROMS-Genesis/Gunstar%20Heroes%20%28USA%29.zip' },
    { name: 'Altered Beast', rom: 'https://archive.org/download/ROMS-Genesis/Altered%20Beast%20%28USA%2C%20Europe%29.zip' },
    { name: 'Mega Man Wily Wars', rom: 'https://archive.org/download/ROMS-Genesis/Mega%20Man%20-%20The%20Wily%20Wars%20%28Europe%29.zip' },
    { name: 'Ecco the Dolphin', rom: 'https://archive.org/download/ROMS-Genesis/Ecco%20the%20Dolphin%20%28USA%2C%20Europe%29.zip' },
    { name: 'NHL 94', rom: 'https://archive.org/download/ROMS-Genesis/NHL%2094%20%28USA%29.zip' },
    { name: 'Madden NFL 94', rom: 'https://archive.org/download/ROMS-Genesis/Madden%20NFL%2094%20%28USA%29.zip' },
  ],
  arcade: [
    { name: 'Street Fighter 2', rom: 'https://archive.org/download/MAME-Non-Merged/sf2.zip' },
    { name: 'Mortal Kombat', rom: 'https://archive.org/download/MAME-Non-Merged/mk.zip' },
    { name: 'Mortal Kombat 2', rom: 'https://archive.org/download/MAME-Non-Merged/mk2.zip' },
    { name: 'Pac-Man', rom: 'https://archive.org/download/MAME-Non-Merged/pacman.zip' },
    { name: 'Ms Pac-Man', rom: 'https://archive.org/download/MAME-Non-Merged/mspacman.zip' },
    { name: 'Galaga', rom: 'https://archive.org/download/MAME-Non-Merged/galaga.zip' },
    { name: 'Donkey Kong', rom: 'https://archive.org/download/MAME-Non-Merged/dkong.zip' },
    { name: 'Frogger', rom: 'https://archive.org/download/MAME-Non-Merged/frogger.zip' },
    { name: 'Space Invaders', rom: 'https://archive.org/download/MAME-Non-Merged/invaders.zip' },
    { name: 'Dig Dug', rom: 'https://archive.org/download/MAME-Non-Merged/digdug.zip' },
    { name: 'Bubble Bobble', rom: 'https://archive.org/download/MAME-Non-Merged/bublbobl.zip' },
    { name: 'Contra', rom: 'https://archive.org/download/MAME-Non-Merged/contra.zip' },
    { name: 'TMNT', rom: 'https://archive.org/download/MAME-Non-Merged/turtles.zip' },
    { name: 'TMNT 2', rom: 'https://archive.org/download/MAME-Non-Merged/tmnt2.zip' },
    { name: 'The Simpsons', rom: 'https://archive.org/download/MAME-Non-Merged/simpsons.zip' },
    { name: 'X-Men Arcade', rom: 'https://archive.org/download/MAME-Non-Merged/xmen.zip' },
    { name: 'NBA Jam', rom: 'https://archive.org/download/MAME-Non-Merged/nbajam.zip' },
    { name: 'Metal Slug', rom: 'https://archive.org/download/MAME-Non-Merged/mslug.zip' },
    { name: 'Metal Slug 2', rom: 'https://archive.org/download/MAME-Non-Merged/mslug2.zip' },
    { name: 'Metal Slug 3', rom: 'https://archive.org/download/MAME-Non-Merged/mslug3.zip' },
    { name: 'King of Fighters 94', rom: 'https://archive.org/download/MAME-Non-Merged/kof94.zip' },
    { name: 'King of Fighters 97', rom: 'https://archive.org/download/MAME-Non-Merged/kof97.zip' },
    { name: 'King of Fighters 98', rom: 'https://archive.org/download/MAME-Non-Merged/kof98.zip' },
    { name: 'Marvel vs Capcom', rom: 'https://archive.org/download/MAME-Non-Merged/mvsc.zip' },
    { name: 'Sunset Riders', rom: 'https://archive.org/download/MAME-Non-Merged/sunsetbl.zip' },
    { name: 'Captain America', rom: 'https://archive.org/download/MAME-Non-Merged/captamerica.zip' },
    { name: 'Cadillacs and Dinosaurs', rom: 'https://archive.org/download/MAME-Non-Merged/captcomm.zip' },
    { name: 'Asteroids', rom: 'https://archive.org/download/MAME-Non-Merged/asteroid.zip' },
    { name: 'Centipede', rom: 'https://archive.org/download/MAME-Non-Merged/centiped.zip' },
    { name: 'NFL Blitz', rom: 'https://archive.org/download/MAME-Non-Merged/nflblitz.zip' },
  ],
  neogeo: [
    { name: 'Metal Slug', rom: 'https://archive.org/download/MAME-Non-Merged/mslug.zip' },
    { name: 'Metal Slug 2', rom: 'https://archive.org/download/MAME-Non-Merged/mslug2.zip' },
    { name: 'Metal Slug 3', rom: 'https://archive.org/download/MAME-Non-Merged/mslug3.zip' },
    { name: 'King of Fighters 94', rom: 'https://archive.org/download/MAME-Non-Merged/kof94.zip' },
    { name: 'King of Fighters 95', rom: 'https://archive.org/download/MAME-Non-Merged/kof95.zip' },
    { name: 'King of Fighters 96', rom: 'https://archive.org/download/MAME-Non-Merged/kof96.zip' },
    { name: 'King of Fighters 97', rom: 'https://archive.org/download/MAME-Non-Merged/kof97.zip' },
    { name: 'King of Fighters 98', rom: 'https://archive.org/download/MAME-Non-Merged/kof98.zip' },
    { name: 'Samurai Shodown', rom: 'https://archive.org/download/MAME-Non-Merged/samsho.zip' },
    { name: 'Samurai Shodown 2', rom: 'https://archive.org/download/MAME-Non-Merged/samsho2.zip' },
    { name: 'Fatal Fury', rom: 'https://archive.org/download/MAME-Non-Merged/fatfury1.zip' },
    { name: 'Fatal Fury 2', rom: 'https://archive.org/download/MAME-Non-Merged/fatfury2.zip' },
    { name: 'Art of Fighting', rom: 'https://archive.org/download/MAME-Non-Merged/aof.zip' },
    { name: 'Art of Fighting 2', rom: 'https://archive.org/download/MAME-Non-Merged/aof2.zip' },
    { name: 'Last Blade', rom: 'https://archive.org/download/MAME-Non-Merged/lastblad.zip' },
    { name: 'Garou Mark of Wolves', rom: 'https://archive.org/download/MAME-Non-Merged/garou.zip' },
    { name: 'Pulstar', rom: 'https://archive.org/download/MAME-Non-Merged/pulstar.zip' },
    { name: 'Blazing Star', rom: 'https://archive.org/download/MAME-Non-Merged/blazstar.zip' },
    { name: 'Neo Turf Masters', rom: 'https://archive.org/download/MAME-Non-Merged/neoturf.zip' },
    { name: 'Sengoku', rom: 'https://archive.org/download/MAME-Non-Merged/sengoku.zip' },
    { name: 'Sengoku 2', rom: 'https://archive.org/download/MAME-Non-Merged/sengoku2.zip' },
    { name: 'Magician Lord', rom: 'https://archive.org/download/MAME-Non-Merged/maglord.zip' },
    { name: 'Top Hunter', rom: 'https://archive.org/download/MAME-Non-Merged/tophuntr.zip' },
    { name: 'Windjammers', rom: 'https://archive.org/download/MAME-Non-Merged/windjammers.zip' },
    { name: 'Neo Bomberman', rom: 'https://archive.org/download/MAME-Non-Merged/neobombe.zip' },
    { name: 'Ghost Pilots', rom: 'https://archive.org/download/MAME-Non-Merged/ghostpilots.zip' },
    { name: 'Baseball Stars 2', rom: 'https://archive.org/download/MAME-Non-Merged/bstars2.zip' },
    { name: 'Crossed Swords', rom: 'https://archive.org/download/MAME-Non-Merged/crsword.zip' },
    { name: 'Eight Man', rom: 'https://archive.org/download/MAME-Non-Merged/eightman.zip' },
    { name: 'Captain Tomaday', rom: 'https://archive.org/download/MAME-Non-Merged/ctomaday.zip' },
  ],
}

const FRAMES = {
  arcade: { bg: 'linear-gradient(180deg,#1a0000,#2d0000)', border: '#8B0000', glow: 'rgba(229,9,20,0.4)', label: 'ARCADE' },
  nes:    { bg: 'linear-gradient(180deg,#1a1a2e,#16213e)', border: '#aaa',    glow: 'rgba(200,200,255,0.3)', label: 'NES' },
  snes:   { bg: 'linear-gradient(180deg,#1a0a2e,#2d1650)', border: '#7c3aed', glow: 'rgba(124,58,237,0.4)', label: 'SUPER NINTENDO' },
  n64:    { bg: 'linear-gradient(180deg,#0a1a0a,#0d2b0d)', border: '#059669', glow: 'rgba(5,150,105,0.4)',  label: 'NINTENDO 64' },
  gba:    { bg: 'linear-gradient(180deg,#1a0a00,#2d1600)', border: '#d97706', glow: 'rgba(217,119,6,0.4)',  label: 'GAME BOY ADVANCE' },
  ps1:    { bg: 'linear-gradient(180deg,#000a1a,#001630)', border: '#2563eb', glow: 'rgba(37,99,235,0.4)',  label: 'PLAYSTATION' },
  genesis:{ bg: 'linear-gradient(180deg,#000a10,#001520)', border: '#0891b2', glow: 'rgba(8,145,178,0.4)',  label: 'SEGA GENESIS' },
}

export default function GamesPage() {
  const [selectedConsole, setSelectedConsole] = useState(null)
  const [selectedGame, setSelectedGame] = useState(null)
  const [search, setSearch] = useState('')
  const iframeRef = useRef(null)

  const handleConsoleSelect = function(c) {
    setSelectedConsole(c)
    setSelectedGame(null)
    setSearch('')
  }

  const handleFullscreen = function() {
    if (iframeRef.current && iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen()
    }
  }

  const games = selectedConsole ? (GAMES[selectedConsole.id] || []) : []
  const filtered = games.filter(function(g) { return g.name.toLowerCase().includes(search.toLowerCase()) })
  const frame = selectedConsole ? (FRAMES[selectedConsole.frame] || FRAMES.arcade) : null

  const emulatorSrc = selectedGame && selectedConsole
    ? '/emulator.html?core=' + selectedConsole.core + '&rom=' + encodeURIComponent(selectedGame.rom) + '&name=' + encodeURIComponent(selectedGame.name)
    : null

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 2rem', background: '#080808' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ width: 4, height: 28, borderRadius: 2, background: '#e50914', display: 'inline-block' }} />
        <Gamepad2 size={24} color="#e50914" />
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: 3 }}>
          JUEGOS RETRO
        </div>
        {selectedConsole && (
          <button
            onClick={function() { setSelectedConsole(null); setSelectedGame(null) }}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'monospace', background: 'none', border: 'none' }}
          >
            <ArrowLeft size={14} /> Volver
          </button>
        )}
      </div>

      {!selectedConsole && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {CONSOLES.map(function(c) {
            return (
              <button
                key={c.id}
                onClick={function() { handleConsoleSelect(c) }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', padding: '2rem 1rem', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', color: '#fff', width: '100%',
                }}
                onMouseEnter={function(e) {
                  e.currentTarget.style.background = c.color + '15'
                  e.currentTarget.style.borderColor = c.color
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px ' + c.color + '30'
                }}
                onMouseLeave={function(e) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: '3rem' }}>{c.emoji}</span>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: 2, color: c.color }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#555' }}>
                  {(GAMES[c.id] || []).length} juegos
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedConsole && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '0.5rem 0.75rem',
            }}>
              <Search size={14} color="#555" />
              <input
                type="text"
                placeholder="Buscar juego..."
                value={search}
                onChange={function(e) { setSearch(e.target.value) }}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingRight: 4 }}>
              {filtered.map(function(game, i) {
                var isSelected = selectedGame && selectedGame.name === game.name
                return (
                  <button
                    key={i}
                    onClick={function() { setSelectedGame(game) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.8rem', borderRadius: 6, textAlign: 'left', width: '100%',
                      background: isSelected ? selectedConsole.color + '22' : 'rgba(255,255,255,0.02)',
                      border: '1px solid ' + (isSelected ? selectedConsole.color : 'rgba(255,255,255,0.05)'),
                      color: '#fff', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: selectedConsole.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontFamily: 'monospace', color: selectedConsole.color, fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{game.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            {selectedGame ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: 2, color: selectedConsole.color }}>
                    {selectedGame.name}
                  </div>
                  <button
                    onClick={handleFullscreen}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.4rem 0.8rem', borderRadius: 6,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace',
                    }}
                  >
                    <Maximize2 size={13} /> Pantalla completa
                  </button>
                </div>

                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  background: frame.bg,
                  border: '3px solid ' + frame.border,
                  boxShadow: '0 0 40px ' + frame.glow + ', inset 0 0 20px rgba(0,0,0,0.5)',
                  padding: '12px 12px 20px',
                }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.65rem', letterSpacing: 4, color: frame.border, textAlign: 'center', marginBottom: 8, opacity: 0.8 }}>
                    {frame.label}
                  </div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <iframe
                      ref={iframeRef}
                      src={emulatorSrc}
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      title={selectedGame.name}
                      allow="fullscreen; gamepad"
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 10 }}>
                    {[0,1,2].map(function(i) {
                      return <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: frame.border, opacity: 0.6 }} />
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 400, background: frame.bg, border: '2px solid ' + frame.border,
                borderRadius: 16, gap: '1rem', boxShadow: '0 0 30px ' + frame.glow,
              }}>
                <span style={{ fontSize: '4rem' }}>{selectedConsole.emoji}</span>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: 3, color: selectedConsole.color }}>
                  {selectedConsole.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#555' }}>
                  Selecciona un juego de la lista
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
