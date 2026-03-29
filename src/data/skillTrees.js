// Skill tree definitions - pure data, no logic
// Each class has 25 tiers. At each tier the player picks 1 of 4 options (3 passives + 1 active, permanent choice).
// type: 'passive' (always active) or 'active' (usable in battle, costs mana)

import { CHARACTER_CLASSES } from './gameData';

export const SKILL_TREES = {
  berserker: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'brs_t1a', name: 'Blood Frenzy', type: 'passive', desc: '+3% ATK for each 10% HP missing', icon: 'P' },
        { id: 'brs_t1b', name: 'Savage Strike', type: 'active', desc: '1.2x damage, take 5% max HP recoil', manaCost: 8, multiplier: 1.2, effect: 'recoil_small', icon: 'A' },
        { id: 'brs_t1c', name: 'Battle Scars', type: 'passive', desc: '+5% max HP permanently from battle', icon: 'P' },
        { id: 'brs_t1d', name: 'Fury Building', type: 'passive', desc: '+2% ATK each turn in combat (stacks)', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'brs_t2a', name: 'Undying Will', type: 'passive', desc: 'Survive one lethal hit per battle at 1 HP', icon: 'P' },
        { id: 'brs_t2b', name: 'Cleave', type: 'active', desc: '1x damage, ignores 30% DEF', manaCost: 10, multiplier: 1, effect: 'pierce_30', icon: 'A' },
        { id: 'brs_t2c', name: 'Reckless Abandon', type: 'passive', desc: '+10% ATK but take 5% more damage', icon: 'P' },
        { id: 'brs_t2d', name: 'Iron Will', type: 'passive', desc: '10% resistance to all debuffs', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'brs_t3a', name: 'Bloodlust', type: 'passive', desc: 'Heal 20% of damage dealt when below 30% HP', icon: 'P' },
        { id: 'brs_t3b', name: 'Rampage', type: 'active', desc: '1.6x damage, take 20% max HP recoil', manaCost: 15, multiplier: 1.6, effect: 'recoil_heavy', icon: 'A' },
        { id: 'brs_t3c', name: 'Rage Fuel', type: 'passive', desc: 'Restore 2 mana when taking damage', icon: 'P' },
        { id: 'brs_t3d', name: 'Primal Instinct', type: 'passive', desc: '+10% dodge chance when below 50% HP', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'brs_t4a', name: 'War Machine', type: 'passive', desc: '+15% ATK, +25% ATK when below 50% HP', icon: 'P' },
        { id: 'brs_t4b', name: 'Skull Crusher', type: 'active', desc: '1.6x damage, reduce enemy DEF by 40%', manaCost: 18, multiplier: 1.6, effect: 'shred_def', icon: 'A' },
        { id: 'brs_t4c', name: 'Brutal Momentum', type: 'passive', desc: 'Normal attacks deal +15% damage', icon: 'P' },
        { id: 'brs_t4d', name: 'Bloodrage', type: 'passive', desc: 'Gain +5% ATK for 2 turns after being hit', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'brs_t5a', name: 'Thick Skin', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
        { id: 'brs_t5b', name: 'Whirlwind', type: 'active', desc: '1.3x damage, ignores 20% DEF', manaCost: 12, multiplier: 1.3, effect: 'pierce_20', icon: 'A' },
        { id: 'brs_t5c', name: 'Savage Endurance', type: 'passive', desc: 'Heal 2% max HP per turn', icon: 'P' },
        { id: 'brs_t5d', name: 'Hardened Body', type: 'passive', desc: '+5 DEF permanently in battle', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'brs_t6a', name: 'Adrenaline Rush', type: 'passive', desc: 'Restore 3 mana each time you attack', icon: 'P' },
        { id: 'brs_t6b', name: 'Decimate', type: 'active', desc: '1.5x damage, enemy ATK -15%', manaCost: 14, multiplier: 1.5, effect: 'weaken_15', icon: 'A' },
        { id: 'brs_t6c', name: 'Fury Unleashed', type: 'passive', desc: 'Critical hits deal 2.5x instead of 2x', icon: 'P' },
        { id: 'brs_t6d', name: 'Combat Expertise', type: 'passive', desc: '+10% damage to stunned or debuffed enemies', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'brs_t7a', name: 'Tenacity', type: 'passive', desc: 'Poison and debuff durations reduced by 1 turn', icon: 'P' },
        { id: 'brs_t7b', name: 'Execution', type: 'active', desc: '0.9x damage if enemy below 25% HP, else 1.5x', manaCost: 16, multiplier: 0.9, effect: 'execute_25', icon: 'A' },
        { id: 'brs_t7c', name: 'Battle Trance', type: 'passive', desc: 'Immune to stun effects', icon: 'P' },
        { id: 'brs_t7d', name: 'Scarred Flesh', type: 'passive', desc: 'Poison damage taken reduced by 50%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'brs_t8a', name: 'Bloodbath', type: 'passive', desc: 'Heal 5% max HP on every kill', icon: 'P' },
        { id: 'brs_t8b', name: 'Devastating Blow', type: 'active', desc: '1.5x damage, ignores 50% DEF', manaCost: 18, multiplier: 1.5, effect: 'pierce_50', icon: 'A' },
        { id: 'brs_t8c', name: "Predator's Eye", type: 'passive', desc: '+10% damage to enemies below 50% HP', icon: 'P' },
        { id: 'brs_t8d', name: 'Blood Scent', type: 'passive', desc: 'Restore 3 mana when enemy drops below 50% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'brs_t9a', name: 'Relentless', type: 'passive', desc: '+20% ATK when above 80% HP', icon: 'P' },
        { id: 'brs_t9b', name: 'Blood Nova', type: 'active', desc: '1.8x damage, heal 25% of damage dealt, 10% recoil', manaCost: 22, multiplier: 1.8, effect: 'blood_nova', icon: 'A' },
        { id: 'brs_t9c', name: 'Savage Resilience', type: 'passive', desc: '+10% DEF when above 50% HP', icon: 'P' },
        { id: 'brs_t9d', name: "Berserker's Focus", type: 'passive', desc: 'Skills deal +10% more damage', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'brs_t10a', name: 'Immortal Rage', type: 'passive', desc: 'When below 10% HP, ATK doubled', icon: 'P' },
        { id: 'brs_t10b', name: 'Apocalypse', type: 'active', desc: '2.3x damage, take 30% max HP recoil', manaCost: 28, multiplier: 2.3, effect: 'recoil_extreme', icon: 'A' },
        { id: 'brs_t10c', name: 'Undaunted', type: 'passive', desc: 'Take 15% less damage from enemies with higher ATK', icon: 'P' },
        { id: 'brs_t10d', name: 'Death Dealer', type: 'passive', desc: '+3% ATK per active buff on self', icon: 'P' },
      ]},
      // ---- Post-20 tiers ----
      { level: 22, label: 'Tier 11', choices: [
        { id: 'brs_t11a', name: 'Gore', type: 'active', desc: '1.6x damage, enemy bleeds 5% max HP/turn for 3 turns', manaCost: 16, multiplier: 1.6, effect: 'apply_bleed', icon: 'A' },
        { id: 'brs_t11b', name: 'Pain Threshold', type: 'passive', desc: 'Recoil damage from skills reduced by 50%', icon: 'P' },
        { id: 'brs_t11c', name: 'Unrelenting Force', type: 'passive', desc: '+8% ATK after using an active skill (lasts 2 turns)', icon: 'P' },
        { id: 'brs_t11d', name: 'Vitality Surge', type: 'passive', desc: 'Heal 3% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'brs_t12a', name: 'Berserker Stance', type: 'passive', desc: '+30% ATK but +15% damage taken', icon: 'P' },
        { id: 'brs_t12b', name: 'Crushing Blow', type: 'active', desc: '1.8x damage, reduce enemy DEF by 60%', manaCost: 20, multiplier: 1.8, effect: 'shred_def_60', icon: 'A' },
        { id: 'brs_t12c', name: 'Wrathful Strikes', type: 'passive', desc: 'Normal attacks have 15% chance to deal double damage', icon: 'P' },
        { id: 'brs_t12d', name: 'Blood Bond', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'brs_t13a', name: 'Second Wind', type: 'passive', desc: 'At 25% HP, heal 20% max HP once per battle', icon: 'P' },
        { id: 'brs_t13b', name: 'Reckless Charge', type: 'active', desc: '1.6x damage, ignore 40% DEF, take 10% recoil', manaCost: 18, multiplier: 1.6, effect: 'reckless_charge', icon: 'A' },
        { id: 'brs_t13c', name: 'Warcry', type: 'passive', desc: 'Start each battle with +10% ATK for 3 turns', icon: 'P' },
        { id: 'brs_t13d', name: 'Bloodied Resolve', type: 'passive', desc: '+15% DEF when below 30% HP', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'brs_t14a', name: 'Frenzy', type: 'passive', desc: 'Each attack in a row increases ATK by 5% (stacks 10x)', icon: 'P' },
        { id: 'brs_t14b', name: 'Annihilate', type: 'active', desc: '1.3x damage if enemy above 50% HP, else 2.5x', manaCost: 24, multiplier: 1.3, effect: 'overkill_50', icon: 'A' },
        { id: 'brs_t14c', name: 'Unbridled Power', type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'brs_t14d', name: 'Savage Instincts', type: 'passive', desc: 'Restore 5 mana when HP drops below 50%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'brs_t15a', name: 'Blood Oath', type: 'passive', desc: 'Permanently sacrifice 30% max HP. ATK +60%, all skills cost 50% less mana. You can never heal above 70% HP again.', icon: 'P', milestone: true },
        { id: 'brs_t15b', name: 'Worldbreaker', type: 'active', desc: '3.1x damage. 40% recoil. If this kills, fully heal. If it doesn\'t kill, you are stunned next turn.', manaCost: 35, multiplier: 3.1, effect: 'worldbreaker', icon: 'A', milestone: true },
        { id: 'brs_t15c', name: 'Eternal Berserker', type: 'passive', desc: 'You can never be healed by potions. In return, every hit you land heals 15% of damage dealt. Your rage sustains you.', icon: 'P', milestone: true },
        { id: 'brs_t15d', name: 'Pain is Power', type: 'passive', desc: 'All recoil damage is converted to +ATK (permanent per battle). The more you hurt yourself, the stronger you become.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'brs_t16a', name: 'Juggernaut', type: 'passive', desc: 'Cannot be reduced below 15% HP by a single hit', icon: 'P' },
        { id: 'brs_t16b', name: 'Eviscerate', type: 'active', desc: '2x damage, ignore 60% DEF', manaCost: 22, multiplier: 2, effect: 'pierce_60', icon: 'A' },
        { id: 'brs_t16c', name: 'Bloodletting', type: 'passive', desc: 'Bleed effects you apply last 2 extra turns', icon: 'P' },
        { id: 'brs_t16d', name: 'Conqueror', type: 'passive', desc: '+1% ATK per level above 20', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'brs_t17a', name: 'Warlord', type: 'passive', desc: '+2% ATK per level above 30', icon: 'P' },
        { id: 'brs_t17b', name: 'Cataclysmic Slam', type: 'active', desc: '2.3x damage, shred enemy DEF to 0, take 15% recoil', manaCost: 26, multiplier: 2.3, effect: 'cata_slam', icon: 'A' },
        { id: 'brs_t17c', name: 'Overwhelming Force', type: 'passive', desc: 'Skills ignore 20% of enemy DEF', icon: 'P' },
        { id: 'brs_t17d', name: 'Blood Fury', type: 'passive', desc: 'When below 40% HP, all damage +20%', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'brs_t18a', name: 'Undying Fury', type: 'passive', desc: 'Survive lethal hits twice per battle (replaces Undying Will)', icon: 'P' },
        { id: 'brs_t18b', name: 'Massacre', type: 'active', desc: '1.6x damage three times in a row', manaCost: 30, multiplier: 1.6, effect: 'triple_strike', icon: 'A' },
        { id: 'brs_t18c', name: 'Rampage Mastery', type: 'passive', desc: 'After killing an enemy, fully restore mana', icon: 'P' },
        { id: 'brs_t18d', name: 'Thick Blood', type: 'passive', desc: 'Immune to poison and bleed effects', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'brs_t19a', name: 'Bloodforged', type: 'passive', desc: 'Convert 20% of overkill damage into healing', icon: 'P' },
        { id: 'brs_t19b', name: 'Oblivion Strike', type: 'active', desc: '2.7x true damage, 25% recoil', manaCost: 32, multiplier: 2.7, effect: 'oblivion_strike', icon: 'A' },
        { id: 'brs_t19c', name: 'Indomitable Spirit', type: 'passive', desc: 'All damage taken reduced by 12%', icon: 'P' },
        { id: 'brs_t19d', name: 'Rage Incarnate', type: 'passive', desc: '+5% ATK each time you take damage (stacks 8x per battle)', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'brs_t20a', name: 'Avatar of Carnage', type: 'passive', desc: 'All damage +100%. All healing received is halved. HP regen disabled. You exist only to destroy.', icon: 'P', milestone: true },
        { id: 'brs_t20b', name: 'Ragnarök', type: 'active', desc: '4.6x damage. Costs 50% current HP + all mana. If enemy survives, your ATK is halved for 3 turns.', manaCost: 40, multiplier: 4.6, effect: 'ragnarok', icon: 'A', milestone: true },
        { id: 'brs_t20c', name: 'Undying Titan', type: 'passive', desc: 'Your max HP is doubled. Your ATK is reduced by 25%. You cannot be killed in fewer than 10 hits. An immovable force.', icon: 'P', milestone: true },
        { id: 'brs_t20d', name: 'Bloodbound', type: 'passive', desc: 'Every point of HP you lose becomes +1% ATK until end of battle. At 1 HP your ATK is astronomical. No healing allowed.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'brs_t21a', name: 'Scarred Veteran', type: 'passive', desc: '+1% damage reduction per 5% HP missing', icon: 'P' },
        { id: 'brs_t21b', name: 'Sundering Blow', type: 'active', desc: '2.5x damage, enemy DEF & ATK -30%', manaCost: 28, multiplier: 2.5, effect: 'sunder', icon: 'A' },
        { id: 'brs_t21c', name: 'Veteran Instincts', type: 'passive', desc: '+20% damage on first attack each battle', icon: 'P' },
        { id: 'brs_t21d', name: 'War-Hardened', type: 'passive', desc: 'Take 3% less damage per turn in battle (max 15%)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'brs_t22a', name: 'Deathless', type: 'passive', desc: 'When revived by Undying Will, gain +50% ATK for rest of fight', icon: 'P' },
        { id: 'brs_t22b', name: 'Titan Blow', type: 'active', desc: '2.7x damage, stun enemy for 1 turn', manaCost: 30, multiplier: 2.7, effect: 'titan_blow', icon: 'A' },
        { id: 'brs_t22c', name: 'Bloodsoaked', type: 'passive', desc: 'All lifesteal effects doubled', icon: 'P' },
        { id: 'brs_t22d', name: 'Gladiator', type: 'passive', desc: '+20% ATK and DEF for the first 5 turns of battle', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'brs_t23a', name: 'Endless Rage', type: 'passive', desc: 'Mana costs reduced by 1 each turn (min 1)', icon: 'P' },
        { id: 'brs_t23b', name: 'Savage Whirlwind', type: 'active', desc: '1.8x damage twice, ignore 30% DEF', manaCost: 28, multiplier: 1.8, effect: 'double_pierce_30', icon: 'A' },
        { id: 'brs_t23c', name: 'Primal Fury', type: 'passive', desc: 'Skills have 20% chance to cost no mana', icon: 'P' },
        { id: 'brs_t23d', name: 'Unyielding', type: 'passive', desc: 'Cannot be stunned, debuff durations halved', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'brs_t24a', name: 'Warpath', type: 'passive', desc: 'After killing an enemy, start next battle with +30% ATK', icon: 'P' },
        { id: 'brs_t24b', name: 'Extinction', type: 'active', desc: '2.5x damage, 8.0x if enemy below 30% HP', manaCost: 34, multiplier: 2.5, effect: 'execute_30_8x', icon: 'A' },
        { id: 'brs_t24c', name: 'Destroyer', type: 'passive', desc: '+25% damage to enemies above 75% HP', icon: 'P' },
        { id: 'brs_t24d', name: 'Crimson Vitality', type: 'passive', desc: 'Heal 8% max HP at start of each turn when below 40% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'brs_t25a', name: 'Godslayer', type: 'passive', desc: 'You deal +5% damage per 1% HP missing. At 1 HP you deal +500% damage. Potions no longer work on you.', icon: 'P', milestone: true },
        { id: 'brs_t25b', name: 'Final Cataclysm', type: 'active', desc: '6.3x damage. Sets your HP to 1. If enemy survives, you die instantly.', manaCost: 50, multiplier: 6.3, effect: 'final_cataclysm', icon: 'A', milestone: true },
        { id: 'brs_t25c', name: 'Eternal Warrior', type: 'passive', desc: 'Survive any hit that would kill you (infinite uses). After each survival, ATK -10% permanently. You never die, but you slowly fade.', icon: 'P', milestone: true },
        { id: 'brs_t25d', name: 'Lord of Slaughter', type: 'passive', desc: 'Every kill permanently grants +3 ATK for the rest of the run. Normal attacks hit twice. You can never defend or use potions again.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'brs_t26a', name: 'Wrath Eternal', type: 'passive', desc: '+3% ATK per level above 40', icon: 'P' },
        { id: 'brs_t26b', name: 'Hemorrhaging Slash', type: 'active', desc: '2.7x damage, apply bleed for 5 turns (4% max HP/turn)', manaCost: 28, multiplier: 2.7, effect: 'hemorrhage_5', icon: 'A' },
        { id: 'brs_t26c', name: 'Savage Recovery', type: 'passive', desc: 'Heal 5% max HP whenever you deal a critical hit', icon: 'P' },
        { id: 'brs_t26d', name: 'Berserker Vitality', type: 'passive', desc: '+30% max HP, +10% ATK', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'brs_t27a', name: 'Primal Wrath', type: 'passive', desc: 'All recoil damage reduced by 75%', icon: 'P' },
        { id: 'brs_t27b', name: 'Cataclysmic Fury', type: 'active', desc: '2.7x damage, +50% if below 50% HP', manaCost: 30, multiplier: 2.7, effect: 'cata_fury', icon: 'A' },
        { id: 'brs_t27c', name: 'Undying Fervor', type: 'passive', desc: 'After surviving a lethal hit, gain +40% ATK for rest of fight', icon: 'P' },
        { id: 'brs_t27d', name: 'Ruthless Strikes', type: 'passive', desc: 'Normal attacks have 25% chance to deal triple damage', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'brs_t28a', name: 'Gore Master', type: 'passive', desc: 'Bleed effects deal double damage and cannot be cleansed', icon: 'P' },
        { id: 'brs_t28b', name: 'Titan Rend', type: 'active', desc: '3.1x damage, ignore 70% DEF, 10% recoil', manaCost: 34, multiplier: 3.1, effect: 'titan_rend', icon: 'A' },
        { id: 'brs_t28c', name: 'Blood Reservoir', type: 'passive', desc: 'Overkill damage on enemies heals you for 50% of excess', icon: 'P' },
        { id: 'brs_t28d', name: 'Rage Mastery', type: 'passive', desc: '+8% ATK per turn in combat (stacks, replaces Fury Building)', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'brs_t29a', name: 'Unstoppable Charge', type: 'passive', desc: 'First attack each battle ignores all DEF and deals +60% damage', icon: 'P' },
        { id: 'brs_t29b', name: 'Oblivion Cleave', type: 'active', desc: '2.3x damage twice, ignore 40% DEF each hit', manaCost: 32, multiplier: 2.3, effect: 'double_pierce_40', icon: 'A' },
        { id: 'brs_t29c', name: 'War Veteran', type: 'passive', desc: '+2% ATK and DEF per level above 45', icon: 'P' },
        { id: 'brs_t29d', name: 'Bloodforged Armor', type: 'passive', desc: 'Gain DEF equal to 20% of your ATK', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'brs_t30a', name: 'Aspect of Carnage', type: 'passive', desc: 'All damage dealt +80%. All damage taken +40%. HP regeneration disabled. You are a weapon, not a person.', icon: 'P', milestone: true },
        { id: 'brs_t30b', name: 'Armageddon Strike', type: 'active', desc: '4.8x damage. Costs 40% current HP. If enemy dies, restore all HP. If not, stunned 2 turns.', manaCost: 45, multiplier: 4.8, effect: 'armageddon_strike', icon: 'A', milestone: true },
        { id: 'brs_t30c', name: 'Blood God', type: 'passive', desc: 'Every point of damage you deal heals 10% as HP. Every point of damage you take adds +2% ATK permanently per battle. Pain feeds power, power feeds life.', icon: 'P', milestone: true },
        { id: 'brs_t30d', name: 'Unkillable Rage', type: 'passive', desc: 'Cannot die while ATK is above 50% of base. Each hit taken reduces ATK by 3%. When ATK drops below threshold, you collapse. Rage is your lifeline.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'brs_t31a', name: 'Shatterbone', type: 'passive', desc: 'Normal attacks reduce enemy DEF by 5% per hit (stacks)', icon: 'P' },
        { id: 'brs_t31b', name: 'Savage Onslaught', type: 'active', desc: '2x damage 3 times', manaCost: 34, multiplier: 2, effect: 'triple_strike_45', icon: 'A' },
        { id: 'brs_t31c', name: 'Crimson Fortitude', type: 'passive', desc: '+40% max HP, heal 4% max HP when taking damage', icon: 'P' },
        { id: 'brs_t31d', name: 'Fury Conduit', type: 'passive', desc: 'Restore 5 mana whenever you take damage', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'brs_t32a', name: 'Legendary Rage', type: 'passive', desc: 'All skill multipliers increased by 20%', icon: 'P' },
        { id: 'brs_t32b', name: 'World Render', type: 'active', desc: '3.5x damage, shred enemy DEF to 0, 15% recoil', manaCost: 36, multiplier: 3.5, effect: 'world_render', icon: 'A' },
        { id: 'brs_t32c', name: 'Battle Euphoria', type: 'passive', desc: 'After killing an enemy, +40% ATK and full mana for next battle', icon: 'P' },
        { id: 'brs_t32d', name: 'Iron Blood', type: 'passive', desc: 'All damage taken reduced by 20%, immune to bleed and poison', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'brs_t33a', name: 'Frenzied Assault', type: 'passive', desc: '30% chance to attack twice each turn', icon: 'P' },
        { id: 'brs_t33b', name: 'Infernal Blow', type: 'active', desc: '2.9x damage, enemy ATK & DEF -40%', manaCost: 32, multiplier: 2.9, effect: 'infernal_blow', icon: 'A' },
        { id: 'brs_t33c', name: 'Enraged Regeneration', type: 'passive', desc: 'Heal 8% max HP per turn when below 50% HP', icon: 'P' },
        { id: 'brs_t33d', name: 'Unbreakable Fury', type: 'passive', desc: 'Immune to stun, doom, and all CC effects', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'brs_t34a', name: 'Warlord Supreme', type: 'passive', desc: '+3% ATK per level above 50', icon: 'P' },
        { id: 'brs_t34b', name: 'Decimating Fury', type: 'active', desc: '2.7x damage twice, each hit ignores 50% DEF', manaCost: 36, multiplier: 2.7, effect: 'double_pierce_50', icon: 'A' },
        { id: 'brs_t34c', name: 'Bloodlust Supreme', type: 'passive', desc: 'Heal 30% of all damage dealt', icon: 'P' },
        { id: 'brs_t34d', name: 'Titan Strength', type: 'passive', desc: 'Equipment ATK bonuses increased by 40%', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'brs_t35a', name: 'Mythic Berserker', type: 'passive', desc: 'ATK tripled. DEF set to 0. Cannot defend. Cannot use potions. Every attack heals 20% of damage dealt. Pure unstoppable offense.', icon: 'P', milestone: true },
        { id: 'brs_t35b', name: 'Extinction Blow', type: 'active', desc: '6.2x damage. Costs 60% current HP. If enemy survives, your ATK is halved permanently. All or nothing.', manaCost: 55, multiplier: 6.2, effect: 'extinction_blow', icon: 'A', milestone: true },
        { id: 'brs_t35c', name: 'Eternal Bloodrage', type: 'passive', desc: 'ATK increases by 5% every turn (stacks infinitely). Max HP decreases by 2% every turn. A ticking time bomb of power.', icon: 'P', milestone: true },
        { id: 'brs_t35d', name: 'Invincible Juggernaut', type: 'passive', desc: 'Cannot be reduced below 25% HP by any single hit. +50% max HP. ATK -20%. Recoil damage heals instead. Unstoppable tank.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'brs_t36a', name: 'Primal Vigor', type: 'passive', desc: 'Heal 10% max HP at start of each turn', icon: 'P' },
        { id: 'brs_t36b', name: 'Cataclysm Wave', type: 'active', desc: '3.3x damage, enemy DEF & ATK -50%', manaCost: 38, multiplier: 3.3, effect: 'cata_wave', icon: 'A' },
        { id: 'brs_t36c', name: 'Rage Shield', type: 'passive', desc: 'Gain a shield equal to 15% ATK at start of each turn', icon: 'P' },
        { id: 'brs_t36d', name: 'Savage Precision', type: 'passive', desc: 'All attacks ignore 30% enemy DEF permanently', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'brs_t37a', name: 'Bloodstorm', type: 'passive', desc: 'All bleed and DoT effects you apply deal triple damage', icon: 'P' },
        { id: 'brs_t37b', name: 'Annihilation Slam', type: 'active', desc: '3.9x damage, 20% recoil, ignore all DEF', manaCost: 40, multiplier: 3.9, effect: 'annihilation_slam', icon: 'A' },
        { id: 'brs_t37c', name: 'Undying Legend', type: 'passive', desc: 'Survive lethal hits 3 times per battle at 15% HP', icon: 'P' },
        { id: 'brs_t37d', name: 'Warborn', type: 'passive', desc: 'Start each battle with +30% ATK and +30% DEF for 5 turns', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'brs_t38a', name: 'Apex Predator', type: 'passive', desc: '+50% damage to enemies above 75% HP, +50% damage to enemies below 25% HP', icon: 'P' },
        { id: 'brs_t38b', name: 'Doomsday Cleave', type: 'active', desc: '2.7x damage 2 times, bleed 5 turns each', manaCost: 38, multiplier: 2.7, effect: 'doom_cleave', icon: 'A' },
        { id: 'brs_t38c', name: 'Furious Momentum', type: 'passive', desc: 'Each consecutive attack increases damage by 10% (no cap)', icon: 'P' },
        { id: 'brs_t38d', name: 'Blood Pact', type: 'passive', desc: 'Sacrifice 3% HP per turn, gain +40% ATK and +40% lifesteal', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'brs_t39a', name: 'Indomitable Champion', type: 'passive', desc: 'All damage taken reduced by 25%, immune to all debuffs', icon: 'P' },
        { id: 'brs_t39b', name: 'Primordial Rage', type: 'active', desc: '4.6x damage, heal 30% of damage dealt, ignore 60% DEF', manaCost: 42, multiplier: 4.6, effect: 'primordial_rage', icon: 'A' },
        { id: 'brs_t39c', name: 'Eternal Frenzy', type: 'passive', desc: 'All skill mana costs reduced by 40%', icon: 'P' },
        { id: 'brs_t39d', name: 'Legendary Fortitude', type: 'passive', desc: '+50% max HP, +20% DEF, +20% ATK', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'brs_t40a', name: 'Divine Berserker', type: 'passive', desc: 'ATK and max HP doubled. All healing tripled. You take +50% damage. Skills cost double mana. Overwhelming power with overwhelming risk.', icon: 'P', milestone: true },
        { id: 'brs_t40b', name: 'Ragnarök Reborn', type: 'active', desc: '4.8x damage. Costs 70% current HP and all mana. If enemy dies, fully heal and restore all mana. If not, ATK halved rest of fight.', manaCost: 60, multiplier: 4.8, effect: 'ragnarok_reborn', icon: 'A', milestone: true },
        { id: 'brs_t40c', name: 'Embodiment of War', type: 'passive', desc: 'Normal attacks hit 3 times at 60% damage each. Every hit heals 5% of damage. You can never use active skills again. Pure primal combat.', icon: 'P', milestone: true },
        { id: 'brs_t40d', name: 'Immortal Warlord', type: 'passive', desc: 'Cannot die. When HP reaches 0, enter Rage State: ATK +200%, take 10% max HP per turn. Rage State ends and you die when you miss an attack.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'brs_t41a', name: 'Mythic Strength', type: 'passive', desc: '+4% ATK per level above 60', icon: 'P' },
        { id: 'brs_t41b', name: 'Godslayer Strike', type: 'active', desc: '3.9x damage, ignore all DEF, enemy ATK -30%', manaCost: 40, multiplier: 3.9, effect: 'godslayer_strike', icon: 'A' },
        { id: 'brs_t41c', name: 'Battle Mastery', type: 'passive', desc: 'All damage +35% permanently', icon: 'P' },
        { id: 'brs_t41d', name: 'Primal Regeneration', type: 'passive', desc: 'Heal 12% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'brs_t42a', name: 'Savage Dominion', type: 'passive', desc: 'Enemy DEF reduced by 5% per turn permanently (stacks)', icon: 'P' },
        { id: 'brs_t42b', name: 'Apocalyptic Rampage', type: 'active', desc: '2.7x damage 3 times, 10% recoil', manaCost: 42, multiplier: 2.7, effect: 'apoc_rampage', icon: 'A' },
        { id: 'brs_t42c', name: 'Wrath Incarnate', type: 'passive', desc: 'Critical hits deal 4x damage instead of 2x', icon: 'P' },
        { id: 'brs_t42d', name: 'Unshakeable', type: 'passive', desc: '+60% max HP, cannot be reduced below 10% HP by a single hit', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'brs_t43a', name: 'Berserker Ascendancy', type: 'passive', desc: 'All equipment bonuses increased by 35%', icon: 'P' },
        { id: 'brs_t43b', name: 'World Ender', type: 'active', desc: '4.4x damage, shred enemy DEF to 0, 15% recoil', manaCost: 44, multiplier: 4.4, effect: 'world_ender', icon: 'A' },
        { id: 'brs_t43c', name: 'Relentless Fury', type: 'passive', desc: 'After using a skill, next normal attack deals +80% damage', icon: 'P' },
        { id: 'brs_t43d', name: 'Bloodfire', type: 'passive', desc: 'Lifesteal from all sources tripled', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'brs_t44a', name: 'Primeval Force', type: 'passive', desc: '+50% ATK when below 50% HP, +25% ATK when above 50% HP', icon: 'P' },
        { id: 'brs_t44b', name: 'Cataclysmic Rend', type: 'active', desc: '3.1x damage twice, ignore 70% DEF each', manaCost: 44, multiplier: 3.1, effect: 'double_pierce_70', icon: 'A' },
        { id: 'brs_t44c', name: 'Undying Wrath', type: 'passive', desc: 'Survive lethal hits 4 times per battle, gain +20% ATK each time', icon: 'P' },
        { id: 'brs_t44d', name: 'Savage Aura', type: 'passive', desc: 'Enemies take 5% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'brs_t45a', name: 'Primordial Berserker', type: 'passive', desc: 'All stats +50%. Every turn, gain +5% ATK permanently. Every turn, lose 1% max HP permanently. You grow stronger as your body crumbles.', icon: 'P', milestone: true },
        { id: 'brs_t45b', name: 'Extinction Event', type: 'active', desc: '6.4x damage. Costs 80% current HP. Sets mana to 0. If enemy survives, fight continues but you cannot use skills for 3 turns.', manaCost: 70, multiplier: 6.4, effect: 'extinction_event_brs', icon: 'A', milestone: true },
        { id: 'brs_t45c', name: 'Wrath of Ages', type: 'passive', desc: 'Every kill permanently adds +5 ATK for the rest of the run. Every death (lethal hit survival) permanently adds +10 ATK. Pain and violence make you eternal.', icon: 'P', milestone: true },
        { id: 'brs_t45d', name: 'Blood Titan', type: 'passive', desc: 'Max HP tripled. ATK halved. All damage taken heals you for 20%. Normal attacks hit twice. You are an immortal mountain of flesh.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'brs_t46a', name: 'Godlike Power', type: 'passive', desc: '+5% ATK per level above 70', icon: 'P' },
        { id: 'brs_t46b', name: 'Divine Rampage', type: 'active', desc: '3.9x damage 2 times, heal 20% of total damage', manaCost: 44, multiplier: 3.9, effect: 'divine_rampage', icon: 'A' },
        { id: 'brs_t46c', name: 'Ascended Vitality', type: 'passive', desc: 'Heal 15% max HP at start of each turn, +30% max HP', icon: 'P' },
        { id: 'brs_t46d', name: 'Conqueror Supreme', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'brs_t47a', name: 'Warmaster Supreme', type: 'passive', desc: '40% chance to attack twice, each attack ignores 40% DEF', icon: 'P' },
        { id: 'brs_t47b', name: 'Apocalypse Incarnate', type: 'active', desc: '5x damage, enemy ATK & DEF -60%, 20% recoil', manaCost: 48, multiplier: 5, effect: 'apoc_incarnate', icon: 'A' },
        { id: 'brs_t47c', name: 'Eternal Bloodlust', type: 'passive', desc: 'All lifesteal quadrupled, heal 5% max HP per hit', icon: 'P' },
        { id: 'brs_t47d', name: 'Unbreakable Spirit', type: 'passive', desc: 'All damage taken reduced by 30%, immune to all negative effects', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'brs_t48a', name: 'Legendary Warlord', type: 'passive', desc: '+80% ATK, +40% DEF, +40% max HP', icon: 'P' },
        { id: 'brs_t48b', name: 'Oblivion Rampage', type: 'active', desc: '3.1x true damage 3 times', manaCost: 50, multiplier: 3.1, effect: 'oblivion_rampage', icon: 'A' },
        { id: 'brs_t48c', name: 'Bloodforged Legend', type: 'passive', desc: 'All equipment bonuses increased by 50%', icon: 'P' },
        { id: 'brs_t48d', name: 'Rage Beyond Death', type: 'passive', desc: 'Survive lethal hits 5 times per battle, each survival grants +30% ATK', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'brs_t49a', name: 'Titan Among Men', type: 'passive', desc: '+100% max HP, +50% ATK, normal attacks hit twice', icon: 'P' },
        { id: 'brs_t49b', name: 'End of All Things', type: 'active', desc: '6.3x damage, ignore all DEF, heal 50% of damage dealt', manaCost: 52, multiplier: 6.3, effect: 'end_all_things', icon: 'A' },
        { id: 'brs_t49c', name: 'Primordial Might', type: 'passive', desc: 'All damage +60% permanently, all damage taken -20%', icon: 'P' },
        { id: 'brs_t49d', name: 'Infinite Rage', type: 'passive', desc: 'Mana costs reduced by 60%, restore 10 mana per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'brs_t50a', name: 'God of War', type: 'passive', desc: 'All stats doubled. All recoil converted to healing. Every hit you land permanently increases ATK by 1% for the run. You are war incarnate.', icon: 'P', milestone: true },
        { id: 'brs_t50b', name: 'Final Ragnarök', type: 'active', desc: '7x damage. Costs all HP except 1 and all mana. If enemy dies, fully restore everything. If not, you die. The ultimate gamble.', manaCost: 1, multiplier: 7, effect: 'final_ragnarok', icon: 'A', milestone: true },
        { id: 'brs_t50c', name: 'Eternal Slaughter', type: 'passive', desc: 'Normal attacks hit 4 times at 50% damage. Every kill fully heals you. Every hit you land heals 10%. ATK -30% but you never stop swinging.', icon: 'P', milestone: true },
        { id: 'brs_t50d', name: 'Primordial God of Fury', type: 'passive', desc: 'You cannot die. Ever. HP cannot drop below 1. In exchange, ATK decreases by 1% each turn. An eternal warrior fading into nothing.', icon: 'P', milestone: true },
      ]},
    ],
  },
  warrior: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'war_t1a', name: 'Iron Skin', type: 'passive', desc: 'Take 10% less damage from all attacks', icon: 'P' },
        { id: 'war_t1b', name: 'War Cry', type: 'active', desc: 'Reduce enemy ATK by 25% for the fight', manaCost: 8, multiplier: 0.5, effect: 'war_cry', icon: 'A' },
        { id: 'war_t1c', name: 'Shield Training', type: 'passive', desc: '+3 DEF permanently in battle', icon: 'P' },
        { id: 'war_t1d', name: 'Resolve', type: 'passive', desc: 'Heal 1% max HP at the start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'war_t2a', name: 'Bulwark', type: 'passive', desc: 'Defend blocks 85% damage instead of 70%', icon: 'P' },
        { id: 'war_t2b', name: 'Counter Strike', type: 'active', desc: '1x damage, 2.5x if defended last turn', manaCost: 10, multiplier: 1, effect: 'counter', icon: 'A' },
        { id: 'war_t2c', name: 'Heavy Armor', type: 'passive', desc: '+10% DEF from equipment', icon: 'P' },
        { id: 'war_t2d', name: 'Bravery', type: 'passive', desc: '+5% ATK when HP is above 70%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'war_t3a', name: 'Unbreakable', type: 'passive', desc: '+15% max HP during battle', icon: 'P' },
        { id: 'war_t3b', name: 'Earthquake', type: 'active', desc: '1.2x damage, lower enemy DEF by 30%', manaCost: 15, multiplier: 1.2, effect: 'quake', icon: 'A' },
        { id: 'war_t3c', name: 'Fortify', type: 'passive', desc: '+8% DEF when defending', icon: 'P' },
        { id: 'war_t3d', name: 'Protector', type: 'passive', desc: 'Restore 2 mana when you defend', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'war_t4a', name: 'Aegis', type: 'passive', desc: '15% chance to fully block any attack', icon: 'P' },
        { id: 'war_t4b', name: 'Final Stand', type: 'active', desc: '1.5x damage, heal 30% of damage dealt', manaCost: 18, multiplier: 1.5, effect: 'final_stand', icon: 'A' },
        { id: 'war_t4c', name: 'Retaliation', type: 'passive', desc: 'When hit, deal 10% of damage back to attacker', icon: 'P' },
        { id: 'war_t4d', name: 'Steadfast', type: 'passive', desc: 'Immune to ATK reduction debuffs', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'war_t5a', name: 'Stalwart', type: 'passive', desc: '+5 DEF permanently in battle', icon: 'P' },
        { id: 'war_t5b', name: 'Shield Slam', type: 'active', desc: '1x damage + DEF added to ATK for this hit', manaCost: 12, multiplier: 1, effect: 'shield_slam', icon: 'A' },
        { id: 'war_t5c', name: 'Enduring Will', type: 'passive', desc: '+10% max HP permanently', icon: 'P' },
        { id: 'war_t5d', name: 'Tactical Mind', type: 'passive', desc: 'Restore 3 mana when you attack', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'war_t6a', name: 'Regeneration', type: 'passive', desc: 'Heal 3% max HP at the start of each turn', icon: 'P' },
        { id: 'war_t6b', name: 'Heroic Strike', type: 'active', desc: '1.3x damage, restore 5 mana', manaCost: 10, multiplier: 1.3, effect: 'heroic_mana', icon: 'A' },
        { id: 'war_t6c', name: 'Shield Wall', type: 'passive', desc: 'Defend now also restores 5% max HP', icon: 'P' },
        { id: 'war_t6d', name: 'Commander', type: 'passive', desc: '+8% ATK and DEF permanently', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'war_t7a', name: 'Armor Mastery', type: 'passive', desc: 'Equipment DEF bonuses increased by 15%', icon: 'P' },
        { id: 'war_t7b', name: 'Mighty Cleave', type: 'active', desc: '1.4x damage, ignores 25% DEF', manaCost: 14, multiplier: 1.4, effect: 'pierce_25', icon: 'A' },
        { id: 'war_t7c', name: 'Battle Ready', type: 'passive', desc: 'Start each battle with +15% DEF for 3 turns', icon: 'P' },
        { id: 'war_t7d', name: 'Weapon Mastery', type: 'passive', desc: 'Equipment ATK bonuses increased by 10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'war_t8a', name: 'Last Stand', type: 'passive', desc: '+30% DEF when below 40% HP', icon: 'P' },
        { id: 'war_t8b', name: 'Rallying Blow', type: 'active', desc: '1.2x damage, heal 20% max HP', manaCost: 16, multiplier: 1.2, effect: 'rally_heal', icon: 'A' },
        { id: 'war_t8c', name: 'Stoneskin', type: 'passive', desc: 'Take 5 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t8d', name: 'Inspiring Presence', type: 'passive', desc: '+12% ATK when HP above 50%', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'war_t9a', name: 'Indomitable', type: 'passive', desc: 'Cannot be reduced below 1 HP by poison or DoT', icon: 'P' },
        { id: 'war_t9b', name: 'Colossus Smash', type: 'active', desc: '1.6x damage, reduce enemy DEF to 0 for 2 turns', manaCost: 22, multiplier: 1.6, effect: 'armor_break', icon: 'A' },
        { id: 'war_t9c', name: 'Sentinel', type: 'passive', desc: '20% chance to fully block any attack', icon: 'P' },
        { id: 'war_t9d', name: 'Endurance Training', type: 'passive', desc: 'Restore 5% max mana at start of each turn', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'war_t10a', name: 'Fortress', type: 'passive', desc: 'All damage taken reduced by 20%', icon: 'P' },
        { id: 'war_t10b', name: 'Avatar of War', type: 'active', desc: '1.8x damage, +50% DEF for 3 turns', manaCost: 28, multiplier: 1.8, effect: 'avatar', icon: 'A' },
        { id: 'war_t10c', name: 'Unassailable', type: 'passive', desc: 'Survive one lethal hit per battle at 25% HP', icon: 'P' },
        { id: 'war_t10d', name: 'Warden', type: 'passive', desc: '+15% ATK and +15% DEF permanently', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'war_t11a', name: 'Fortified Mind', type: 'passive', desc: 'Immune to ATK debuffs from enemies', icon: 'P' },
        { id: 'war_t11b', name: 'Thunder Clap', type: 'active', desc: '1.3x damage, enemy ATK -35% for the fight', manaCost: 16, multiplier: 1.3, effect: 'thunder_clap', icon: 'A' },
        { id: 'war_t11c', name: 'Bastion', type: 'passive', desc: 'Defend blocks 90% of damage', icon: 'P' },
        { id: 'war_t11d', name: 'Iron Resolve', type: 'passive', desc: '+4% max HP per level above 15', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'war_t12a', name: 'Phalanx', type: 'passive', desc: 'Defend now blocks 95% of damage', icon: 'P' },
        { id: 'war_t12b', name: 'Retribution', type: 'active', desc: '1.6x damage, 4.0x if you defended last turn', manaCost: 18, multiplier: 1.6, effect: 'retribution', icon: 'A' },
        { id: 'war_t12c', name: 'Thorns', type: 'passive', desc: 'When hit, deal 20% of damage taken back to attacker', icon: 'P' },
        { id: 'war_t12d', name: 'Defensive Mastery', type: 'passive', desc: '+20% DEF from all sources', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'war_t13a', name: "Titan's Grip", type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'war_t13b', name: 'Seismic Slam', type: 'active', desc: '1.6x damage, reduce enemy DEF by 50%', manaCost: 20, multiplier: 1.6, effect: 'seismic_slam', icon: 'A' },
        { id: 'war_t13c', name: 'Guardian Angel', type: 'passive', desc: 'Heal 5% max HP when you successfully block', icon: 'P' },
        { id: 'war_t13d', name: 'Heavy Strikes', type: 'passive', desc: 'Normal attacks have +20% damage', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'war_t14a', name: 'Endurance', type: 'passive', desc: 'Heal 5% max HP at start of each turn', icon: 'P' },
        { id: 'war_t14b', name: 'Devastate', type: 'active', desc: '2x damage, heal 25% of damage dealt', manaCost: 22, multiplier: 2, effect: 'devastate_heal', icon: 'A' },
        { id: 'war_t14c', name: 'Plate Armor', type: 'passive', desc: 'Take 10 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t14d', name: 'Veterans Might', type: 'passive', desc: '+2% ATK per level above 20', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'war_t15a', name: 'Immortal Bastion', type: 'passive', desc: 'You cannot die for the first 5 turns of any battle. After turn 5, you take +25% damage permanently.', icon: 'P', milestone: true },
        { id: 'war_t15b', name: 'Wrath of the Ancients', type: 'active', desc: '2.7x damage. Consumes all DEF for this fight — DEF becomes 0. Damage scales with lost DEF.', manaCost: 35, multiplier: 2.7, effect: 'wrath_ancients', icon: 'A', milestone: true },
        { id: 'war_t15c', name: 'Immovable Object', type: 'passive', desc: 'DEF is doubled. You cannot dodge or use potions. Defend fully negates all damage. You are the shield.', icon: 'P', milestone: true },
        { id: 'war_t15d', name: 'Living Monument', type: 'passive', desc: 'Max HP +50%. ATK -20%. Every turn you survive, gain +3% ATK permanently for the battle. Time is your weapon.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'war_t16a', name: 'Ironclad', type: 'passive', desc: '+25% DEF from all sources', icon: 'P' },
        { id: 'war_t16b', name: 'Warbringer', type: 'active', desc: '1.8x damage, gain +20% ATK for rest of fight', manaCost: 22, multiplier: 1.8, effect: 'warbringer', icon: 'A' },
        { id: 'war_t16c', name: 'Mana Fortress', type: 'passive', desc: 'Restore 4 mana when you defend', icon: 'P' },
        { id: 'war_t16d', name: 'Adaptive Armor', type: 'passive', desc: 'After being hit, take 5% less damage next hit (stacks 5x)', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'war_t17a', name: 'Vigilance', type: 'passive', desc: '25% chance to fully block any attack', icon: 'P' },
        { id: 'war_t17b', name: 'Judgment', type: 'active', desc: '2.3x damage, enemy ATK and DEF -25%', manaCost: 26, multiplier: 2.3, effect: 'judgment', icon: 'A' },
        { id: 'war_t17c', name: 'Steel Resolve', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t17d', name: 'Punisher', type: 'passive', desc: 'Counter-attacks deal 30% of your ATK after blocking', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'war_t18a', name: 'Undying Resolve', type: 'passive', desc: 'Survive lethal hit at 20% HP instead of 1 HP (once per battle)', icon: 'P' },
        { id: 'war_t18b', name: 'Colossal Strike', type: 'active', desc: '2.5x damage, DEF added to ATK for this hit', manaCost: 28, multiplier: 2.5, effect: 'colossal_strike', icon: 'A' },
        { id: 'war_t18c', name: 'Citadel', type: 'passive', desc: 'Heal 6% max HP at start of each turn', icon: 'P' },
        { id: 'war_t18d', name: 'Shield Mastery', type: 'passive', desc: 'Defend also reduces enemy ATK by 10%', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'war_t19a', name: 'Battle Hardened', type: 'passive', desc: 'Take 2% less damage for each turn that passes in battle', icon: 'P' },
        { id: 'war_t19b', name: 'Titanic Slam', type: 'active', desc: '2.7x damage, stun enemy 1 turn, ignore 30% DEF', manaCost: 30, multiplier: 2.7, effect: 'titanic_slam', icon: 'A' },
        { id: 'war_t19c', name: 'Aegis Supreme', type: 'passive', desc: '30% chance to fully block any attack', icon: 'P' },
        { id: 'war_t19d', name: 'Titan Constitution', type: 'passive', desc: '+25% max HP permanently', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'war_t20a', name: 'Eternal Guardian', type: 'passive', desc: 'All damage taken reduced by 50%. Your ATK is reduced by 35%. You can never die in fewer than 8 hits.', icon: 'P', milestone: true },
        { id: 'war_t20b', name: 'Cataclysm of Steel', type: 'active', desc: '3.9x damage. Shatters your armor — DEF halved for rest of fight. If enemy dies, DEF is fully restored.', manaCost: 40, multiplier: 3.9, effect: 'cataclysm_steel', icon: 'A', milestone: true },
        { id: 'war_t20c', name: 'Absolute Defense', type: 'passive', desc: 'Every 3rd hit against you is fully negated. Your ATK is halved. You cannot use skills costing >20 mana. An unbreakable wall.', icon: 'P', milestone: true },
        { id: 'war_t20d', name: 'Warmaster', type: 'passive', desc: 'ATK and DEF +40%. All skill costs doubled. Normal attacks hit twice. Balance through mastery.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'war_t21a', name: 'Unshakable', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t21b', name: 'Punishing Strike', type: 'active', desc: '2x damage, heal 15% max HP, restore 8 mana', manaCost: 24, multiplier: 2, effect: 'punishing_strike', icon: 'A' },
        { id: 'war_t21c', name: 'Living Armor', type: 'passive', desc: '+1 DEF each turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t21d', name: 'Righteous Fury', type: 'passive', desc: '+15% ATK when you defend successfully', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'war_t22a', name: 'Stalwart Commander', type: 'passive', desc: 'Pet damage +50%, pet takes 30% less damage', icon: 'P' },
        { id: 'war_t22b', name: 'Bladestorm', type: 'active', desc: '1.6x damage three times', manaCost: 28, multiplier: 1.6, effect: 'triple_strike', icon: 'A' },
        { id: 'war_t22c', name: 'Impervious', type: 'passive', desc: 'Cannot be reduced below 20% HP by a single hit', icon: 'P' },
        { id: 'war_t22d', name: 'Juggernaut Charge', type: 'passive', desc: '+20% damage on first attack each battle, ignore 40% DEF', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'war_t23a', name: 'Bulwark Mastery', type: 'passive', desc: 'Defending also reflects 30% of blocked damage', icon: 'P' },
        { id: 'war_t23b', name: 'Sundering Cleave', type: 'active', desc: '2.5x damage, reduce enemy DEF to 0', manaCost: 30, multiplier: 2.5, effect: 'full_armor_break', icon: 'A' },
        { id: 'war_t23c', name: 'Regeneration+', type: 'passive', desc: 'Heal 8% max HP at start of each turn', icon: 'P' },
        { id: 'war_t23d', name: 'Overpower', type: 'passive', desc: 'Skills ignore 25% of enemy DEF', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'war_t24a', name: 'Indestructible', type: 'passive', desc: 'Heal 8% max HP at start of each turn', icon: 'P' },
        { id: 'war_t24b', name: 'Worldsplitter', type: 'active', desc: '2.7x damage, ignore 50% DEF, gain 15% max HP as shield', manaCost: 34, multiplier: 2.7, effect: 'worldsplitter', icon: 'A' },
        { id: 'war_t24c', name: 'Legendary Armor', type: 'passive', desc: 'All equipment bonuses increased by 25%', icon: 'P' },
        { id: 'war_t24d', name: 'Undying Fortress', type: 'passive', desc: 'Survive lethal hits twice per battle at 15% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'war_t25a', name: 'Living Fortress', type: 'passive', desc: 'DEF is doubled. You regenerate 10% max HP/turn. Your ATK is halved. You cannot use active skills. You are an unkillable wall.', icon: 'P', milestone: true },
        { id: 'war_t25b', name: 'Final Judgment', type: 'active', desc: '4.8x damage. For the rest of the fight, you take double damage. If enemy survives, heal to full.', manaCost: 50, multiplier: 4.8, effect: 'final_judgment', icon: 'A', milestone: true },
        { id: 'war_t25c', name: 'Immortal Vanguard', type: 'passive', desc: 'You cannot die. Period. But every hit reduces your ATK by 2% permanently. Eventually you cannot fight.', icon: 'P', milestone: true },
        { id: 'war_t25d', name: 'One-Man Army', type: 'passive', desc: 'ATK and DEF +50%. Max HP +100%. All skill costs tripled. Active skills deal +50% damage. The ultimate soldier.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'war_t26a', name: 'Mythic Armor', type: 'passive', desc: '+30% DEF from all sources', icon: 'P' },
        { id: 'war_t26b', name: 'Divine Strike', type: 'active', desc: '2.7x damage, gain +25% DEF for rest of fight', manaCost: 28, multiplier: 2.7, effect: 'divine_strike', icon: 'A' },
        { id: 'war_t26c', name: 'Fortified Soul', type: 'passive', desc: '+3% DEF per level above 40', icon: 'P' },
        { id: 'war_t26d', name: 'Veteran Commander', type: 'passive', desc: '+20% ATK, +20% DEF, +20% max HP', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'war_t27a', name: 'Impenetrable Guard', type: 'passive', desc: 'Defend blocks 98% of damage and restores 8 mana', icon: 'P' },
        { id: 'war_t27b', name: 'Hammer of Justice', type: 'active', desc: '2.7x damage, stun enemy 2 turns', manaCost: 30, multiplier: 2.7, effect: 'hammer_justice', icon: 'A' },
        { id: 'war_t27c', name: 'Guardian Spirit', type: 'passive', desc: 'Heal 8% max HP at start of each turn', icon: 'P' },
        { id: 'war_t27d', name: 'Steel Tempering', type: 'passive', desc: 'Take 8 less flat damage from every hit (min 1)', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'war_t28a', name: 'Legendary Shield', type: 'passive', desc: '35% chance to fully block any attack', icon: 'P' },
        { id: 'war_t28b', name: 'Titanic Crush', type: 'active', desc: '3.1x damage, DEF added to ATK for this hit, stun 1 turn', manaCost: 32, multiplier: 3.1, effect: 'titanic_crush', icon: 'A' },
        { id: 'war_t28c', name: 'Thorned Armor', type: 'passive', desc: 'When hit, deal 30% of damage taken back to attacker', icon: 'P' },
        { id: 'war_t28d', name: 'Wardens Grace', type: 'passive', desc: '+35% max HP, immune to ATK reduction debuffs', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'war_t29a', name: 'Mythic Constitution', type: 'passive', desc: '+50% max HP permanently', icon: 'P' },
        { id: 'war_t29b', name: 'Champions Blow', type: 'active', desc: '2.5x damage twice, heal 15% max HP', manaCost: 32, multiplier: 2.5, effect: 'champions_blow', icon: 'A' },
        { id: 'war_t29c', name: 'Battle Fortress', type: 'passive', desc: '+2% DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t29d', name: 'Unbreakable Resolve', type: 'passive', desc: 'Immune to stun, doom, and poison effects', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'war_t30a', name: 'Aspect of the Shield', type: 'passive', desc: 'DEF doubled. All damage taken reduced by 30%. Your ATK is halved. Defend fully negates damage and heals 10% max HP. The ultimate shield.', icon: 'P', milestone: true },
        { id: 'war_t30b', name: 'Judgment of Ages', type: 'active', desc: '4.8x damage. DEF added to ATK. Shatters your DEF to 0 for 3 turns. If enemy dies, DEF fully restored and doubled.', manaCost: 45, multiplier: 4.8, effect: 'judgment_ages', icon: 'A', milestone: true },
        { id: 'war_t30c', name: 'Eternal Sentinel', type: 'passive', desc: 'Every 3rd hit against you is fully negated. Heal 5% max HP per turn. ATK reduced by 30%. An unbreakable guardian.', icon: 'P', milestone: true },
        { id: 'war_t30d', name: 'Warlord Ascendant', type: 'passive', desc: 'ATK and DEF +60%. Normal attacks hit twice. All skill costs doubled. Counter-attacks deal 50% ATK. Balance of offense and defense.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'war_t31a', name: 'Adamantine Skin', type: 'passive', desc: 'Take 15 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t31b', name: 'Seismic Wave', type: 'active', desc: '2.5x damage, enemy ATK & DEF -40%', manaCost: 30, multiplier: 2.5, effect: 'seismic_wave', icon: 'A' },
        { id: 'war_t31c', name: 'Inspiring Leader', type: 'passive', desc: 'Pet damage +80%, pet takes 50% less damage', icon: 'P' },
        { id: 'war_t31d', name: 'Legendary Resolve', type: 'passive', desc: 'Heal 10% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'war_t32a', name: 'Mythic Bulwark', type: 'passive', desc: '40% chance to fully block any attack', icon: 'P' },
        { id: 'war_t32b', name: 'Executioners Judgment', type: 'active', desc: '3.5x damage, 12.0x if enemy below 30% HP', manaCost: 34, multiplier: 3.5, effect: 'exec_judgment', icon: 'A' },
        { id: 'war_t32c', name: 'Fortification Mastery', type: 'passive', desc: 'All DEF bonuses from equipment increased by 40%', icon: 'P' },
        { id: 'war_t32d', name: 'Righteous Might', type: 'passive', desc: '+30% ATK when HP is above 60%', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'war_t33a', name: 'Vanguards Presence', type: 'passive', desc: '+3% ATK and DEF per level above 50', icon: 'P' },
        { id: 'war_t33b', name: 'Avalanche', type: 'active', desc: '2.3x damage 3 times, enemy DEF -20% each hit', manaCost: 36, multiplier: 2.3, effect: 'avalanche', icon: 'A' },
        { id: 'war_t33c', name: 'Shield of Ages', type: 'passive', desc: 'Start each battle with a shield equal to 30% max HP', icon: 'P' },
        { id: 'war_t33d', name: 'Invulnerable Charge', type: 'passive', desc: 'First 3 turns of battle, take 50% less damage', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'war_t34a', name: 'Living Bastion', type: 'passive', desc: '+3 DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t34b', name: 'Cataclysmic Judgment', type: 'active', desc: '3.9x damage, DEF added to ATK, ignore 50% enemy DEF', manaCost: 38, multiplier: 3.9, effect: 'cata_judgment', icon: 'A' },
        { id: 'war_t34c', name: 'Recover', type: 'passive', desc: 'When below 40% HP, heal 15% max HP per turn', icon: 'P' },
        { id: 'war_t34d', name: 'Counter Mastery', type: 'passive', desc: 'When hit, counter-attack for 40% of your ATK', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'war_t35a', name: 'Mythic Guardian', type: 'passive', desc: 'All damage taken reduced by 50%. Heal 8% max HP/turn. ATK reduced by 40%. You cannot use skills costing >25 mana. An invincible wall of iron.', icon: 'P', milestone: true },
        { id: 'war_t35b', name: 'World Sunder', type: 'active', desc: '6.2x damage. Consumes all DEF permanently. If enemy dies, DEF is tripled from base. The ultimate sacrifice strike.', manaCost: 55, multiplier: 6.2, effect: 'world_sunder', icon: 'A', milestone: true },
        { id: 'war_t35c', name: 'Immortal Champion', type: 'passive', desc: 'Cannot be reduced below 20% HP. Max HP doubled. ATK +30%. All healing doubled. Immune to all debuffs. The perfect warrior.', icon: 'P', milestone: true },
        { id: 'war_t35d', name: 'Aspect of the Mountain', type: 'passive', desc: 'Every turn, gain +5% DEF permanently. After 10 turns, you are immune to all damage. ATK decreases by 2%/turn. Eventually nothing can touch you.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'war_t36a', name: 'Unbreakable Will', type: 'passive', desc: 'Survive lethal hits 3 times per battle at 25% HP', icon: 'P' },
        { id: 'war_t36b', name: 'Holy Retribution', type: 'active', desc: '3.1x damage, heal 30% max HP, +20% DEF for 3 turns', manaCost: 36, multiplier: 3.1, effect: 'holy_retribution', icon: 'A' },
        { id: 'war_t36c', name: 'Protective Aura', type: 'passive', desc: 'All damage taken reduced by 25%', icon: 'P' },
        { id: 'war_t36d', name: 'Supreme Valor', type: 'passive', desc: '+40% ATK when HP above 50%, +40% DEF when HP below 50%', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'war_t37a', name: 'Titanforged', type: 'passive', desc: '+50% max HP, +30% DEF, +20% ATK', icon: 'P' },
        { id: 'war_t37b', name: 'Judgment Storm', type: 'active', desc: '2.7x damage 3 times', manaCost: 40, multiplier: 2.7, effect: 'judgment_storm', icon: 'A' },
        { id: 'war_t37c', name: 'Iron Determination', type: 'passive', desc: 'Restore 8 mana whenever you take damage', icon: 'P' },
        { id: 'war_t37d', name: 'Aegis Absolute', type: 'passive', desc: '45% chance to fully block any attack', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'war_t38a', name: 'Steel Dominion', type: 'passive', desc: 'All equipment bonuses increased by 40%', icon: 'P' },
        { id: 'war_t38b', name: 'Worldbreaker Slam', type: 'active', desc: '4.6x damage, shred enemy DEF to 0, stun 1 turn', manaCost: 42, multiplier: 4.6, effect: 'worldbreaker_slam', icon: 'A' },
        { id: 'war_t38c', name: 'Regenerative Armor', type: 'passive', desc: 'Heal 12% max HP at start of each turn', icon: 'P' },
        { id: 'war_t38d', name: 'Legendary Endurance', type: 'passive', desc: 'Immune to all debuffs, take 20% less damage', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'war_t39a', name: 'Ascended Guardian', type: 'passive', desc: '+4% ATK and DEF per level above 60', icon: 'P' },
        { id: 'war_t39b', name: 'Heaven Splitter', type: 'active', desc: '3.9x damage, heal 25% damage dealt, ignore 60% DEF', manaCost: 40, multiplier: 3.9, effect: 'heaven_splitter', icon: 'A' },
        { id: 'war_t39c', name: 'Bulwark Supreme', type: 'passive', desc: 'Defend blocks 100% damage and heals 10% max HP', icon: 'P' },
        { id: 'war_t39d', name: 'Heroic Aura', type: 'passive', desc: '+50% ATK and DEF for first 5 turns of battle', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'war_t40a', name: 'Divine Guardian', type: 'passive', desc: 'All damage taken reduced by 60%. Heal 15% max HP/turn. ATK halved. You radiate an aura of invincibility. Nothing can break you.', icon: 'P', milestone: true },
        { id: 'war_t40b', name: 'Final Crusade', type: 'active', desc: '4.8x damage. DEF doubled and added to ATK. After use, DEF becomes 0 permanently. One legendary strike.', manaCost: 60, multiplier: 4.8, effect: 'final_crusade', icon: 'A', milestone: true },
        { id: 'war_t40c', name: 'Paragon of War', type: 'passive', desc: 'ATK and DEF +80%. Max HP +50%. All skill costs tripled. Normal attacks hit twice. Counter-attacks deal 60% ATK. The complete warrior.', icon: 'P', milestone: true },
        { id: 'war_t40d', name: 'Indestructible', type: 'passive', desc: 'Cannot die. HP cannot drop below 1. All healing doubled. ATK decreases by 1% per hit taken. The last man standing.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'war_t41a', name: 'Godsteel Armor', type: 'passive', desc: 'Take 20 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t41b', name: 'Decimation Strike', type: 'active', desc: '3.1x damage twice, +30% DEF for rest of fight', manaCost: 40, multiplier: 3.1, effect: 'decimation_strike', icon: 'A' },
        { id: 'war_t41c', name: 'Undying Champion', type: 'passive', desc: 'Survive lethal hits 4 times per battle at 30% HP', icon: 'P' },
        { id: 'war_t41d', name: 'War Mastery', type: 'passive', desc: 'All damage +40%, all damage taken -15%', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'war_t42a', name: 'Mythic Fortitude', type: 'passive', desc: '+80% max HP, +30% DEF', icon: 'P' },
        { id: 'war_t42b', name: 'Divine Retribution', type: 'active', desc: '3.9x damage, 15.0x if you defended last turn', manaCost: 38, multiplier: 3.9, effect: 'divine_retribution', icon: 'A' },
        { id: 'war_t42c', name: 'Legendary Guardian', type: 'passive', desc: '50% chance to fully block any attack', icon: 'P' },
        { id: 'war_t42d', name: 'Stalwart Hero', type: 'passive', desc: 'Heal 15% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'war_t43a', name: 'Armor of Ages', type: 'passive', desc: '+5 DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t43b', name: 'Apocalyptic Judgment', type: 'active', desc: '4.4x damage, enemy ATK & DEF -50%, heal 20% max HP', manaCost: 44, multiplier: 4.4, effect: 'apoc_judgment', icon: 'A' },
        { id: 'war_t43c', name: 'Eternal Shield', type: 'passive', desc: 'Start each battle with a shield equal to 50% max HP', icon: 'P' },
        { id: 'war_t43d', name: 'Weapon Legend', type: 'passive', desc: 'All equipment ATK bonuses increased by 50%', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'war_t44a', name: 'Primordial Might', type: 'passive', desc: '+5% ATK and DEF per level above 70', icon: 'P' },
        { id: 'war_t44b', name: 'Titans Judgment', type: 'active', desc: '4.6x damage, stun 2 turns, heal 30% of damage dealt', manaCost: 46, multiplier: 4.6, effect: 'titans_judgment', icon: 'A' },
        { id: 'war_t44c', name: 'Absolute Resolve', type: 'passive', desc: 'All damage taken reduced by 35%, immune to all negative effects', icon: 'P' },
        { id: 'war_t44d', name: 'Supreme Commander', type: 'passive', desc: 'Pet damage doubled, all allies (self + pet) take 30% less damage', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'war_t45a', name: 'Primordial Guardian', type: 'passive', desc: 'All damage taken reduced by 70%. Heal 20% max HP/turn. ATK reduced by 50%. Cannot use active skills. The ultimate immovable object.', icon: 'P', milestone: true },
        { id: 'war_t45b', name: 'Cataclysm of the Gods', type: 'active', desc: '6.4x damage. Consumes all DEF and 50% HP. If enemy dies, all stats tripled for rest of run. If not, DEF stays at 0.', manaCost: 70, multiplier: 6.4, effect: 'cata_gods', icon: 'A', milestone: true },
        { id: 'war_t45c', name: 'Eternal Bastion', type: 'passive', desc: 'Cannot be reduced below 30% HP by any means. Max HP tripled. ATK -30%. All healing tripled. An eternal fortress of flesh and steel.', icon: 'P', milestone: true },
        { id: 'war_t45d', name: 'Legend of the Blade', type: 'passive', desc: 'ATK and DEF +100%. Normal attacks hit 3 times at 50% damage. All skill costs quadrupled. Counter-attacks deal 80% ATK. The warrior legend.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'war_t46a', name: 'Godlike Resilience', type: 'passive', desc: 'All damage taken reduced by 40%, heal 20% max HP per turn', icon: 'P' },
        { id: 'war_t46b', name: 'Divine Annihilation', type: 'active', desc: '4.4x damage, +20.0x if defended last turn', manaCost: 46, multiplier: 4.4, effect: 'divine_annihilation', icon: 'A' },
        { id: 'war_t46c', name: 'Ascended Warrior', type: 'passive', desc: '+100% max HP, +50% DEF', icon: 'P' },
        { id: 'war_t46d', name: 'Infinite Valor', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'war_t47a', name: 'Impregnable Fortress', type: 'passive', desc: '55% chance to fully block any attack, blocked attacks heal 5% max HP', icon: 'P' },
        { id: 'war_t47b', name: 'Worldshatter', type: 'active', desc: '3.9x damage 2 times, ignore all DEF', manaCost: 48, multiplier: 3.9, effect: 'worldshatter', icon: 'A' },
        { id: 'war_t47c', name: 'Champions Aura', type: 'passive', desc: '+60% ATK and DEF permanently', icon: 'P' },
        { id: 'war_t47d', name: 'Eternal Vigor', type: 'passive', desc: 'Restore 10 mana per turn, +50% max mana', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'war_t48a', name: 'Godforged Armor', type: 'passive', desc: 'All equipment bonuses increased by 60%', icon: 'P' },
        { id: 'war_t48b', name: 'Judgment Absolute', type: 'active', desc: '5x damage, heal 40% of damage dealt, enemy ATK & DEF -60%', manaCost: 50, multiplier: 5, effect: 'judgment_absolute', icon: 'A' },
        { id: 'war_t48c', name: 'Mythic Vitality', type: 'passive', desc: '+120% max HP, heal 15% max HP per turn', icon: 'P' },
        { id: 'war_t48d', name: 'Iron God', type: 'passive', desc: 'Cannot be reduced below 15% HP by any single hit, +50% DEF', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'war_t49a', name: 'Supreme Guardian', type: 'passive', desc: '+80% ATK, +80% DEF, +80% max HP', icon: 'P' },
        { id: 'war_t49b', name: 'Divine Cataclysm', type: 'active', desc: '6.3x damage, DEF tripled and added to ATK for this hit', manaCost: 52, multiplier: 6.3, effect: 'divine_cataclysm', icon: 'A' },
        { id: 'war_t49c', name: 'Primordial Endurance', type: 'passive', desc: 'All damage taken reduced by 45%, immune to all effects', icon: 'P' },
        { id: 'war_t49d', name: 'Eternal Protector', type: 'passive', desc: 'Survive lethal hits 6 times per battle at 35% HP', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'war_t50a', name: 'God of War', type: 'passive', desc: 'ATK and DEF tripled. Max HP doubled. All healing tripled. All damage taken reduced by 40%. All skill costs quadrupled. The pinnacle of martial perfection.', icon: 'P', milestone: true },
        { id: 'war_t50b', name: 'Final Judgment Absolute', type: 'active', desc: '7x damage. DEF quintupled and added to ATK. Permanently destroys all DEF after. The ultimate sacrifice for the ultimate strike.', manaCost: 1, multiplier: 7, effect: 'final_judgment_absolute', icon: 'A', milestone: true },
        { id: 'war_t50c', name: 'Eternal Fortress', type: 'passive', desc: 'Cannot die. Cannot take more than 5% max HP per hit. Heal 20% max HP/turn. ATK decreases by 2%/turn. An eternal, slowly fading monument.', icon: 'P', milestone: true },
        { id: 'war_t50d', name: 'Primordial God of the Shield', type: 'passive', desc: 'All damage reflected back at 50%. Defend fully heals you. ATK and DEF swap values. You become the immovable object AND the unstoppable force.', icon: 'P', milestone: true },
      ]},
    ],
  },
  thief: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'thf_t1a', name: 'Shadow Step', type: 'passive', desc: '15% chance to dodge enemy attacks', icon: 'P' },
        { id: 'thf_t1b', name: 'Poison Blade', type: 'active', desc: '0.9x damage, poison enemy for 3 turns', manaCost: 8, multiplier: 0.9, effect: 'apply_poison', icon: 'A' },
        { id: 'thf_t1c', name: 'Nimble Fingers', type: 'passive', desc: '+15% gold from battles', icon: 'P' },
        { id: 'thf_t1d', name: 'Keen Edge', type: 'passive', desc: '+8% ATK permanently', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'thf_t2a', name: 'Plunder', type: 'passive', desc: '+50% gold from battles', icon: 'P' },
        { id: 'thf_t2b', name: 'Assassinate', type: 'active', desc: '0.9x damage if enemy <30% HP, else 1.5x', manaCost: 10, multiplier: 0.9, effect: 'execute', icon: 'A' },
        { id: 'thf_t2c', name: 'Quick Reflexes', type: 'passive', desc: '+5% dodge chance', icon: 'P' },
        { id: 'thf_t2d', name: 'Venom Knowledge', type: 'passive', desc: 'Poison damage increased by 25%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'thf_t3a', name: 'Evasion Mastery', type: 'passive', desc: 'Dodge chance +10% (stacks with Shadow Step)', icon: 'P' },
        { id: 'thf_t3b', name: 'Shadow Dance', type: 'active', desc: '1x damage, dodge the next enemy attack', manaCost: 15, multiplier: 1, effect: 'shadow_dance', icon: 'A' },
        { id: 'thf_t3c', name: 'Agility', type: 'passive', desc: 'Restore 2 mana each time you dodge', icon: 'P' },
        { id: 'thf_t3d', name: 'Exploit Weakness', type: 'passive', desc: '+10% damage to poisoned enemies', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'thf_t4a', name: 'Lucky Strike', type: 'passive', desc: '20% chance to deal double damage on attacks', icon: 'P' },
        { id: 'thf_t4b', name: 'Death Mark', type: 'active', desc: '1.3x damage, ignores all enemy DEF', manaCost: 18, multiplier: 1.3, effect: 'true_damage', icon: 'A' },
        { id: 'thf_t4c', name: 'Sleight of Hand', type: 'passive', desc: 'Potions heal 20% more and restore 5 mana', icon: 'P' },
        { id: 'thf_t4d', name: 'Precision', type: 'passive', desc: 'All skills ignore 15% of enemy DEF', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'thf_t5a', name: 'Quick Hands', type: 'passive', desc: 'Potions heal 30% more', icon: 'P' },
        { id: 'thf_t5b', name: 'Fan of Knives', type: 'active', desc: '1x damage, apply poison for 2 turns', manaCost: 10, multiplier: 1, effect: 'apply_poison_short', icon: 'A' },
        { id: 'thf_t5c', name: 'Lethal Focus', type: 'passive', desc: '+12% ATK, +5% critical hit chance', icon: 'P' },
        { id: 'thf_t5d', name: 'Acrobat', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'thf_t6a', name: 'Opportunist', type: 'passive', desc: '+15% damage against poisoned enemies', icon: 'P' },
        { id: 'thf_t6b', name: 'Cheap Shot', type: 'active', desc: '1x damage, reduce enemy ATK by 20%', manaCost: 10, multiplier: 1, effect: 'cheap_shot', icon: 'A' },
        { id: 'thf_t6c', name: 'Mana Thief', type: 'passive', desc: 'Restore 3 mana each time you attack', icon: 'P' },
        { id: 'thf_t6d', name: 'Silent Killer', type: 'passive', desc: '+20% damage on first attack each battle', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'thf_t7a', name: 'Slippery', type: 'passive', desc: '100% escape chance from non-boss fights', icon: 'P' },
        { id: 'thf_t7b', name: 'Garrote', type: 'active', desc: '1.2x damage, strong poison for 3 turns', manaCost: 14, multiplier: 1.2, effect: 'strong_poison_3', icon: 'A' },
        { id: 'thf_t7c', name: 'Dirty Tricks', type: 'passive', desc: 'Poison and bleed durations +1 turn', icon: 'P' },
        { id: 'thf_t7d', name: 'Fleet Footed', type: 'passive', desc: '+8% dodge, immune to slow effects', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'thf_t8a', name: 'Treasure Hunter', type: 'passive', desc: 'Better loot drop rates from monsters', icon: 'P' },
        { id: 'thf_t8b', name: 'Ambush', type: 'active', desc: '1.6x damage, ignores 50% DEF', manaCost: 16, multiplier: 1.6, effect: 'pierce_50', icon: 'A' },
        { id: 'thf_t8c', name: 'Dual Wield', type: 'passive', desc: '15% chance to attack twice', icon: 'P' },
        { id: 'thf_t8d', name: 'Assassin Training', type: 'passive', desc: '+15% damage to enemies above 70% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'thf_t9a', name: 'Blade Dance', type: 'passive', desc: '10% chance to attack twice', icon: 'P' },
        { id: 'thf_t9b', name: 'Shadowstrike', type: 'active', desc: '1.6x damage, dodge next 2 attacks', manaCost: 22, multiplier: 1.6, effect: 'shadow_dance_2', icon: 'A' },
        { id: 'thf_t9c', name: 'Toxic Mastery', type: 'passive', desc: 'Poison damage doubled', icon: 'P' },
        { id: 'thf_t9d', name: 'Shadow Cloak', type: 'passive', desc: '+15% dodge chance at full HP', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'thf_t10a', name: 'Master Thief', type: 'passive', desc: 'Double gold + guaranteed rare+ loot drops', icon: 'P' },
        { id: 'thf_t10b', name: 'Phantom Blade', type: 'active', desc: '2x true damage, dodge next attack', manaCost: 28, multiplier: 2, effect: 'phantom_blade', icon: 'A' },
        { id: 'thf_t10c', name: 'Killing Spree', type: 'passive', desc: 'After killing an enemy, start next battle with +20% ATK', icon: 'P' },
        { id: 'thf_t10d', name: 'Perfect Evasion', type: 'passive', desc: '+25% dodge chance total', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'thf_t11a', name: 'Venomcraft', type: 'passive', desc: 'Poison damage doubled, poison lasts 1 extra turn', icon: 'P' },
        { id: 'thf_t11b', name: 'Kidney Shot', type: 'active', desc: '1.3x damage, stun enemy for 1 turn', manaCost: 14, multiplier: 1.3, effect: 'stun_1', icon: 'A' },
        { id: 'thf_t11c', name: 'Windwalker', type: 'passive', desc: 'After dodging, next attack deals +25% damage', icon: 'P' },
        { id: 'thf_t11d', name: 'Resourceful', type: 'passive', desc: 'Restore 4 mana at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'thf_t12a', name: 'Cloak of Shadows', type: 'passive', desc: '+20% dodge chance (stacks with others)', icon: 'P' },
        { id: 'thf_t12b', name: 'Backstab', type: 'active', desc: '1x true damage if you dodged last turn, else 2.0x', manaCost: 18, multiplier: 1, effect: 'backstab', icon: 'A' },
        { id: 'thf_t12c', name: 'Marked Prey', type: 'passive', desc: '+20% damage to enemies below 50% HP', icon: 'P' },
        { id: 'thf_t12d', name: 'Shadowstep Mastery', type: 'passive', desc: 'Dodge also restores 3% max HP', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'thf_t13a', name: 'Swift Strikes', type: 'passive', desc: '20% chance to attack twice (stacks with Blade Dance)', icon: 'P' },
        { id: 'thf_t13b', name: 'Toxic Barrage', type: 'active', desc: '1x damage 3 times, each applies 1 turn poison', manaCost: 20, multiplier: 1, effect: 'toxic_barrage', icon: 'A' },
        { id: 'thf_t13c', name: 'Serrated Blades', type: 'passive', desc: 'Normal attacks apply 1 turn bleed', icon: 'P' },
        { id: 'thf_t13d', name: 'Ghost Step', type: 'passive', desc: 'Every 4th turn, automatically dodge all attacks', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'thf_t14a', name: 'Cutthroat', type: 'passive', desc: '+30% damage to enemies below 40% HP', icon: 'P' },
        { id: 'thf_t14b', name: 'Marked for Death', type: 'active', desc: '1.6x damage, enemy takes +25% damage for 3 turns', manaCost: 20, multiplier: 1.6, effect: 'mark_death', icon: 'A' },
        { id: 'thf_t14c', name: 'Lethality', type: 'passive', desc: 'Critical hits now deal 3x damage instead of 2x', icon: 'P' },
        { id: 'thf_t14d', name: 'Vanish', type: 'passive', desc: 'When below 25% HP, gain 30% dodge for 2 turns', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'thf_t15a', name: 'Phantom Existence', type: 'passive', desc: '50% dodge chance. You deal 30% less damage. You can never be hit by more than 2 attacks in a row. Trade power for near-invulnerability.', icon: 'P', milestone: true },
        { id: 'thf_t15b', name: 'Death Sentence', type: 'active', desc: '3.9x true damage. Can only be used once per battle. If enemy survives, they gain +50% ATK.', manaCost: 35, multiplier: 3.9, effect: 'death_sentence', icon: 'A', milestone: true },
        { id: 'thf_t15c', name: 'Venom Lord', type: 'passive', desc: 'All poison damage tripled. Poison cannot be cleansed. Your non-poison damage is halved. Let the venom do the work.', icon: 'P', milestone: true },
        { id: 'thf_t15d', name: 'Shadow Assassin', type: 'passive', desc: 'First hit each battle is 5x damage. Gain +30% dodge. ATK -15% after first hit. One perfect strike defines you.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'thf_t16a', name: 'Elusive', type: 'passive', desc: 'After dodging, your next attack deals +40% damage', icon: 'P' },
        { id: 'thf_t16b', name: 'Shadow Assault', type: 'active', desc: '2x true damage, dodge next 2 attacks', manaCost: 24, multiplier: 2, effect: 'shadow_assault', icon: 'A' },
        { id: 'thf_t16c', name: 'Deadly Precision', type: 'passive', desc: 'Skills ignore 30% of enemy DEF', icon: 'P' },
        { id: 'thf_t16d', name: 'Phantom Speed', type: 'passive', desc: '+10% dodge, +10% ATK', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'thf_t17a', name: 'Pickpocket', type: 'passive', desc: 'Triple gold from battles, +15% rare item chance', icon: 'P' },
        { id: 'thf_t17b', name: 'Hemorrhage', type: 'active', desc: '1.6x damage, strong bleed for 4 turns', manaCost: 20, multiplier: 1.6, effect: 'hemorrhage', icon: 'A' },
        { id: 'thf_t17c', name: 'Assassin Instinct', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
        { id: 'thf_t17d', name: 'Evasive Maneuvers', type: 'passive', desc: 'Take 15% less damage from all sources', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'thf_t18a', name: 'Shadowmeld', type: 'passive', desc: 'First attack each battle is guaranteed critical (3x damage)', icon: 'P' },
        { id: 'thf_t18b', name: "Assassin's Creed", type: 'active', desc: '2.3x true damage, if enemy below 25% HP instant kill (not bosses)', manaCost: 26, multiplier: 2.3, effect: 'assassin_creed', icon: 'A' },
        { id: 'thf_t18c', name: 'Blinding Speed', type: 'passive', desc: '25% chance to attack twice on any turn', icon: 'P' },
        { id: 'thf_t18d', name: 'Deathblow', type: 'passive', desc: '+40% damage to enemies below 25% HP', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'thf_t19a', name: 'Predator', type: 'passive', desc: '+3% damage for each turn the fight has lasted', icon: 'P' },
        { id: 'thf_t19b', name: 'Phantom Storm', type: 'active', desc: '1.6x true damage 2 times, dodge next attack', manaCost: 28, multiplier: 1.6, effect: 'phantom_storm', icon: 'A' },
        { id: 'thf_t19c', name: 'Blade Mastery', type: 'passive', desc: 'All damage +20% permanently', icon: 'P' },
        { id: 'thf_t19d', name: 'Untouchable', type: 'passive', desc: '+35% dodge, but max HP reduced by 10%', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'thf_t20a', name: 'Living Shadow', type: 'passive', desc: '75% dodge chance. Your ATK is halved. Normal attacks apply lethal poison (3% enemy max HP/turn). You become untouchable but rely on time to kill.', icon: 'P', milestone: true },
        { id: 'thf_t20b', name: 'Coup de Grâce', type: 'active', desc: '4.8x true damage. Usable only when enemy is below 30% HP. Miss threshold = instant death for you.', manaCost: 40, multiplier: 4.8, effect: 'coup_de_grace', icon: 'A', milestone: true },
        { id: 'thf_t20c', name: 'Dance of Blades', type: 'passive', desc: 'Attack 3 times per turn. Each attack deals 40% normal damage. Every dodge gives +10% ATK for the rest of the battle. A whirlwind.', icon: 'P', milestone: true },
        { id: 'thf_t20d', name: 'Kingpin', type: 'passive', desc: 'Quadruple gold. Guaranteed legendary loot. +30% ATK. You take +20% damage. Greed is power.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'thf_t21a', name: 'Smoke Bomb', type: 'passive', desc: 'When hit, 25% chance to gain dodge for next attack', icon: 'P' },
        { id: 'thf_t21b', name: 'Execution Chain', type: 'active', desc: '2.3x damage, if kill refund all mana spent', manaCost: 26, multiplier: 2.3, effect: 'execution_chain', icon: 'A' },
        { id: 'thf_t21c', name: 'Shadowstrike+', type: 'passive', desc: 'After dodging, next attack ignores all DEF', icon: 'P' },
        { id: 'thf_t21d', name: 'Relentless Pursuit', type: 'passive', desc: '+4% ATK each turn (stacks infinitely)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'thf_t22a', name: 'Opportunity Strikes', type: 'passive', desc: 'Lucky Strike chance increased to 35%', icon: 'P' },
        { id: 'thf_t22b', name: 'Viper Strike', type: 'active', desc: '1.8x true damage, lethal poison for 4 turns', manaCost: 24, multiplier: 1.8, effect: 'viper_strike', icon: 'A' },
        { id: 'thf_t22c', name: 'Master Assassin', type: 'passive', desc: '+25% damage, +10% dodge', icon: 'P' },
        { id: 'thf_t22d', name: 'Toxic Immunity', type: 'passive', desc: 'Immune to poison and bleed, +15% ATK', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'thf_t23a', name: 'Ghost Walk', type: 'passive', desc: 'Every 3rd turn, automatically dodge all attacks', icon: 'P' },
        { id: 'thf_t23b', name: 'Shadow Barrage', type: 'active', desc: '1.6x true damage 3 times', manaCost: 30, multiplier: 1.6, effect: 'shadow_barrage', icon: 'A' },
        { id: 'thf_t23c', name: 'Perfect Timing', type: 'passive', desc: 'Skills have 20% chance to cost no mana', icon: 'P' },
        { id: 'thf_t23d', name: 'Death From Above', type: 'passive', desc: 'First attack each battle ignores all DEF and deals +50% damage', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'thf_t24a', name: 'Lethal Precision', type: 'passive', desc: 'Critical hits (Lucky Strike) now deal 3x instead of 2x', icon: 'P' },
        { id: 'thf_t24b', name: 'Dance of Death', type: 'active', desc: '2.7x true damage, dodge next 3 attacks', manaCost: 32, multiplier: 2.7, effect: 'dance_death', icon: 'A' },
        { id: 'thf_t24c', name: 'Shadow Lord', type: 'passive', desc: '+40% dodge chance, +20% ATK', icon: 'P' },
        { id: 'thf_t24d', name: 'Eternal Venom', type: 'passive', desc: 'All poison effects last forever (never expire)', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'thf_t25a', name: 'One with Nothing', type: 'passive', desc: 'Unequip all gear — your ATK and DEF become based on your level x3. Dodge chance 60%. Every hit you land steals 5% enemy max HP. You transcend equipment.', icon: 'P', milestone: true },
        { id: 'thf_t25b', name: 'Perfect Assassination', type: 'active', desc: '6.2x true damage. Only usable at full HP. Sets you to 1 HP after use. If enemy survives, fight continues normally.', manaCost: 50, multiplier: 6.2, effect: 'perfect_assassination', icon: 'A', milestone: true },
        { id: 'thf_t25c', name: 'Eternal Shadow', type: 'passive', desc: '90% dodge. ATK reduced to 25%. Every dodge deals 5% enemy max HP as shadow damage. You cannot be hit, but you barely hit back.', icon: 'P', milestone: true },
        { id: 'thf_t25d', name: 'God of Thieves', type: 'passive', desc: '10x gold. All loot is legendary. +50% ATK. You take double damage. Crits deal 5x. Fortune favors the bold.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'thf_t26a', name: 'Shadow Mastery', type: 'passive', desc: '+3% dodge and +3% ATK per level above 40', icon: 'P' },
        { id: 'thf_t26b', name: 'Phantom Execution', type: 'active', desc: '2.7x true damage, dodge next 3 attacks', manaCost: 28, multiplier: 2.7, effect: 'phantom_exec', icon: 'A' },
        { id: 'thf_t26c', name: 'Venom Supremacy', type: 'passive', desc: 'All poison effects tripled and cannot be cleansed', icon: 'P' },
        { id: 'thf_t26d', name: 'Fortune Seeker', type: 'passive', desc: '5x gold from battles, +25% rare item chance', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'thf_t27a', name: 'Lightning Reflexes', type: 'passive', desc: '35% chance to attack twice each turn', icon: 'P' },
        { id: 'thf_t27b', name: 'Assassins Mark', type: 'active', desc: '2.7x true damage, enemy takes +40% damage for 4 turns', manaCost: 30, multiplier: 2.7, effect: 'assassins_mark', icon: 'A' },
        { id: 'thf_t27c', name: 'Shadowstep+', type: 'passive', desc: '+30% dodge chance permanently', icon: 'P' },
        { id: 'thf_t27d', name: 'Critical Mastery', type: 'passive', desc: 'Critical hits deal 4x damage instead of 2x', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'thf_t28a', name: 'Deadly Precision', type: 'passive', desc: 'All attacks ignore 40% enemy DEF', icon: 'P' },
        { id: 'thf_t28b', name: 'Shadow Annihilation', type: 'active', desc: '2.3x true damage 2 times, dodge next 2 attacks', manaCost: 32, multiplier: 2.3, effect: 'shadow_annihilation', icon: 'A' },
        { id: 'thf_t28c', name: 'Toxic Supremacy', type: 'passive', desc: 'Poison also reduces enemy ATK by 20% and DEF by 20%', icon: 'P' },
        { id: 'thf_t28d', name: 'Elusive Target', type: 'passive', desc: 'When dodging, heal 5% max HP and restore 5 mana', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'thf_t29a', name: 'Killing Machine', type: 'passive', desc: '+40% damage to enemies below 50% HP, +20% to those above', icon: 'P' },
        { id: 'thf_t29b', name: 'Oblivion Blade', type: 'active', desc: '3.1x true damage, if enemy below 30% HP instant kill (not bosses)', manaCost: 34, multiplier: 3.1, effect: 'oblivion_blade', icon: 'A' },
        { id: 'thf_t29c', name: 'Master Acrobat', type: 'passive', desc: 'Take 20% less damage from all sources, +15% dodge', icon: 'P' },
        { id: 'thf_t29d', name: 'Blade Dancer', type: 'passive', desc: 'Each dodge increases ATK by 8% (stacks 10x per battle)', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'thf_t30a', name: 'Aspect of Shadow', type: 'passive', desc: '65% dodge chance. Every dodge deals 8% enemy max HP as shadow damage. ATK reduced by 30%. You are unhittable, death by a thousand shadows.', icon: 'P', milestone: true },
        { id: 'thf_t30b', name: 'Godstrike', type: 'active', desc: '4.8x true damage. Guaranteed critical (4x). Only usable once per battle. Miss = instant death.', manaCost: 45, multiplier: 4.8, effect: 'godstrike', icon: 'A', milestone: true },
        { id: 'thf_t30c', name: 'Venom God', type: 'passive', desc: 'All poison damage quintupled. Every attack applies lethal poison. Your direct damage is reduced by 50%. Venom does all the work.', icon: 'P', milestone: true },
        { id: 'thf_t30d', name: 'Master of Fortune', type: 'passive', desc: '8x gold. All loot is epic+. Lucky Strike chance 40%. +30% ATK. You take +30% damage. The luckiest thief alive.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'thf_t31a', name: 'Phantom Agility', type: 'passive', desc: '40% chance to attack twice, dodge also triggers extra attack', icon: 'P' },
        { id: 'thf_t31b', name: 'Death Blossom', type: 'active', desc: '2x true damage 3 times, each apply 2 turn poison', manaCost: 34, multiplier: 2, effect: 'death_blossom', icon: 'A' },
        { id: 'thf_t31c', name: 'Shadow Recovery', type: 'passive', desc: 'Heal 8% max HP and restore 5 mana at start of each turn', icon: 'P' },
        { id: 'thf_t31d', name: 'Lethal Intent', type: 'passive', desc: '+50% damage to enemies below 30% HP', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'thf_t32a', name: 'Legendary Thief', type: 'passive', desc: '+40% ATK, +40% dodge chance', icon: 'P' },
        { id: 'thf_t32b', name: 'Twilight Strike', type: 'active', desc: '3.5x true damage, dodge next 4 attacks', manaCost: 36, multiplier: 3.5, effect: 'twilight_strike', icon: 'A' },
        { id: 'thf_t32c', name: 'Shadow Weave', type: 'passive', desc: 'Every 3rd turn, automatically dodge all attacks and deal 10% ATK shadow damage', icon: 'P' },
        { id: 'thf_t32d', name: 'Poison Immunity', type: 'passive', desc: 'Immune to all poison, bleed, and DoT effects, +20% ATK', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'thf_t33a', name: 'Supreme Evasion', type: 'passive', desc: '+3% dodge per level above 50', icon: 'P' },
        { id: 'thf_t33b', name: 'Shadow Maelstrom', type: 'active', desc: '2.3x true damage 3 times, each hit ignores all DEF', manaCost: 38, multiplier: 2.3, effect: 'shadow_maelstrom', icon: 'A' },
        { id: 'thf_t33c', name: 'Assassin Instincts', type: 'passive', desc: 'First attack each battle deals 5x damage and is guaranteed critical', icon: 'P' },
        { id: 'thf_t33d', name: 'Quick Silver', type: 'passive', desc: 'All skill mana costs reduced by 40%', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'thf_t34a', name: 'Shadow Strike Master', type: 'passive', desc: 'After dodging, next attack deals +80% damage and ignores all DEF', icon: 'P' },
        { id: 'thf_t34b', name: 'Void Assassination', type: 'active', desc: '3.9x true damage, if kills refund all mana + dodge 3 attacks', manaCost: 38, multiplier: 3.9, effect: 'void_assassination', icon: 'A' },
        { id: 'thf_t34c', name: 'Mythic Agility', type: 'passive', desc: '+50% ATK, +25% dodge, take 15% less damage', icon: 'P' },
        { id: 'thf_t34d', name: 'Plunderer Supreme', type: 'passive', desc: '6x gold, all items drop at rare+ quality minimum', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'thf_t35a', name: 'Mythic Shadow', type: 'passive', desc: '80% dodge. ATK reduced by 25%. Every dodge deals 10% enemy max HP. Attacks apply lethal poison. You are the shadow of death itself.', icon: 'P', milestone: true },
        { id: 'thf_t35b', name: 'Perfect Kill', type: 'active', desc: '6.2x true damage. Guaranteed critical (5x). Costs 50% current HP. If enemy survives, gain +50% dodge for rest of fight.', manaCost: 55, multiplier: 6.2, effect: 'perfect_kill', icon: 'A', milestone: true },
        { id: 'thf_t35c', name: 'Blade Typhoon', type: 'passive', desc: 'Attack 4 times per turn at 35% damage each. Every dodge grants +5% ATK permanently per battle. 50% dodge chance. A whirlwind of steel.', icon: 'P', milestone: true },
        { id: 'thf_t35d', name: 'Emperor of Thieves', type: 'passive', desc: '15x gold. All loot legendary. Crits deal 6x. +40% dodge. You take +40% damage. The richest corpse or the richest king.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'thf_t36a', name: 'Ethereal Form', type: 'passive', desc: '+50% dodge, heal 3% max HP per dodge', icon: 'P' },
        { id: 'thf_t36b', name: 'Phantasmal Barrage', type: 'active', desc: '2.7x true damage 3 times, dodge next 3 attacks', manaCost: 40, multiplier: 2.7, effect: 'phantasmal_barrage', icon: 'A' },
        { id: 'thf_t36c', name: 'Lethal Efficiency', type: 'passive', desc: 'All damage +40% permanently', icon: 'P' },
        { id: 'thf_t36d', name: 'Shadow Cloak+', type: 'passive', desc: 'Start battle invisible: dodge first 3 attacks guaranteed, +30% ATK for 3 turns', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'thf_t37a', name: 'Mythic Precision', type: 'passive', desc: 'All attacks ignore 50% enemy DEF, crits deal 5x', icon: 'P' },
        { id: 'thf_t37b', name: 'Eclipse Strike', type: 'active', desc: '4.6x true damage, enemy ATK & DEF -40%', manaCost: 42, multiplier: 4.6, effect: 'eclipse_strike', icon: 'A' },
        { id: 'thf_t37c', name: 'Poison Grandmaster', type: 'passive', desc: 'All poison damage quadrupled, poison also applies doom for 2 turns', icon: 'P' },
        { id: 'thf_t37d', name: 'Blinding Speed', type: 'passive', desc: '45% chance to attack twice, +20% ATK per dodge (max 5 stacks)', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'thf_t38a', name: 'Apex Assassin', type: 'passive', desc: '+60% damage to enemies below 50% HP, first attack each battle ignores all DEF', icon: 'P' },
        { id: 'thf_t38b', name: 'Shadow Obliteration', type: 'active', desc: '3.1x true damage 2 times, each hit guaranteed critical', manaCost: 42, multiplier: 3.1, effect: 'shadow_obliteration', icon: 'A' },
        { id: 'thf_t38c', name: 'Untouchable Legend', type: 'passive', desc: '+55% dodge, immune to all debuffs', icon: 'P' },
        { id: 'thf_t38d', name: 'Shadow Economy', type: 'passive', desc: '8x gold, +40% item drop rate, all skills cost 30% less mana', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'thf_t39a', name: 'Ascended Thief', type: 'passive', desc: '+4% ATK and dodge per level above 60', icon: 'P' },
        { id: 'thf_t39b', name: 'Annihilation Dance', type: 'active', desc: '2.7x true damage 3 times, dodge all attacks for 2 turns', manaCost: 44, multiplier: 2.7, effect: 'annihilation_dance', icon: 'A' },
        { id: 'thf_t39c', name: 'Shadow Regeneration', type: 'passive', desc: 'Heal 10% max HP per turn, restore 8 mana per dodge', icon: 'P' },
        { id: 'thf_t39d', name: 'Legendary Lethality', type: 'passive', desc: '+70% ATK, all attacks have 30% chance to critically strike', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'thf_t40a', name: 'Divine Shadow', type: 'passive', desc: '85% dodge. Every dodge deals 12% enemy max HP. ATK reduced by 20%. Heal 5% max HP per dodge. You exist between worlds.', icon: 'P', milestone: true },
        { id: 'thf_t40b', name: 'Final Assassination', type: 'active', desc: '4.8x true damage. Guaranteed critical (6x). Costs all mana and 50% HP. If enemy dies, fully restore everything.', manaCost: 60, multiplier: 4.8, effect: 'final_assassination', icon: 'A', milestone: true },
        { id: 'thf_t40c', name: 'Shadow Sovereign', type: 'passive', desc: 'Attack 5 times per turn at 30% damage. Every dodge grants +3% ATK permanently. 60% dodge. Crits deal 5x. A blizzard of blades.', icon: 'P', milestone: true },
        { id: 'thf_t40d', name: 'Lord of Shadows', type: 'passive', desc: 'All damage doubled. +60% dodge. Poison applies on every hit (5 turns). You take +30% damage. Cannot use potions. Pure lethal efficiency.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'thf_t41a', name: 'Godlike Reflexes', type: 'passive', desc: '+5% dodge per level above 60, dodge heals 3% max HP', icon: 'P' },
        { id: 'thf_t41b', name: 'Phantom Annihilator', type: 'active', desc: '3.9x true damage 2 times, guaranteed crits, dodge 4 attacks', manaCost: 44, multiplier: 3.9, effect: 'phantom_annihilator', icon: 'A' },
        { id: 'thf_t41c', name: 'Shadow Perfection', type: 'passive', desc: 'All damage +50%, all dodge +30%', icon: 'P' },
        { id: 'thf_t41d', name: 'Eternal Poison', type: 'passive', desc: 'All attacks apply poison (never expires), poison damage quintupled', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'thf_t42a', name: 'Ultimate Evasion', type: 'passive', desc: '60% dodge chance, cannot be reduced below 20% HP by a single hit', icon: 'P' },
        { id: 'thf_t42b', name: 'Shadow Cataclysm', type: 'active', desc: '3.1x true damage 3 times, each apply lethal poison', manaCost: 46, multiplier: 3.1, effect: 'shadow_cataclysm', icon: 'A' },
        { id: 'thf_t42c', name: 'Critical God', type: 'passive', desc: 'Lucky Strike chance 50%, crits deal 5x damage', icon: 'P' },
        { id: 'thf_t42d', name: 'Shadow Vigor', type: 'passive', desc: 'Heal 12% max HP per turn, restore 10 mana per turn', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'thf_t43a', name: 'Ethereal Assassin', type: 'passive', desc: 'All equipment bonuses increased by 40%, +30% ATK', icon: 'P' },
        { id: 'thf_t43b', name: 'Doom Blade', type: 'active', desc: '4.4x true damage, apply doom for 5 turns, dodge next 3 attacks', manaCost: 44, multiplier: 4.4, effect: 'doom_blade', icon: 'A' },
        { id: 'thf_t43c', name: 'Spectral Agility', type: 'passive', desc: '50% chance to attack twice, each attack has 30% crit chance', icon: 'P' },
        { id: 'thf_t43d', name: 'Grand Larceny', type: 'passive', desc: '10x gold, all loot epic+, +50% item drop rate', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'thf_t44a', name: 'Shadow Transcendence', type: 'passive', desc: '+70% dodge chance, dodge also restores 5% max HP and 5 mana', icon: 'P' },
        { id: 'thf_t44b', name: 'Eternal Night', type: 'active', desc: '3.9x true damage 2 times, guaranteed crits, enemy ATK & DEF -50%', manaCost: 46, multiplier: 3.9, effect: 'eternal_night', icon: 'A' },
        { id: 'thf_t44c', name: 'Primal Instinct', type: 'passive', desc: '+80% ATK, immune to all negative effects', icon: 'P' },
        { id: 'thf_t44d', name: 'Invisible Death', type: 'passive', desc: 'First 3 attacks each battle deal 3x damage and ignore all DEF', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'thf_t45a', name: 'Primordial Shadow', type: 'passive', desc: '90% dodge. Every dodge deals 15% enemy max HP. ATK halved. Heal 8% max HP per dodge. You are the darkness between heartbeats.', icon: 'P', milestone: true },
        { id: 'thf_t45b', name: 'Absolute Kill', type: 'active', desc: '6.4x true damage. Guaranteed critical (7x). Costs 80% current HP. If enemy survives at <5% HP, instant kill. The perfect strike.', manaCost: 70, multiplier: 6.4, effect: 'absolute_kill', icon: 'A', milestone: true },
        { id: 'thf_t45c', name: 'Eternal Blade Dance', type: 'passive', desc: 'Attack 6 times per turn at 25% damage. 70% dodge. Every dodge grants +4% ATK permanently. Crits deal 6x. An endless storm of steel.', icon: 'P', milestone: true },
        { id: 'thf_t45d', name: 'Primordial Fortune', type: 'passive', desc: '20x gold. All loot legendary. Crits deal 8x. +50% ATK. +60% dodge. You take double damage. The ultimate risk-reward existence.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'thf_t46a', name: 'Godlike Agility', type: 'passive', desc: '+80% dodge, +50% ATK, heal 5% max HP per dodge', icon: 'P' },
        { id: 'thf_t46b', name: 'Shadow Apocalypse', type: 'active', desc: '3.9x true damage 3 times, guaranteed crits', manaCost: 48, multiplier: 3.9, effect: 'shadow_apocalypse', icon: 'A' },
        { id: 'thf_t46c', name: 'Infinite Precision', type: 'passive', desc: 'All attacks ignore all enemy DEF, +40% ATK', icon: 'P' },
        { id: 'thf_t46d', name: 'Ascended Assassin', type: 'passive', desc: 'All skill damage +60%, all skill costs -40%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'thf_t47a', name: 'Supreme Shadow', type: 'passive', desc: '55% chance to attack twice, crits deal 6x, +40% ATK', icon: 'P' },
        { id: 'thf_t47b', name: 'Void Strike', type: 'active', desc: '5x true damage, guaranteed critical, dodge 5 attacks', manaCost: 50, multiplier: 5, effect: 'void_strike', icon: 'A' },
        { id: 'thf_t47c', name: 'Master of All Trades', type: 'passive', desc: '+60% ATK, +60% dodge, +30% max HP', icon: 'P' },
        { id: 'thf_t47d', name: 'Eternal Evasion', type: 'passive', desc: 'Immune to all damage for first 3 turns of battle, +30% ATK', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'thf_t48a', name: 'Shadow Legend', type: 'passive', desc: '+100% ATK, +70% dodge, all attacks apply lethal poison', icon: 'P' },
        { id: 'thf_t48b', name: 'Oblivion Assassination', type: 'active', desc: '4.6x true damage 2 times, guaranteed crits (6x), dodge all for 2 turns', manaCost: 50, multiplier: 4.6, effect: 'oblivion_assassination', icon: 'A' },
        { id: 'thf_t48c', name: 'Phantom God', type: 'passive', desc: 'All equipment bonuses increased by 60%, +50% dodge', icon: 'P' },
        { id: 'thf_t48d', name: 'Primordial Agility', type: 'passive', desc: 'Heal 15% max HP per turn, restore 12 mana per turn', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'thf_t49a', name: 'Mythic Assassin', type: 'passive', desc: '+100% ATK, +80% dodge, all attacks guaranteed critical', icon: 'P' },
        { id: 'thf_t49b', name: 'End of Shadow', type: 'active', desc: '6.3x true damage, guaranteed critical (7x), dodge all attacks for 3 turns', manaCost: 52, multiplier: 6.3, effect: 'end_shadow', icon: 'A' },
        { id: 'thf_t49c', name: 'Absolute Stealth', type: 'passive', desc: '+90% dodge, +60% ATK, immune to all negative effects', icon: 'P' },
        { id: 'thf_t49d', name: 'Infinite Fortune', type: 'passive', desc: '15x gold, all loot legendary, +80% item drop rate', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'thf_t50a', name: 'God of Shadows', type: 'passive', desc: '95% dodge. Every dodge deals 20% enemy max HP. Heal 10% max HP per dodge. ATK halved. You are shadow incarnate — untouchable, inevitable.', icon: 'P', milestone: true },
        { id: 'thf_t50b', name: 'Final Shadow', type: 'active', desc: '7x true damage. Guaranteed critical (8x). Costs all HP except 1 and all mana. If enemy dies, fully restore. The ultimate assassination.', manaCost: 1, multiplier: 7, effect: 'final_shadow', icon: 'A', milestone: true },
        { id: 'thf_t50c', name: 'Eternal Phantom', type: 'passive', desc: 'Attack 8 times per turn at 20% damage. 80% dodge. Crits deal 8x. Every dodge heals 5%. An infinite cascade of phantom blades.', icon: 'P', milestone: true },
        { id: 'thf_t50d', name: 'Primordial God of Fortune', type: 'passive', desc: '50x gold. All loot legendary. Crits deal 10x. Lucky Strike 60%. +100% ATK. You take triple damage. The ultimate gambler.', icon: 'P', milestone: true },
      ]},
    ],
  },
  mage: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'mag_t1a', name: 'Mana Shield', type: 'passive', desc: '20% of damage taken is absorbed by mana', icon: 'P' },
        { id: 'mag_t1b', name: 'Fireball', type: 'active', desc: '1x true damage (ignores DEF)', manaCost: 10, multiplier: 1, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t1c', name: 'Arcane Focus', type: 'passive', desc: '+10% skill damage', icon: 'P' },
        { id: 'mag_t1d', name: 'Mana Flow', type: 'passive', desc: 'Restore 2 mana at start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'mag_t2a', name: 'Spell Echo', type: 'passive', desc: '20% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t2b', name: 'Ice Lance', type: 'active', desc: '0.8x damage, reduce enemy ATK by 20%', manaCost: 10, multiplier: 0.8, effect: 'freeze', icon: 'A' },
        { id: 'mag_t2c', name: 'Frost Armor', type: 'passive', desc: 'Take 8% less damage from all attacks', icon: 'P' },
        { id: 'mag_t2d', name: 'Mana Efficiency', type: 'passive', desc: 'All skills cost 10% less mana', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'mag_t3a', name: 'Arcane Overflow', type: 'passive', desc: '+1 ATK for every 10 current mana', icon: 'P' },
        { id: 'mag_t3b', name: 'Meteor', type: 'active', desc: '1.6x true damage (ignores DEF)', manaCost: 20, multiplier: 1.6, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t3c', name: 'Elemental Affinity', type: 'passive', desc: '+15% ATK permanently', icon: 'P' },
        { id: 'mag_t3d', name: 'Arcane Regeneration', type: 'passive', desc: 'Restore 3% max mana each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'mag_t4a', name: 'Mana Surge', type: 'passive', desc: 'All skills cost 25% less mana', icon: 'P' },
        { id: 'mag_t4b', name: 'Chain Lightning', type: 'active', desc: '1.3x damage, reduce enemy DEF by 25%', manaCost: 16, multiplier: 1.3, effect: 'chain_lightning', icon: 'A' },
        { id: 'mag_t4c', name: 'Spell Shield', type: 'passive', desc: '+10% max mana, +5% DEF', icon: 'P' },
        { id: 'mag_t4d', name: 'Burning Soul', type: 'passive', desc: 'After using a skill, deal 5% ATK as bonus damage on next attack', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'mag_t5a', name: 'Meditation', type: 'passive', desc: 'Restore 4 mana at the start of each turn', icon: 'P' },
        { id: 'mag_t5b', name: 'Frost Nova', type: 'active', desc: '1x damage, enemy ATK -30%', manaCost: 14, multiplier: 1, effect: 'frost_nova', icon: 'A' },
        { id: 'mag_t5c', name: 'Arcane Brilliance', type: 'passive', desc: '+20% max mana', icon: 'P' },
        { id: 'mag_t5d', name: 'Elemental Ward', type: 'passive', desc: 'Take 10% less damage, +5% max HP', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'mag_t6a', name: 'Elemental Mastery', type: 'passive', desc: 'All skill damage +20%', icon: 'P' },
        { id: 'mag_t6b', name: 'Lightning Bolt', type: 'active', desc: '1.2x true damage', manaCost: 14, multiplier: 1.2, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t6c', name: 'Mana Harvest', type: 'passive', desc: 'Restore 5 mana when you deal damage with a skill', icon: 'P' },
        { id: 'mag_t6d', name: 'Crystallize', type: 'passive', desc: 'When defending, gain a shield equal to 10% max mana', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'mag_t7a', name: 'Arcane Barrier', type: 'passive', desc: 'Defend also restores 10 mana', icon: 'P' },
        { id: 'mag_t7b', name: 'Blizzard', type: 'active', desc: '1x damage, enemy ATK & DEF -15%', manaCost: 16, multiplier: 1, effect: 'blizzard', icon: 'A' },
        { id: 'mag_t7c', name: 'Arcane Potency', type: 'passive', desc: 'Skill damage scales with 5% of current mana', icon: 'P' },
        { id: 'mag_t7d', name: 'Enchanted Armor', type: 'passive', desc: '+15% DEF, equipment DEF bonuses +10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'mag_t8a', name: 'Spellweaver', type: 'passive', desc: 'After using a skill, next attack deals +50% damage', icon: 'P' },
        { id: 'mag_t8b', name: 'Pyroblast', type: 'active', desc: '1.6x true damage', manaCost: 22, multiplier: 1.6, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t8c', name: 'Mana Mastery', type: 'passive', desc: '+15% max mana, restore 3 mana per turn', icon: 'P' },
        { id: 'mag_t8d', name: 'Empowered Spells', type: 'passive', desc: 'Skills that cost >15 mana deal +25% damage', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'mag_t9a', name: 'Mana Regeneration', type: 'passive', desc: 'Restore 8% max mana each turn', icon: 'P' },
        { id: 'mag_t9b', name: 'Arcane Torrent', type: 'active', desc: '1.6x damage, restore 50% mana spent', manaCost: 20, multiplier: 1.6, effect: 'mana_refund', icon: 'A' },
        { id: 'mag_t9c', name: 'Spell Penetration', type: 'passive', desc: 'All skills ignore 20% of enemy DEF', icon: 'P' },
        { id: 'mag_t9d', name: 'Arcane Resilience', type: 'passive', desc: '+12% max HP, immune to mana drain effects', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'mag_t10a', name: 'Transcendence', type: 'passive', desc: 'Mana Shield absorbs 40% instead of 20%', icon: 'P' },
        { id: 'mag_t10b', name: 'Cataclysm', type: 'active', desc: '2.3x true damage', manaCost: 30, multiplier: 2.3, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t10c', name: 'Spell Lord', type: 'passive', desc: 'All skill damage +25%, +10% max mana', icon: 'P' },
        { id: 'mag_t10d', name: 'Living Mana', type: 'passive', desc: 'Heal 3% max HP when you spend mana', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'mag_t11a', name: 'Arcane Intellect', type: 'passive', desc: '+2 ATK per 10 max mana', icon: 'P' },
        { id: 'mag_t11b', name: 'Inferno', type: 'active', desc: '1.6x true damage, enemy ATK -20%', manaCost: 18, multiplier: 1.6, effect: 'inferno', icon: 'A' },
        { id: 'mag_t11c', name: 'Mana Font', type: 'passive', desc: '+25% max mana', icon: 'P' },
        { id: 'mag_t11d', name: 'Elemental Fury', type: 'passive', desc: 'Skills have 15% chance to deal double damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'mag_t12a', name: 'Mana Well', type: 'passive', desc: '+30% max mana', icon: 'P' },
        { id: 'mag_t12b', name: 'Arcane Missiles', type: 'active', desc: '1x true damage 3 times', manaCost: 20, multiplier: 1, effect: 'arcane_missiles', icon: 'A' },
        { id: 'mag_t12c', name: 'Runic Power', type: 'passive', desc: '+2% skill damage per level above 15', icon: 'P' },
        { id: 'mag_t12d', name: 'Elemental Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 15% max mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'mag_t13a', name: 'Sorcerous Shield', type: 'passive', desc: 'Start battle with a shield equal to 20% max mana', icon: 'P' },
        { id: 'mag_t13b', name: 'Comet', type: 'active', desc: '2x true damage, reduce enemy DEF by 40%', manaCost: 24, multiplier: 2, effect: 'comet', icon: 'A' },
        { id: 'mag_t13c', name: 'Volatile Magic', type: 'passive', desc: 'Skills have 25% chance to deal +50% damage', icon: 'P' },
        { id: 'mag_t13d', name: 'Astral Sight', type: 'passive', desc: 'All enemy stats visible, +10% damage to all enemies', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'mag_t14a', name: 'Spell Mastery', type: 'passive', desc: 'All skill damage +30%', icon: 'P' },
        { id: 'mag_t14b', name: 'Void Bolt', type: 'active', desc: '1.8x true damage, drain 10% enemy max HP as mana', manaCost: 22, multiplier: 1.8, effect: 'void_bolt', icon: 'A' },
        { id: 'mag_t14c', name: 'Deep Reserves', type: 'passive', desc: '+40% max mana, restore 5% max mana per turn', icon: 'P' },
        { id: 'mag_t14d', name: 'Arcane Supremacy', type: 'passive', desc: 'Equipment ATK bonuses increased by 25%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'mag_t15a', name: 'Archmage', type: 'passive', desc: 'All skills cost 50% less mana. Your max HP is halved permanently. Mana becomes your true resource — HP is just a suggestion.', icon: 'P', milestone: true },
        { id: 'mag_t15b', name: 'Supernova', type: 'active', desc: '3.5x true damage. Drains ALL remaining mana. Deals bonus damage equal to mana spent.', manaCost: 1, multiplier: 3.5, effect: 'supernova', icon: 'A', milestone: true },
        { id: 'mag_t15c', name: 'Spell Singularity', type: 'passive', desc: 'Every spell you cast increases all future spell damage by 3% (stacks infinitely). Mana costs increase by 1 each cast. Infinite potential.', icon: 'P', milestone: true },
        { id: 'mag_t15d', name: 'Mana Incarnate', type: 'passive', desc: 'Your mana pool doubles. All damage scales with current mana (1% per 5 mana). At 0 mana you deal 0 damage. Mana IS your power.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'mag_t16a', name: 'Temporal Shield', type: 'passive', desc: 'After taking damage, heal 50% of it over 2 turns', icon: 'P' },
        { id: 'mag_t16b', name: 'Disintegrate', type: 'active', desc: '2.5x true damage, ignore all DEF', manaCost: 26, multiplier: 2.5, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t16c', name: 'Feedback Loop', type: 'passive', desc: 'When a skill deals double damage (Spell Echo), restore all mana spent', icon: 'P' },
        { id: 'mag_t16d', name: 'Arcane Fortification', type: 'passive', desc: '+20% DEF, +20% max HP', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'mag_t17a', name: 'Leyline Tap', type: 'passive', desc: 'Restore 12% max mana each turn', icon: 'P' },
        { id: 'mag_t17b', name: 'Apocalyptic Fire', type: 'active', desc: '2.3x true damage, enemy burns for 4% max HP/turn for 3 turns', manaCost: 24, multiplier: 2.3, effect: 'apoc_fire', icon: 'A' },
        { id: 'mag_t17c', name: 'Spellfire', type: 'passive', desc: 'Normal attacks deal true damage (ignore DEF)', icon: 'P' },
        { id: 'mag_t17d', name: 'Mana Conduit', type: 'passive', desc: '+3 ATK per 10 current mana', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'mag_t18a', name: 'Spell Echo+', type: 'passive', desc: '35% chance for skills to deal double damage (replaces Spell Echo)', icon: 'P' },
        { id: 'mag_t18b', name: 'Gravity Well', type: 'active', desc: '1.8x true damage, stun enemy 1 turn, ATK & DEF -20%', manaCost: 24, multiplier: 1.8, effect: 'gravity_well', icon: 'A' },
        { id: 'mag_t18c', name: 'Arcane Torrent+', type: 'passive', desc: 'All skill damage +35%', icon: 'P' },
        { id: 'mag_t18d', name: 'Counterspell', type: 'passive', desc: 'Immune to enemy debuffs and ATK reductions', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'mag_t19a', name: 'Overcharge', type: 'passive', desc: 'When mana is above 75%, all damage +25%', icon: 'P' },
        { id: 'mag_t19b', name: 'Starfall', type: 'active', desc: '1.8x true damage 2 times', manaCost: 30, multiplier: 1.8, effect: 'double_true', icon: 'A' },
        { id: 'mag_t19c', name: 'Infinite Mana', type: 'passive', desc: '+50% max mana, restore 8% max mana per turn', icon: 'P' },
        { id: 'mag_t19d', name: 'Devastation', type: 'passive', desc: 'Skills that cost >25 mana deal +40% damage', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'mag_t20a', name: 'Lich Ascension', type: 'passive', desc: 'Your HP and Mana pools merge into one Arcane HP pool. Spells cost HP. Your total pool is HP + Mana combined. All healing works on this pool.', icon: 'P', milestone: true },
        { id: 'mag_t20b', name: 'Singularity', type: 'active', desc: '4.4x true damage. After casting, you cannot cast spells for 2 turns (cooldown).', manaCost: 45, multiplier: 4.4, effect: 'singularity', icon: 'A', milestone: true },
        { id: 'mag_t20c', name: 'Living Spellbook', type: 'passive', desc: 'All active skills cost 0 mana. Your max HP is reduced by 60%. Every spell cast costs 5% current HP instead. Glass cannon perfected.', icon: 'P', milestone: true },
        { id: 'mag_t20d', name: 'Arcane Godhood', type: 'passive', desc: 'All skill damage doubled. Max mana tripled. Cannot use normal attacks. Defending restores 20% mana. Pure spellcaster.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'mag_t21a', name: 'Arcane Attunement', type: 'passive', desc: '+1% skill damage per player level', icon: 'P' },
        { id: 'mag_t21b', name: 'Chain Destruction', type: 'active', desc: '2x true damage, reduce enemy DEF by 50%', manaCost: 26, multiplier: 2, effect: 'chain_destruction', icon: 'A' },
        { id: 'mag_t21c', name: 'Spell Cascade', type: 'passive', desc: 'After using a skill, 30% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t21d', name: 'Mana Absorption', type: 'passive', desc: '15% of damage taken is converted to mana', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'mag_t22a', name: 'Spell Absorption', type: 'passive', desc: '10% of damage taken is converted to mana', icon: 'P' },
        { id: 'mag_t22b', name: 'Dimensional Rift', type: 'active', desc: '2.7x true damage, dodge next attack', manaCost: 28, multiplier: 2.7, effect: 'dim_rift', icon: 'A' },
        { id: 'mag_t22c', name: 'Arcane Overload', type: 'passive', desc: 'All damage +30%, take 10% more damage', icon: 'P' },
        { id: 'mag_t22d', name: 'Mana Shield+', type: 'passive', desc: 'Mana Shield now absorbs 50% of damage', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'mag_t23a', name: 'Infinite Power', type: 'passive', desc: 'Skills that cost mana also deal bonus damage equal to mana spent', icon: 'P' },
        { id: 'mag_t23b', name: 'Cosmic Ray', type: 'active', desc: '2.7x true damage', manaCost: 32, multiplier: 2.7, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t23c', name: 'Arcane Perfection', type: 'passive', desc: 'Skills have 25% chance to cost no mana', icon: 'P' },
        { id: 'mag_t23d', name: 'Spellstorm', type: 'passive', desc: 'Each skill used in battle increases next skill damage by 10%', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'mag_t24a', name: 'Astral Form', type: 'passive', desc: 'Mana Shield absorbs 60% of damage (replaces Transcendence)', icon: 'P' },
        { id: 'mag_t24b', name: 'Oblivion Beam', type: 'active', desc: '3.1x true damage, costs 20% current HP too', manaCost: 34, multiplier: 3.1, effect: 'oblivion_beam', icon: 'A' },
        { id: 'mag_t24c', name: 'Endless Wisdom', type: 'passive', desc: '+3% ATK per level above 30', icon: 'P' },
        { id: 'mag_t24d', name: 'Supreme Intellect', type: 'passive', desc: '+50% max mana, all skill damage +20%', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'mag_t25a', name: 'Reality Weaver', type: 'passive', desc: 'Each spell you cast permanently increases your ATK by 2 for the rest of the run. Mana costs doubled. Your power grows infinitely but each spell is a gamble.', icon: 'P', milestone: true },
        { id: 'mag_t25b', name: 'Big Bang', type: 'active', desc: '4.8x true damage. Costs ALL mana and 50% HP. 1 use per battle. The ultimate gambit.', manaCost: 1, multiplier: 4.8, effect: 'big_bang', icon: 'A', milestone: true },
        { id: 'mag_t25c', name: 'Omniscience', type: 'passive', desc: 'All skills deal true damage. All skills cost 75% less. Your max HP is reduced to 1. One hit kills you. Absolute power at absolute risk.', icon: 'P', milestone: true },
        { id: 'mag_t25d', name: 'Spell Weaver Supreme', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 1%. Normal attacks are replaced by free 2.0x true damage spells. You become magic itself.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'mag_t26a', name: 'Arcane Ascendancy', type: 'passive', desc: '+3% skill damage per level above 40', icon: 'P' },
        { id: 'mag_t26b', name: 'Plasma Bolt', type: 'active', desc: '2.7x true damage, reduce enemy DEF by 50%', manaCost: 28, multiplier: 2.7, effect: 'plasma_bolt', icon: 'A' },
        { id: 'mag_t26c', name: 'Mana Wellspring', type: 'passive', desc: '+60% max mana, restore 10% max mana per turn', icon: 'P' },
        { id: 'mag_t26d', name: 'Spell Amplification', type: 'passive', desc: 'All skill damage +40%', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'mag_t27a', name: 'Arcane Storm', type: 'passive', desc: '40% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t27b', name: 'Cosmic Blast', type: 'active', desc: '2.7x true damage, enemy ATK & DEF -30%', manaCost: 30, multiplier: 2.7, effect: 'cosmic_blast', icon: 'A' },
        { id: 'mag_t27c', name: 'Mana Shield Supreme', type: 'passive', desc: 'Mana Shield absorbs 70% of damage', icon: 'P' },
        { id: 'mag_t27d', name: 'Spell Efficiency', type: 'passive', desc: 'All skill costs reduced by 35%', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'mag_t28a', name: 'Dimensional Mastery', type: 'passive', desc: 'After using a skill, next skill deals +60% damage', icon: 'P' },
        { id: 'mag_t28b', name: 'Void Storm', type: 'active', desc: '2.3x true damage 2 times, drain 15% enemy max HP as mana', manaCost: 32, multiplier: 2.3, effect: 'void_storm', icon: 'A' },
        { id: 'mag_t28c', name: 'Arcane Vitality', type: 'passive', desc: 'Heal 5% max HP when you spend mana, +20% max HP', icon: 'P' },
        { id: 'mag_t28d', name: 'Elemental Supremacy', type: 'passive', desc: 'All skills ignore 40% enemy DEF', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'mag_t29a', name: 'Spell Cascade+', type: 'passive', desc: 'After using a skill, 40% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t29b', name: 'Annihilation Beam', type: 'active', desc: '3.1x true damage, ignore all DEF', manaCost: 34, multiplier: 3.1, effect: 'annihilation_beam', icon: 'A' },
        { id: 'mag_t29c', name: 'Living Arcana', type: 'passive', desc: '+4 ATK per 10 current mana, +30% max mana', icon: 'P' },
        { id: 'mag_t29d', name: 'Temporal Mastery', type: 'passive', desc: 'After taking damage, heal 75% of it over 2 turns', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'mag_t30a', name: 'Aspect of the Arcane', type: 'passive', desc: 'All skill damage doubled. Max mana quadrupled. All skill costs +50%. Your max HP is halved. Pure arcane devastation.', icon: 'P', milestone: true },
        { id: 'mag_t30b', name: 'Genesis', type: 'active', desc: '4.8x true damage. Restores all mana after cast. Can only be used once per battle. Drains 30% max HP.', manaCost: 45, multiplier: 4.8, effect: 'genesis', icon: 'A', milestone: true },
        { id: 'mag_t30c', name: 'Arcane Singularity', type: 'passive', desc: 'Every spell increases all future spell damage by 5% (stacks infinitely). Mana costs increase by 2 each cast. Limitless potential at limitless cost.', icon: 'P', milestone: true },
        { id: 'mag_t30d', name: 'Mana God', type: 'passive', desc: 'Mana pool quintupled. All damage scales with current mana (2% per 5 mana). At 0 mana you deal 0 damage. Mana regeneration doubled.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'mag_t31a', name: 'Spellfire Mastery', type: 'passive', desc: 'Normal attacks deal true damage and deal +50% damage', icon: 'P' },
        { id: 'mag_t31b', name: 'Arcane Devastation', type: 'active', desc: '2.7x true damage 2 times, restore 40% mana spent', manaCost: 32, multiplier: 2.7, effect: 'arcane_devastation', icon: 'A' },
        { id: 'mag_t31c', name: 'Supreme Intellect+', type: 'passive', desc: '+80% max mana, all skill damage +30%', icon: 'P' },
        { id: 'mag_t31d', name: 'Arcane Regeneration+', type: 'passive', desc: 'Restore 15% max mana each turn, heal 5% max HP per turn', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'mag_t32a', name: 'Legendary Sorcerer', type: 'passive', desc: 'All skill damage +50%, skills have 30% chance to deal double damage', icon: 'P' },
        { id: 'mag_t32b', name: 'Dimensional Collapse', type: 'active', desc: '3.5x true damage, stun 2 turns, enemy ATK & DEF -40%', manaCost: 36, multiplier: 3.5, effect: 'dim_collapse', icon: 'A' },
        { id: 'mag_t32c', name: 'Mana Conversion', type: 'passive', desc: '25% of damage taken converted to mana', icon: 'P' },
        { id: 'mag_t32d', name: 'Crystalline Shield', type: 'passive', desc: 'Start each battle with shield equal to 30% max mana', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'mag_t33a', name: 'Arcane Supremacy+', type: 'passive', desc: '+3% skill damage per level above 50', icon: 'P' },
        { id: 'mag_t33b', name: 'Starburst', type: 'active', desc: '2.3x true damage 3 times', manaCost: 36, multiplier: 2.3, effect: 'starburst', icon: 'A' },
        { id: 'mag_t33c', name: 'Infinite Wisdom', type: 'passive', desc: '+100% max mana, all skill costs -25%', icon: 'P' },
        { id: 'mag_t33d', name: 'Elemental Lord', type: 'passive', desc: 'All damage +40%, immune to all debuffs', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'mag_t34a', name: 'Leyline Master', type: 'passive', desc: 'Restore 20% max mana each turn', icon: 'P' },
        { id: 'mag_t34b', name: 'Celestial Ray', type: 'active', desc: '3.9x true damage, heal 20% max HP', manaCost: 38, multiplier: 3.9, effect: 'celestial_ray', icon: 'A' },
        { id: 'mag_t34c', name: 'Arcane Perfection+', type: 'passive', desc: 'Skills have 35% chance to cost no mana', icon: 'P' },
        { id: 'mag_t34d', name: 'Empowered Barrier', type: 'passive', desc: 'Mana Shield absorbs 80% of damage, +40% max mana', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'mag_t35a', name: 'Mythic Archmage', type: 'passive', desc: 'All skills cost 60% less mana. All skill damage tripled. Max HP reduced by 70%. One touch of magic annihilates, but a breeze could kill you.', icon: 'P', milestone: true },
        { id: 'mag_t35b', name: 'Cosmic Annihilation', type: 'active', desc: '6.2x true damage. Drains ALL mana. Bonus damage equal to 200% of mana spent. The power of a dying star.', manaCost: 1, multiplier: 6.2, effect: 'cosmic_annihilation', icon: 'A', milestone: true },
        { id: 'mag_t35c', name: 'Arcane Godhood+', type: 'passive', desc: 'All skill damage tripled. Max mana quintupled. Cannot use normal attacks. Defending restores 30% mana. All healing tripled. Supreme spellcaster.', icon: 'P', milestone: true },
        { id: 'mag_t35d', name: 'Living Spell', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 2%. Normal attacks replaced by 3.0x true damage spells. Mana costs +3 per cast. You ARE magic.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'mag_t36a', name: 'Spell Annihilation', type: 'passive', desc: 'All skill damage +60%, skills ignore all DEF', icon: 'P' },
        { id: 'mag_t36b', name: 'Arcane Tempest', type: 'active', desc: '2.7x true damage 2 times, restore 50% mana spent', manaCost: 38, multiplier: 2.7, effect: 'arcane_tempest', icon: 'A' },
        { id: 'mag_t36c', name: 'Mana Fortress', type: 'passive', desc: '+120% max mana, +30% max HP, +20% DEF', icon: 'P' },
        { id: 'mag_t36d', name: 'Spell Echo Supreme', type: 'passive', desc: '50% chance for skills to deal double damage', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'mag_t37a', name: 'Cosmic Intellect', type: 'passive', desc: '+5 ATK per 10 current mana, +50% max mana', icon: 'P' },
        { id: 'mag_t37b', name: 'Galactic Storm', type: 'active', desc: '2.7x true damage 3 times, enemy ATK & DEF -40%', manaCost: 42, multiplier: 2.7, effect: 'galactic_storm', icon: 'A' },
        { id: 'mag_t37c', name: 'Mana Overflow', type: 'passive', desc: 'When mana is above 50%, all damage +40%. When above 80%, all damage +80%', icon: 'P' },
        { id: 'mag_t37d', name: 'Arcane Recovery', type: 'passive', desc: 'Heal 8% max HP per turn, restore 15% max mana per turn', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'mag_t38a', name: 'Celestial Power', type: 'passive', desc: 'All equipment bonuses increased by 40%, +50% skill damage', icon: 'P' },
        { id: 'mag_t38b', name: 'Reality Tear', type: 'active', desc: '4.6x true damage, stun 1 turn, enemy ATK & DEF -50%', manaCost: 42, multiplier: 4.6, effect: 'reality_tear', icon: 'A' },
        { id: 'mag_t38c', name: 'Spell Cascade Supreme', type: 'passive', desc: 'After using a skill, 50% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t38d', name: 'Ethereal Shield', type: 'passive', desc: 'Mana Shield absorbs 90% of damage', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'mag_t39a', name: 'Ascended Mage', type: 'passive', desc: '+4% skill damage per level above 60', icon: 'P' },
        { id: 'mag_t39b', name: 'Celestial Cataclysm', type: 'active', desc: '3.9x true damage 2 times, heal 25% of total damage dealt', manaCost: 44, multiplier: 3.9, effect: 'celestial_cata', icon: 'A' },
        { id: 'mag_t39c', name: 'Infinite Mana+', type: 'passive', desc: '+150% max mana, restore 20% max mana per turn', icon: 'P' },
        { id: 'mag_t39d', name: 'Primordial Wisdom', type: 'passive', desc: 'All damage +60%, all skill costs -40%', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'mag_t40a', name: 'Divine Archmage', type: 'passive', desc: 'All skill damage quadrupled. All skill costs -50%. Max HP reduced by 80%. Max mana quintupled. Glass cannon ascended to godhood.', icon: 'P', milestone: true },
        { id: 'mag_t40b', name: 'Universe End', type: 'active', desc: '4.8x true damage. Costs ALL mana and 60% HP. Bonus damage equal to 300% mana spent. 1 use per battle. The death of stars.', manaCost: 1, multiplier: 4.8, effect: 'universe_end', icon: 'A', milestone: true },
        { id: 'mag_t40c', name: 'Spell Singularity+', type: 'passive', desc: 'Every spell increases all future spell damage by 8% (stacks infinitely). Mana costs increase by 3 each cast. Defend restores 40% mana. Infinite escalation.', icon: 'P', milestone: true },
        { id: 'mag_t40d', name: 'Arcane Transcendence', type: 'passive', desc: 'HP and Mana merge. All spells cost HP. Total pool = HP + Mana x2. All healing tripled. Every spell heals 5% of damage as HP. Pure arcane existence.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'mag_t41a', name: 'Godlike Intellect', type: 'passive', desc: '+6 ATK per 10 current mana, +80% max mana', icon: 'P' },
        { id: 'mag_t41b', name: 'Star Destroyer', type: 'active', desc: '3.9x true damage 2 times, restore all mana spent', manaCost: 40, multiplier: 3.9, effect: 'star_destroyer', icon: 'A' },
        { id: 'mag_t41c', name: 'Supreme Spellcraft', type: 'passive', desc: 'All skill damage +70%, skills have 40% chance to cost no mana', icon: 'P' },
        { id: 'mag_t41d', name: 'Arcane Immortality', type: 'passive', desc: 'Heal 10% max HP per turn, +40% max HP', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'mag_t42a', name: 'Cosmic Mastery', type: 'passive', desc: '55% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t42b', name: 'Dimensional Annihilation', type: 'active', desc: '4.4x true damage, ignore all DEF, enemy ATK -50%', manaCost: 44, multiplier: 4.4, effect: 'dim_annihilation', icon: 'A' },
        { id: 'mag_t42c', name: 'Mana Supremacy', type: 'passive', desc: '+200% max mana, restore 25% max mana per turn', icon: 'P' },
        { id: 'mag_t42d', name: 'Spell Fortress', type: 'passive', desc: 'Start each battle with shield equal to 50% max mana', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'mag_t43a', name: 'Mythic Sorcery', type: 'passive', desc: 'All equipment bonuses increased by 50%, +60% skill damage', icon: 'P' },
        { id: 'mag_t43b', name: 'Void Annihilation', type: 'active', desc: '3.1x true damage 3 times, drain 20% enemy max HP as mana each hit', manaCost: 46, multiplier: 3.1, effect: 'void_annihilation', icon: 'A' },
        { id: 'mag_t43c', name: 'Arcane Resilience+', type: 'passive', desc: 'All damage taken reduced by 30%, immune to all debuffs, +30% max HP', icon: 'P' },
        { id: 'mag_t43d', name: 'Spell God', type: 'passive', desc: 'All skill damage +80%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'mag_t44a', name: 'Primordial Arcana', type: 'passive', desc: '+5% skill damage per level above 70', icon: 'P' },
        { id: 'mag_t44b', name: 'Creation Blast', type: 'active', desc: '4.6x true damage 2 times, heal 30% of total damage dealt', manaCost: 48, multiplier: 4.6, effect: 'creation_blast', icon: 'A' },
        { id: 'mag_t44c', name: 'Infinite Arcana', type: 'passive', desc: 'Skills that cost mana deal bonus true damage equal to 150% of mana spent', icon: 'P' },
        { id: 'mag_t44d', name: 'Celestial Regeneration', type: 'passive', desc: 'Heal 12% max HP and restore 20% max mana per turn', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'mag_t45a', name: 'Primordial Archmage', type: 'passive', desc: 'All skill damage quintupled. All skill costs -60%. Max HP reduced by 90%. You are a being of pure magic — one hit destroys you, one spell destroys everything.', icon: 'P', milestone: true },
        { id: 'mag_t45b', name: 'Cosmic Genesis', type: 'active', desc: '6.4x true damage. Costs ALL mana and 70% HP. Bonus damage equal to 500% mana spent. If enemy survives, fully restore mana.', manaCost: 1, multiplier: 6.4, effect: 'cosmic_genesis', icon: 'A', milestone: true },
        { id: 'mag_t45c', name: 'Infinite Spellweave', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 3%. Normal attacks replaced by 4.0x true damage spells. Mana costs +5 per cast. Transcendent magic.', icon: 'P', milestone: true },
        { id: 'mag_t45d', name: 'Arcane Eternity', type: 'passive', desc: 'Cannot die while mana > 0. All damage taken drains mana instead of HP. Max mana quintupled. Restore 10% mana/turn. Mana is your life.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'mag_t46a', name: 'Godlike Sorcery', type: 'passive', desc: 'All skill damage +100%, 60% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t46b', name: 'Eternity Blast', type: 'active', desc: '4.4x true damage 2 times, restore all mana', manaCost: 48, multiplier: 4.4, effect: 'eternity_blast', icon: 'A' },
        { id: 'mag_t46c', name: 'Supreme Mana', type: 'passive', desc: '+300% max mana, restore 30% max mana per turn', icon: 'P' },
        { id: 'mag_t46d', name: 'Arcane God', type: 'passive', desc: 'All damage +80%, immune to all effects, +50% max HP', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'mag_t47a', name: 'Spell Infinity', type: 'passive', desc: '50% chance for skills to cost no mana, +60% skill damage', icon: 'P' },
        { id: 'mag_t47b', name: 'Dimensional Rift+', type: 'active', desc: '5x true damage, stun 2 turns, immune to damage for 1 turn', manaCost: 50, multiplier: 5, effect: 'dim_rift_plus', icon: 'A' },
        { id: 'mag_t47c', name: 'Arcane Perfection Supreme', type: 'passive', desc: '+8 ATK per 10 current mana, +100% max mana', icon: 'P' },
        { id: 'mag_t47d', name: 'Cosmic Vitality', type: 'passive', desc: 'Heal 15% max HP per turn, +60% max HP, +40% DEF', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'mag_t48a', name: 'Mythic Arcana', type: 'passive', desc: 'All equipment bonuses increased by 60%, +80% skill damage', icon: 'P' },
        { id: 'mag_t48b', name: 'Oblivion Storm', type: 'active', desc: '3.9x true damage 3 times, each hit reduces enemy ATK & DEF by 20%', manaCost: 52, multiplier: 3.9, effect: 'oblivion_storm', icon: 'A' },
        { id: 'mag_t48c', name: 'Supreme Spellweave', type: 'passive', desc: '60% chance to cast skills twice for free, all skill damage +50%', icon: 'P' },
        { id: 'mag_t48d', name: 'Astral Immortality', type: 'passive', desc: 'Mana Shield absorbs 95% of damage, +200% max mana', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'mag_t49a', name: 'Cosmic Supremacy', type: 'passive', desc: 'All skill damage +120%, all skill costs -50%', icon: 'P' },
        { id: 'mag_t49b', name: 'End of Reality', type: 'active', desc: '6.3x true damage 2 times, ignore all DEF, heal 30% of total damage', manaCost: 54, multiplier: 6.3, effect: 'end_reality', icon: 'A' },
        { id: 'mag_t49c', name: 'Infinite Power+', type: 'passive', desc: 'Skills deal bonus true damage equal to 200% of mana spent', icon: 'P' },
        { id: 'mag_t49d', name: 'Primordial Regeneration', type: 'passive', desc: 'Heal 20% max HP and restore 30% max mana per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'mag_t50a', name: 'God of Magic', type: 'passive', desc: 'All skill damage x10. All skill costs -80%. Max HP reduced by 95%. Max mana x10. You are a god of destruction — fragile as glass, powerful as the sun.', icon: 'P', milestone: true },
        { id: 'mag_t50b', name: 'Final Big Bang', type: 'active', desc: '7x true damage. Costs ALL mana, ALL HP except 1. Bonus damage equal to 1000% mana spent. If enemy dies, fully restore. The universe reborn.', manaCost: 1, multiplier: 7, effect: 'final_big_bang', icon: 'A', milestone: true },
        { id: 'mag_t50c', name: 'Eternal Spellweaver', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 5%. Normal attacks are 5.0x true damage spells. Mana costs +10 per cast. Infinite, unstoppable growth.', icon: 'P', milestone: true },
        { id: 'mag_t50d', name: 'Primordial God of Arcana', type: 'passive', desc: 'Cannot die while mana > 0. All damage drains mana instead. Max mana x10. All skill damage x5. Restore 15% mana/turn. You are magic eternal.', icon: 'P', milestone: true },
      ]},
    ],
  },
  necromancer: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'nec_t1a', name: 'Soul Siphon', type: 'passive', desc: 'Attacks have 25% chance to restore 5 mana', icon: 'P' },
        { id: 'nec_t1b', name: 'Bone Spear', type: 'active', desc: '1x damage, ignores 40% DEF', manaCost: 8, multiplier: 1, effect: 'pierce_40', icon: 'A' },
        { id: 'nec_t1c', name: 'Dark Vitality', type: 'passive', desc: '+5% max HP, +5% ATK', icon: 'P' },
        { id: 'nec_t1d', name: 'Necrotic Presence', type: 'passive', desc: 'Enemies take 2% max HP damage at start of combat', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'nec_t2a', name: "Death's Embrace", type: 'passive', desc: 'When below 25% HP, heal 15% max HP (once/battle)', icon: 'P' },
        { id: 'nec_t2b', name: 'Plague', type: 'active', desc: '0.7x damage, strong poison for 4 turns', manaCost: 10, multiplier: 0.7, effect: 'strong_poison', icon: 'A' },
        { id: 'nec_t2c', name: 'Bone Armor', type: 'passive', desc: 'Take 8% less damage from all attacks', icon: 'P' },
        { id: 'nec_t2d', name: 'Soul Leech', type: 'passive', desc: 'Normal attacks heal 5% of damage dealt', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'nec_t3a', name: 'Vampiric Aura', type: 'passive', desc: 'All attacks heal 10% of damage dealt', icon: 'P' },
        { id: 'nec_t3b', name: 'Soul Harvest', type: 'active', desc: '1.3x damage, heal 60% of damage dealt', manaCost: 15, multiplier: 1.3, effect: 'soul_harvest', icon: 'A' },
        { id: 'nec_t3c', name: 'Corpse Shield', type: 'passive', desc: '+12% DEF permanently', icon: 'P' },
        { id: 'nec_t3d', name: 'Dark Channeling', type: 'passive', desc: 'Restore 3 mana at start of each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'nec_t4a', name: 'Dark Pact', type: 'passive', desc: 'Sacrifice 5% HP per turn, gain +25% ATK', icon: 'P' },
        { id: 'nec_t4b', name: 'Doom', type: 'active', desc: '1x damage, enemy takes 8% max HP/turn for 3 turns', manaCost: 20, multiplier: 1, effect: 'doom', icon: 'A' },
        { id: 'nec_t4c', name: 'Spectral Grasp', type: 'passive', desc: 'Poison effects you apply also reduce enemy ATK by 10%', icon: 'P' },
        { id: 'nec_t4d', name: 'Unholy Vigor', type: 'passive', desc: '+15% ATK, heal 2% max HP per turn', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'nec_t5a', name: 'Necrotic Touch', type: 'passive', desc: 'Normal attacks reduce enemy DEF by 1 each hit', icon: 'P' },
        { id: 'nec_t5b', name: 'Corpse Explosion', type: 'active', desc: '1.2x damage, +50% if enemy is poisoned', manaCost: 12, multiplier: 1.2, effect: 'corpse_explode', icon: 'A' },
        { id: 'nec_t5c', name: 'Decay Aura', type: 'passive', desc: 'Enemies take 1% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t5d', name: 'Soul Well', type: 'passive', desc: '+15% max mana, restore 2 mana when enemy takes DoT damage', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'nec_t6a', name: 'Life Tap', type: 'passive', desc: 'Spending mana heals 50% of mana spent as HP', icon: 'P' },
        { id: 'nec_t6b', name: 'Shadow Bolt', type: 'active', desc: '1.3x damage, ignores 30% DEF', manaCost: 12, multiplier: 1.3, effect: 'pierce_30', icon: 'A' },
        { id: 'nec_t6c', name: 'Cursed Touch', type: 'passive', desc: 'Normal attacks have 15% chance to doom enemy for 2 turns', icon: 'P' },
        { id: 'nec_t6d', name: 'Bone Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 10% max HP', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'nec_t7a', name: 'Undead Fortitude', type: 'passive', desc: '+10% max HP and +10% DEF', icon: 'P' },
        { id: 'nec_t7b', name: 'Death Coil', type: 'active', desc: '1x damage, heal 100% of damage dealt', manaCost: 18, multiplier: 1, effect: 'full_drain', icon: 'A' },
        { id: 'nec_t7c', name: 'Pestilence', type: 'passive', desc: 'Poison effects last 1 extra turn', icon: 'P' },
        { id: 'nec_t7d', name: 'Dark Resilience', type: 'passive', desc: 'Immune to poison, +8% ATK', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'nec_t8a', name: 'Cursed Blood', type: 'passive', desc: 'When hit, 20% chance to poison the attacker for 2 turns', icon: 'P' },
        { id: 'nec_t8b', name: 'Wither', type: 'active', desc: '0.9x damage, reduce enemy ATK and DEF by 25%', manaCost: 16, multiplier: 0.9, effect: 'wither', icon: 'A' },
        { id: 'nec_t8c', name: 'Soul Harvest+', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
        { id: 'nec_t8d', name: 'Blighted Ground', type: 'passive', desc: 'Enemies take +15% damage from poison and doom', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'nec_t9a', name: 'Eternal Hunger', type: 'passive', desc: 'Lifesteal from all sources increased by 50%', icon: 'P' },
        { id: 'nec_t9b', name: 'Army of the Dead', type: 'active', desc: '1.6x damage, heal 40% of damage dealt', manaCost: 22, multiplier: 1.6, effect: 'army_drain', icon: 'A' },
        { id: 'nec_t9c', name: 'Dark Empowerment', type: 'passive', desc: '+20% ATK when enemy is poisoned or doomed', icon: 'P' },
        { id: 'nec_t9d', name: 'Reaper Form', type: 'passive', desc: '+5% ATK per turn in battle (stacks)', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'nec_t10a', name: 'Lich Form', type: 'passive', desc: 'All healing doubled, +20% ATK, immune to poison', icon: 'P' },
        { id: 'nec_t10b', name: 'Apocalypse', type: 'active', desc: '2x damage, doom for 4 turns, heal 30%', manaCost: 30, multiplier: 2, effect: 'nec_apocalypse', icon: 'A' },
        { id: 'nec_t10c', name: 'Soul Lord', type: 'passive', desc: '+25% ATK, +15% max mana, restore 5 mana on kill', icon: 'P' },
        { id: 'nec_t10d', name: 'Undying', type: 'passive', desc: 'Survive one lethal hit per battle at 20% HP', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'nec_t11a', name: 'Death Aura', type: 'passive', desc: 'Enemies take 3% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t11b', name: 'Spirit Lance', type: 'active', desc: '1.6x damage, heal 50% of damage dealt', manaCost: 18, multiplier: 1.6, effect: 'spirit_lance', icon: 'A' },
        { id: 'nec_t11c', name: 'Ghoul Strength', type: 'passive', desc: '+20% ATK permanently', icon: 'P' },
        { id: 'nec_t11d', name: 'Miasma', type: 'passive', desc: 'All DoT effects deal 20% more damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'nec_t12a', name: 'Soul Collector', type: 'passive', desc: 'Gain +3% ATK per battle won (resets on rest, max 30%)', icon: 'P' },
        { id: 'nec_t12b', name: 'Bone Storm', type: 'active', desc: '1.3x damage 2 times, ignore 30% DEF each hit', manaCost: 20, multiplier: 1.3, effect: 'bone_storm', icon: 'A' },
        { id: 'nec_t12c', name: 'Vile Contagion', type: 'passive', desc: 'Poison effects also apply doom for 1 turn', icon: 'P' },
        { id: 'nec_t12d', name: 'Drain Essence', type: 'passive', desc: 'Normal attacks restore 3 mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'nec_t13a', name: 'Hungering Void', type: 'passive', desc: 'Lifesteal from all sources now also restores mana equal to 25% of healing done', icon: 'P' },
        { id: 'nec_t13b', name: 'Devouring Plague', type: 'active', desc: '1.6x damage, doom 4 turns, heal 20% of damage', manaCost: 22, multiplier: 1.6, effect: 'devouring_plague', icon: 'A' },
        { id: 'nec_t13c', name: 'Lich Armor', type: 'passive', desc: '+20% DEF, immune to ATK debuffs', icon: 'P' },
        { id: 'nec_t13d', name: 'Soulfire', type: 'passive', desc: '+15% skill damage, skills ignore 15% DEF', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'nec_t14a', name: 'Phylactery', type: 'passive', desc: 'On death, revive once at 30% HP (once per battle)', icon: 'P' },
        { id: 'nec_t14b', name: 'Soul Rend', type: 'active', desc: '2x damage, steal 10% enemy ATK permanently', manaCost: 24, multiplier: 2, effect: 'soul_rend', icon: 'A' },
        { id: 'nec_t14c', name: 'Plague Lord', type: 'passive', desc: 'All poison and doom durations +2 turns', icon: 'P' },
        { id: 'nec_t14d', name: 'Death Shroud', type: 'passive', desc: 'Take 15% less damage from all sources', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'nec_t15a', name: 'Pact of Undeath', type: 'passive', desc: 'You are undead. Healing is 50% more effective. Potions damage you instead of healing. Your HP slowly drains (1%/turn) but you lifesteal from everything.', icon: 'P', milestone: true },
        { id: 'nec_t15b', name: 'Soul Apocalypse', type: 'active', desc: '3.1x damage. Costs 25% HP. Heals 100% of damage dealt. Dooms enemy for 5 turns. If enemy survives, your max HP is reduced by 10% for the fight.', manaCost: 35, multiplier: 3.1, effect: 'soul_apocalypse', icon: 'A', milestone: true },
        { id: 'nec_t15c', name: 'Plague Bearer', type: 'passive', desc: 'All DoT damage tripled. Poison and doom cannot be resisted. Your direct damage is reduced by 40%. Death comes slowly but inevitably.', icon: 'P', milestone: true },
        { id: 'nec_t15d', name: 'Soul Devourer', type: 'passive', desc: 'Every attack steals 3% enemy max HP permanently and adds it to yours. Your base ATK is halved. You grow by consuming.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'nec_t16a', name: 'Grave Chill', type: 'passive', desc: 'Enemies you poison also have ATK reduced by 15%', icon: 'P' },
        { id: 'nec_t16b', name: 'Necrotic Burst', type: 'active', desc: '1.8x damage, +100% if enemy is doomed or poisoned', manaCost: 22, multiplier: 1.8, effect: 'necrotic_burst', icon: 'A' },
        { id: 'nec_t16c', name: 'Siphon Life', type: 'passive', desc: 'Heal 4% max HP at start of each turn', icon: 'P' },
        { id: 'nec_t16d', name: 'Dark Power', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'nec_t17a', name: 'Undying Servitude', type: 'passive', desc: 'Dark Pact ATK bonus increased to +50%, sacrifice reduced to 3%', icon: 'P' },
        { id: 'nec_t17b', name: 'Abyssal Strike', type: 'active', desc: '2.3x damage, ignore 50% DEF, heal 30% of damage', manaCost: 26, multiplier: 2.3, effect: 'abyssal_strike', icon: 'A' },
        { id: 'nec_t17c', name: 'Entropic Decay', type: 'passive', desc: 'Enemy DEF reduced by 3% each turn (stacks)', icon: 'P' },
        { id: 'nec_t17d', name: 'Death Knight', type: 'passive', desc: '+20% ATK, +15% DEF, immune to doom', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'nec_t18a', name: 'Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 15%, heal 5% max HP per turn', icon: 'P' },
        { id: 'nec_t18b', name: 'Mass Wither', type: 'active', desc: '1.6x damage, reduce enemy ATK and DEF by 40%', manaCost: 24, multiplier: 1.6, effect: 'mass_wither', icon: 'A' },
        { id: 'nec_t18c', name: 'Necrotic Empowerment', type: 'passive', desc: 'Skills deal +25% damage against poisoned/doomed targets', icon: 'P' },
        { id: 'nec_t18d', name: 'Wraithform', type: 'passive', desc: '+15% dodge chance, +10% ATK', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'nec_t19a', name: 'Essence Drain', type: 'passive', desc: 'Doom damage also heals you for 100% of damage dealt', icon: 'P' },
        { id: 'nec_t19b', name: 'Death Wave', type: 'active', desc: '2.5x damage, doom 3 turns, poison 3 turns', manaCost: 28, multiplier: 2.5, effect: 'death_wave', icon: 'A' },
        { id: 'nec_t19c', name: 'Eternal Dread', type: 'passive', desc: 'Doom effects last forever (never expire)', icon: 'P' },
        { id: 'nec_t19d', name: 'Abyssal Power', type: 'passive', desc: '+30% ATK when enemy is affected by any DoT', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'nec_t20a', name: 'Death Incarnate', type: 'passive', desc: 'All DoT damage (poison/doom/bleed) on enemies is tripled. Your direct attack damage is halved. You become a patient executioner, letting decay do the work.', icon: 'P', milestone: true },
        { id: 'nec_t20b', name: 'Extinction Event', type: 'active', desc: '4.6x damage. Heals 50% of damage dealt. Dooms for 5 turns. Costs 30% current HP. Your max HP is permanently reduced by 5% each use (stacks).', manaCost: 40, multiplier: 4.6, effect: 'extinction_event', icon: 'A', milestone: true },
        { id: 'nec_t20c', name: 'Eternal Lich', type: 'passive', desc: 'All healing doubled. Lifesteal doubled. All damage taken increased by 30%. Your DEF becomes 0. You sustain through pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t20d', name: 'Entropy Lord', type: 'passive', desc: 'Every turn, enemy ATK and DEF each drop by 3% permanently. Your ATK also drops by 1%/turn. Everything fades — the question is who fades first.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'nec_t21a', name: 'Necrotic Mastery', type: 'passive', desc: 'Poison and doom cannot be resisted or cleansed by enemies', icon: 'P' },
        { id: 'nec_t21b', name: 'Siphon Soul', type: 'active', desc: '1.8x damage, steal 15% enemy max HP as healing', manaCost: 24, multiplier: 1.8, effect: 'siphon_soul', icon: 'A' },
        { id: 'nec_t21c', name: 'Soul Storm', type: 'passive', desc: 'All skill damage +25%', icon: 'P' },
        { id: 'nec_t21d', name: 'Undead Army', type: 'passive', desc: '+3% ATK per DoT effect on enemy (stacks)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'nec_t22a', name: 'Spectral Armor', type: 'passive', desc: 'Gain +1 DEF for every 5% HP you are missing', icon: 'P' },
        { id: 'nec_t22b', name: 'Banshee Wail', type: 'active', desc: '1.6x damage, stun 1 turn, enemy ATK -30%', manaCost: 24, multiplier: 1.6, effect: 'banshee_wail', icon: 'A' },
        { id: 'nec_t22c', name: 'Death Mark', type: 'passive', desc: '+30% damage to enemies below 40% HP', icon: 'P' },
        { id: 'nec_t22d', name: 'Soul Forge', type: 'passive', desc: 'Lifesteal from all sources doubled', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'nec_t23a', name: 'Blood Magic', type: 'passive', desc: 'When out of mana, spells cost HP instead (at 2x rate)', icon: 'P' },
        { id: 'nec_t23b', name: 'Death Grip', type: 'active', desc: '2.7x damage, heal 40% of damage, enemy DEF -50%', manaCost: 30, multiplier: 2.7, effect: 'death_grip', icon: 'A' },
        { id: 'nec_t23c', name: 'Lich Mastery', type: 'passive', desc: 'All skill costs -30%, all healing +30%', icon: 'P' },
        { id: 'nec_t23d', name: 'Reaper Presence', type: 'passive', desc: 'Enemies take 5% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'nec_t24a', name: 'Eternal Undeath', type: 'passive', desc: 'Revive from Phylactery now triggers twice, at 50% HP each time', icon: 'P' },
        { id: 'nec_t24b', name: 'Annihilation', type: 'active', desc: '2.7x damage, doom 4 turns, heal 50% of damage dealt', manaCost: 34, multiplier: 2.7, effect: 'annihilation', icon: 'A' },
        { id: 'nec_t24c', name: 'Supreme Drain', type: 'passive', desc: 'Lifesteal tripled, all healing +50%', icon: 'P' },
        { id: 'nec_t24d', name: 'Endless Decay', type: 'passive', desc: 'All DoT effects deal +50% damage and last +2 turns', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'nec_t25a', name: 'Harbinger of Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats (ATK, DEF, HP) decay by 2%. Your own ATK decays by 1%/turn. Given enough time, everything dies — including you.', icon: 'P', milestone: true },
        { id: 'nec_t25b', name: 'Requiem', type: 'active', desc: '6.3x damage. Costs 50% current HP. Heals 100% of damage. Dooms for 6 turns. If enemy survives with <10% HP, instant kill. The final song.', manaCost: 50, multiplier: 6.3, effect: 'requiem', icon: 'A', milestone: true },
        { id: 'nec_t25c', name: 'Undeath Eternal', type: 'passive', desc: 'Cannot die. When HP reaches 0, consume 50% max mana to revive at 25% HP. When mana is also 0, you finally rest. Infinite persistence.', icon: 'P', milestone: true },
        { id: 'nec_t25d', name: 'Lord of the Dead', type: 'passive', desc: 'All attacks apply doom (5 turns) and poison (5 turns). All damage +50%. You take 3% max HP per turn as necrotic decay. Race against your own entropy.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'nec_t26a', name: 'Necrotic Ascendancy', type: 'passive', desc: '+3% ATK and lifesteal per level above 40', icon: 'P' },
        { id: 'nec_t26b', name: 'Soul Devastation', type: 'active', desc: '2.7x damage, heal 80% of damage dealt, doom 3 turns', manaCost: 28, multiplier: 2.7, effect: 'soul_devastation', icon: 'A' },
        { id: 'nec_t26c', name: 'Eternal Hunger+', type: 'passive', desc: 'Lifesteal from all sources tripled', icon: 'P' },
        { id: 'nec_t26d', name: 'Plague Mastery', type: 'passive', desc: 'All DoT effects deal double damage and last 2 extra turns', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'nec_t27a', name: 'Dark Resurrection', type: 'passive', desc: 'On death, revive at 40% HP (twice per battle)', icon: 'P' },
        { id: 'nec_t27b', name: 'Abyssal Nova', type: 'active', desc: '2.7x damage, doom 4 turns, poison 4 turns, heal 30%', manaCost: 30, multiplier: 2.7, effect: 'abyssal_nova', icon: 'A' },
        { id: 'nec_t27c', name: 'Soul Absorption', type: 'passive', desc: '20% of damage taken converted to mana and healing', icon: 'P' },
        { id: 'nec_t27d', name: 'Death Shroud+', type: 'passive', desc: 'All damage taken reduced by 20%, +20% ATK', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'nec_t28a', name: 'Necrotic Supremacy', type: 'passive', desc: 'All DoT effects deal triple damage', icon: 'P' },
        { id: 'nec_t28b', name: 'Deathstorm', type: 'active', desc: '2.3x damage 2 times, each apply doom 3 turns and poison 3 turns', manaCost: 32, multiplier: 2.3, effect: 'deathstorm', icon: 'A' },
        { id: 'nec_t28c', name: 'Soul Well+', type: 'passive', desc: '+40% max mana, restore 10% max mana per turn, +20% ATK', icon: 'P' },
        { id: 'nec_t28d', name: 'Vampiric Lord', type: 'passive', desc: 'All healing quadrupled, lifesteal doubled', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'nec_t29a', name: 'Reaper Supreme', type: 'passive', desc: '+8% ATK per turn in combat (stacks), +20% ATK', icon: 'P' },
        { id: 'nec_t29b', name: 'Soul Annihilation', type: 'active', desc: '3.1x damage, steal 20% enemy ATK permanently, heal 50%', manaCost: 34, multiplier: 3.1, effect: 'soul_annihilation', icon: 'A' },
        { id: 'nec_t29c', name: 'Entropic Shield', type: 'passive', desc: 'Start each battle with shield equal to 25% max HP, immune to ATK debuffs', icon: 'P' },
        { id: 'nec_t29d', name: 'Death Resonance', type: 'passive', desc: '+40% damage to poisoned or doomed enemies', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'nec_t30a', name: 'Aspect of Death', type: 'passive', desc: 'All DoT damage quintupled. Every attack applies doom and poison. Your direct damage is halved. Heal 5% max HP per turn. Death is patient.', icon: 'P', milestone: true },
        { id: 'nec_t30b', name: 'Soul Apocalypse+', type: 'active', desc: '4.8x damage. Costs 30% HP. Heals 150% of damage dealt. Dooms for 6 turns. Poisons for 6 turns. The ultimate drain.', manaCost: 45, multiplier: 4.8, effect: 'soul_apocalypse_plus', icon: 'A', milestone: true },
        { id: 'nec_t30c', name: 'Lich God', type: 'passive', desc: 'All healing tripled. Lifesteal tripled. All damage taken +30%. DEF becomes 0. You cannot defend. Pure sustain through pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t30d', name: 'Entropy Incarnate', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 3%. Your ATK also decays by 1%/turn. All DoT damage tripled. The ultimate war of attrition.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'nec_t31a', name: 'Necrotic Dominion', type: 'passive', desc: 'All attacks apply doom (3 turns) and poison (3 turns)', icon: 'P' },
        { id: 'nec_t31b', name: 'Plague Storm', type: 'active', desc: '2x damage 3 times, each apply doom 2 turns and poison 2 turns', manaCost: 34, multiplier: 2, effect: 'plague_storm', icon: 'A' },
        { id: 'nec_t31c', name: 'Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 20%, heal 8% max HP per turn', icon: 'P' },
        { id: 'nec_t31d', name: 'Dark Empowerment+', type: 'passive', desc: '+40% ATK when enemy has any DoT effect', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'nec_t32a', name: 'Legendary Necromancer', type: 'passive', desc: 'All skill damage +50%, all DoT damage +50%', icon: 'P' },
        { id: 'nec_t32b', name: 'Death Ray', type: 'active', desc: '3.5x damage, ignore 60% DEF, heal 60% of damage dealt', manaCost: 36, multiplier: 3.5, effect: 'death_ray', icon: 'A' },
        { id: 'nec_t32c', name: 'Soul Collector+', type: 'passive', desc: 'Gain +5% ATK per battle won (resets on rest, max 50%)', icon: 'P' },
        { id: 'nec_t32d', name: 'Wraithform+', type: 'passive', desc: '+25% dodge chance, +20% ATK, immune to all debuffs', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'nec_t33a', name: 'Death Aura+', type: 'passive', desc: 'Enemies take 6% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t33b', name: 'Vile Eruption', type: 'active', desc: '2.9x damage, +100% if enemy has 3+ DoT effects', manaCost: 34, multiplier: 2.9, effect: 'vile_eruption', icon: 'A' },
        { id: 'nec_t33c', name: 'Supreme Drain', type: 'passive', desc: '+3% ATK and healing per level above 50', icon: 'P' },
        { id: 'nec_t33d', name: 'Bone Lord', type: 'passive', desc: '+30% DEF, +30% ATK, +30% max HP', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'nec_t34a', name: 'Eternal Plague', type: 'passive', desc: 'All poison and doom effects last forever (never expire)', icon: 'P' },
        { id: 'nec_t34b', name: 'Soul Cataclysm', type: 'active', desc: '3.9x damage, doom 5 turns, heal 70% of damage dealt', manaCost: 38, multiplier: 3.9, effect: 'soul_cataclysm', icon: 'A' },
        { id: 'nec_t34c', name: 'Necrotic Fortitude', type: 'passive', desc: '+50% max HP, +25% DEF, immune to doom and poison', icon: 'P' },
        { id: 'nec_t34d', name: 'Dark Mastery', type: 'passive', desc: 'All equipment bonuses increased by 35%, +30% skill damage', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'nec_t35a', name: 'Mythic Lich', type: 'passive', desc: 'All healing quintupled. Lifesteal quintupled. All damage taken +50%. DEF becomes 0. Max HP doubled. An undead juggernaut sustained by pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t35b', name: 'Requiem Eternal', type: 'active', desc: '6.2x damage. Costs 60% HP. Heals 200% of damage. Doom 8 turns. Poison 8 turns. If enemy below 15% after, instant kill.', manaCost: 55, multiplier: 6.2, effect: 'requiem_eternal', icon: 'A', milestone: true },
        { id: 'nec_t35c', name: 'Plague God', type: 'passive', desc: 'All DoT damage x10. All attacks apply doom and poison (forever). Your direct damage is reduced by 60%. Heal 10% max HP/turn. Inevitable decay.', icon: 'P', milestone: true },
        { id: 'nec_t35d', name: 'Soul Devourer+', type: 'passive', desc: 'Every attack steals 5% enemy max HP permanently and adds it to yours. ATK halved. Every 3 hits, steal 5% enemy ATK too. You consume everything.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'nec_t36a', name: 'Vampiric God', type: 'passive', desc: 'All lifesteal quadrupled, heal 10% max HP per turn', icon: 'P' },
        { id: 'nec_t36b', name: 'Death Cascade', type: 'active', desc: '2.7x damage 3 times, heal 40% of total damage', manaCost: 38, multiplier: 2.7, effect: 'death_cascade', icon: 'A' },
        { id: 'nec_t36c', name: 'Necrotic Empowerment+', type: 'passive', desc: '+60% damage against enemies with any DoT effect', icon: 'P' },
        { id: 'nec_t36d', name: 'Spectral Lord', type: 'passive', desc: '+30% dodge, +30% ATK, attacks restore 5 mana', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'nec_t37a', name: 'Reaper Mastery', type: 'passive', desc: '+10% ATK per turn in combat (stacks infinitely)', icon: 'P' },
        { id: 'nec_t37b', name: 'Doomsday Plague', type: 'active', desc: '3.1x damage, doom 6 turns, poison 6 turns, bleed 6 turns, heal 40%', manaCost: 40, multiplier: 3.1, effect: 'doomsday_plague', icon: 'A' },
        { id: 'nec_t37c', name: 'Undying Lich', type: 'passive', desc: 'On death, revive at 50% HP (3 times per battle)', icon: 'P' },
        { id: 'nec_t37d', name: 'Soul Resonance', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'nec_t38a', name: 'Entropy Lord', type: 'passive', desc: 'Enemy ATK and DEF each drop by 5% per turn permanently', icon: 'P' },
        { id: 'nec_t38b', name: 'Annihilation Wave', type: 'active', desc: '4.6x damage, doom 5 turns, heal 80% of damage dealt', manaCost: 42, multiplier: 4.6, effect: 'annihilation_wave', icon: 'A' },
        { id: 'nec_t38c', name: 'Dark Immortality', type: 'passive', desc: 'All damage taken reduced by 25%, all healing tripled', icon: 'P' },
        { id: 'nec_t38d', name: 'Plague Aura', type: 'passive', desc: 'Enemies take 8% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'nec_t39a', name: 'Ascended Necromancer', type: 'passive', desc: '+4% ATK, lifesteal, and healing per level above 60', icon: 'P' },
        { id: 'nec_t39b', name: 'Soul Oblivion', type: 'active', desc: '3.9x damage 2 times, heal 60% of total damage, doom 4 turns each', manaCost: 44, multiplier: 3.9, effect: 'soul_oblivion', icon: 'A' },
        { id: 'nec_t39c', name: 'Supreme Undeath', type: 'passive', desc: 'Cannot die while enemy has any DoT effect. +40% ATK when enemy is doomed or poisoned', icon: 'P' },
        { id: 'nec_t39d', name: 'Legendary Drain', type: 'passive', desc: '+80% ATK, all attacks heal 20% of damage dealt', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'nec_t40a', name: 'Divine Lich', type: 'passive', desc: 'All healing x10. Lifesteal x10. All damage taken +60%. DEF becomes 0. Max HP tripled. An undead god sustained by infinite drain.', icon: 'P', milestone: true },
        { id: 'nec_t40b', name: 'Extinction Requiem', type: 'active', desc: '4.8x damage. Costs 70% HP. Heals 300% of damage dealt. Doom and poison for 10 turns. If enemy survives at <20%, instant kill.', manaCost: 60, multiplier: 4.8, effect: 'extinction_requiem', icon: 'A', milestone: true },
        { id: 'nec_t40c', name: 'Death Incarnate+', type: 'passive', desc: 'All DoT damage x15. All attacks apply doom, poison, and bleed (forever). Direct damage reduced by 70%. Heal 15% max HP/turn. Everything decays.', icon: 'P', milestone: true },
        { id: 'nec_t40d', name: 'Entropy God', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 5%. Your ATK decays by 2%/turn. All DoT damage quintupled. Lifesteal tripled. The slow heat death of combat.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'nec_t41a', name: 'Godlike Drain', type: 'passive', desc: '+5% lifesteal and ATK per level above 60', icon: 'P' },
        { id: 'nec_t41b', name: 'Soul Maelstrom', type: 'active', desc: '3.1x damage 3 times, heal 50% of total damage, each apply doom', manaCost: 42, multiplier: 3.1, effect: 'soul_maelstrom', icon: 'A' },
        { id: 'nec_t41c', name: 'Necrotic God', type: 'passive', desc: 'All skill damage +60%, all DoT damage +60%', icon: 'P' },
        { id: 'nec_t41d', name: 'Eternal Phylactery', type: 'passive', desc: 'On death, revive at 60% HP (4 times per battle)', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'nec_t42a', name: 'Supreme Soul Collector', type: 'passive', desc: '+8% ATK per battle won (max 80%), lifesteal doubled', icon: 'P' },
        { id: 'nec_t42b', name: 'Cataclysmic Doom', type: 'active', desc: '4.4x damage, doom 8 turns, poison 8 turns, heal 100% of damage', manaCost: 46, multiplier: 4.4, effect: 'cataclysmic_doom', icon: 'A' },
        { id: 'nec_t42c', name: 'Dark Restoration', type: 'passive', desc: 'Heal 15% max HP per turn, all healing tripled', icon: 'P' },
        { id: 'nec_t42d', name: 'Spectral God', type: 'passive', desc: '+40% dodge, +40% ATK, immune to all debuffs', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'nec_t43a', name: 'Mythic Death Knight', type: 'passive', desc: '+50% ATK, +40% DEF, +40% max HP, immune to doom and poison', icon: 'P' },
        { id: 'nec_t43b', name: 'Plague Apocalypse', type: 'active', desc: '3.1x damage 3 times, each apply eternal doom and eternal poison', manaCost: 46, multiplier: 3.1, effect: 'plague_apocalypse', icon: 'A' },
        { id: 'nec_t43c', name: 'Soul Dominion', type: 'passive', desc: 'All equipment bonuses increased by 45%, +40% skill damage', icon: 'P' },
        { id: 'nec_t43d', name: 'Reaper Aura', type: 'passive', desc: 'Enemies take 10% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'nec_t44a', name: 'Primordial Undeath', type: 'passive', desc: '+5% ATK, lifesteal, and healing per level above 70', icon: 'P' },
        { id: 'nec_t44b', name: 'Soul Devastation+', type: 'active', desc: '4.6x damage 2 times, heal 80% of total damage, doom 6 turns each', manaCost: 48, multiplier: 4.6, effect: 'soul_devastation_plus', icon: 'A' },
        { id: 'nec_t44c', name: 'Eternal Lich+', type: 'passive', desc: 'All healing quintupled, lifesteal quintupled, +50% ATK', icon: 'P' },
        { id: 'nec_t44d', name: 'Death God Aura', type: 'passive', desc: 'Enemies take 12% max HP damage per turn, your DoT damage tripled', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'nec_t45a', name: 'Primordial Lich', type: 'passive', desc: 'All healing x15. Lifesteal x15. All damage taken +80%. DEF becomes 0. Max HP quadrupled. The ultimate undead abomination of pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t45b', name: 'Final Requiem', type: 'active', desc: '6.4x damage. Costs 80% HP. Heals 500% of damage dealt. Doom and poison forever. If enemy below 25% after, instant kill. The song that ends worlds.', manaCost: 70, multiplier: 6.4, effect: 'final_requiem', icon: 'A', milestone: true },
        { id: 'nec_t45c', name: 'Eternal Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 8%. Your ATK decays by 3%/turn. All DoT damage x10. Lifesteal quintupled. The universe dies around you.', icon: 'P', milestone: true },
        { id: 'nec_t45d', name: 'Supreme Soul Devourer', type: 'passive', desc: 'Every attack steals 8% enemy max HP and 5% enemy ATK permanently. Your base ATK halved. Every kill permanently adds +10 ATK for the run. Consume all.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'nec_t46a', name: 'Godlike Necromancy', type: 'passive', desc: 'All skill damage +80%, all DoT damage x5, all healing tripled', icon: 'P' },
        { id: 'nec_t46b', name: 'Oblivion Plague', type: 'active', desc: '3.9x damage 3 times, each apply eternal doom and poison, heal 50% total', manaCost: 50, multiplier: 3.9, effect: 'oblivion_plague', icon: 'A' },
        { id: 'nec_t46c', name: 'Undying God', type: 'passive', desc: 'On death, revive at 70% HP (5 times per battle), +50% ATK each revive', icon: 'P' },
        { id: 'nec_t46d', name: 'Supreme Dark Power', type: 'passive', desc: '+100% ATK, +60% max HP, all attacks heal 15% of damage', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'nec_t47a', name: 'Eternal Reaper', type: 'passive', desc: '+12% ATK per turn in combat (stacks infinitely), lifesteal tripled', icon: 'P' },
        { id: 'nec_t47b', name: 'Death Incarnation', type: 'active', desc: '5x damage, doom forever, heal 100% of damage, steal 20% enemy ATK', manaCost: 52, multiplier: 5, effect: 'death_incarnation', icon: 'A' },
        { id: 'nec_t47c', name: 'Mythic Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 35%, all healing quintupled, +60% max HP', icon: 'P' },
        { id: 'nec_t47d', name: 'Plague Emperor', type: 'passive', desc: 'Enemies take 15% max HP per turn, all DoT damage x8', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'nec_t48a', name: 'Entropy Supreme', type: 'passive', desc: 'Enemy ATK and DEF decay by 8% per turn, all DoT damage x6', icon: 'P' },
        { id: 'nec_t48b', name: 'Apocalypse Eternal', type: 'active', desc: '4.6x damage 3 times, heal 70% total, doom and poison forever each hit', manaCost: 54, multiplier: 4.6, effect: 'apocalypse_eternal', icon: 'A' },
        { id: 'nec_t48c', name: 'Supreme Necromancy', type: 'passive', desc: 'All equipment bonuses increased by 60%, +80% skill damage', icon: 'P' },
        { id: 'nec_t48d', name: 'Deathless God', type: 'passive', desc: 'On death, revive at 80% HP (infinite times), +30% ATK each revive', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'nec_t49a', name: 'Cosmic Necromancer', type: 'passive', desc: '+120% ATK, all attacks heal 25% of damage, all DoT damage x5', icon: 'P' },
        { id: 'nec_t49b', name: 'End of Death', type: 'active', desc: '6.3x damage, heal 200% of damage dealt, doom and poison forever, steal 30% enemy ATK', manaCost: 56, multiplier: 6.3, effect: 'end_of_death', icon: 'A' },
        { id: 'nec_t49c', name: 'Primordial Soul', type: 'passive', desc: 'All skill damage +100%, all healing x10, +80% max HP', icon: 'P' },
        { id: 'nec_t49d', name: 'Infinite Entropy', type: 'passive', desc: 'Enemies take 20% max HP per turn, enemy stats decay 10% per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'nec_t50a', name: 'God of Death', type: 'passive', desc: 'All healing x20. Lifesteal x20. All damage taken doubled. DEF becomes 0. Max HP quintupled. You are death itself — sustained by an ocean of stolen life.', icon: 'P', milestone: true },
        { id: 'nec_t50b', name: 'Final Requiem Absolute', type: 'active', desc: '7x damage. Costs all HP except 1. Heals 1000% of damage dealt. Doom and poison forever. If enemy survives, you gain +200% ATK. The ultimate death song.', manaCost: 1, multiplier: 7, effect: 'final_requiem_absolute', icon: 'A', milestone: true },
        { id: 'nec_t50c', name: 'Primordial Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 15%. Your ATK decays by 5%/turn. All DoT damage x20. Lifesteal x10. The heat death of all things.', icon: 'P', milestone: true },
        { id: 'nec_t50d', name: 'Primordial God of Undeath', type: 'passive', desc: 'Cannot die. When HP reaches 0, consume 30% max mana to revive at 50% HP (infinite). All attacks steal 10% enemy max HP permanently. You consume eternity.', icon: 'P', milestone: true },
      ]},
    ],
  },
};

// Build a fast lookup map at module load time
const _allTreeSkills = {};
for (const cls of Object.values(SKILL_TREES)) {
  for (const tier of cls.tiers) {
    for (const choice of tier.choices) {
      _allTreeSkills[choice.id] = choice;
    }
  }
}

export function getTreeSkill(id) {
  return _allTreeSkills[id] || null;
}

// Get all unlocked active skills for a player (class skill + tree actives)
export function getPlayerActiveSkills(player) {
  const cls = player.characterClass ? CHARACTER_CLASSES[player.characterClass] : null;
  if (!cls) return [];
  const skills = [];
  skills.push({
    id: 'class_skill',
    name: cls.skillName,
    desc: cls.skillDesc,
    manaCost: cls.skillManaCost,
    multiplier: cls.skillMultiplier,
    effect: cls.skillEffect,
    isClassSkill: true,
  });
  const tree = player.skillTree || [];
  for (const skillId of tree) {
    const skill = _allTreeSkills[skillId];
    if (skill && skill.type === 'active') {
      skills.push(skill);
    }
  }
  return skills;
}

// Get all unlocked passive skills for a player (class passive + tree passives)
export function getPlayerPassiveSkills(player) {
  const cls = player.characterClass ? CHARACTER_CLASSES[player.characterClass] : null;
  if (!cls) return [];
  const passives = [];
  passives.push({
    id: 'class_passive',
    name: cls.passive,
    desc: cls.passiveDesc,
  });
  const tree = player.skillTree || [];
  for (const skillId of tree) {
    const skill = _allTreeSkills[skillId];
    if (skill && skill.type === 'passive') {
      passives.push(skill);
    }
  }
  return passives;
}
