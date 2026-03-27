// Skill tree definitions - pure data, no logic
// Each class has 25 tiers. At each tier the player picks 1 of 4 options (3 passives + 1 active, permanent choice).
// type: 'passive' (always active) or 'active' (usable in battle, costs mana)

import { CHARACTER_CLASSES } from './gameData';

export const SKILL_TREES = {
  berserker: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'brs_t1a', name: 'Blood Frenzy', type: 'passive', desc: '+3% ATK for each 10% HP missing', icon: 'P' },
        { id: 'brs_t1b', name: 'Savage Strike', type: 'active', desc: '2.2x damage, take 5% max HP recoil', manaCost: 8, multiplier: 2.2, effect: 'recoil_small', icon: 'A' },
        { id: 'brs_t1c', name: 'Battle Scars', type: 'passive', desc: '+5% max HP permanently from battle', icon: 'P' },
        { id: 'brs_t1d', name: 'Fury Building', type: 'passive', desc: '+2% ATK each turn in combat (stacks)', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'brs_t2a', name: 'Undying Will', type: 'passive', desc: 'Survive one lethal hit per battle at 1 HP', icon: 'P' },
        { id: 'brs_t2b', name: 'Cleave', type: 'active', desc: '1.8x damage, ignores 30% DEF', manaCost: 10, multiplier: 1.8, effect: 'pierce_30', icon: 'A' },
        { id: 'brs_t2c', name: 'Reckless Abandon', type: 'passive', desc: '+10% ATK but take 5% more damage', icon: 'P' },
        { id: 'brs_t2d', name: 'Iron Will', type: 'passive', desc: '10% resistance to all debuffs', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'brs_t3a', name: 'Bloodlust', type: 'passive', desc: 'Heal 20% of damage dealt when below 30% HP', icon: 'P' },
        { id: 'brs_t3b', name: 'Rampage', type: 'active', desc: '3.0x damage, take 20% max HP recoil', manaCost: 15, multiplier: 3.0, effect: 'recoil_heavy', icon: 'A' },
        { id: 'brs_t3c', name: 'Rage Fuel', type: 'passive', desc: 'Restore 2 mana when taking damage', icon: 'P' },
        { id: 'brs_t3d', name: 'Primal Instinct', type: 'passive', desc: '+10% dodge chance when below 50% HP', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'brs_t4a', name: 'War Machine', type: 'passive', desc: '+15% ATK, +25% ATK when below 50% HP', icon: 'P' },
        { id: 'brs_t4b', name: 'Skull Crusher', type: 'active', desc: '3.5x damage, reduce enemy DEF by 40%', manaCost: 18, multiplier: 3.5, effect: 'shred_def', icon: 'A' },
        { id: 'brs_t4c', name: 'Brutal Momentum', type: 'passive', desc: 'Normal attacks deal +15% damage', icon: 'P' },
        { id: 'brs_t4d', name: 'Bloodrage', type: 'passive', desc: 'Gain +5% ATK for 2 turns after being hit', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'brs_t5a', name: 'Thick Skin', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
        { id: 'brs_t5b', name: 'Whirlwind', type: 'active', desc: '2.5x damage, ignores 20% DEF', manaCost: 12, multiplier: 2.5, effect: 'pierce_20', icon: 'A' },
        { id: 'brs_t5c', name: 'Savage Endurance', type: 'passive', desc: 'Heal 2% max HP per turn', icon: 'P' },
        { id: 'brs_t5d', name: 'Hardened Body', type: 'passive', desc: '+5 DEF permanently in battle', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'brs_t6a', name: 'Adrenaline Rush', type: 'passive', desc: 'Restore 3 mana each time you attack', icon: 'P' },
        { id: 'brs_t6b', name: 'Decimate', type: 'active', desc: '2.8x damage, enemy ATK -15%', manaCost: 14, multiplier: 2.8, effect: 'weaken_15', icon: 'A' },
        { id: 'brs_t6c', name: 'Fury Unleashed', type: 'passive', desc: 'Critical hits deal 2.5x instead of 2x', icon: 'P' },
        { id: 'brs_t6d', name: 'Combat Expertise', type: 'passive', desc: '+10% damage to stunned or debuffed enemies', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'brs_t7a', name: 'Tenacity', type: 'passive', desc: 'Poison and debuff durations reduced by 1 turn', icon: 'P' },
        { id: 'brs_t7b', name: 'Execution', type: 'active', desc: '4.0x damage if enemy below 25% HP, else 1.5x', manaCost: 16, multiplier: 1.5, effect: 'execute_25', icon: 'A' },
        { id: 'brs_t7c', name: 'Battle Trance', type: 'passive', desc: 'Immune to stun effects', icon: 'P' },
        { id: 'brs_t7d', name: 'Scarred Flesh', type: 'passive', desc: 'Poison damage taken reduced by 50%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'brs_t8a', name: 'Bloodbath', type: 'passive', desc: 'Heal 5% max HP on every kill', icon: 'P' },
        { id: 'brs_t8b', name: 'Devastating Blow', type: 'active', desc: '3.2x damage, ignores 50% DEF', manaCost: 18, multiplier: 3.2, effect: 'pierce_50', icon: 'A' },
        { id: 'brs_t8c', name: "Predator's Eye", type: 'passive', desc: '+10% damage to enemies below 50% HP', icon: 'P' },
        { id: 'brs_t8d', name: 'Blood Scent', type: 'passive', desc: 'Restore 3 mana when enemy drops below 50% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'brs_t9a', name: 'Relentless', type: 'passive', desc: '+20% ATK when above 80% HP', icon: 'P' },
        { id: 'brs_t9b', name: 'Blood Nova', type: 'active', desc: '3.8x damage, heal 25% of damage dealt, 10% recoil', manaCost: 22, multiplier: 3.8, effect: 'blood_nova', icon: 'A' },
        { id: 'brs_t9c', name: 'Savage Resilience', type: 'passive', desc: '+10% DEF when above 50% HP', icon: 'P' },
        { id: 'brs_t9d', name: "Berserker's Focus", type: 'passive', desc: 'Skills deal +10% more damage', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'brs_t10a', name: 'Immortal Rage', type: 'passive', desc: 'When below 10% HP, ATK doubled', icon: 'P' },
        { id: 'brs_t10b', name: 'Apocalypse', type: 'active', desc: '5.0x damage, take 30% max HP recoil', manaCost: 28, multiplier: 5.0, effect: 'recoil_extreme', icon: 'A' },
        { id: 'brs_t10c', name: 'Undaunted', type: 'passive', desc: 'Take 15% less damage from enemies with higher ATK', icon: 'P' },
        { id: 'brs_t10d', name: 'Death Dealer', type: 'passive', desc: '+3% ATK per active buff on self', icon: 'P' },
      ]},
      // ---- Post-20 tiers ----
      { level: 22, label: 'Tier 11', choices: [
        { id: 'brs_t11a', name: 'Gore', type: 'active', desc: '3.0x damage, enemy bleeds 5% max HP/turn for 3 turns', manaCost: 16, multiplier: 3.0, effect: 'apply_bleed', icon: 'A' },
        { id: 'brs_t11b', name: 'Pain Threshold', type: 'passive', desc: 'Recoil damage from skills reduced by 50%', icon: 'P' },
        { id: 'brs_t11c', name: 'Unrelenting Force', type: 'passive', desc: '+8% ATK after using an active skill (lasts 2 turns)', icon: 'P' },
        { id: 'brs_t11d', name: 'Vitality Surge', type: 'passive', desc: 'Heal 3% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'brs_t12a', name: 'Berserker Stance', type: 'passive', desc: '+30% ATK but +15% damage taken', icon: 'P' },
        { id: 'brs_t12b', name: 'Crushing Blow', type: 'active', desc: '4.0x damage, reduce enemy DEF by 60%', manaCost: 20, multiplier: 4.0, effect: 'shred_def_60', icon: 'A' },
        { id: 'brs_t12c', name: 'Wrathful Strikes', type: 'passive', desc: 'Normal attacks have 15% chance to deal double damage', icon: 'P' },
        { id: 'brs_t12d', name: 'Blood Bond', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'brs_t13a', name: 'Second Wind', type: 'passive', desc: 'At 25% HP, heal 20% max HP once per battle', icon: 'P' },
        { id: 'brs_t13b', name: 'Reckless Charge', type: 'active', desc: '3.5x damage, ignore 40% DEF, take 10% recoil', manaCost: 18, multiplier: 3.5, effect: 'reckless_charge', icon: 'A' },
        { id: 'brs_t13c', name: 'Warcry', type: 'passive', desc: 'Start each battle with +10% ATK for 3 turns', icon: 'P' },
        { id: 'brs_t13d', name: 'Bloodied Resolve', type: 'passive', desc: '+15% DEF when below 30% HP', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'brs_t14a', name: 'Frenzy', type: 'passive', desc: 'Each attack in a row increases ATK by 5% (stacks 10x)', icon: 'P' },
        { id: 'brs_t14b', name: 'Annihilate', type: 'active', desc: '5.5x damage if enemy above 50% HP, else 2.5x', manaCost: 24, multiplier: 2.5, effect: 'overkill_50', icon: 'A' },
        { id: 'brs_t14c', name: 'Unbridled Power', type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'brs_t14d', name: 'Savage Instincts', type: 'passive', desc: 'Restore 5 mana when HP drops below 50%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'brs_t15a', name: 'Blood Oath', type: 'passive', desc: 'Permanently sacrifice 30% max HP. ATK +60%, all skills cost 50% less mana. You can never heal above 70% HP again.', icon: 'P', milestone: true },
        { id: 'brs_t15b', name: 'Worldbreaker', type: 'active', desc: '8.0x damage. 40% recoil. If this kills, fully heal. If it doesn\'t kill, you are stunned next turn.', manaCost: 35, multiplier: 8.0, effect: 'worldbreaker', icon: 'A', milestone: true },
        { id: 'brs_t15c', name: 'Eternal Berserker', type: 'passive', desc: 'You can never be healed by potions. In return, every hit you land heals 15% of damage dealt. Your rage sustains you.', icon: 'P', milestone: true },
        { id: 'brs_t15d', name: 'Pain is Power', type: 'passive', desc: 'All recoil damage is converted to +ATK (permanent per battle). The more you hurt yourself, the stronger you become.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'brs_t16a', name: 'Juggernaut', type: 'passive', desc: 'Cannot be reduced below 15% HP by a single hit', icon: 'P' },
        { id: 'brs_t16b', name: 'Eviscerate', type: 'active', desc: '4.5x damage, ignore 60% DEF', manaCost: 22, multiplier: 4.5, effect: 'pierce_60', icon: 'A' },
        { id: 'brs_t16c', name: 'Bloodletting', type: 'passive', desc: 'Bleed effects you apply last 2 extra turns', icon: 'P' },
        { id: 'brs_t16d', name: 'Conqueror', type: 'passive', desc: '+1% ATK per level above 20', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'brs_t17a', name: 'Warlord', type: 'passive', desc: '+2% ATK per level above 30', icon: 'P' },
        { id: 'brs_t17b', name: 'Cataclysmic Slam', type: 'active', desc: '5.0x damage, shred enemy DEF to 0, take 15% recoil', manaCost: 26, multiplier: 5.0, effect: 'cata_slam', icon: 'A' },
        { id: 'brs_t17c', name: 'Overwhelming Force', type: 'passive', desc: 'Skills ignore 20% of enemy DEF', icon: 'P' },
        { id: 'brs_t17d', name: 'Blood Fury', type: 'passive', desc: 'When below 40% HP, all damage +20%', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'brs_t18a', name: 'Undying Fury', type: 'passive', desc: 'Survive lethal hits twice per battle (replaces Undying Will)', icon: 'P' },
        { id: 'brs_t18b', name: 'Massacre', type: 'active', desc: '3.5x damage three times in a row', manaCost: 30, multiplier: 3.5, effect: 'triple_strike', icon: 'A' },
        { id: 'brs_t18c', name: 'Rampage Mastery', type: 'passive', desc: 'After killing an enemy, fully restore mana', icon: 'P' },
        { id: 'brs_t18d', name: 'Thick Blood', type: 'passive', desc: 'Immune to poison and bleed effects', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'brs_t19a', name: 'Bloodforged', type: 'passive', desc: 'Convert 20% of overkill damage into healing', icon: 'P' },
        { id: 'brs_t19b', name: 'Oblivion Strike', type: 'active', desc: '6.0x true damage, 25% recoil', manaCost: 32, multiplier: 6.0, effect: 'oblivion_strike', icon: 'A' },
        { id: 'brs_t19c', name: 'Indomitable Spirit', type: 'passive', desc: 'All damage taken reduced by 12%', icon: 'P' },
        { id: 'brs_t19d', name: 'Rage Incarnate', type: 'passive', desc: '+5% ATK each time you take damage (stacks 8x per battle)', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'brs_t20a', name: 'Avatar of Carnage', type: 'passive', desc: 'All damage +100%. All healing received is halved. HP regen disabled. You exist only to destroy.', icon: 'P', milestone: true },
        { id: 'brs_t20b', name: 'Ragnarök', type: 'active', desc: '12.0x damage. Costs 50% current HP + all mana. If enemy survives, your ATK is halved for 3 turns.', manaCost: 40, multiplier: 12.0, effect: 'ragnarok', icon: 'A', milestone: true },
        { id: 'brs_t20c', name: 'Undying Titan', type: 'passive', desc: 'Your max HP is doubled. Your ATK is reduced by 25%. You cannot be killed in fewer than 10 hits. An immovable force.', icon: 'P', milestone: true },
        { id: 'brs_t20d', name: 'Bloodbound', type: 'passive', desc: 'Every point of HP you lose becomes +1% ATK until end of battle. At 1 HP your ATK is astronomical. No healing allowed.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'brs_t21a', name: 'Scarred Veteran', type: 'passive', desc: '+1% damage reduction per 5% HP missing', icon: 'P' },
        { id: 'brs_t21b', name: 'Sundering Blow', type: 'active', desc: '5.5x damage, enemy DEF & ATK -30%', manaCost: 28, multiplier: 5.5, effect: 'sunder', icon: 'A' },
        { id: 'brs_t21c', name: 'Veteran Instincts', type: 'passive', desc: '+20% damage on first attack each battle', icon: 'P' },
        { id: 'brs_t21d', name: 'War-Hardened', type: 'passive', desc: 'Take 3% less damage per turn in battle (max 15%)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'brs_t22a', name: 'Deathless', type: 'passive', desc: 'When revived by Undying Will, gain +50% ATK for rest of fight', icon: 'P' },
        { id: 'brs_t22b', name: 'Titan Blow', type: 'active', desc: '7.0x damage, stun enemy for 1 turn', manaCost: 30, multiplier: 7.0, effect: 'titan_blow', icon: 'A' },
        { id: 'brs_t22c', name: 'Bloodsoaked', type: 'passive', desc: 'All lifesteal effects doubled', icon: 'P' },
        { id: 'brs_t22d', name: 'Gladiator', type: 'passive', desc: '+20% ATK and DEF for the first 5 turns of battle', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'brs_t23a', name: 'Endless Rage', type: 'passive', desc: 'Mana costs reduced by 1 each turn (min 1)', icon: 'P' },
        { id: 'brs_t23b', name: 'Savage Whirlwind', type: 'active', desc: '4.0x damage twice, ignore 30% DEF', manaCost: 28, multiplier: 4.0, effect: 'double_pierce_30', icon: 'A' },
        { id: 'brs_t23c', name: 'Primal Fury', type: 'passive', desc: 'Skills have 20% chance to cost no mana', icon: 'P' },
        { id: 'brs_t23d', name: 'Unyielding', type: 'passive', desc: 'Cannot be stunned, debuff durations halved', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'brs_t24a', name: 'Warpath', type: 'passive', desc: 'After killing an enemy, start next battle with +30% ATK', icon: 'P' },
        { id: 'brs_t24b', name: 'Extinction', type: 'active', desc: '6.5x damage, 8.0x if enemy below 30% HP', manaCost: 34, multiplier: 6.5, effect: 'execute_30_8x', icon: 'A' },
        { id: 'brs_t24c', name: 'Destroyer', type: 'passive', desc: '+25% damage to enemies above 75% HP', icon: 'P' },
        { id: 'brs_t24d', name: 'Crimson Vitality', type: 'passive', desc: 'Heal 8% max HP at start of each turn when below 40% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'brs_t25a', name: 'Godslayer', type: 'passive', desc: 'You deal +5% damage per 1% HP missing. At 1 HP you deal +500% damage. Potions no longer work on you.', icon: 'P', milestone: true },
        { id: 'brs_t25b', name: 'Final Cataclysm', type: 'active', desc: '20.0x damage. Sets your HP to 1. If enemy survives, you die instantly.', manaCost: 50, multiplier: 20.0, effect: 'final_cataclysm', icon: 'A', milestone: true },
        { id: 'brs_t25c', name: 'Eternal Warrior', type: 'passive', desc: 'Survive any hit that would kill you (infinite uses). After each survival, ATK -10% permanently. You never die, but you slowly fade.', icon: 'P', milestone: true },
        { id: 'brs_t25d', name: 'Lord of Slaughter', type: 'passive', desc: 'Every kill permanently grants +3 ATK for the rest of the run. Normal attacks hit twice. You can never defend or use potions again.', icon: 'P', milestone: true },
      ]},
    ],
  },
  warrior: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'war_t1a', name: 'Iron Skin', type: 'passive', desc: 'Take 10% less damage from all attacks', icon: 'P' },
        { id: 'war_t1b', name: 'War Cry', type: 'active', desc: 'Reduce enemy ATK by 25% for the fight', manaCost: 8, multiplier: 0.8, effect: 'war_cry', icon: 'A' },
        { id: 'war_t1c', name: 'Shield Training', type: 'passive', desc: '+3 DEF permanently in battle', icon: 'P' },
        { id: 'war_t1d', name: 'Resolve', type: 'passive', desc: 'Heal 1% max HP at the start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'war_t2a', name: 'Bulwark', type: 'passive', desc: 'Defend blocks 85% damage instead of 70%', icon: 'P' },
        { id: 'war_t2b', name: 'Counter Strike', type: 'active', desc: '2.0x damage, 2.5x if defended last turn', manaCost: 10, multiplier: 2.0, effect: 'counter', icon: 'A' },
        { id: 'war_t2c', name: 'Heavy Armor', type: 'passive', desc: '+10% DEF from equipment', icon: 'P' },
        { id: 'war_t2d', name: 'Bravery', type: 'passive', desc: '+5% ATK when HP is above 70%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'war_t3a', name: 'Unbreakable', type: 'passive', desc: '+15% max HP during battle', icon: 'P' },
        { id: 'war_t3b', name: 'Earthquake', type: 'active', desc: '2.2x damage, lower enemy DEF by 30%', manaCost: 15, multiplier: 2.2, effect: 'quake', icon: 'A' },
        { id: 'war_t3c', name: 'Fortify', type: 'passive', desc: '+8% DEF when defending', icon: 'P' },
        { id: 'war_t3d', name: 'Protector', type: 'passive', desc: 'Restore 2 mana when you defend', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'war_t4a', name: 'Aegis', type: 'passive', desc: '15% chance to fully block any attack', icon: 'P' },
        { id: 'war_t4b', name: 'Final Stand', type: 'active', desc: '2.8x damage, heal 30% of damage dealt', manaCost: 18, multiplier: 2.8, effect: 'final_stand', icon: 'A' },
        { id: 'war_t4c', name: 'Retaliation', type: 'passive', desc: 'When hit, deal 10% of damage back to attacker', icon: 'P' },
        { id: 'war_t4d', name: 'Steadfast', type: 'passive', desc: 'Immune to ATK reduction debuffs', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'war_t5a', name: 'Stalwart', type: 'passive', desc: '+5 DEF permanently in battle', icon: 'P' },
        { id: 'war_t5b', name: 'Shield Slam', type: 'active', desc: '1.8x damage + DEF added to ATK for this hit', manaCost: 12, multiplier: 1.8, effect: 'shield_slam', icon: 'A' },
        { id: 'war_t5c', name: 'Enduring Will', type: 'passive', desc: '+10% max HP permanently', icon: 'P' },
        { id: 'war_t5d', name: 'Tactical Mind', type: 'passive', desc: 'Restore 3 mana when you attack', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'war_t6a', name: 'Regeneration', type: 'passive', desc: 'Heal 3% max HP at the start of each turn', icon: 'P' },
        { id: 'war_t6b', name: 'Heroic Strike', type: 'active', desc: '2.5x damage, restore 5 mana', manaCost: 10, multiplier: 2.5, effect: 'heroic_mana', icon: 'A' },
        { id: 'war_t6c', name: 'Shield Wall', type: 'passive', desc: 'Defend now also restores 5% max HP', icon: 'P' },
        { id: 'war_t6d', name: 'Commander', type: 'passive', desc: '+8% ATK and DEF permanently', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'war_t7a', name: 'Armor Mastery', type: 'passive', desc: 'Equipment DEF bonuses increased by 15%', icon: 'P' },
        { id: 'war_t7b', name: 'Mighty Cleave', type: 'active', desc: '2.6x damage, ignores 25% DEF', manaCost: 14, multiplier: 2.6, effect: 'pierce_25', icon: 'A' },
        { id: 'war_t7c', name: 'Battle Ready', type: 'passive', desc: 'Start each battle with +15% DEF for 3 turns', icon: 'P' },
        { id: 'war_t7d', name: 'Weapon Mastery', type: 'passive', desc: 'Equipment ATK bonuses increased by 10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'war_t8a', name: 'Last Stand', type: 'passive', desc: '+30% DEF when below 40% HP', icon: 'P' },
        { id: 'war_t8b', name: 'Rallying Blow', type: 'active', desc: '2.2x damage, heal 20% max HP', manaCost: 16, multiplier: 2.2, effect: 'rally_heal', icon: 'A' },
        { id: 'war_t8c', name: 'Stoneskin', type: 'passive', desc: 'Take 5 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t8d', name: 'Inspiring Presence', type: 'passive', desc: '+12% ATK when HP above 50%', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'war_t9a', name: 'Indomitable', type: 'passive', desc: 'Cannot be reduced below 1 HP by poison or DoT', icon: 'P' },
        { id: 'war_t9b', name: 'Colossus Smash', type: 'active', desc: '3.5x damage, reduce enemy DEF to 0 for 2 turns', manaCost: 22, multiplier: 3.5, effect: 'armor_break', icon: 'A' },
        { id: 'war_t9c', name: 'Sentinel', type: 'passive', desc: '20% chance to fully block any attack', icon: 'P' },
        { id: 'war_t9d', name: 'Endurance Training', type: 'passive', desc: 'Restore 5% max mana at start of each turn', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'war_t10a', name: 'Fortress', type: 'passive', desc: 'All damage taken reduced by 20%', icon: 'P' },
        { id: 'war_t10b', name: 'Avatar of War', type: 'active', desc: '4.0x damage, +50% DEF for 3 turns', manaCost: 28, multiplier: 4.0, effect: 'avatar', icon: 'A' },
        { id: 'war_t10c', name: 'Unassailable', type: 'passive', desc: 'Survive one lethal hit per battle at 25% HP', icon: 'P' },
        { id: 'war_t10d', name: 'Warden', type: 'passive', desc: '+15% ATK and +15% DEF permanently', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'war_t11a', name: 'Fortified Mind', type: 'passive', desc: 'Immune to ATK debuffs from enemies', icon: 'P' },
        { id: 'war_t11b', name: 'Thunder Clap', type: 'active', desc: '2.5x damage, enemy ATK -35% for the fight', manaCost: 16, multiplier: 2.5, effect: 'thunder_clap', icon: 'A' },
        { id: 'war_t11c', name: 'Bastion', type: 'passive', desc: 'Defend blocks 90% of damage', icon: 'P' },
        { id: 'war_t11d', name: 'Iron Resolve', type: 'passive', desc: '+4% max HP per level above 15', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'war_t12a', name: 'Phalanx', type: 'passive', desc: 'Defend now blocks 95% of damage', icon: 'P' },
        { id: 'war_t12b', name: 'Retribution', type: 'active', desc: '3.0x damage, 4.0x if you defended last turn', manaCost: 18, multiplier: 3.0, effect: 'retribution', icon: 'A' },
        { id: 'war_t12c', name: 'Thorns', type: 'passive', desc: 'When hit, deal 20% of damage taken back to attacker', icon: 'P' },
        { id: 'war_t12d', name: 'Defensive Mastery', type: 'passive', desc: '+20% DEF from all sources', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'war_t13a', name: "Titan's Grip", type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'war_t13b', name: 'Seismic Slam', type: 'active', desc: '3.5x damage, reduce enemy DEF by 50%', manaCost: 20, multiplier: 3.5, effect: 'seismic_slam', icon: 'A' },
        { id: 'war_t13c', name: 'Guardian Angel', type: 'passive', desc: 'Heal 5% max HP when you successfully block', icon: 'P' },
        { id: 'war_t13d', name: 'Heavy Strikes', type: 'passive', desc: 'Normal attacks have +20% damage', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'war_t14a', name: 'Endurance', type: 'passive', desc: 'Heal 5% max HP at start of each turn', icon: 'P' },
        { id: 'war_t14b', name: 'Devastate', type: 'active', desc: '4.5x damage, heal 25% of damage dealt', manaCost: 22, multiplier: 4.5, effect: 'devastate_heal', icon: 'A' },
        { id: 'war_t14c', name: 'Plate Armor', type: 'passive', desc: 'Take 10 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t14d', name: 'Veterans Might', type: 'passive', desc: '+2% ATK per level above 20', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'war_t15a', name: 'Immortal Bastion', type: 'passive', desc: 'You cannot die for the first 5 turns of any battle. After turn 5, you take +25% damage permanently.', icon: 'P', milestone: true },
        { id: 'war_t15b', name: 'Wrath of the Ancients', type: 'active', desc: '7.0x damage. Consumes all DEF for this fight — DEF becomes 0. Damage scales with lost DEF.', manaCost: 35, multiplier: 7.0, effect: 'wrath_ancients', icon: 'A', milestone: true },
        { id: 'war_t15c', name: 'Immovable Object', type: 'passive', desc: 'DEF is doubled. You cannot dodge or use potions. Defend fully negates all damage. You are the shield.', icon: 'P', milestone: true },
        { id: 'war_t15d', name: 'Living Monument', type: 'passive', desc: 'Max HP +50%. ATK -20%. Every turn you survive, gain +3% ATK permanently for the battle. Time is your weapon.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'war_t16a', name: 'Ironclad', type: 'passive', desc: '+25% DEF from all sources', icon: 'P' },
        { id: 'war_t16b', name: 'Warbringer', type: 'active', desc: '4.0x damage, gain +20% ATK for rest of fight', manaCost: 22, multiplier: 4.0, effect: 'warbringer', icon: 'A' },
        { id: 'war_t16c', name: 'Mana Fortress', type: 'passive', desc: 'Restore 4 mana when you defend', icon: 'P' },
        { id: 'war_t16d', name: 'Adaptive Armor', type: 'passive', desc: 'After being hit, take 5% less damage next hit (stacks 5x)', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'war_t17a', name: 'Vigilance', type: 'passive', desc: '25% chance to fully block any attack', icon: 'P' },
        { id: 'war_t17b', name: 'Judgment', type: 'active', desc: '5.0x damage, enemy ATK and DEF -25%', manaCost: 26, multiplier: 5.0, effect: 'judgment', icon: 'A' },
        { id: 'war_t17c', name: 'Steel Resolve', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t17d', name: 'Punisher', type: 'passive', desc: 'Counter-attacks deal 30% of your ATK after blocking', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'war_t18a', name: 'Undying Resolve', type: 'passive', desc: 'Survive lethal hit at 20% HP instead of 1 HP (once per battle)', icon: 'P' },
        { id: 'war_t18b', name: 'Colossal Strike', type: 'active', desc: '5.5x damage, DEF added to ATK for this hit', manaCost: 28, multiplier: 5.5, effect: 'colossal_strike', icon: 'A' },
        { id: 'war_t18c', name: 'Citadel', type: 'passive', desc: 'Heal 6% max HP at start of each turn', icon: 'P' },
        { id: 'war_t18d', name: 'Shield Mastery', type: 'passive', desc: 'Defend also reduces enemy ATK by 10%', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'war_t19a', name: 'Battle Hardened', type: 'passive', desc: 'Take 2% less damage for each turn that passes in battle', icon: 'P' },
        { id: 'war_t19b', name: 'Titanic Slam', type: 'active', desc: '6.0x damage, stun enemy 1 turn, ignore 30% DEF', manaCost: 30, multiplier: 6.0, effect: 'titanic_slam', icon: 'A' },
        { id: 'war_t19c', name: 'Aegis Supreme', type: 'passive', desc: '30% chance to fully block any attack', icon: 'P' },
        { id: 'war_t19d', name: 'Titan Constitution', type: 'passive', desc: '+25% max HP permanently', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'war_t20a', name: 'Eternal Guardian', type: 'passive', desc: 'All damage taken reduced by 50%. Your ATK is reduced by 35%. You can never die in fewer than 8 hits.', icon: 'P', milestone: true },
        { id: 'war_t20b', name: 'Cataclysm of Steel', type: 'active', desc: '10.0x damage. Shatters your armor — DEF halved for rest of fight. If enemy dies, DEF is fully restored.', manaCost: 40, multiplier: 10.0, effect: 'cataclysm_steel', icon: 'A', milestone: true },
        { id: 'war_t20c', name: 'Absolute Defense', type: 'passive', desc: 'Every 3rd hit against you is fully negated. Your ATK is halved. You cannot use skills costing >20 mana. An unbreakable wall.', icon: 'P', milestone: true },
        { id: 'war_t20d', name: 'Warmaster', type: 'passive', desc: 'ATK and DEF +40%. All skill costs doubled. Normal attacks hit twice. Balance through mastery.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'war_t21a', name: 'Unshakable', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t21b', name: 'Punishing Strike', type: 'active', desc: '4.5x damage, heal 15% max HP, restore 8 mana', manaCost: 24, multiplier: 4.5, effect: 'punishing_strike', icon: 'A' },
        { id: 'war_t21c', name: 'Living Armor', type: 'passive', desc: '+1 DEF each turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t21d', name: 'Righteous Fury', type: 'passive', desc: '+15% ATK when you defend successfully', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'war_t22a', name: 'Stalwart Commander', type: 'passive', desc: 'Pet damage +50%, pet takes 30% less damage', icon: 'P' },
        { id: 'war_t22b', name: 'Bladestorm', type: 'active', desc: '3.5x damage three times', manaCost: 28, multiplier: 3.5, effect: 'triple_strike', icon: 'A' },
        { id: 'war_t22c', name: 'Impervious', type: 'passive', desc: 'Cannot be reduced below 20% HP by a single hit', icon: 'P' },
        { id: 'war_t22d', name: 'Juggernaut Charge', type: 'passive', desc: '+20% damage on first attack each battle, ignore 40% DEF', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'war_t23a', name: 'Bulwark Mastery', type: 'passive', desc: 'Defending also reflects 30% of blocked damage', icon: 'P' },
        { id: 'war_t23b', name: 'Sundering Cleave', type: 'active', desc: '6.5x damage, reduce enemy DEF to 0', manaCost: 30, multiplier: 6.5, effect: 'full_armor_break', icon: 'A' },
        { id: 'war_t23c', name: 'Regeneration+', type: 'passive', desc: 'Heal 8% max HP at start of each turn', icon: 'P' },
        { id: 'war_t23d', name: 'Overpower', type: 'passive', desc: 'Skills ignore 25% of enemy DEF', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'war_t24a', name: 'Indestructible', type: 'passive', desc: 'Heal 8% max HP at start of each turn', icon: 'P' },
        { id: 'war_t24b', name: 'Worldsplitter', type: 'active', desc: '7.0x damage, ignore 50% DEF, gain 15% max HP as shield', manaCost: 34, multiplier: 7.0, effect: 'worldsplitter', icon: 'A' },
        { id: 'war_t24c', name: 'Legendary Armor', type: 'passive', desc: 'All equipment bonuses increased by 25%', icon: 'P' },
        { id: 'war_t24d', name: 'Undying Fortress', type: 'passive', desc: 'Survive lethal hits twice per battle at 15% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'war_t25a', name: 'Living Fortress', type: 'passive', desc: 'DEF is doubled. You regenerate 10% max HP/turn. Your ATK is halved. You cannot use active skills. You are an unkillable wall.', icon: 'P', milestone: true },
        { id: 'war_t25b', name: 'Final Judgment', type: 'active', desc: '15.0x damage. For the rest of the fight, you take double damage. If enemy survives, heal to full.', manaCost: 50, multiplier: 15.0, effect: 'final_judgment', icon: 'A', milestone: true },
        { id: 'war_t25c', name: 'Immortal Vanguard', type: 'passive', desc: 'You cannot die. Period. But every hit reduces your ATK by 2% permanently. Eventually you cannot fight.', icon: 'P', milestone: true },
        { id: 'war_t25d', name: 'One-Man Army', type: 'passive', desc: 'ATK and DEF +50%. Max HP +100%. All skill costs tripled. Active skills deal +50% damage. The ultimate soldier.', icon: 'P', milestone: true },
      ]},
    ],
  },
  thief: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'thf_t1a', name: 'Shadow Step', type: 'passive', desc: '15% chance to dodge enemy attacks', icon: 'P' },
        { id: 'thf_t1b', name: 'Poison Blade', type: 'active', desc: '1.5x damage, poison enemy for 3 turns', manaCost: 8, multiplier: 1.5, effect: 'apply_poison', icon: 'A' },
        { id: 'thf_t1c', name: 'Nimble Fingers', type: 'passive', desc: '+15% gold from battles', icon: 'P' },
        { id: 'thf_t1d', name: 'Keen Edge', type: 'passive', desc: '+8% ATK permanently', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'thf_t2a', name: 'Plunder', type: 'passive', desc: '+50% gold from battles', icon: 'P' },
        { id: 'thf_t2b', name: 'Assassinate', type: 'active', desc: '3.0x damage if enemy <30% HP, else 1.5x', manaCost: 10, multiplier: 1.5, effect: 'execute', icon: 'A' },
        { id: 'thf_t2c', name: 'Quick Reflexes', type: 'passive', desc: '+5% dodge chance', icon: 'P' },
        { id: 'thf_t2d', name: 'Venom Knowledge', type: 'passive', desc: 'Poison damage increased by 25%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'thf_t3a', name: 'Evasion Mastery', type: 'passive', desc: 'Dodge chance +10% (stacks with Shadow Step)', icon: 'P' },
        { id: 'thf_t3b', name: 'Shadow Dance', type: 'active', desc: '2.0x damage, dodge the next enemy attack', manaCost: 15, multiplier: 2.0, effect: 'shadow_dance', icon: 'A' },
        { id: 'thf_t3c', name: 'Agility', type: 'passive', desc: 'Restore 2 mana each time you dodge', icon: 'P' },
        { id: 'thf_t3d', name: 'Exploit Weakness', type: 'passive', desc: '+10% damage to poisoned enemies', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'thf_t4a', name: 'Lucky Strike', type: 'passive', desc: '20% chance to deal double damage on attacks', icon: 'P' },
        { id: 'thf_t4b', name: 'Death Mark', type: 'active', desc: '2.5x damage, ignores all enemy DEF', manaCost: 18, multiplier: 2.5, effect: 'true_damage', icon: 'A' },
        { id: 'thf_t4c', name: 'Sleight of Hand', type: 'passive', desc: 'Potions heal 20% more and restore 5 mana', icon: 'P' },
        { id: 'thf_t4d', name: 'Precision', type: 'passive', desc: 'All skills ignore 15% of enemy DEF', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'thf_t5a', name: 'Quick Hands', type: 'passive', desc: 'Potions heal 30% more', icon: 'P' },
        { id: 'thf_t5b', name: 'Fan of Knives', type: 'active', desc: '2.0x damage, apply poison for 2 turns', manaCost: 10, multiplier: 2.0, effect: 'apply_poison_short', icon: 'A' },
        { id: 'thf_t5c', name: 'Lethal Focus', type: 'passive', desc: '+12% ATK, +5% critical hit chance', icon: 'P' },
        { id: 'thf_t5d', name: 'Acrobat', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'thf_t6a', name: 'Opportunist', type: 'passive', desc: '+15% damage against poisoned enemies', icon: 'P' },
        { id: 'thf_t6b', name: 'Cheap Shot', type: 'active', desc: '1.8x damage, reduce enemy ATK by 20%', manaCost: 10, multiplier: 1.8, effect: 'cheap_shot', icon: 'A' },
        { id: 'thf_t6c', name: 'Mana Thief', type: 'passive', desc: 'Restore 3 mana each time you attack', icon: 'P' },
        { id: 'thf_t6d', name: 'Silent Killer', type: 'passive', desc: '+20% damage on first attack each battle', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'thf_t7a', name: 'Slippery', type: 'passive', desc: '100% escape chance from non-boss fights', icon: 'P' },
        { id: 'thf_t7b', name: 'Garrote', type: 'active', desc: '2.2x damage, strong poison for 3 turns', manaCost: 14, multiplier: 2.2, effect: 'strong_poison_3', icon: 'A' },
        { id: 'thf_t7c', name: 'Dirty Tricks', type: 'passive', desc: 'Poison and bleed durations +1 turn', icon: 'P' },
        { id: 'thf_t7d', name: 'Fleet Footed', type: 'passive', desc: '+8% dodge, immune to slow effects', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'thf_t8a', name: 'Treasure Hunter', type: 'passive', desc: 'Better loot drop rates from monsters', icon: 'P' },
        { id: 'thf_t8b', name: 'Ambush', type: 'active', desc: '3.0x damage, ignores 50% DEF', manaCost: 16, multiplier: 3.0, effect: 'pierce_50', icon: 'A' },
        { id: 'thf_t8c', name: 'Dual Wield', type: 'passive', desc: '15% chance to attack twice', icon: 'P' },
        { id: 'thf_t8d', name: 'Assassin Training', type: 'passive', desc: '+15% damage to enemies above 70% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'thf_t9a', name: 'Blade Dance', type: 'passive', desc: '10% chance to attack twice', icon: 'P' },
        { id: 'thf_t9b', name: 'Shadowstrike', type: 'active', desc: '3.5x damage, dodge next 2 attacks', manaCost: 22, multiplier: 3.5, effect: 'shadow_dance_2', icon: 'A' },
        { id: 'thf_t9c', name: 'Toxic Mastery', type: 'passive', desc: 'Poison damage doubled', icon: 'P' },
        { id: 'thf_t9d', name: 'Shadow Cloak', type: 'passive', desc: '+15% dodge chance at full HP', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'thf_t10a', name: 'Master Thief', type: 'passive', desc: 'Double gold + guaranteed rare+ loot drops', icon: 'P' },
        { id: 'thf_t10b', name: 'Phantom Blade', type: 'active', desc: '4.5x true damage, dodge next attack', manaCost: 28, multiplier: 4.5, effect: 'phantom_blade', icon: 'A' },
        { id: 'thf_t10c', name: 'Killing Spree', type: 'passive', desc: 'After killing an enemy, start next battle with +20% ATK', icon: 'P' },
        { id: 'thf_t10d', name: 'Perfect Evasion', type: 'passive', desc: '+25% dodge chance total', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'thf_t11a', name: 'Venomcraft', type: 'passive', desc: 'Poison damage doubled, poison lasts 1 extra turn', icon: 'P' },
        { id: 'thf_t11b', name: 'Kidney Shot', type: 'active', desc: '2.5x damage, stun enemy for 1 turn', manaCost: 14, multiplier: 2.5, effect: 'stun_1', icon: 'A' },
        { id: 'thf_t11c', name: 'Windwalker', type: 'passive', desc: 'After dodging, next attack deals +25% damage', icon: 'P' },
        { id: 'thf_t11d', name: 'Resourceful', type: 'passive', desc: 'Restore 4 mana at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'thf_t12a', name: 'Cloak of Shadows', type: 'passive', desc: '+20% dodge chance (stacks with others)', icon: 'P' },
        { id: 'thf_t12b', name: 'Backstab', type: 'active', desc: '4.0x true damage if you dodged last turn, else 2.0x', manaCost: 18, multiplier: 2.0, effect: 'backstab', icon: 'A' },
        { id: 'thf_t12c', name: 'Marked Prey', type: 'passive', desc: '+20% damage to enemies below 50% HP', icon: 'P' },
        { id: 'thf_t12d', name: 'Shadowstep Mastery', type: 'passive', desc: 'Dodge also restores 3% max HP', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'thf_t13a', name: 'Swift Strikes', type: 'passive', desc: '20% chance to attack twice (stacks with Blade Dance)', icon: 'P' },
        { id: 'thf_t13b', name: 'Toxic Barrage', type: 'active', desc: '2.0x damage 3 times, each applies 1 turn poison', manaCost: 20, multiplier: 2.0, effect: 'toxic_barrage', icon: 'A' },
        { id: 'thf_t13c', name: 'Serrated Blades', type: 'passive', desc: 'Normal attacks apply 1 turn bleed', icon: 'P' },
        { id: 'thf_t13d', name: 'Ghost Step', type: 'passive', desc: 'Every 4th turn, automatically dodge all attacks', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'thf_t14a', name: 'Cutthroat', type: 'passive', desc: '+30% damage to enemies below 40% HP', icon: 'P' },
        { id: 'thf_t14b', name: 'Marked for Death', type: 'active', desc: '3.0x damage, enemy takes +25% damage for 3 turns', manaCost: 20, multiplier: 3.0, effect: 'mark_death', icon: 'A' },
        { id: 'thf_t14c', name: 'Lethality', type: 'passive', desc: 'Critical hits now deal 3x damage instead of 2x', icon: 'P' },
        { id: 'thf_t14d', name: 'Vanish', type: 'passive', desc: 'When below 25% HP, gain 30% dodge for 2 turns', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'thf_t15a', name: 'Phantom Existence', type: 'passive', desc: '50% dodge chance. You deal 30% less damage. You can never be hit by more than 2 attacks in a row. Trade power for near-invulnerability.', icon: 'P', milestone: true },
        { id: 'thf_t15b', name: 'Death Sentence', type: 'active', desc: '10.0x true damage. Can only be used once per battle. If enemy survives, they gain +50% ATK.', manaCost: 35, multiplier: 10.0, effect: 'death_sentence', icon: 'A', milestone: true },
        { id: 'thf_t15c', name: 'Venom Lord', type: 'passive', desc: 'All poison damage tripled. Poison cannot be cleansed. Your non-poison damage is halved. Let the venom do the work.', icon: 'P', milestone: true },
        { id: 'thf_t15d', name: 'Shadow Assassin', type: 'passive', desc: 'First hit each battle is 5x damage. Gain +30% dodge. ATK -15% after first hit. One perfect strike defines you.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'thf_t16a', name: 'Elusive', type: 'passive', desc: 'After dodging, your next attack deals +40% damage', icon: 'P' },
        { id: 'thf_t16b', name: 'Shadow Assault', type: 'active', desc: '4.5x true damage, dodge next 2 attacks', manaCost: 24, multiplier: 4.5, effect: 'shadow_assault', icon: 'A' },
        { id: 'thf_t16c', name: 'Deadly Precision', type: 'passive', desc: 'Skills ignore 30% of enemy DEF', icon: 'P' },
        { id: 'thf_t16d', name: 'Phantom Speed', type: 'passive', desc: '+10% dodge, +10% ATK', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'thf_t17a', name: 'Pickpocket', type: 'passive', desc: 'Triple gold from battles, +15% rare item chance', icon: 'P' },
        { id: 'thf_t17b', name: 'Hemorrhage', type: 'active', desc: '3.5x damage, strong bleed for 4 turns', manaCost: 20, multiplier: 3.5, effect: 'hemorrhage', icon: 'A' },
        { id: 'thf_t17c', name: 'Assassin Instinct', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
        { id: 'thf_t17d', name: 'Evasive Maneuvers', type: 'passive', desc: 'Take 15% less damage from all sources', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'thf_t18a', name: 'Shadowmeld', type: 'passive', desc: 'First attack each battle is guaranteed critical (3x damage)', icon: 'P' },
        { id: 'thf_t18b', name: "Assassin's Creed", type: 'active', desc: '5.0x true damage, if enemy below 25% HP instant kill (not bosses)', manaCost: 26, multiplier: 5.0, effect: 'assassin_creed', icon: 'A' },
        { id: 'thf_t18c', name: 'Blinding Speed', type: 'passive', desc: '25% chance to attack twice on any turn', icon: 'P' },
        { id: 'thf_t18d', name: 'Deathblow', type: 'passive', desc: '+40% damage to enemies below 25% HP', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'thf_t19a', name: 'Predator', type: 'passive', desc: '+3% damage for each turn the fight has lasted', icon: 'P' },
        { id: 'thf_t19b', name: 'Phantom Storm', type: 'active', desc: '3.5x true damage 2 times, dodge next attack', manaCost: 28, multiplier: 3.5, effect: 'phantom_storm', icon: 'A' },
        { id: 'thf_t19c', name: 'Blade Mastery', type: 'passive', desc: 'All damage +20% permanently', icon: 'P' },
        { id: 'thf_t19d', name: 'Untouchable', type: 'passive', desc: '+35% dodge, but max HP reduced by 10%', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'thf_t20a', name: 'Living Shadow', type: 'passive', desc: '75% dodge chance. Your ATK is halved. Normal attacks apply lethal poison (3% enemy max HP/turn). You become untouchable but rely on time to kill.', icon: 'P', milestone: true },
        { id: 'thf_t20b', name: 'Coup de Grâce', type: 'active', desc: '15.0x true damage. Usable only when enemy is below 30% HP. Miss threshold = instant death for you.', manaCost: 40, multiplier: 15.0, effect: 'coup_de_grace', icon: 'A', milestone: true },
        { id: 'thf_t20c', name: 'Dance of Blades', type: 'passive', desc: 'Attack 3 times per turn. Each attack deals 40% normal damage. Every dodge gives +10% ATK for the rest of the battle. A whirlwind.', icon: 'P', milestone: true },
        { id: 'thf_t20d', name: 'Kingpin', type: 'passive', desc: 'Quadruple gold. Guaranteed legendary loot. +30% ATK. You take +20% damage. Greed is power.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'thf_t21a', name: 'Smoke Bomb', type: 'passive', desc: 'When hit, 25% chance to gain dodge for next attack', icon: 'P' },
        { id: 'thf_t21b', name: 'Execution Chain', type: 'active', desc: '5.0x damage, if kill refund all mana spent', manaCost: 26, multiplier: 5.0, effect: 'execution_chain', icon: 'A' },
        { id: 'thf_t21c', name: 'Shadowstrike+', type: 'passive', desc: 'After dodging, next attack ignores all DEF', icon: 'P' },
        { id: 'thf_t21d', name: 'Relentless Pursuit', type: 'passive', desc: '+4% ATK each turn (stacks infinitely)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'thf_t22a', name: 'Opportunity Strikes', type: 'passive', desc: 'Lucky Strike chance increased to 35%', icon: 'P' },
        { id: 'thf_t22b', name: 'Viper Strike', type: 'active', desc: '4.0x true damage, lethal poison for 4 turns', manaCost: 24, multiplier: 4.0, effect: 'viper_strike', icon: 'A' },
        { id: 'thf_t22c', name: 'Master Assassin', type: 'passive', desc: '+25% damage, +10% dodge', icon: 'P' },
        { id: 'thf_t22d', name: 'Toxic Immunity', type: 'passive', desc: 'Immune to poison and bleed, +15% ATK', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'thf_t23a', name: 'Ghost Walk', type: 'passive', desc: 'Every 3rd turn, automatically dodge all attacks', icon: 'P' },
        { id: 'thf_t23b', name: 'Shadow Barrage', type: 'active', desc: '3.0x true damage 3 times', manaCost: 30, multiplier: 3.0, effect: 'shadow_barrage', icon: 'A' },
        { id: 'thf_t23c', name: 'Perfect Timing', type: 'passive', desc: 'Skills have 20% chance to cost no mana', icon: 'P' },
        { id: 'thf_t23d', name: 'Death From Above', type: 'passive', desc: 'First attack each battle ignores all DEF and deals +50% damage', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'thf_t24a', name: 'Lethal Precision', type: 'passive', desc: 'Critical hits (Lucky Strike) now deal 3x instead of 2x', icon: 'P' },
        { id: 'thf_t24b', name: 'Dance of Death', type: 'active', desc: '6.0x true damage, dodge next 3 attacks', manaCost: 32, multiplier: 6.0, effect: 'dance_death', icon: 'A' },
        { id: 'thf_t24c', name: 'Shadow Lord', type: 'passive', desc: '+40% dodge chance, +20% ATK', icon: 'P' },
        { id: 'thf_t24d', name: 'Eternal Venom', type: 'passive', desc: 'All poison effects last forever (never expire)', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'thf_t25a', name: 'One with Nothing', type: 'passive', desc: 'Unequip all gear — your ATK and DEF become based on your level x3. Dodge chance 60%. Every hit you land steals 5% enemy max HP. You transcend equipment.', icon: 'P', milestone: true },
        { id: 'thf_t25b', name: 'Perfect Assassination', type: 'active', desc: '25.0x true damage. Only usable at full HP. Sets you to 1 HP after use. If enemy survives, fight continues normally.', manaCost: 50, multiplier: 25.0, effect: 'perfect_assassination', icon: 'A', milestone: true },
        { id: 'thf_t25c', name: 'Eternal Shadow', type: 'passive', desc: '90% dodge. ATK reduced to 25%. Every dodge deals 5% enemy max HP as shadow damage. You cannot be hit, but you barely hit back.', icon: 'P', milestone: true },
        { id: 'thf_t25d', name: 'God of Thieves', type: 'passive', desc: '10x gold. All loot is legendary. +50% ATK. You take double damage. Crits deal 5x. Fortune favors the bold.', icon: 'P', milestone: true },
      ]},
    ],
  },
  mage: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'mag_t1a', name: 'Mana Shield', type: 'passive', desc: '20% of damage taken is absorbed by mana', icon: 'P' },
        { id: 'mag_t1b', name: 'Fireball', type: 'active', desc: '2.0x true damage (ignores DEF)', manaCost: 10, multiplier: 2.0, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t1c', name: 'Arcane Focus', type: 'passive', desc: '+10% skill damage', icon: 'P' },
        { id: 'mag_t1d', name: 'Mana Flow', type: 'passive', desc: 'Restore 2 mana at start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'mag_t2a', name: 'Spell Echo', type: 'passive', desc: '20% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t2b', name: 'Ice Lance', type: 'active', desc: '1.6x damage, reduce enemy ATK by 20%', manaCost: 10, multiplier: 1.6, effect: 'freeze', icon: 'A' },
        { id: 'mag_t2c', name: 'Frost Armor', type: 'passive', desc: 'Take 8% less damage from all attacks', icon: 'P' },
        { id: 'mag_t2d', name: 'Mana Efficiency', type: 'passive', desc: 'All skills cost 10% less mana', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'mag_t3a', name: 'Arcane Overflow', type: 'passive', desc: '+1 ATK for every 10 current mana', icon: 'P' },
        { id: 'mag_t3b', name: 'Meteor', type: 'active', desc: '3.0x true damage (ignores DEF)', manaCost: 20, multiplier: 3.0, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t3c', name: 'Elemental Affinity', type: 'passive', desc: '+15% ATK permanently', icon: 'P' },
        { id: 'mag_t3d', name: 'Arcane Regeneration', type: 'passive', desc: 'Restore 3% max mana each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'mag_t4a', name: 'Mana Surge', type: 'passive', desc: 'All skills cost 25% less mana', icon: 'P' },
        { id: 'mag_t4b', name: 'Chain Lightning', type: 'active', desc: '2.5x damage, reduce enemy DEF by 25%', manaCost: 16, multiplier: 2.5, effect: 'chain_lightning', icon: 'A' },
        { id: 'mag_t4c', name: 'Spell Shield', type: 'passive', desc: '+10% max mana, +5% DEF', icon: 'P' },
        { id: 'mag_t4d', name: 'Burning Soul', type: 'passive', desc: 'After using a skill, deal 5% ATK as bonus damage on next attack', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'mag_t5a', name: 'Meditation', type: 'passive', desc: 'Restore 4 mana at the start of each turn', icon: 'P' },
        { id: 'mag_t5b', name: 'Frost Nova', type: 'active', desc: '1.8x damage, enemy ATK -30%', manaCost: 14, multiplier: 1.8, effect: 'frost_nova', icon: 'A' },
        { id: 'mag_t5c', name: 'Arcane Brilliance', type: 'passive', desc: '+20% max mana', icon: 'P' },
        { id: 'mag_t5d', name: 'Elemental Ward', type: 'passive', desc: 'Take 10% less damage, +5% max HP', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'mag_t6a', name: 'Elemental Mastery', type: 'passive', desc: 'All skill damage +20%', icon: 'P' },
        { id: 'mag_t6b', name: 'Lightning Bolt', type: 'active', desc: '2.2x true damage', manaCost: 14, multiplier: 2.2, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t6c', name: 'Mana Harvest', type: 'passive', desc: 'Restore 5 mana when you deal damage with a skill', icon: 'P' },
        { id: 'mag_t6d', name: 'Crystallize', type: 'passive', desc: 'When defending, gain a shield equal to 10% max mana', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'mag_t7a', name: 'Arcane Barrier', type: 'passive', desc: 'Defend also restores 10 mana', icon: 'P' },
        { id: 'mag_t7b', name: 'Blizzard', type: 'active', desc: '2.0x damage, enemy ATK & DEF -15%', manaCost: 16, multiplier: 2.0, effect: 'blizzard', icon: 'A' },
        { id: 'mag_t7c', name: 'Arcane Potency', type: 'passive', desc: 'Skill damage scales with 5% of current mana', icon: 'P' },
        { id: 'mag_t7d', name: 'Enchanted Armor', type: 'passive', desc: '+15% DEF, equipment DEF bonuses +10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'mag_t8a', name: 'Spellweaver', type: 'passive', desc: 'After using a skill, next attack deals +50% damage', icon: 'P' },
        { id: 'mag_t8b', name: 'Pyroblast', type: 'active', desc: '3.5x true damage', manaCost: 22, multiplier: 3.5, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t8c', name: 'Mana Mastery', type: 'passive', desc: '+15% max mana, restore 3 mana per turn', icon: 'P' },
        { id: 'mag_t8d', name: 'Empowered Spells', type: 'passive', desc: 'Skills that cost >15 mana deal +25% damage', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'mag_t9a', name: 'Mana Regeneration', type: 'passive', desc: 'Restore 8% max mana each turn', icon: 'P' },
        { id: 'mag_t9b', name: 'Arcane Torrent', type: 'active', desc: '3.0x damage, restore 50% mana spent', manaCost: 20, multiplier: 3.0, effect: 'mana_refund', icon: 'A' },
        { id: 'mag_t9c', name: 'Spell Penetration', type: 'passive', desc: 'All skills ignore 20% of enemy DEF', icon: 'P' },
        { id: 'mag_t9d', name: 'Arcane Resilience', type: 'passive', desc: '+12% max HP, immune to mana drain effects', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'mag_t10a', name: 'Transcendence', type: 'passive', desc: 'Mana Shield absorbs 40% instead of 20%', icon: 'P' },
        { id: 'mag_t10b', name: 'Cataclysm', type: 'active', desc: '5.0x true damage', manaCost: 30, multiplier: 5.0, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t10c', name: 'Spell Lord', type: 'passive', desc: 'All skill damage +25%, +10% max mana', icon: 'P' },
        { id: 'mag_t10d', name: 'Living Mana', type: 'passive', desc: 'Heal 3% max HP when you spend mana', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'mag_t11a', name: 'Arcane Intellect', type: 'passive', desc: '+2 ATK per 10 max mana', icon: 'P' },
        { id: 'mag_t11b', name: 'Inferno', type: 'active', desc: '3.5x true damage, enemy ATK -20%', manaCost: 18, multiplier: 3.5, effect: 'inferno', icon: 'A' },
        { id: 'mag_t11c', name: 'Mana Font', type: 'passive', desc: '+25% max mana', icon: 'P' },
        { id: 'mag_t11d', name: 'Elemental Fury', type: 'passive', desc: 'Skills have 15% chance to deal double damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'mag_t12a', name: 'Mana Well', type: 'passive', desc: '+30% max mana', icon: 'P' },
        { id: 'mag_t12b', name: 'Arcane Missiles', type: 'active', desc: '2.0x true damage 3 times', manaCost: 20, multiplier: 2.0, effect: 'arcane_missiles', icon: 'A' },
        { id: 'mag_t12c', name: 'Runic Power', type: 'passive', desc: '+2% skill damage per level above 15', icon: 'P' },
        { id: 'mag_t12d', name: 'Elemental Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 15% max mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'mag_t13a', name: 'Sorcerous Shield', type: 'passive', desc: 'Start battle with a shield equal to 20% max mana', icon: 'P' },
        { id: 'mag_t13b', name: 'Comet', type: 'active', desc: '4.5x true damage, reduce enemy DEF by 40%', manaCost: 24, multiplier: 4.5, effect: 'comet', icon: 'A' },
        { id: 'mag_t13c', name: 'Volatile Magic', type: 'passive', desc: 'Skills have 25% chance to deal +50% damage', icon: 'P' },
        { id: 'mag_t13d', name: 'Astral Sight', type: 'passive', desc: 'All enemy stats visible, +10% damage to all enemies', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'mag_t14a', name: 'Spell Mastery', type: 'passive', desc: 'All skill damage +30%', icon: 'P' },
        { id: 'mag_t14b', name: 'Void Bolt', type: 'active', desc: '4.0x true damage, drain 10% enemy max HP as mana', manaCost: 22, multiplier: 4.0, effect: 'void_bolt', icon: 'A' },
        { id: 'mag_t14c', name: 'Deep Reserves', type: 'passive', desc: '+40% max mana, restore 5% max mana per turn', icon: 'P' },
        { id: 'mag_t14d', name: 'Arcane Supremacy', type: 'passive', desc: 'Equipment ATK bonuses increased by 25%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'mag_t15a', name: 'Archmage', type: 'passive', desc: 'All skills cost 50% less mana. Your max HP is halved permanently. Mana becomes your true resource — HP is just a suggestion.', icon: 'P', milestone: true },
        { id: 'mag_t15b', name: 'Supernova', type: 'active', desc: '9.0x true damage. Drains ALL remaining mana. Deals bonus damage equal to mana spent.', manaCost: 1, multiplier: 9.0, effect: 'supernova', icon: 'A', milestone: true },
        { id: 'mag_t15c', name: 'Spell Singularity', type: 'passive', desc: 'Every spell you cast increases all future spell damage by 3% (stacks infinitely). Mana costs increase by 1 each cast. Infinite potential.', icon: 'P', milestone: true },
        { id: 'mag_t15d', name: 'Mana Incarnate', type: 'passive', desc: 'Your mana pool doubles. All damage scales with current mana (1% per 5 mana). At 0 mana you deal 0 damage. Mana IS your power.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'mag_t16a', name: 'Temporal Shield', type: 'passive', desc: 'After taking damage, heal 50% of it over 2 turns', icon: 'P' },
        { id: 'mag_t16b', name: 'Disintegrate', type: 'active', desc: '5.5x true damage, ignore all DEF', manaCost: 26, multiplier: 5.5, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t16c', name: 'Feedback Loop', type: 'passive', desc: 'When a skill deals double damage (Spell Echo), restore all mana spent', icon: 'P' },
        { id: 'mag_t16d', name: 'Arcane Fortification', type: 'passive', desc: '+20% DEF, +20% max HP', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'mag_t17a', name: 'Leyline Tap', type: 'passive', desc: 'Restore 12% max mana each turn', icon: 'P' },
        { id: 'mag_t17b', name: 'Apocalyptic Fire', type: 'active', desc: '5.0x true damage, enemy burns for 4% max HP/turn for 3 turns', manaCost: 24, multiplier: 5.0, effect: 'apoc_fire', icon: 'A' },
        { id: 'mag_t17c', name: 'Spellfire', type: 'passive', desc: 'Normal attacks deal true damage (ignore DEF)', icon: 'P' },
        { id: 'mag_t17d', name: 'Mana Conduit', type: 'passive', desc: '+3 ATK per 10 current mana', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'mag_t18a', name: 'Spell Echo+', type: 'passive', desc: '35% chance for skills to deal double damage (replaces Spell Echo)', icon: 'P' },
        { id: 'mag_t18b', name: 'Gravity Well', type: 'active', desc: '4.0x true damage, stun enemy 1 turn, ATK & DEF -20%', manaCost: 24, multiplier: 4.0, effect: 'gravity_well', icon: 'A' },
        { id: 'mag_t18c', name: 'Arcane Torrent+', type: 'passive', desc: 'All skill damage +35%', icon: 'P' },
        { id: 'mag_t18d', name: 'Counterspell', type: 'passive', desc: 'Immune to enemy debuffs and ATK reductions', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'mag_t19a', name: 'Overcharge', type: 'passive', desc: 'When mana is above 75%, all damage +25%', icon: 'P' },
        { id: 'mag_t19b', name: 'Starfall', type: 'active', desc: '4.0x true damage 2 times', manaCost: 30, multiplier: 4.0, effect: 'double_true', icon: 'A' },
        { id: 'mag_t19c', name: 'Infinite Mana', type: 'passive', desc: '+50% max mana, restore 8% max mana per turn', icon: 'P' },
        { id: 'mag_t19d', name: 'Devastation', type: 'passive', desc: 'Skills that cost >25 mana deal +40% damage', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'mag_t20a', name: 'Lich Ascension', type: 'passive', desc: 'Your HP and Mana pools merge into one Arcane HP pool. Spells cost HP. Your total pool is HP + Mana combined. All healing works on this pool.', icon: 'P', milestone: true },
        { id: 'mag_t20b', name: 'Singularity', type: 'active', desc: '14.0x true damage. After casting, you cannot cast spells for 2 turns (cooldown).', manaCost: 45, multiplier: 14.0, effect: 'singularity', icon: 'A', milestone: true },
        { id: 'mag_t20c', name: 'Living Spellbook', type: 'passive', desc: 'All active skills cost 0 mana. Your max HP is reduced by 60%. Every spell cast costs 5% current HP instead. Glass cannon perfected.', icon: 'P', milestone: true },
        { id: 'mag_t20d', name: 'Arcane Godhood', type: 'passive', desc: 'All skill damage doubled. Max mana tripled. Cannot use normal attacks. Defending restores 20% mana. Pure spellcaster.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'mag_t21a', name: 'Arcane Attunement', type: 'passive', desc: '+1% skill damage per player level', icon: 'P' },
        { id: 'mag_t21b', name: 'Chain Destruction', type: 'active', desc: '4.5x true damage, reduce enemy DEF by 50%', manaCost: 26, multiplier: 4.5, effect: 'chain_destruction', icon: 'A' },
        { id: 'mag_t21c', name: 'Spell Cascade', type: 'passive', desc: 'After using a skill, 30% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t21d', name: 'Mana Absorption', type: 'passive', desc: '15% of damage taken is converted to mana', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'mag_t22a', name: 'Spell Absorption', type: 'passive', desc: '10% of damage taken is converted to mana', icon: 'P' },
        { id: 'mag_t22b', name: 'Dimensional Rift', type: 'active', desc: '6.0x true damage, dodge next attack', manaCost: 28, multiplier: 6.0, effect: 'dim_rift', icon: 'A' },
        { id: 'mag_t22c', name: 'Arcane Overload', type: 'passive', desc: 'All damage +30%, take 10% more damage', icon: 'P' },
        { id: 'mag_t22d', name: 'Mana Shield+', type: 'passive', desc: 'Mana Shield now absorbs 50% of damage', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'mag_t23a', name: 'Infinite Power', type: 'passive', desc: 'Skills that cost mana also deal bonus damage equal to mana spent', icon: 'P' },
        { id: 'mag_t23b', name: 'Cosmic Ray', type: 'active', desc: '7.0x true damage', manaCost: 32, multiplier: 7.0, effect: 'true_damage', icon: 'A' },
        { id: 'mag_t23c', name: 'Arcane Perfection', type: 'passive', desc: 'Skills have 25% chance to cost no mana', icon: 'P' },
        { id: 'mag_t23d', name: 'Spellstorm', type: 'passive', desc: 'Each skill used in battle increases next skill damage by 10%', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'mag_t24a', name: 'Astral Form', type: 'passive', desc: 'Mana Shield absorbs 60% of damage (replaces Transcendence)', icon: 'P' },
        { id: 'mag_t24b', name: 'Oblivion Beam', type: 'active', desc: '8.0x true damage, costs 20% current HP too', manaCost: 34, multiplier: 8.0, effect: 'oblivion_beam', icon: 'A' },
        { id: 'mag_t24c', name: 'Endless Wisdom', type: 'passive', desc: '+3% ATK per level above 30', icon: 'P' },
        { id: 'mag_t24d', name: 'Supreme Intellect', type: 'passive', desc: '+50% max mana, all skill damage +20%', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'mag_t25a', name: 'Reality Weaver', type: 'passive', desc: 'Each spell you cast permanently increases your ATK by 2 for the rest of the run. Mana costs doubled. Your power grows infinitely but each spell is a gamble.', icon: 'P', milestone: true },
        { id: 'mag_t25b', name: 'Big Bang', type: 'active', desc: '30.0x true damage. Costs ALL mana and 50% HP. 1 use per battle. The ultimate gambit.', manaCost: 1, multiplier: 30.0, effect: 'big_bang', icon: 'A', milestone: true },
        { id: 'mag_t25c', name: 'Omniscience', type: 'passive', desc: 'All skills deal true damage. All skills cost 75% less. Your max HP is reduced to 1. One hit kills you. Absolute power at absolute risk.', icon: 'P', milestone: true },
        { id: 'mag_t25d', name: 'Spell Weaver Supreme', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 1%. Normal attacks are replaced by free 2.0x true damage spells. You become magic itself.', icon: 'P', milestone: true },
      ]},
    ],
  },
  necromancer: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'nec_t1a', name: 'Soul Siphon', type: 'passive', desc: 'Attacks have 25% chance to restore 5 mana', icon: 'P' },
        { id: 'nec_t1b', name: 'Bone Spear', type: 'active', desc: '1.8x damage, ignores 40% DEF', manaCost: 8, multiplier: 1.8, effect: 'pierce_40', icon: 'A' },
        { id: 'nec_t1c', name: 'Dark Vitality', type: 'passive', desc: '+5% max HP, +5% ATK', icon: 'P' },
        { id: 'nec_t1d', name: 'Necrotic Presence', type: 'passive', desc: 'Enemies take 2% max HP damage at start of combat', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'nec_t2a', name: "Death's Embrace", type: 'passive', desc: 'When below 25% HP, heal 15% max HP (once/battle)', icon: 'P' },
        { id: 'nec_t2b', name: 'Plague', type: 'active', desc: '1.2x damage, strong poison for 4 turns', manaCost: 10, multiplier: 1.2, effect: 'strong_poison', icon: 'A' },
        { id: 'nec_t2c', name: 'Bone Armor', type: 'passive', desc: 'Take 8% less damage from all attacks', icon: 'P' },
        { id: 'nec_t2d', name: 'Soul Leech', type: 'passive', desc: 'Normal attacks heal 5% of damage dealt', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'nec_t3a', name: 'Vampiric Aura', type: 'passive', desc: 'All attacks heal 10% of damage dealt', icon: 'P' },
        { id: 'nec_t3b', name: 'Soul Harvest', type: 'active', desc: '2.5x damage, heal 60% of damage dealt', manaCost: 15, multiplier: 2.5, effect: 'soul_harvest', icon: 'A' },
        { id: 'nec_t3c', name: 'Corpse Shield', type: 'passive', desc: '+12% DEF permanently', icon: 'P' },
        { id: 'nec_t3d', name: 'Dark Channeling', type: 'passive', desc: 'Restore 3 mana at start of each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'nec_t4a', name: 'Dark Pact', type: 'passive', desc: 'Sacrifice 5% HP per turn, gain +25% ATK', icon: 'P' },
        { id: 'nec_t4b', name: 'Doom', type: 'active', desc: '2.0x damage, enemy takes 8% max HP/turn for 3 turns', manaCost: 20, multiplier: 2.0, effect: 'doom', icon: 'A' },
        { id: 'nec_t4c', name: 'Spectral Grasp', type: 'passive', desc: 'Poison effects you apply also reduce enemy ATK by 10%', icon: 'P' },
        { id: 'nec_t4d', name: 'Unholy Vigor', type: 'passive', desc: '+15% ATK, heal 2% max HP per turn', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'nec_t5a', name: 'Necrotic Touch', type: 'passive', desc: 'Normal attacks reduce enemy DEF by 1 each hit', icon: 'P' },
        { id: 'nec_t5b', name: 'Corpse Explosion', type: 'active', desc: '2.2x damage, +50% if enemy is poisoned', manaCost: 12, multiplier: 2.2, effect: 'corpse_explode', icon: 'A' },
        { id: 'nec_t5c', name: 'Decay Aura', type: 'passive', desc: 'Enemies take 1% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t5d', name: 'Soul Well', type: 'passive', desc: '+15% max mana, restore 2 mana when enemy takes DoT damage', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'nec_t6a', name: 'Life Tap', type: 'passive', desc: 'Spending mana heals 50% of mana spent as HP', icon: 'P' },
        { id: 'nec_t6b', name: 'Shadow Bolt', type: 'active', desc: '2.4x damage, ignores 30% DEF', manaCost: 12, multiplier: 2.4, effect: 'pierce_30', icon: 'A' },
        { id: 'nec_t6c', name: 'Cursed Touch', type: 'passive', desc: 'Normal attacks have 15% chance to doom enemy for 2 turns', icon: 'P' },
        { id: 'nec_t6d', name: 'Bone Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 10% max HP', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'nec_t7a', name: 'Undead Fortitude', type: 'passive', desc: '+10% max HP and +10% DEF', icon: 'P' },
        { id: 'nec_t7b', name: 'Death Coil', type: 'active', desc: '2.0x damage, heal 100% of damage dealt', manaCost: 18, multiplier: 2.0, effect: 'full_drain', icon: 'A' },
        { id: 'nec_t7c', name: 'Pestilence', type: 'passive', desc: 'Poison effects last 1 extra turn', icon: 'P' },
        { id: 'nec_t7d', name: 'Dark Resilience', type: 'passive', desc: 'Immune to poison, +8% ATK', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'nec_t8a', name: 'Cursed Blood', type: 'passive', desc: 'When hit, 20% chance to poison the attacker for 2 turns', icon: 'P' },
        { id: 'nec_t8b', name: 'Wither', type: 'active', desc: '1.5x damage, reduce enemy ATK and DEF by 25%', manaCost: 16, multiplier: 1.5, effect: 'wither', icon: 'A' },
        { id: 'nec_t8c', name: 'Soul Harvest+', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
        { id: 'nec_t8d', name: 'Blighted Ground', type: 'passive', desc: 'Enemies take +15% damage from poison and doom', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'nec_t9a', name: 'Eternal Hunger', type: 'passive', desc: 'Lifesteal from all sources increased by 50%', icon: 'P' },
        { id: 'nec_t9b', name: 'Army of the Dead', type: 'active', desc: '3.5x damage, heal 40% of damage dealt', manaCost: 22, multiplier: 3.5, effect: 'army_drain', icon: 'A' },
        { id: 'nec_t9c', name: 'Dark Empowerment', type: 'passive', desc: '+20% ATK when enemy is poisoned or doomed', icon: 'P' },
        { id: 'nec_t9d', name: 'Reaper Form', type: 'passive', desc: '+5% ATK per turn in battle (stacks)', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'nec_t10a', name: 'Lich Form', type: 'passive', desc: 'All healing doubled, +20% ATK, immune to poison', icon: 'P' },
        { id: 'nec_t10b', name: 'Apocalypse', type: 'active', desc: '4.5x damage, doom for 4 turns, heal 30%', manaCost: 30, multiplier: 4.5, effect: 'nec_apocalypse', icon: 'A' },
        { id: 'nec_t10c', name: 'Soul Lord', type: 'passive', desc: '+25% ATK, +15% max mana, restore 5 mana on kill', icon: 'P' },
        { id: 'nec_t10d', name: 'Undying', type: 'passive', desc: 'Survive one lethal hit per battle at 20% HP', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'nec_t11a', name: 'Death Aura', type: 'passive', desc: 'Enemies take 3% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t11b', name: 'Spirit Lance', type: 'active', desc: '3.5x damage, heal 50% of damage dealt', manaCost: 18, multiplier: 3.5, effect: 'spirit_lance', icon: 'A' },
        { id: 'nec_t11c', name: 'Ghoul Strength', type: 'passive', desc: '+20% ATK permanently', icon: 'P' },
        { id: 'nec_t11d', name: 'Miasma', type: 'passive', desc: 'All DoT effects deal 20% more damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'nec_t12a', name: 'Soul Collector', type: 'passive', desc: 'Gain +3% ATK per battle won (resets on rest, max 30%)', icon: 'P' },
        { id: 'nec_t12b', name: 'Bone Storm', type: 'active', desc: '2.5x damage 2 times, ignore 30% DEF each hit', manaCost: 20, multiplier: 2.5, effect: 'bone_storm', icon: 'A' },
        { id: 'nec_t12c', name: 'Vile Contagion', type: 'passive', desc: 'Poison effects also apply doom for 1 turn', icon: 'P' },
        { id: 'nec_t12d', name: 'Drain Essence', type: 'passive', desc: 'Normal attacks restore 3 mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'nec_t13a', name: 'Hungering Void', type: 'passive', desc: 'Lifesteal from all sources now also restores mana equal to 25% of healing done', icon: 'P' },
        { id: 'nec_t13b', name: 'Devouring Plague', type: 'active', desc: '3.0x damage, doom 4 turns, heal 20% of damage', manaCost: 22, multiplier: 3.0, effect: 'devouring_plague', icon: 'A' },
        { id: 'nec_t13c', name: 'Lich Armor', type: 'passive', desc: '+20% DEF, immune to ATK debuffs', icon: 'P' },
        { id: 'nec_t13d', name: 'Soulfire', type: 'passive', desc: '+15% skill damage, skills ignore 15% DEF', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'nec_t14a', name: 'Phylactery', type: 'passive', desc: 'On death, revive once at 30% HP (once per battle)', icon: 'P' },
        { id: 'nec_t14b', name: 'Soul Rend', type: 'active', desc: '4.5x damage, steal 10% enemy ATK permanently', manaCost: 24, multiplier: 4.5, effect: 'soul_rend', icon: 'A' },
        { id: 'nec_t14c', name: 'Plague Lord', type: 'passive', desc: 'All poison and doom durations +2 turns', icon: 'P' },
        { id: 'nec_t14d', name: 'Death Shroud', type: 'passive', desc: 'Take 15% less damage from all sources', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'nec_t15a', name: 'Pact of Undeath', type: 'passive', desc: 'You are undead. Healing is 50% more effective. Potions damage you instead of healing. Your HP slowly drains (1%/turn) but you lifesteal from everything.', icon: 'P', milestone: true },
        { id: 'nec_t15b', name: 'Soul Apocalypse', type: 'active', desc: '8.0x damage. Costs 25% HP. Heals 100% of damage dealt. Dooms enemy for 5 turns. If enemy survives, your max HP is reduced by 10% for the fight.', manaCost: 35, multiplier: 8.0, effect: 'soul_apocalypse', icon: 'A', milestone: true },
        { id: 'nec_t15c', name: 'Plague Bearer', type: 'passive', desc: 'All DoT damage tripled. Poison and doom cannot be resisted. Your direct damage is reduced by 40%. Death comes slowly but inevitably.', icon: 'P', milestone: true },
        { id: 'nec_t15d', name: 'Soul Devourer', type: 'passive', desc: 'Every attack steals 3% enemy max HP permanently and adds it to yours. Your base ATK is halved. You grow by consuming.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'nec_t16a', name: 'Grave Chill', type: 'passive', desc: 'Enemies you poison also have ATK reduced by 15%', icon: 'P' },
        { id: 'nec_t16b', name: 'Necrotic Burst', type: 'active', desc: '4.0x damage, +100% if enemy is doomed or poisoned', manaCost: 22, multiplier: 4.0, effect: 'necrotic_burst', icon: 'A' },
        { id: 'nec_t16c', name: 'Siphon Life', type: 'passive', desc: 'Heal 4% max HP at start of each turn', icon: 'P' },
        { id: 'nec_t16d', name: 'Dark Power', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'nec_t17a', name: 'Undying Servitude', type: 'passive', desc: 'Dark Pact ATK bonus increased to +50%, sacrifice reduced to 3%', icon: 'P' },
        { id: 'nec_t17b', name: 'Abyssal Strike', type: 'active', desc: '5.0x damage, ignore 50% DEF, heal 30% of damage', manaCost: 26, multiplier: 5.0, effect: 'abyssal_strike', icon: 'A' },
        { id: 'nec_t17c', name: 'Entropic Decay', type: 'passive', desc: 'Enemy DEF reduced by 3% each turn (stacks)', icon: 'P' },
        { id: 'nec_t17d', name: 'Death Knight', type: 'passive', desc: '+20% ATK, +15% DEF, immune to doom', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'nec_t18a', name: 'Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 15%, heal 5% max HP per turn', icon: 'P' },
        { id: 'nec_t18b', name: 'Mass Wither', type: 'active', desc: '3.0x damage, reduce enemy ATK and DEF by 40%', manaCost: 24, multiplier: 3.0, effect: 'mass_wither', icon: 'A' },
        { id: 'nec_t18c', name: 'Necrotic Empowerment', type: 'passive', desc: 'Skills deal +25% damage against poisoned/doomed targets', icon: 'P' },
        { id: 'nec_t18d', name: 'Wraithform', type: 'passive', desc: '+15% dodge chance, +10% ATK', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'nec_t19a', name: 'Essence Drain', type: 'passive', desc: 'Doom damage also heals you for 100% of damage dealt', icon: 'P' },
        { id: 'nec_t19b', name: 'Death Wave', type: 'active', desc: '5.5x damage, doom 3 turns, poison 3 turns', manaCost: 28, multiplier: 5.5, effect: 'death_wave', icon: 'A' },
        { id: 'nec_t19c', name: 'Eternal Dread', type: 'passive', desc: 'Doom effects last forever (never expire)', icon: 'P' },
        { id: 'nec_t19d', name: 'Abyssal Power', type: 'passive', desc: '+30% ATK when enemy is affected by any DoT', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'nec_t20a', name: 'Death Incarnate', type: 'passive', desc: 'All DoT damage (poison/doom/bleed) on enemies is tripled. Your direct attack damage is halved. You become a patient executioner, letting decay do the work.', icon: 'P', milestone: true },
        { id: 'nec_t20b', name: 'Extinction Event', type: 'active', desc: '12.0x damage. Heals 50% of damage dealt. Dooms for 5 turns. Costs 30% current HP. Your max HP is permanently reduced by 5% each use (stacks).', manaCost: 40, multiplier: 12.0, effect: 'extinction_event', icon: 'A', milestone: true },
        { id: 'nec_t20c', name: 'Eternal Lich', type: 'passive', desc: 'All healing doubled. Lifesteal doubled. All damage taken increased by 30%. Your DEF becomes 0. You sustain through pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t20d', name: 'Entropy Lord', type: 'passive', desc: 'Every turn, enemy ATK and DEF each drop by 3% permanently. Your ATK also drops by 1%/turn. Everything fades — the question is who fades first.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'nec_t21a', name: 'Necrotic Mastery', type: 'passive', desc: 'Poison and doom cannot be resisted or cleansed by enemies', icon: 'P' },
        { id: 'nec_t21b', name: 'Siphon Soul', type: 'active', desc: '4.0x damage, steal 15% enemy max HP as healing', manaCost: 24, multiplier: 4.0, effect: 'siphon_soul', icon: 'A' },
        { id: 'nec_t21c', name: 'Soul Storm', type: 'passive', desc: 'All skill damage +25%', icon: 'P' },
        { id: 'nec_t21d', name: 'Undead Army', type: 'passive', desc: '+3% ATK per DoT effect on enemy (stacks)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'nec_t22a', name: 'Spectral Armor', type: 'passive', desc: 'Gain +1 DEF for every 5% HP you are missing', icon: 'P' },
        { id: 'nec_t22b', name: 'Banshee Wail', type: 'active', desc: '3.5x damage, stun 1 turn, enemy ATK -30%', manaCost: 24, multiplier: 3.5, effect: 'banshee_wail', icon: 'A' },
        { id: 'nec_t22c', name: 'Death Mark', type: 'passive', desc: '+30% damage to enemies below 40% HP', icon: 'P' },
        { id: 'nec_t22d', name: 'Soul Forge', type: 'passive', desc: 'Lifesteal from all sources doubled', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'nec_t23a', name: 'Blood Magic', type: 'passive', desc: 'When out of mana, spells cost HP instead (at 2x rate)', icon: 'P' },
        { id: 'nec_t23b', name: 'Death Grip', type: 'active', desc: '6.0x damage, heal 40% of damage, enemy DEF -50%', manaCost: 30, multiplier: 6.0, effect: 'death_grip', icon: 'A' },
        { id: 'nec_t23c', name: 'Lich Mastery', type: 'passive', desc: 'All skill costs -30%, all healing +30%', icon: 'P' },
        { id: 'nec_t23d', name: 'Reaper Presence', type: 'passive', desc: 'Enemies take 5% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'nec_t24a', name: 'Eternal Undeath', type: 'passive', desc: 'Revive from Phylactery now triggers twice, at 50% HP each time', icon: 'P' },
        { id: 'nec_t24b', name: 'Annihilation', type: 'active', desc: '7.0x damage, doom 4 turns, heal 50% of damage dealt', manaCost: 34, multiplier: 7.0, effect: 'annihilation', icon: 'A' },
        { id: 'nec_t24c', name: 'Supreme Drain', type: 'passive', desc: 'Lifesteal tripled, all healing +50%', icon: 'P' },
        { id: 'nec_t24d', name: 'Endless Decay', type: 'passive', desc: 'All DoT effects deal +50% damage and last +2 turns', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'nec_t25a', name: 'Harbinger of Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats (ATK, DEF, HP) decay by 2%. Your own ATK decays by 1%/turn. Given enough time, everything dies — including you.', icon: 'P', milestone: true },
        { id: 'nec_t25b', name: 'Requiem', type: 'active', desc: '20.0x damage. Costs 50% current HP. Heals 100% of damage. Dooms for 6 turns. If enemy survives with <10% HP, instant kill. The final song.', manaCost: 50, multiplier: 20.0, effect: 'requiem', icon: 'A', milestone: true },
        { id: 'nec_t25c', name: 'Undeath Eternal', type: 'passive', desc: 'Cannot die. When HP reaches 0, consume 50% max mana to revive at 25% HP. When mana is also 0, you finally rest. Infinite persistence.', icon: 'P', milestone: true },
        { id: 'nec_t25d', name: 'Lord of the Dead', type: 'passive', desc: 'All attacks apply doom (5 turns) and poison (5 turns). All damage +50%. You take 3% max HP per turn as necrotic decay. Race against your own entropy.', icon: 'P', milestone: true },
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
