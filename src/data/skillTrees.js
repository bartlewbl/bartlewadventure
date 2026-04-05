// Skill tree definitions - pure data, no logic
// Each class has tiers. At each tier the player picks 1 of 3 passive options (permanent choice).
// type: 'passive' (always active, stacks permanently)

import { CHARACTER_CLASSES } from './gameData';

export const SKILL_TREES = {
  berserker: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'brs_t1a', name: 'Blood Frenzy', type: 'passive', desc: '+2% ATK for each 6% HP missing', icon: 'P' },
        { id: 'brs_t1c', name: 'Battle Scars', type: 'passive', desc: '+3% max HP permanently from battle', icon: 'P' },
        { id: 'brs_t1d', name: 'Fury Building', type: 'passive', desc: '+2% ATK each turn in combat (stacks)', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'brs_t2a', name: 'Undying Will', type: 'passive', desc: 'Survive one lethal hit per battle at 1 HP', icon: 'P' },
        { id: 'brs_t2c', name: 'Reckless Abandon', type: 'passive', desc: '+6% ATK but take 3% more damage', icon: 'P' },
        { id: 'brs_t2d', name: 'Iron Will', type: 'passive', desc: '6% resistance to all debuffs', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'brs_t3a', name: 'Bloodlust', type: 'passive', desc: 'Heal 4% of damage dealt when below 30% HP', icon: 'P' },
        { id: 'brs_t3c', name: 'Rage Fuel', type: 'passive', desc: 'Restore 1 mana when taking damage', icon: 'P' },
        { id: 'brs_t3d', name: 'Primal Instinct', type: 'passive', desc: '+6% dodge chance when below 50% HP', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'brs_t4a', name: 'War Machine', type: 'passive', desc: '+8% ATK, +10% ATK when below 50% HP', icon: 'P' },
        { id: 'brs_t4c', name: 'Brutal Momentum', type: 'passive', desc: 'Normal attacks deal +8% damage', icon: 'P' },
        { id: 'brs_t4d', name: 'Bloodrage', type: 'passive', desc: 'Gain +3% ATK for 2 turns after being hit', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'brs_t5a', name: 'Thick Skin', type: 'passive', desc: 'Take 5% less damage from all sources', icon: 'P' },
        { id: 'brs_t5c', name: 'Savage Endurance', type: 'passive', desc: 'Heal 1% max HP per turn', icon: 'P' },
        { id: 'brs_t5d', name: 'Hardened Body', type: 'passive', desc: '+3 DEF permanently in battle', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'brs_t6a', name: 'Adrenaline Rush', type: 'passive', desc: 'Restore 2 mana each time you attack', icon: 'P' },
        { id: 'brs_t6c', name: 'Fury Unleashed', type: 'passive', desc: 'Critical hits deal 2.2x instead of 2x', icon: 'P' },
        { id: 'brs_t6d', name: 'Combat Expertise', type: 'passive', desc: '+6% damage to stunned or debuffed enemies', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'brs_t7a', name: 'Tenacity', type: 'passive', desc: 'Poison and debuff durations reduced by 1 turn', icon: 'P' },
        { id: 'brs_t7c', name: 'Battle Trance', type: 'passive', desc: 'Immune to stun effects', icon: 'P' },
        { id: 'brs_t7d', name: 'Scarred Flesh', type: 'passive', desc: 'Poison damage taken reduced by 50%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'brs_t8a', name: 'Bloodbath', type: 'passive', desc: 'Heal 1% max HP on every kill', icon: 'P' },
        { id: 'brs_t8c', name: "Predator's Eye", type: 'passive', desc: '+6% damage to enemies below 50% HP', icon: 'P' },
        { id: 'brs_t8d', name: 'Blood Scent', type: 'passive', desc: 'Restore 2 mana when enemy drops below 50% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'brs_t9a', name: 'Relentless', type: 'passive', desc: '+10% ATK when above 80% HP', icon: 'P' },
        { id: 'brs_t9c', name: 'Savage Resilience', type: 'passive', desc: '+6% DEF when above 50% HP', icon: 'P' },
        { id: 'brs_t9d', name: "Berserker's Focus", type: 'passive', desc: 'Skills deal +6% more damage', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'brs_t10a', name: 'Immortal Rage', type: 'passive', desc: 'When below 10% HP, ATK +20%', icon: 'P' },
        { id: 'brs_t10c', name: 'Undaunted', type: 'passive', desc: 'Take 8% less damage from enemies with higher ATK', icon: 'P' },
        { id: 'brs_t10d', name: 'Death Dealer', type: 'passive', desc: '+2% ATK per active buff on self', icon: 'P' },
      ]},
      // ---- Post-20 tiers ----
      { level: 22, label: 'Tier 11', choices: [
        { id: 'brs_t11b', name: 'Pain Threshold', type: 'passive', desc: 'Recoil damage from skills reduced by 50%', icon: 'P' },
        { id: 'brs_t11c', name: 'Unrelenting Force', type: 'passive', desc: '+5% ATK after using an active skill (lasts 2 turns)', icon: 'P' },
        { id: 'brs_t11d', name: 'Vitality Surge', type: 'passive', desc: 'Heal 1% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'brs_t12a', name: 'Berserker Stance', type: 'passive', desc: '+12% ATK but +8% damage taken', icon: 'P' },
        { id: 'brs_t12c', name: 'Wrathful Strikes', type: 'passive', desc: 'Normal attacks have 8% chance to deal double damage', icon: 'P' },
        { id: 'brs_t12d', name: 'Blood Bond', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'brs_t13a', name: 'Second Wind', type: 'passive', desc: 'At 25% HP, heal 3% max HP once per battle', icon: 'P' },
        { id: 'brs_t13c', name: 'Warcry', type: 'passive', desc: 'Start each battle with +6% ATK for 3 turns', icon: 'P' },
        { id: 'brs_t13d', name: 'Bloodied Resolve', type: 'passive', desc: '+8% DEF when below 30% HP', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'brs_t14a', name: 'Frenzy', type: 'passive', desc: 'Each attack in a row increases ATK by 5% (stacks 5x)', icon: 'P' },
        { id: 'brs_t14c', name: 'Unbridled Power', type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'brs_t14d', name: 'Savage Instincts', type: 'passive', desc: 'Restore 3 mana when HP drops below 50%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'brs_t15a', name: 'Blood Oath', type: 'passive', desc: 'Permanently sacrifice 12% max HP. ATK +20%, all skills cost 17% less mana. You can never heal above 70% HP again.', icon: 'P', milestone: true },
        { id: 'brs_t15c', name: 'Eternal Berserker', type: 'passive', desc: 'You can never be healed by potions. In return, every hit you land heals 3% of damage dealt. Your rage sustains you.', icon: 'P', milestone: true },
        { id: 'brs_t15d', name: 'Pain is Power', type: 'passive', desc: 'All recoil damage is converted to +ATK (permanent per battle). The more you hurt yourself, the stronger you become.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'brs_t16a', name: 'Juggernaut', type: 'passive', desc: 'Cannot be reduced below 15% HP by a single hit', icon: 'P' },
        { id: 'brs_t16c', name: 'Bloodletting', type: 'passive', desc: 'Bleed effects you apply last 2 extra turns', icon: 'P' },
        { id: 'brs_t16d', name: 'Conqueror', type: 'passive', desc: '+1% ATK per level above 20', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'brs_t17a', name: 'Warlord', type: 'passive', desc: '+2% ATK per level above 30', icon: 'P' },
        { id: 'brs_t17c', name: 'Overwhelming Force', type: 'passive', desc: 'Skills ignore 10% of enemy DEF', icon: 'P' },
        { id: 'brs_t17d', name: 'Blood Fury', type: 'passive', desc: 'When below 40% HP, all damage +20%', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'brs_t18a', name: 'Undying Fury', type: 'passive', desc: 'Survive lethal hits twice per battle (replaces Undying Will)', icon: 'P' },
        { id: 'brs_t18c', name: 'Rampage Mastery', type: 'passive', desc: 'After killing an enemy, fully restore mana', icon: 'P' },
        { id: 'brs_t18d', name: 'Thick Blood', type: 'passive', desc: 'Immune to poison and bleed effects', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'brs_t19a', name: 'Bloodforged', type: 'passive', desc: 'Convert 10% of overkill damage into healing', icon: 'P' },
        { id: 'brs_t19c', name: 'Indomitable Spirit', type: 'passive', desc: 'All damage taken reduced by 12%', icon: 'P' },
        { id: 'brs_t19d', name: 'Rage Incarnate', type: 'passive', desc: '+3% ATK each time you take damage (stacks 8x per battle)', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'brs_t20a', name: 'Avatar of Carnage', type: 'passive', desc: 'All damage +25%. All healing received is halved. HP regen disabled. A dangerous trade-off.', icon: 'P', milestone: true },
        { id: 'brs_t20c', name: 'Undying Titan', type: 'passive', desc: 'Your max HP +11%. Your ATK is reduced by 25%. You cannot be killed in fewer than 10 hits. A sturdy fighter.', icon: 'P', milestone: true },
        { id: 'brs_t20d', name: 'Bloodbound', type: 'passive', desc: 'Every point of HP you lose becomes +1% ATK until end of battle. At 1 HP your ATK is astronomical. No healing allowed.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'brs_t21a', name: 'Scarred Veteran', type: 'passive', desc: '+1% damage reduction per 3% HP missing', icon: 'P' },
        { id: 'brs_t21c', name: 'Veteran Instincts', type: 'passive', desc: '+10% damage on first attack each battle', icon: 'P' },
        { id: 'brs_t21d', name: 'War-Hardened', type: 'passive', desc: 'Take 2% less damage per turn in battle (max 15%)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'brs_t22a', name: 'Deathless', type: 'passive', desc: 'When revived by Undying Will, gain +17% ATK for rest of fight', icon: 'P' },
        { id: 'brs_t22c', name: 'Bloodsoaked', type: 'passive', desc: 'All lifesteal effects +15%', icon: 'P' },
        { id: 'brs_t22d', name: 'Gladiator', type: 'passive', desc: '+10% ATK and DEF for the first 5 turns of battle', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'brs_t23a', name: 'Endless Rage', type: 'passive', desc: 'Mana costs reduced by 1 each turn (min 1)', icon: 'P' },
        { id: 'brs_t23c', name: 'Primal Fury', type: 'passive', desc: 'Skills have 10% chance to cost no mana', icon: 'P' },
        { id: 'brs_t23d', name: 'Unyielding', type: 'passive', desc: 'Cannot be stunned, debuff durations halved', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'brs_t24a', name: 'Warpath', type: 'passive', desc: 'After killing an enemy, start next battle with +12% ATK', icon: 'P' },
        { id: 'brs_t24c', name: 'Destroyer', type: 'passive', desc: '+10% damage to enemies above 75% HP', icon: 'P' },
        { id: 'brs_t24d', name: 'Crimson Vitality', type: 'passive', desc: 'Heal 2% max HP at start of each turn when below 40% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'brs_t25a', name: 'Godslayer', type: 'passive', desc: 'You deal +3% damage per 1% HP missing. At 1 HP you deal +125% damage. Potions no longer work on you.', icon: 'P', milestone: true },
        { id: 'brs_t25c', name: 'Eternal Warrior', type: 'passive', desc: 'Survive any hit that would kill you (infinite uses). After each survival, ATK -6% permanently. You never die, but you slowly fade.', icon: 'P', milestone: true },
        { id: 'brs_t25d', name: 'Lord of Slaughter', type: 'passive', desc: 'Every kill permanently grants +2 ATK for the rest of the run. Normal attacks hit twice. You can never defend or use potions again.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'brs_t26a', name: 'Wrath Eternal', type: 'passive', desc: '+2% ATK per level above 40', icon: 'P' },
        { id: 'brs_t26c', name: 'Savage Recovery', type: 'passive', desc: 'Heal 1% max HP whenever you deal a critical hit', icon: 'P' },
        { id: 'brs_t26d', name: 'Berserker Vitality', type: 'passive', desc: '+12% max HP, +6% ATK', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'brs_t27a', name: 'Primal Wrath', type: 'passive', desc: 'All recoil damage reduced by 75%', icon: 'P' },
        { id: 'brs_t27c', name: 'Undying Fervor', type: 'passive', desc: 'After surviving a lethal hit, gain +13% ATK for rest of fight', icon: 'P' },
        { id: 'brs_t27d', name: 'Ruthless Strikes', type: 'passive', desc: 'Normal attacks have 10% chance to deal triple damage', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'brs_t28a', name: 'Gore Master', type: 'passive', desc: 'Bleed effects deal double damage and cannot be cleansed', icon: 'P' },
        { id: 'brs_t28c', name: 'Blood Reservoir', type: 'passive', desc: 'Overkill damage on enemies heals you for 17% of excess', icon: 'P' },
        { id: 'brs_t28d', name: 'Rage Mastery', type: 'passive', desc: '+5% ATK per turn in combat (stacks, replaces Fury Building)', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'brs_t29a', name: 'Unstoppable Charge', type: 'passive', desc: 'First attack each battle ignores all DEF and deals +17% damage', icon: 'P' },
        { id: 'brs_t29c', name: 'War Veteran', type: 'passive', desc: '+2% ATK and DEF per level above 45', icon: 'P' },
        { id: 'brs_t29d', name: 'Bloodforged Armor', type: 'passive', desc: 'Gain DEF equal to 10% of your ATK', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'brs_t30a', name: 'Aspect of Carnage', type: 'passive', desc: 'All damage dealt +80%. All damage taken +16%. HP regeneration disabled. Offense over defense.', icon: 'P', milestone: true },
        { id: 'brs_t30c', name: 'Blood God', type: 'passive', desc: 'Every point of damage you deal heals 10% as HP. Every point of damage you take adds +2% ATK permanently per battle. Pain feeds power, power feeds life.', icon: 'P', milestone: true },
        { id: 'brs_t30d', name: 'Unkillable Rage', type: 'passive', desc: 'Cannot die while ATK is above 17% of base. Each hit taken reduces ATK by 3%. When ATK drops below threshold, you collapse. Rage is your lifeline.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'brs_t31a', name: 'Shatterbone', type: 'passive', desc: 'Normal attacks reduce enemy DEF by 3% per hit (stacks)', icon: 'P' },
        { id: 'brs_t31c', name: 'Crimson Fortitude', type: 'passive', desc: '+13% max HP, heal 1% max HP when taking damage', icon: 'P' },
        { id: 'brs_t31d', name: 'Fury Conduit', type: 'passive', desc: 'Restore 3 mana whenever you take damage', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'brs_t32a', name: 'Legendary Rage', type: 'passive', desc: 'All skill multipliers increased by 20%', icon: 'P' },
        { id: 'brs_t32c', name: 'Battle Euphoria', type: 'passive', desc: 'After killing an enemy, +13% ATK and full mana for next battle', icon: 'P' },
        { id: 'brs_t32d', name: 'Iron Blood', type: 'passive', desc: 'All damage taken reduced by 20%, immune to bleed and poison', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'brs_t33a', name: 'Frenzied Assault', type: 'passive', desc: '12% chance to attack twice each turn', icon: 'P' },
        { id: 'brs_t33c', name: 'Enraged Regeneration', type: 'passive', desc: 'Heal 2% max HP per turn when below 50% HP', icon: 'P' },
        { id: 'brs_t33d', name: 'Unbreakable Fury', type: 'passive', desc: 'Immune to stun, doom, and all CC effects', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'brs_t34a', name: 'Warlord Supreme', type: 'passive', desc: '+2% ATK per level above 50', icon: 'P' },
        { id: 'brs_t34c', name: 'Bloodlust Supreme', type: 'passive', desc: 'Heal 5% of all damage dealt', icon: 'P' },
        { id: 'brs_t34d', name: 'Titan Strength', type: 'passive', desc: 'Equipment ATK bonuses increased by 40%', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'brs_t35a', name: 'Mythic Berserker', type: 'passive', desc: 'ATK +15%. DEF set to 0. Cannot defend. Cannot use potions. Every attack heals 4% of damage dealt. Pure unstoppable offense.', icon: 'P', milestone: true },
        { id: 'brs_t35c', name: 'Eternal Bloodrage', type: 'passive', desc: 'ATK increases by 3% every turn (stacks infinitely). Max HP decreases by 2% every turn. A ticking time bomb of power.', icon: 'P', milestone: true },
        { id: 'brs_t35d', name: 'Invincible Juggernaut', type: 'passive', desc: 'Cannot be reduced below 25% HP by any single hit. +17% max HP. ATK -10%. Recoil damage heals instead. Unstoppable tank.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'brs_t36a', name: 'Primal Vigor', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
        { id: 'brs_t36c', name: 'Rage Shield', type: 'passive', desc: 'Gain a shield equal to 8% ATK at start of each turn', icon: 'P' },
        { id: 'brs_t36d', name: 'Savage Precision', type: 'passive', desc: 'All attacks ignore 12% of enemy DEF permanently', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'brs_t37a', name: 'Bloodstorm', type: 'passive', desc: 'All bleed and DoT effects you apply deal triple damage', icon: 'P' },
        { id: 'brs_t37c', name: 'Undying Legend', type: 'passive', desc: 'Survive lethal hits 2 times per battle at 15% HP', icon: 'P' },
        { id: 'brs_t37d', name: 'Warborn', type: 'passive', desc: 'Start each battle with +12% ATK and +12% DEF for 5 turns', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'brs_t38a', name: 'Apex Predator', type: 'passive', desc: '+17% damage to enemies above 75% HP, +17% damage to enemies below 25% HP', icon: 'P' },
        { id: 'brs_t38c', name: 'Furious Momentum', type: 'passive', desc: 'Each consecutive attack increases damage by 10% (no cap)', icon: 'P' },
        { id: 'brs_t38d', name: 'Blood Pact', type: 'passive', desc: 'Sacrifice 2% HP per turn, gain +13% ATK and +13% lifesteal', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'brs_t39a', name: 'Indomitable Champion', type: 'passive', desc: 'All damage taken reduced by 25%, immune to all debuffs', icon: 'P' },
        { id: 'brs_t39c', name: 'Eternal Frenzy', type: 'passive', desc: 'All skill mana costs reduced by 40%', icon: 'P' },
        { id: 'brs_t39d', name: 'Legendary Fortitude', type: 'passive', desc: '+17% max HP, +10% DEF, +10% ATK', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'brs_t40a', name: 'Divine Berserker', type: 'passive', desc: 'ATK and max HP +11%. All healing +20%. You take +7% damage. Skills cost 15% more mana. Overwhelming power with overwhelming risk.', icon: 'P', milestone: true },
        { id: 'brs_t40c', name: 'Embodiment of War', type: 'passive', desc: 'Normal attacks hit 2 times at 60% damage each. Every hit heals 2% of damage. You can never use active skills again. Pure primal combat.', icon: 'P', milestone: true },
        { id: 'brs_t40d', name: 'Immortal Warlord', type: 'passive', desc: 'When HP reaches 0, enter Rage State: ATK +33%, take 3% max HP per turn. Rage State ends and you die when you miss an attack.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'brs_t41a', name: 'Mythic Strength', type: 'passive', desc: '+3% ATK per level above 60', icon: 'P' },
        { id: 'brs_t41c', name: 'Battle Mastery', type: 'passive', desc: 'All damage +14% permanently', icon: 'P' },
        { id: 'brs_t41d', name: 'Primal Regeneration', type: 'passive', desc: 'Heal 3% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'brs_t42a', name: 'Savage Dominion', type: 'passive', desc: 'Enemy DEF reduced by 3% per turn permanently (stacks)', icon: 'P' },
        { id: 'brs_t42c', name: 'Wrath Incarnate', type: 'passive', desc: 'Critical hits deal 2.5x damage instead of 2x', icon: 'P' },
        { id: 'brs_t42d', name: 'Unshakeable', type: 'passive', desc: '+17% max HP, cannot be reduced below 10% HP by a single hit', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'brs_t43a', name: 'Berserker Ascendancy', type: 'passive', desc: 'All equipment bonuses increased by 35%', icon: 'P' },
        { id: 'brs_t43c', name: 'Relentless Fury', type: 'passive', desc: 'After using a skill, next normal attack deals +20% damage', icon: 'P' },
        { id: 'brs_t43d', name: 'Bloodfire', type: 'passive', desc: 'Lifesteal +20%', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'brs_t44a', name: 'Primeval Force', type: 'passive', desc: '+17% ATK when below 50% HP, +10% ATK when above 50% HP', icon: 'P' },
        { id: 'brs_t44c', name: 'Undying Wrath', type: 'passive', desc: 'Survive lethal hits 2 times per battle, gain +10% ATK each time', icon: 'P' },
        { id: 'brs_t44d', name: 'Savage Aura', type: 'passive', desc: 'Enemies take 3% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'brs_t45a', name: 'Primordial Berserker', type: 'passive', desc: 'All stats +12%. Every turn, gain +3% ATK permanently. Every turn, lose 1% max HP permanently. You grow stronger as your body crumbles.', icon: 'P', milestone: true },
        { id: 'brs_t45c', name: 'Wrath of Ages', type: 'passive', desc: 'Every kill permanently adds +3 ATK for the rest of the run. Every death (lethal hit survival) permanently adds +3 ATK. Pain and violence make you eternal.', icon: 'P', milestone: true },
        { id: 'brs_t45d', name: 'Blood Titan', type: 'passive', desc: 'max HP +15%. ATK -10%. All damage taken heals you for 20%. Normal attacks hit twice. You are an immortal mountain of flesh.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'brs_t46a', name: 'Godlike Power', type: 'passive', desc: '+3% ATK per level above 70', icon: 'P' },
        { id: 'brs_t46c', name: 'Ascended Vitality', type: 'passive', desc: 'Heal 2% max HP at start of each turn, +12% max HP', icon: 'P' },
        { id: 'brs_t46d', name: 'Conqueror Supreme', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'brs_t47a', name: 'Warmaster Supreme', type: 'passive', desc: '13% chance to attack twice, each attack ignores 13% DEF', icon: 'P' },
        { id: 'brs_t47c', name: 'Eternal Bloodlust', type: 'passive', desc: 'All lifesteal +25%, heal 1% max HP per hit', icon: 'P' },
        { id: 'brs_t47d', name: 'Unbreakable Spirit', type: 'passive', desc: 'All damage taken reduced by 30%, immune to all negative effects', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'brs_t48a', name: 'Legendary Warlord', type: 'passive', desc: '+20% ATK, +13% DEF, +13% max HP', icon: 'P' },
        { id: 'brs_t48c', name: 'Bloodforged Legend', type: 'passive', desc: 'All equipment bonuses increased by 50%', icon: 'P' },
        { id: 'brs_t48d', name: 'Rage Beyond Death', type: 'passive', desc: 'Survive lethal hits 2 times per battle, each survival grants +12% ATK', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'brs_t49a', name: 'Titan Among Men', type: 'passive', desc: '+25% max HP, +17% ATK, normal attacks hit twice', icon: 'P' },
        { id: 'brs_t49c', name: 'Primordial Might', type: 'passive', desc: 'All damage +17% permanently, all damage taken -20%', icon: 'P' },
        { id: 'brs_t49d', name: 'Infinite Rage', type: 'passive', desc: 'Mana costs reduced by 60%, restore 5 mana per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'brs_t50a', name: 'God of War', type: 'passive', desc: 'All stats +15%. All recoil converted to healing. Every hit you land permanently increases ATK by 1% for the run. A true warrior.', icon: 'P', milestone: true },
        { id: 'brs_t50c', name: 'Eternal Slaughter', type: 'passive', desc: 'Normal attacks hit 2 times at 70% damage. Every kill fully heals you. Every hit you land heals 10%. ATK -12% but you never stop swinging.', icon: 'P', milestone: true },
        { id: 'brs_t50d', name: 'Primordial God of Fury', type: 'passive', desc: 'You cannot die. Ever. HP cannot drop below 1. In exchange, ATK decreases by 1% each turn. An eternal warrior fading into nothing.', icon: 'P', milestone: true },
      ]},
    ],
  },
  warrior: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'war_t1a', name: 'Iron Skin', type: 'passive', desc: 'Take 6% less damage from all attacks', icon: 'P' },
        { id: 'war_t1c', name: 'Shield Training', type: 'passive', desc: '+2 DEF permanently in battle', icon: 'P' },
        { id: 'war_t1d', name: 'Resolve', type: 'passive', desc: 'Heal 1% max HP at the start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'war_t2a', name: 'Bulwark', type: 'passive', desc: 'Defend blocks 21% damage instead of 70%', icon: 'P' },
        { id: 'war_t2c', name: 'Heavy Armor', type: 'passive', desc: '+6% DEF from equipment', icon: 'P' },
        { id: 'war_t2d', name: 'Bravery', type: 'passive', desc: '+3% ATK when HP is above 70%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'war_t3a', name: 'Unbreakable', type: 'passive', desc: '+8% max HP during battle', icon: 'P' },
        { id: 'war_t3c', name: 'Fortify', type: 'passive', desc: '+5% DEF when defending', icon: 'P' },
        { id: 'war_t3d', name: 'Protector', type: 'passive', desc: 'Restore 1 mana when you defend', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'war_t4a', name: 'Aegis', type: 'passive', desc: '8% chance to fully block any attack', icon: 'P' },
        { id: 'war_t4c', name: 'Retaliation', type: 'passive', desc: 'When hit, deal 6% of damage back to attacker', icon: 'P' },
        { id: 'war_t4d', name: 'Steadfast', type: 'passive', desc: 'Immune to ATK reduction debuffs', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'war_t5a', name: 'Stalwart', type: 'passive', desc: '+3 DEF permanently in battle', icon: 'P' },
        { id: 'war_t5c', name: 'Enduring Will', type: 'passive', desc: '+6% max HP permanently', icon: 'P' },
        { id: 'war_t5d', name: 'Tactical Mind', type: 'passive', desc: 'Restore 2 mana when you attack', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'war_t6a', name: 'Regeneration', type: 'passive', desc: 'Heal 1% max HP at the start of each turn', icon: 'P' },
        { id: 'war_t6c', name: 'Shield Wall', type: 'passive', desc: 'Defend now also restores 3% max HP', icon: 'P' },
        { id: 'war_t6d', name: 'Commander', type: 'passive', desc: '+5% ATK and DEF permanently', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'war_t7a', name: 'Armor Mastery', type: 'passive', desc: 'Equipment DEF bonuses increased by 15%', icon: 'P' },
        { id: 'war_t7c', name: 'Battle Ready', type: 'passive', desc: 'Start each battle with +8% DEF for 3 turns', icon: 'P' },
        { id: 'war_t7d', name: 'Weapon Mastery', type: 'passive', desc: 'Equipment ATK bonuses increased by 10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'war_t8a', name: 'Last Stand', type: 'passive', desc: '+12% DEF when below 40% HP', icon: 'P' },
        { id: 'war_t8c', name: 'Stoneskin', type: 'passive', desc: 'Take 2 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t8d', name: 'Inspiring Presence', type: 'passive', desc: '+7% ATK when HP above 50%', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'war_t9a', name: 'Indomitable', type: 'passive', desc: 'Cannot be reduced below 1 HP by poison or DoT', icon: 'P' },
        { id: 'war_t9c', name: 'Sentinel', type: 'passive', desc: '10% chance to fully block any attack', icon: 'P' },
        { id: 'war_t9d', name: 'Endurance Training', type: 'passive', desc: 'Restore 5% max mana at start of each turn', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'war_t10a', name: 'Fortress', type: 'passive', desc: 'All damage taken reduced by 20%', icon: 'P' },
        { id: 'war_t10c', name: 'Unassailable', type: 'passive', desc: 'Survive one lethal hit per battle at 25% HP', icon: 'P' },
        { id: 'war_t10d', name: 'Warden', type: 'passive', desc: '+8% ATK and +8% DEF permanently', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'war_t11a', name: 'Fortified Mind', type: 'passive', desc: 'Immune to ATK debuffs from enemies', icon: 'P' },
        { id: 'war_t11c', name: 'Bastion', type: 'passive', desc: 'Defend blocks 23% of damage', icon: 'P' },
        { id: 'war_t11d', name: 'Iron Resolve', type: 'passive', desc: '+3% max HP per level above 15', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'war_t12a', name: 'Phalanx', type: 'passive', desc: 'Defend now blocks 24% of damage', icon: 'P' },
        { id: 'war_t12c', name: 'Thorns', type: 'passive', desc: 'When hit, deal 10% of damage taken back to attacker', icon: 'P' },
        { id: 'war_t12d', name: 'Defensive Mastery', type: 'passive', desc: '+10% DEF from all sources', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'war_t13a', name: "Titan's Grip", type: 'passive', desc: 'Equipment ATK bonuses increased by 20%', icon: 'P' },
        { id: 'war_t13c', name: 'Guardian Angel', type: 'passive', desc: 'Heal 1% max HP when you successfully block', icon: 'P' },
        { id: 'war_t13d', name: 'Heavy Strikes', type: 'passive', desc: 'Normal attacks have +10% damage', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'war_t14a', name: 'Endurance', type: 'passive', desc: 'Heal 1% max HP at start of each turn', icon: 'P' },
        { id: 'war_t14c', name: 'Plate Armor', type: 'passive', desc: 'Take 4 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t14d', name: 'Veterans Might', type: 'passive', desc: '+2% ATK per level above 20', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'war_t15a', name: 'Immortal Bastion', type: 'passive', desc: 'You cannot die for the first 5 turns of any battle. After turn 5, you take +5% damage permanently.', icon: 'P', milestone: true },
        { id: 'war_t15c', name: 'Immovable Object', type: 'passive', desc: 'DEF +8%. You cannot dodge or use potions. Defend fully negates all damage. A steadfast defender.', icon: 'P', milestone: true },
        { id: 'war_t15d', name: 'Living Monument', type: 'passive', desc: 'Max HP +50%. ATK -10%. Every turn you survive, gain +2% ATK permanently for the battle. Time is your weapon.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'war_t16a', name: 'Ironclad', type: 'passive', desc: '+10% DEF from all sources', icon: 'P' },
        { id: 'war_t16c', name: 'Mana Fortress', type: 'passive', desc: 'Restore 2 mana when you defend', icon: 'P' },
        { id: 'war_t16d', name: 'Adaptive Armor', type: 'passive', desc: 'After being hit, take 3% less damage next hit (stacks 5x)', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'war_t17a', name: 'Vigilance', type: 'passive', desc: '10% chance to fully block any attack', icon: 'P' },
        { id: 'war_t17c', name: 'Steel Resolve', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t17d', name: 'Punisher', type: 'passive', desc: 'Counter-attacks deal 12% of your ATK after blocking', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'war_t18a', name: 'Undying Resolve', type: 'passive', desc: 'Survive lethal hit at 20% HP instead of 1 HP (once per battle)', icon: 'P' },
        { id: 'war_t18c', name: 'Citadel', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
        { id: 'war_t18d', name: 'Shield Mastery', type: 'passive', desc: 'Defend also reduces enemy ATK by 10%', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'war_t19a', name: 'Battle Hardened', type: 'passive', desc: 'Take 2% less damage for each turn that passes in battle', icon: 'P' },
        { id: 'war_t19c', name: 'Aegis Supreme', type: 'passive', desc: '12% chance to fully block any attack', icon: 'P' },
        { id: 'war_t19d', name: 'Titan Constitution', type: 'passive', desc: '+10% max HP permanently', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'war_t20a', name: 'Eternal Guardian', type: 'passive', desc: 'All damage taken reduced by 50%. Your ATK is reduced by 35%. You can never die in fewer than 8 hits.', icon: 'P', milestone: true },
        { id: 'war_t20c', name: 'Absolute Defense', type: 'passive', desc: 'Every 3rd hit against you is fully negated. Your ATK is reduced by 10%. You cannot use skills costing >20 mana. An unbreakable wall.', icon: 'P', milestone: true },
        { id: 'war_t20d', name: 'Warmaster', type: 'passive', desc: 'ATK and DEF +13%. All skill costs +15%. Normal attacks hit twice. Balance through mastery.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'war_t21a', name: 'Unshakable', type: 'passive', desc: 'Immune to stun, poison, and doom effects', icon: 'P' },
        { id: 'war_t21c', name: 'Living Armor', type: 'passive', desc: '+1 DEF each turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t21d', name: 'Righteous Fury', type: 'passive', desc: '+8% ATK when you defend successfully', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'war_t22a', name: 'Stalwart Commander', type: 'passive', desc: 'Pet damage +50%, pet takes 12% less damage', icon: 'P' },
        { id: 'war_t22c', name: 'Impervious', type: 'passive', desc: 'Cannot be reduced below 20% HP by a single hit', icon: 'P' },
        { id: 'war_t22d', name: 'Juggernaut Charge', type: 'passive', desc: '+10% damage on first attack each battle, ignore 13% DEF', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'war_t23a', name: 'Bulwark Mastery', type: 'passive', desc: 'Defending also reflects 12% of blocked damage', icon: 'P' },
        { id: 'war_t23c', name: 'Regeneration+', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
        { id: 'war_t23d', name: 'Overpower', type: 'passive', desc: 'Skills ignore 10% of enemy DEF', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'war_t24a', name: 'Indestructible', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
        { id: 'war_t24c', name: 'Legendary Armor', type: 'passive', desc: 'All equipment bonuses increased by 25%', icon: 'P' },
        { id: 'war_t24d', name: 'Undying Fortress', type: 'passive', desc: 'Survive lethal hits twice per battle at 15% HP', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'war_t25a', name: 'Living Fortress', type: 'passive', desc: 'DEF +8%. You regenerate 6% max HP/turn. Your ATK is reduced by 10%. You cannot use active skills. You are an unkillable wall.', icon: 'P', milestone: true },
        { id: 'war_t25c', name: 'Immortal Vanguard', type: 'passive', desc: 'You cannot die. Period. But every hit reduces your ATK by 2% permanently. Eventually you cannot fight.', icon: 'P', milestone: true },
        { id: 'war_t25d', name: 'One-Man Army', type: 'passive', desc: 'ATK and DEF +9%. Max HP +100%. All skill costs +20%. Active skills deal +17% damage. The ultimate soldier.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'war_t26a', name: 'Mythic Armor', type: 'passive', desc: '+12% DEF from all sources', icon: 'P' },
        { id: 'war_t26c', name: 'Fortified Soul', type: 'passive', desc: '+2% DEF per level above 40', icon: 'P' },
        { id: 'war_t26d', name: 'Veteran Commander', type: 'passive', desc: '+10% ATK, +10% DEF, +10% max HP', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'war_t27a', name: 'Impenetrable Guard', type: 'passive', desc: 'Defend blocks 25% of damage and restores 8 mana', icon: 'P' },
        { id: 'war_t27c', name: 'Guardian Spirit', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
        { id: 'war_t27d', name: 'Steel Tempering', type: 'passive', desc: 'Take 3 less flat damage from every hit (min 1)', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'war_t28a', name: 'Legendary Shield', type: 'passive', desc: '14% chance to fully block any attack', icon: 'P' },
        { id: 'war_t28c', name: 'Thorned Armor', type: 'passive', desc: 'When hit, deal 6% of damage taken back to attacker', icon: 'P' },
        { id: 'war_t28d', name: 'Wardens Grace', type: 'passive', desc: '+14% max HP, immune to ATK reduction debuffs', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'war_t29a', name: 'Mythic Constitution', type: 'passive', desc: '+17% max HP permanently', icon: 'P' },
        { id: 'war_t29c', name: 'Battle Fortress', type: 'passive', desc: '+2% DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t29d', name: 'Unbreakable Resolve', type: 'passive', desc: 'Immune to stun, doom, and poison effects', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'war_t30a', name: 'Aspect of the Shield', type: 'passive', desc: 'DEF +8%. All damage taken reduced by 30%. Your ATK is reduced by 10%. Defend fully negates damage and heals 3% max HP. The ultimate shield.', icon: 'P', milestone: true },
        { id: 'war_t30c', name: 'Eternal Sentinel', type: 'passive', desc: 'Every 3rd hit against you is fully negated. Heal 1% max HP per turn. ATK reduced by 30%. An unbreakable guardian.', icon: 'P', milestone: true },
        { id: 'war_t30d', name: 'Warlord Ascendant', type: 'passive', desc: 'ATK and DEF +8%. Normal attacks hit twice. All skill costs +15%. Counter-attacks deal 17% ATK. Balance of offense and defense.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'war_t31a', name: 'Adamantine Skin', type: 'passive', desc: 'Take 6 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t31c', name: 'Inspiring Leader', type: 'passive', desc: 'Pet damage +80%, pet takes 17% less damage', icon: 'P' },
        { id: 'war_t31d', name: 'Legendary Resolve', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'war_t32a', name: 'Mythic Bulwark', type: 'passive', desc: '13% chance to fully block any attack', icon: 'P' },
        { id: 'war_t32c', name: 'Fortification Mastery', type: 'passive', desc: 'All DEF bonuses from equipment increased by 40%', icon: 'P' },
        { id: 'war_t32d', name: 'Righteous Might', type: 'passive', desc: '+12% ATK when HP is above 60%', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'war_t33a', name: 'Vanguards Presence', type: 'passive', desc: '+2% ATK and DEF per level above 50', icon: 'P' },
        { id: 'war_t33c', name: 'Shield of Ages', type: 'passive', desc: 'Start each battle with a shield equal to 12% max HP', icon: 'P' },
        { id: 'war_t33d', name: 'Invulnerable Charge', type: 'passive', desc: 'First 3 turns of battle, take 17% less damage', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'war_t34a', name: 'Living Bastion', type: 'passive', desc: '+2 DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t34c', name: 'Recover', type: 'passive', desc: 'When below 40% HP, heal 2% max HP per turn', icon: 'P' },
        { id: 'war_t34d', name: 'Counter Mastery', type: 'passive', desc: 'When hit, counter-attack for 13% of your ATK', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'war_t35a', name: 'Mythic Guardian', type: 'passive', desc: 'All damage taken reduced by 50%. Heal 2% max HP/turn. ATK reduced by 40%. You cannot use skills costing >25 mana. An invincible wall of iron.', icon: 'P', milestone: true },
        { id: 'war_t35c', name: 'Immortal Champion', type: 'passive', desc: 'Cannot be reduced below 20% HP. max HP +11%. ATK +15%. All healing +10%. Immune to all debuffs. The perfect warrior.', icon: 'P', milestone: true },
        { id: 'war_t35d', name: 'Aspect of the Mountain', type: 'passive', desc: 'Every turn, gain +3% DEF permanently. After 10 turns, you are immune to all damage. ATK decreases by 2%/turn. Eventually nothing can touch you.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'war_t36a', name: 'Unbreakable Will', type: 'passive', desc: 'Survive lethal hits 2 times per battle at 25% HP', icon: 'P' },
        { id: 'war_t36c', name: 'Protective Aura', type: 'passive', desc: 'All damage taken reduced by 25%', icon: 'P' },
        { id: 'war_t36d', name: 'Supreme Valor', type: 'passive', desc: '+13% ATK when HP above 50%, +13% DEF when HP below 50%', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'war_t37a', name: 'Titanforged', type: 'passive', desc: '+17% max HP, +12% DEF, +10% ATK', icon: 'P' },
        { id: 'war_t37c', name: 'Iron Determination', type: 'passive', desc: 'Restore 4 mana whenever you take damage', icon: 'P' },
        { id: 'war_t37d', name: 'Aegis Absolute', type: 'passive', desc: '15% chance to fully block any attack', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'war_t38a', name: 'Steel Dominion', type: 'passive', desc: 'All equipment bonuses increased by 40%', icon: 'P' },
        { id: 'war_t38c', name: 'Regenerative Armor', type: 'passive', desc: 'Heal 3% max HP at start of each turn', icon: 'P' },
        { id: 'war_t38d', name: 'Legendary Endurance', type: 'passive', desc: 'Immune to all debuffs, take 10% less damage', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'war_t39a', name: 'Ascended Guardian', type: 'passive', desc: '+3% ATK and DEF per level above 60', icon: 'P' },
        { id: 'war_t39c', name: 'Bulwark Supreme', type: 'passive', desc: 'Defend blocks 25% damage and heals 3% max HP', icon: 'P' },
        { id: 'war_t39d', name: 'Heroic Aura', type: 'passive', desc: '+17% ATK and DEF for first 5 turns of battle', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'war_t40a', name: 'Divine Guardian', type: 'passive', desc: 'All damage taken reduced by 60%. Heal 2% max HP/turn. ATK -10%. You radiate an aura of invincibility. Nothing can break you.', icon: 'P', milestone: true },
        { id: 'war_t40c', name: 'Paragon of War', type: 'passive', desc: 'ATK and DEF +11%. Max HP +50%. All skill costs +20%. Normal attacks hit twice. Counter-attacks deal 17% ATK. The complete warrior.', icon: 'P', milestone: true },
        { id: 'war_t40d', name: 'Indestructible', type: 'passive', desc: 'Survive one additional lethal hit per battle at 1 HP. All healing +10%. ATK decreases by 1% per hit taken. The last man standing.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'war_t41a', name: 'Godsteel Armor', type: 'passive', desc: 'Take 8 less flat damage from every hit (min 1)', icon: 'P' },
        { id: 'war_t41c', name: 'Undying Champion', type: 'passive', desc: 'Survive lethal hits 2 times per battle at 30% HP', icon: 'P' },
        { id: 'war_t41d', name: 'War Mastery', type: 'passive', desc: 'All damage +16%, all damage taken -15%', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'war_t42a', name: 'Mythic Fortitude', type: 'passive', desc: '+20% max HP, +12% DEF', icon: 'P' },
        { id: 'war_t42c', name: 'Legendary Guardian', type: 'passive', desc: '17% chance to fully block any attack', icon: 'P' },
        { id: 'war_t42d', name: 'Stalwart Hero', type: 'passive', desc: 'Heal 2% max HP at start of each turn', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'war_t43a', name: 'Armor of Ages', type: 'passive', desc: '+3 DEF per turn in battle (stacks infinitely)', icon: 'P' },
        { id: 'war_t43c', name: 'Eternal Shield', type: 'passive', desc: 'Start each battle with a shield equal to 6% max HP', icon: 'P' },
        { id: 'war_t43d', name: 'Weapon Legend', type: 'passive', desc: 'All equipment ATK bonuses increased by 50%', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'war_t44a', name: 'Primordial Might', type: 'passive', desc: '+3% ATK and DEF per level above 70', icon: 'P' },
        { id: 'war_t44c', name: 'Absolute Resolve', type: 'passive', desc: 'All damage taken reduced by 35%, immune to all negative effects', icon: 'P' },
        { id: 'war_t44d', name: 'Supreme Commander', type: 'passive', desc: 'Pet damage doubled, all allies (self + pet) take 12% less damage', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'war_t45a', name: 'Primordial Guardian', type: 'passive', desc: 'All damage taken reduced by 70%. Heal 3% max HP/turn. ATK reduced by 50%. Cannot use active skills. A very tough fighter.', icon: 'P', milestone: true },
        { id: 'war_t45c', name: 'Eternal Bastion', type: 'passive', desc: 'Cannot be reduced below 30% HP by any means. max HP +15%. ATK -12%. All healing +20%. An eternal fortress of flesh and steel.', icon: 'P', milestone: true },
        { id: 'war_t45d', name: 'Legend of the Blade', type: 'passive', desc: 'ATK and DEF +11%. Normal attacks hit 2 times at 70% damage. All skill costs +25%. Counter-attacks deal 20% ATK. The warrior legend.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'war_t46a', name: 'Godlike Resilience', type: 'passive', desc: 'All damage taken reduced by 40%, heal 2% max HP per turn', icon: 'P' },
        { id: 'war_t46c', name: 'Ascended Warrior', type: 'passive', desc: '+25% max HP, +17% DEF', icon: 'P' },
        { id: 'war_t46d', name: 'Infinite Valor', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'war_t47a', name: 'Impregnable Fortress', type: 'passive', desc: '18% chance to fully block any attack, blocked attacks heal 1% max HP', icon: 'P' },
        { id: 'war_t47c', name: 'Champions Aura', type: 'passive', desc: '+17% ATK and DEF permanently', icon: 'P' },
        { id: 'war_t47d', name: 'Eternal Vigor', type: 'passive', desc: 'Restore 5 mana per turn, +50% max mana', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'war_t48a', name: 'Godforged Armor', type: 'passive', desc: 'All equipment bonuses increased by 60%', icon: 'P' },
        { id: 'war_t48c', name: 'Mythic Vitality', type: 'passive', desc: '+30% max HP, heal 2% max HP per turn', icon: 'P' },
        { id: 'war_t48d', name: 'Iron God', type: 'passive', desc: 'Cannot be reduced below 15% HP by any single hit, +17% DEF', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'war_t49a', name: 'Supreme Guardian', type: 'passive', desc: '+20% ATK, +20% DEF, +20% max HP', icon: 'P' },
        { id: 'war_t49c', name: 'Primordial Endurance', type: 'passive', desc: 'All damage taken reduced by 45%, immune to all effects', icon: 'P' },
        { id: 'war_t49d', name: 'Eternal Protector', type: 'passive', desc: 'Survive lethal hits 2 times per battle at 35% HP', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'war_t50a', name: 'God of War', type: 'passive', desc: 'ATK and DEF +10%. max HP +11%. All healing +20%. All damage taken reduced by 40%. All skill costs +25%. The pinnacle of martial perfection.', icon: 'P', milestone: true },
        { id: 'war_t50c', name: 'Eternal Fortress', type: 'passive', desc: 'Cannot die. Cannot take more than 3% max HP per hit. Heal 3% max HP/turn. ATK decreases by 2%/turn. An eternal, slowly fading monument.', icon: 'P', milestone: true },
        { id: 'war_t50d', name: 'Primordial God of the Shield', type: 'passive', desc: 'All damage reflected back at 50%. Defend fully heals you. ATK and DEF swap values. You become the immovable object AND the unstoppable force.', icon: 'P', milestone: true },
      ]},
    ],
  },
  thief: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'thf_t1a', name: 'Shadow Step', type: 'passive', desc: '8% chance to dodge enemy attacks', icon: 'P' },
        { id: 'thf_t1c', name: 'Nimble Fingers', type: 'passive', desc: '+10% gold from battles', icon: 'P' },
        { id: 'thf_t1d', name: 'Keen Edge', type: 'passive', desc: '+5% ATK permanently', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'thf_t2a', name: 'Plunder', type: 'passive', desc: '+25% gold from battles', icon: 'P' },
        { id: 'thf_t2c', name: 'Quick Reflexes', type: 'passive', desc: '+3% dodge chance', icon: 'P' },
        { id: 'thf_t2d', name: 'Venom Knowledge', type: 'passive', desc: 'Poison damage increased by 25%', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'thf_t3a', name: 'Evasion Mastery', type: 'passive', desc: 'Dodge chance +10% (stacks with Shadow Step)', icon: 'P' },
        { id: 'thf_t3c', name: 'Agility', type: 'passive', desc: 'Restore 1 mana each time you dodge', icon: 'P' },
        { id: 'thf_t3d', name: 'Exploit Weakness', type: 'passive', desc: '+6% damage to poisoned enemies', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'thf_t4a', name: 'Lucky Strike', type: 'passive', desc: '10% chance to deal double damage on attacks', icon: 'P' },
        { id: 'thf_t4c', name: 'Sleight of Hand', type: 'passive', desc: 'Potions heal 10% more and restore 3 mana', icon: 'P' },
        { id: 'thf_t4d', name: 'Precision', type: 'passive', desc: 'All skills ignore 8% of enemy DEF', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'thf_t5a', name: 'Quick Hands', type: 'passive', desc: 'Potions heal 12% more', icon: 'P' },
        { id: 'thf_t5c', name: 'Lethal Focus', type: 'passive', desc: '+7% ATK, +3% critical hit chance', icon: 'P' },
        { id: 'thf_t5d', name: 'Acrobat', type: 'passive', desc: 'Take 5% less damage from all sources', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'thf_t6a', name: 'Opportunist', type: 'passive', desc: '+8% damage against poisoned enemies', icon: 'P' },
        { id: 'thf_t6c', name: 'Mana Thief', type: 'passive', desc: 'Restore 2 mana each time you attack', icon: 'P' },
        { id: 'thf_t6d', name: 'Silent Killer', type: 'passive', desc: '+10% damage on first attack each battle', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'thf_t7a', name: 'Slippery', type: 'passive', desc: '100% escape chance from non-boss fights', icon: 'P' },
        { id: 'thf_t7c', name: 'Dirty Tricks', type: 'passive', desc: 'Poison and bleed durations +1 turn', icon: 'P' },
        { id: 'thf_t7d', name: 'Fleet Footed', type: 'passive', desc: '+5% dodge, immune to slow effects', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'thf_t8a', name: 'Treasure Hunter', type: 'passive', desc: 'Better loot drop rates from monsters', icon: 'P' },
        { id: 'thf_t8c', name: 'Dual Wield', type: 'passive', desc: '8% chance to attack twice', icon: 'P' },
        { id: 'thf_t8d', name: 'Assassin Training', type: 'passive', desc: '+8% damage to enemies above 70% HP', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'thf_t9a', name: 'Blade Dance', type: 'passive', desc: '6% chance to attack twice', icon: 'P' },
        { id: 'thf_t9c', name: 'Toxic Mastery', type: 'passive', desc: 'Poison damage +10%', icon: 'P' },
        { id: 'thf_t9d', name: 'Shadow Cloak', type: 'passive', desc: '+8% dodge chance at full HP', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'thf_t10a', name: 'Master Thief', type: 'passive', desc: '+30% gold + guaranteed rare+ loot drops', icon: 'P' },
        { id: 'thf_t10c', name: 'Killing Spree', type: 'passive', desc: 'After killing an enemy, start next battle with +10% ATK', icon: 'P' },
        { id: 'thf_t10d', name: 'Perfect Evasion', type: 'passive', desc: '+5% dodge chance total', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'thf_t11a', name: 'Venomcraft', type: 'passive', desc: 'Poison damage +10%, poison lasts 1 extra turn', icon: 'P' },
        { id: 'thf_t11c', name: 'Windwalker', type: 'passive', desc: 'After dodging, next attack deals +10% damage', icon: 'P' },
        { id: 'thf_t11d', name: 'Resourceful', type: 'passive', desc: 'Restore 2 mana at start of each turn', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'thf_t12a', name: 'Cloak of Shadows', type: 'passive', desc: '+5% dodge chance (stacks with others)', icon: 'P' },
        { id: 'thf_t12c', name: 'Marked Prey', type: 'passive', desc: '+10% damage to enemies below 50% HP', icon: 'P' },
        { id: 'thf_t12d', name: 'Shadowstep Mastery', type: 'passive', desc: 'Dodge also restores 2% max HP', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'thf_t13a', name: 'Swift Strikes', type: 'passive', desc: '10% chance to attack twice (stacks with Blade Dance)', icon: 'P' },
        { id: 'thf_t13c', name: 'Serrated Blades', type: 'passive', desc: 'Normal attacks apply 1 turn bleed', icon: 'P' },
        { id: 'thf_t13d', name: 'Ghost Step', type: 'passive', desc: 'Every 4th turn, automatically dodge all attacks', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'thf_t14a', name: 'Cutthroat', type: 'passive', desc: '+12% damage to enemies below 40% HP', icon: 'P' },
        { id: 'thf_t14c', name: 'Lethality', type: 'passive', desc: 'Critical hits now deal 2.3x damage instead of 2x', icon: 'P' },
        { id: 'thf_t14d', name: 'Vanish', type: 'passive', desc: 'When below 25% HP, gain 12% dodge for 2 turns', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'thf_t15a', name: 'Phantom Existence', type: 'passive', desc: '17% dodge chance. You deal 12% less damage. You can never be hit by more than 2 attacks in a row. Trade power for near-invulnerability.', icon: 'P', milestone: true },
        { id: 'thf_t15c', name: 'Venom Lord', type: 'passive', desc: 'All Poison damage +15%. Poison cannot be cleansed. Your non-poison damage is halved. Let the venom do the work.', icon: 'P', milestone: true },
        { id: 'thf_t15d', name: 'Shadow Assassin', type: 'passive', desc: 'First hit each battle is 1.7x damage. Gain +6% dodge. ATK -8% after first hit. One perfect strike defines you.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'thf_t16a', name: 'Elusive', type: 'passive', desc: 'After dodging, your next attack deals +13% damage', icon: 'P' },
        { id: 'thf_t16c', name: 'Deadly Precision', type: 'passive', desc: 'Skills ignore 12% of enemy DEF', icon: 'P' },
        { id: 'thf_t16d', name: 'Phantom Speed', type: 'passive', desc: '+6% dodge, +6% ATK', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'thf_t17a', name: 'Pickpocket', type: 'passive', desc: '+40% gold from battles, +8% rare item chance', icon: 'P' },
        { id: 'thf_t17c', name: 'Assassin Instinct', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
        { id: 'thf_t17d', name: 'Evasive Maneuvers', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'thf_t18a', name: 'Shadowmeld', type: 'passive', desc: 'First attack each battle is +15% crit chance (1.7x damage)', icon: 'P' },
        { id: 'thf_t18c', name: 'Blinding Speed', type: 'passive', desc: '10% chance to attack twice on any turn', icon: 'P' },
        { id: 'thf_t18d', name: 'Deathblow', type: 'passive', desc: '+13% damage to enemies below 25% HP', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'thf_t19a', name: 'Predator', type: 'passive', desc: '+2% damage for each turn the fight has lasted', icon: 'P' },
        { id: 'thf_t19c', name: 'Blade Mastery', type: 'passive', desc: 'All damage +10% permanently', icon: 'P' },
        { id: 'thf_t19d', name: 'Untouchable', type: 'passive', desc: '+7% dodge, but max HP reduced by 10%', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'thf_t20a', name: 'Living Shadow', type: 'passive', desc: '21% dodge chance. Your ATK is reduced by 10%. Normal attacks apply lethal poison (2% enemy max HP/turn). You become untouchable but rely on time to kill.', icon: 'P', milestone: true },
        { id: 'thf_t20c', name: 'Dance of Blades', type: 'passive', desc: 'Attack 2 times per turn. Each attack deals 13% normal damage. Every dodge gives +6% ATK for the rest of the battle. A whirlwind.', icon: 'P', milestone: true },
        { id: 'thf_t20d', name: 'Kingpin', type: 'passive', desc: '+50% gold. Guaranteed legendary loot. +12% ATK. You take +5% damage. Greed is power.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'thf_t21a', name: 'Smoke Bomb', type: 'passive', desc: 'When hit, 10% chance to gain dodge for next attack', icon: 'P' },
        { id: 'thf_t21c', name: 'Shadowstrike+', type: 'passive', desc: 'After dodging, next attack ignores all DEF', icon: 'P' },
        { id: 'thf_t21d', name: 'Relentless Pursuit', type: 'passive', desc: '+3% ATK each turn (stacks infinitely)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'thf_t22a', name: 'Opportunity Strikes', type: 'passive', desc: 'Lucky Strike chance increased to 35%', icon: 'P' },
        { id: 'thf_t22c', name: 'Master Assassin', type: 'passive', desc: '+10% damage, +6% dodge', icon: 'P' },
        { id: 'thf_t22d', name: 'Toxic Immunity', type: 'passive', desc: 'Immune to poison and bleed, +8% ATK', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'thf_t23a', name: 'Ghost Walk', type: 'passive', desc: 'Every 3rd turn, automatically dodge all attacks', icon: 'P' },
        { id: 'thf_t23c', name: 'Perfect Timing', type: 'passive', desc: 'Skills have 10% chance to cost no mana', icon: 'P' },
        { id: 'thf_t23d', name: 'Death From Above', type: 'passive', desc: 'First attack each battle ignores all DEF and deals +17% damage', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'thf_t24a', name: 'Lethal Precision', type: 'passive', desc: 'Critical hits (Lucky Strike) now deal 2.3x instead of 2x', icon: 'P' },
        { id: 'thf_t24c', name: 'Shadow Lord', type: 'passive', desc: '+7% dodge chance, +10% ATK', icon: 'P' },
        { id: 'thf_t24d', name: 'Eternal Venom', type: 'passive', desc: 'All poison effects last forever (never expire)', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'thf_t25a', name: 'One with Nothing', type: 'passive', desc: 'Unequip all gear — your ATK and DEF become based on your level x3. Dodge chance 60%. Every hit you land steals 3% enemy max HP. You transcend equipment.', icon: 'P', milestone: true },
        { id: 'thf_t25c', name: 'Eternal Shadow', type: 'passive', desc: '23% dodge. ATK reduced to 25%. Every dodge deals 3% enemy max HP as shadow damage. You cannot be hit, but you barely hit back.', icon: 'P', milestone: true },
        { id: 'thf_t25d', name: 'God of Thieves', type: 'passive', desc: '+60% gold. All loot is legendary. +17% ATK. You take +10% more damage. Crits deal 2.5x. Fortune favors the bold.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'thf_t26a', name: 'Shadow Mastery', type: 'passive', desc: '+2% dodge and +2% ATK per level above 40', icon: 'P' },
        { id: 'thf_t26c', name: 'Venom Supremacy', type: 'passive', desc: 'All poison effects tripled and cannot be cleansed', icon: 'P' },
        { id: 'thf_t26d', name: 'Fortune Seeker', type: 'passive', desc: '+35% gold from battles, +10% rare item chance', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'thf_t27a', name: 'Lightning Reflexes', type: 'passive', desc: '14% chance to attack twice each turn', icon: 'P' },
        { id: 'thf_t27c', name: 'Shadowstep+', type: 'passive', desc: '+6% dodge chance permanently', icon: 'P' },
        { id: 'thf_t27d', name: 'Critical Mastery', type: 'passive', desc: 'Critical hits deal 2.5x damage instead of 2x', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'thf_t28a', name: 'Deadly Precision', type: 'passive', desc: 'All attacks ignore 16% of enemy DEF', icon: 'P' },
        { id: 'thf_t28c', name: 'Toxic Supremacy', type: 'passive', desc: 'Poison also reduces enemy ATK by 20% and DEF by 20%', icon: 'P' },
        { id: 'thf_t28d', name: 'Elusive Target', type: 'passive', desc: 'When dodging, heal 1% max HP and restore 3 mana', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'thf_t29a', name: 'Killing Machine', type: 'passive', desc: '+13% damage to enemies below 50% HP, +20% to those above', icon: 'P' },
        { id: 'thf_t29c', name: 'Master Acrobat', type: 'passive', desc: 'Take 10% less damage from all sources, +8% dodge', icon: 'P' },
        { id: 'thf_t29d', name: 'Blade Dancer', type: 'passive', desc: 'Each dodge increases ATK by 8% (stacks 5x per battle)', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'thf_t30a', name: 'Aspect of Shadow', type: 'passive', desc: '19% dodge chance. Every dodge deals 4% enemy max HP as shadow damage. ATK reduced by 30%. You are unhittable, death by a thousand shadows.', icon: 'P', milestone: true },
        { id: 'thf_t30c', name: 'Venom God', type: 'passive', desc: 'All poison damage +20%. Every attack applies lethal poison. Your direct damage is reduced by 50%. Venom does all the work.', icon: 'P', milestone: true },
        { id: 'thf_t30d', name: 'Master of Fortune', type: 'passive', desc: '+60% gold. All loot is epic+. Lucky Strike chance 13%. +12% ATK. You take +6% damage. The luckiest thief alive.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'thf_t31a', name: 'Phantom Agility', type: 'passive', desc: '13% chance to attack twice, dodge also triggers extra attack', icon: 'P' },
        { id: 'thf_t31c', name: 'Shadow Recovery', type: 'passive', desc: 'Heal 2% max HP and restore 3 mana at start of each turn', icon: 'P' },
        { id: 'thf_t31d', name: 'Lethal Intent', type: 'passive', desc: '+17% damage to enemies below 30% HP', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'thf_t32a', name: 'Legendary Thief', type: 'passive', desc: '+13% ATK, +7% dodge chance', icon: 'P' },
        { id: 'thf_t32c', name: 'Shadow Weave', type: 'passive', desc: 'Every 3rd turn, automatically dodge all attacks and deal 6% ATK shadow damage', icon: 'P' },
        { id: 'thf_t32d', name: 'Poison Immunity', type: 'passive', desc: 'Immune to all poison, bleed, and DoT effects, +10% ATK', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'thf_t33a', name: 'Supreme Evasion', type: 'passive', desc: '+2% dodge per level above 50', icon: 'P' },
        { id: 'thf_t33c', name: 'Assassin Instincts', type: 'passive', desc: 'First attack each battle deals 1.7x damage and is +15% crit chance', icon: 'P' },
        { id: 'thf_t33d', name: 'Quick Silver', type: 'passive', desc: 'All skill mana costs reduced by 40%', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'thf_t34a', name: 'Shadow Strike Master', type: 'passive', desc: 'After dodging, next attack deals +20% damage and ignores all DEF', icon: 'P' },
        { id: 'thf_t34c', name: 'Mythic Agility', type: 'passive', desc: '+17% ATK, +5% dodge, take 8% less damage', icon: 'P' },
        { id: 'thf_t34d', name: 'Plunderer Supreme', type: 'passive', desc: '+40% gold, all items drop at rare+ quality minimum', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'thf_t35a', name: 'Mythic Shadow', type: 'passive', desc: '20% dodge. ATK reduced by 25%. Every dodge deals 3% enemy max HP. Attacks apply lethal poison. You are the shadow of death itself.', icon: 'P', milestone: true },
        { id: 'thf_t35c', name: 'Blade Typhoon', type: 'passive', desc: 'Attack 2 times per turn at 70% damage each. Every dodge grants +3% ATK permanently per battle. 17% dodge chance. A whirlwind of steel.', icon: 'P', milestone: true },
        { id: 'thf_t35d', name: 'Emperor of Thieves', type: 'passive', desc: '+70% gold. All loot legendary. Crits deal 2.5x. +7% dodge. You take +7% damage. The richest corpse or the richest king.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'thf_t36a', name: 'Ethereal Form', type: 'passive', desc: '+9% dodge, heal 1% max HP per dodge', icon: 'P' },
        { id: 'thf_t36c', name: 'Lethal Efficiency', type: 'passive', desc: 'All damage +13% permanently', icon: 'P' },
        { id: 'thf_t36d', name: 'Shadow Cloak+', type: 'passive', desc: 'Start battle invisible: dodge first 3 attacks guaranteed, +12% ATK for 3 turns', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'thf_t37a', name: 'Mythic Precision', type: 'passive', desc: 'All attacks ignore 20% of enemy DEF, Crits deal 2.5x', icon: 'P' },
        { id: 'thf_t37c', name: 'Poison Grandmaster', type: 'passive', desc: 'All poison damage quadrupled, poison also applies doom for 2 turns', icon: 'P' },
        { id: 'thf_t37d', name: 'Blinding Speed', type: 'passive', desc: '15% chance to attack twice, +10% ATK per dodge (max 5 stacks)', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'thf_t38a', name: 'Apex Assassin', type: 'passive', desc: '+17% damage to enemies below 50% HP, first attack each battle ignores all DEF', icon: 'P' },
        { id: 'thf_t38c', name: 'Untouchable Legend', type: 'passive', desc: '+9% dodge, immune to all debuffs', icon: 'P' },
        { id: 'thf_t38d', name: 'Shadow Economy', type: 'passive', desc: '+50% gold, +13% item drop rate, all skills cost 12% less mana', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'thf_t39a', name: 'Ascended Thief', type: 'passive', desc: '+3% ATK and dodge per level above 60', icon: 'P' },
        { id: 'thf_t39c', name: 'Shadow Regeneration', type: 'passive', desc: 'Heal 2% max HP per turn, restore 4 mana per dodge', icon: 'P' },
        { id: 'thf_t39d', name: 'Legendary Lethality', type: 'passive', desc: '+20% ATK, all attacks have 12% chance to critically strike', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'thf_t40a', name: 'Divine Shadow', type: 'passive', desc: '21% dodge. Every dodge deals 4% enemy max HP. ATK reduced by 20%. Heal 1% max HP per dodge. You exist between worlds.', icon: 'P', milestone: true },
        { id: 'thf_t40c', name: 'Shadow Sovereign', type: 'passive', desc: 'Attack 2 times per turn at 70% damage. Every dodge grants +2% ATK permanently. 17% dodge. Crits deal 2.5x. A blizzard of blades.', icon: 'P', milestone: true },
        { id: 'thf_t40d', name: 'Lord of Shadows', type: 'passive', desc: 'All damage doubled. +9% dodge. Poison applies on every hit (5 turns). You take +6% damage. Cannot use potions. Pure lethal efficiency.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'thf_t41a', name: 'Godlike Reflexes', type: 'passive', desc: '+3% dodge per level above 60, dodge heals 1% max HP', icon: 'P' },
        { id: 'thf_t41c', name: 'Shadow Perfection', type: 'passive', desc: 'All damage +20%, all dodge +30%', icon: 'P' },
        { id: 'thf_t41d', name: 'Eternal Poison', type: 'passive', desc: 'All attacks apply poison (never expires), poison damage +20%', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'thf_t42a', name: 'Ultimate Evasion', type: 'passive', desc: '17% dodge chance, cannot be reduced below 20% HP by a single hit', icon: 'P' },
        { id: 'thf_t42c', name: 'Critical God', type: 'passive', desc: 'Lucky Strike chance 17%, Crits deal 2.3x damage', icon: 'P' },
        { id: 'thf_t42d', name: 'Shadow Vigor', type: 'passive', desc: 'Heal 2% max HP per turn, restore 5 mana per turn', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'thf_t43a', name: 'Ethereal Assassin', type: 'passive', desc: 'All equipment bonuses increased by 40%, +12% ATK', icon: 'P' },
        { id: 'thf_t43c', name: 'Spectral Agility', type: 'passive', desc: '17% chance to attack twice, each attack has 12% crit chance', icon: 'P' },
        { id: 'thf_t43d', name: 'Grand Larceny', type: 'passive', desc: '+60% gold, all loot epic+, +17% item drop rate', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'thf_t44a', name: 'Shadow Transcendence', type: 'passive', desc: '+10% dodge chance, dodge also restores 3% max HP and 5 mana', icon: 'P' },
        { id: 'thf_t44c', name: 'Primal Instinct', type: 'passive', desc: '+20% ATK, immune to all negative effects', icon: 'P' },
        { id: 'thf_t44d', name: 'Invisible Death', type: 'passive', desc: 'First 3 attacks each battle deal 1.7x damage and ignore all DEF', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'thf_t45a', name: 'Primordial Shadow', type: 'passive', desc: '23% dodge. Every dodge deals 5% enemy max HP. ATK -10%. Heal 2% max HP per dodge. You are the darkness between heartbeats.', icon: 'P', milestone: true },
        { id: 'thf_t45c', name: 'Eternal Blade Dance', type: 'passive', desc: 'Attack 2 times per turn at 70% damage. 20% dodge. Every dodge grants +3% ATK permanently. Crits deal 2.5x. An endless storm of steel.', icon: 'P', milestone: true },
        { id: 'thf_t45d', name: 'Primordial Fortune', type: 'passive', desc: '+80% gold. All loot legendary. Crits deal 2.5x. +17% ATK. +9% dodge. You take +10% more damage. The ultimate risk-reward existence.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'thf_t46a', name: 'Godlike Agility', type: 'passive', desc: '+10% dodge, +17% ATK, heal 1% max HP per dodge', icon: 'P' },
        { id: 'thf_t46c', name: 'Infinite Precision', type: 'passive', desc: 'All attacks ignore 15% of enemy DEF, +13% ATK', icon: 'P' },
        { id: 'thf_t46d', name: 'Ascended Assassin', type: 'passive', desc: 'All skill damage +60%, all skill costs -40%', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'thf_t47a', name: 'Supreme Shadow', type: 'passive', desc: '18% chance to attack twice, Crits deal 2.5x, +13% ATK', icon: 'P' },
        { id: 'thf_t47c', name: 'Master of All Trades', type: 'passive', desc: '+17% ATK, +9% dodge, +12% max HP', icon: 'P' },
        { id: 'thf_t47d', name: 'Eternal Evasion', type: 'passive', desc: 'Immune to all damage for first 3 turns of battle, +12% ATK', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'thf_t48a', name: 'Shadow Legend', type: 'passive', desc: '+25% ATK, +10% dodge, all attacks apply lethal poison', icon: 'P' },
        { id: 'thf_t48c', name: 'Phantom God', type: 'passive', desc: 'All equipment bonuses increased by 60%, +9% dodge', icon: 'P' },
        { id: 'thf_t48d', name: 'Primordial Agility', type: 'passive', desc: 'Heal 2% max HP per turn, restore 6 mana per turn', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'thf_t49a', name: 'Mythic Assassin', type: 'passive', desc: '+25% ATK, +10% dodge, all attacks have +10% crit chance', icon: 'P' },
        { id: 'thf_t49c', name: 'Absolute Stealth', type: 'passive', desc: '+12% dodge, +17% ATK, immune to all negative effects', icon: 'P' },
        { id: 'thf_t49d', name: 'Infinite Fortune', type: 'passive', desc: '+75% gold, all loot legendary, +20% item drop rate', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'thf_t50a', name: 'God of Shadows', type: 'passive', desc: '24% dodge. Every dodge deals 7% enemy max HP. Heal 2% max HP per dodge. ATK -10%. You are shadow incarnate — untouchable, inevitable.', icon: 'P', milestone: true },
        { id: 'thf_t50c', name: 'Eternal Phantom', type: 'passive', desc: 'Attack 2 times per turn at 70% damage. 20% dodge. Crits deal 2.5x. Every dodge heals 5%. An infinite cascade of phantom blades.', icon: 'P', milestone: true },
        { id: 'thf_t50d', name: 'Primordial God of Fortune', type: 'passive', desc: '+100% gold. All loot legendary. Crits deal 2.5x. Lucky Strike 20%. +25% ATK. You take +15% more damage. The ultimate gambler.', icon: 'P', milestone: true },
      ]},
    ],
  },
  mage: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'mag_t1a', name: 'Mana Shield', type: 'passive', desc: '10% of damage taken is absorbed by mana', icon: 'P' },
        { id: 'mag_t1c', name: 'Arcane Focus', type: 'passive', desc: '+6% skill damage', icon: 'P' },
        { id: 'mag_t1d', name: 'Mana Flow', type: 'passive', desc: 'Restore 1 mana at start of each turn', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'mag_t2a', name: 'Spell Echo', type: 'passive', desc: '10% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t2c', name: 'Frost Armor', type: 'passive', desc: 'Take 5% less damage from all attacks', icon: 'P' },
        { id: 'mag_t2d', name: 'Mana Efficiency', type: 'passive', desc: 'All skills cost 6% less mana', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'mag_t3a', name: 'Arcane Overflow', type: 'passive', desc: '+1 ATK for every 10 current mana', icon: 'P' },
        { id: 'mag_t3c', name: 'Elemental Affinity', type: 'passive', desc: '+8% ATK permanently', icon: 'P' },
        { id: 'mag_t3d', name: 'Arcane Regeneration', type: 'passive', desc: 'Restore 3% max mana each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'mag_t4a', name: 'Mana Surge', type: 'passive', desc: 'All skills cost 10% less mana', icon: 'P' },
        { id: 'mag_t4c', name: 'Spell Shield', type: 'passive', desc: '+10% max mana, +3% DEF', icon: 'P' },
        { id: 'mag_t4d', name: 'Burning Soul', type: 'passive', desc: 'After using a skill, deal 3% ATK as bonus damage on next attack', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'mag_t5a', name: 'Meditation', type: 'passive', desc: 'Restore 2 mana at the start of each turn', icon: 'P' },
        { id: 'mag_t5c', name: 'Arcane Brilliance', type: 'passive', desc: '+20% max mana', icon: 'P' },
        { id: 'mag_t5d', name: 'Elemental Ward', type: 'passive', desc: 'Take 6% less damage, +3% max HP', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'mag_t6a', name: 'Elemental Mastery', type: 'passive', desc: 'All skill damage +20%', icon: 'P' },
        { id: 'mag_t6c', name: 'Mana Harvest', type: 'passive', desc: 'Restore 3 mana when you deal damage with a skill', icon: 'P' },
        { id: 'mag_t6d', name: 'Crystallize', type: 'passive', desc: 'When defending, gain a shield equal to 10% max mana', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'mag_t7a', name: 'Arcane Barrier', type: 'passive', desc: 'Defend also restores 10 mana', icon: 'P' },
        { id: 'mag_t7c', name: 'Arcane Potency', type: 'passive', desc: 'Skill damage scales with 3% of current mana', icon: 'P' },
        { id: 'mag_t7d', name: 'Enchanted Armor', type: 'passive', desc: '+8% DEF, equipment DEF bonuses +10%', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'mag_t8a', name: 'Spellweaver', type: 'passive', desc: 'After using a skill, next attack deals +17% damage', icon: 'P' },
        { id: 'mag_t8c', name: 'Mana Mastery', type: 'passive', desc: '+15% max mana, restore 2 mana per turn', icon: 'P' },
        { id: 'mag_t8d', name: 'Empowered Spells', type: 'passive', desc: 'Skills that cost >15 mana deal +10% damage', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'mag_t9a', name: 'Mana Regeneration', type: 'passive', desc: 'Restore 8% max mana each turn', icon: 'P' },
        { id: 'mag_t9c', name: 'Spell Penetration', type: 'passive', desc: 'All skills ignore 10% of enemy DEF', icon: 'P' },
        { id: 'mag_t9d', name: 'Arcane Resilience', type: 'passive', desc: '+7% max HP, immune to mana drain effects', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'mag_t10a', name: 'Transcendence', type: 'passive', desc: 'Mana Shield absorbs 40% instead of 20%', icon: 'P' },
        { id: 'mag_t10c', name: 'Spell Lord', type: 'passive', desc: 'All skill damage +25%, +10% max mana', icon: 'P' },
        { id: 'mag_t10d', name: 'Living Mana', type: 'passive', desc: 'Heal 1% max HP when you spend mana', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'mag_t11a', name: 'Arcane Intellect', type: 'passive', desc: '+1 ATK per 10 max mana', icon: 'P' },
        { id: 'mag_t11c', name: 'Mana Font', type: 'passive', desc: '+25% max mana', icon: 'P' },
        { id: 'mag_t11d', name: 'Elemental Fury', type: 'passive', desc: 'Skills have 8% chance to deal double damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'mag_t12a', name: 'Mana Well', type: 'passive', desc: '+30% max mana', icon: 'P' },
        { id: 'mag_t12c', name: 'Runic Power', type: 'passive', desc: '+2% skill damage per level above 15', icon: 'P' },
        { id: 'mag_t12d', name: 'Elemental Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 15% max mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'mag_t13a', name: 'Sorcerous Shield', type: 'passive', desc: 'Start battle with a shield equal to 20% max mana', icon: 'P' },
        { id: 'mag_t13c', name: 'Volatile Magic', type: 'passive', desc: 'Skills have 10% chance to deal +17% damage', icon: 'P' },
        { id: 'mag_t13d', name: 'Astral Sight', type: 'passive', desc: 'All enemy stats visible, +6% damage to all enemies', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'mag_t14a', name: 'Spell Mastery', type: 'passive', desc: 'All skill damage +30%', icon: 'P' },
        { id: 'mag_t14c', name: 'Deep Reserves', type: 'passive', desc: '+40% max mana, restore 5% max mana per turn', icon: 'P' },
        { id: 'mag_t14d', name: 'Arcane Supremacy', type: 'passive', desc: 'Equipment ATK bonuses increased by 25%', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'mag_t15a', name: 'Archmage', type: 'passive', desc: 'All skills cost 17% less mana. Your max HP is halved permanently. Mana becomes your true resource — HP is just a suggestion.', icon: 'P', milestone: true },
        { id: 'mag_t15c', name: 'Spell Singularity', type: 'passive', desc: 'Every spell you cast increases all future spell damage by 3% (stacks infinitely). Mana costs increase by 1 each cast. Infinite potential.', icon: 'P', milestone: true },
        { id: 'mag_t15d', name: 'Mana Incarnate', type: 'passive', desc: 'Your mana pool doubles. All damage scales with current mana (1% per 5 mana). At 0 mana you deal 0 damage. Mana IS your power.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'mag_t16a', name: 'Temporal Shield', type: 'passive', desc: 'After taking damage, heal 6% of it over 2 turns', icon: 'P' },
        { id: 'mag_t16c', name: 'Feedback Loop', type: 'passive', desc: 'When a skill deals double damage (Spell Echo), restore all mana spent', icon: 'P' },
        { id: 'mag_t16d', name: 'Arcane Fortification', type: 'passive', desc: '+10% DEF, +10% max HP', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'mag_t17a', name: 'Leyline Tap', type: 'passive', desc: 'Restore 12% max mana each turn', icon: 'P' },
        { id: 'mag_t17c', name: 'Spellfire', type: 'passive', desc: 'Normal attacks deal true damage (ignore DEF)', icon: 'P' },
        { id: 'mag_t17d', name: 'Mana Conduit', type: 'passive', desc: '+2 ATK per 10 current mana', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'mag_t18a', name: 'Spell Echo+', type: 'passive', desc: '14% chance for skills to deal double damage (replaces Spell Echo)', icon: 'P' },
        { id: 'mag_t18c', name: 'Arcane Torrent+', type: 'passive', desc: 'All skill damage +35%', icon: 'P' },
        { id: 'mag_t18d', name: 'Counterspell', type: 'passive', desc: 'Immune to enemy debuffs and ATK reductions', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'mag_t19a', name: 'Overcharge', type: 'passive', desc: 'When mana is above 75%, all damage +25%', icon: 'P' },
        { id: 'mag_t19c', name: 'Infinite Mana', type: 'passive', desc: '+50% max mana, restore 8% max mana per turn', icon: 'P' },
        { id: 'mag_t19d', name: 'Devastation', type: 'passive', desc: 'Skills that cost >25 mana deal +13% damage', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'mag_t20a', name: 'Lich Ascension', type: 'passive', desc: 'Your HP and Mana pools merge into one Arcane HP pool. Spells cost HP. Your total pool is HP + Mana combined. All healing works on this pool.', icon: 'P', milestone: true },
        { id: 'mag_t20c', name: 'Living Spellbook', type: 'passive', desc: 'All active skills cost 0 mana. Your max HP is reduced by 60%. Every spell cast costs 5% current HP instead. Glass cannon perfected.', icon: 'P', milestone: true },
        { id: 'mag_t20d', name: 'Arcane Godhood', type: 'passive', desc: 'All skill damage doubled. Max mana tripled. Cannot use normal attacks. Defending restores 10% mana. Pure spellcaster.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'mag_t21a', name: 'Arcane Attunement', type: 'passive', desc: '+1% skill damage per player level', icon: 'P' },
        { id: 'mag_t21c', name: 'Spell Cascade', type: 'passive', desc: 'After using a skill, 12% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t21d', name: 'Mana Absorption', type: 'passive', desc: '8% of damage taken is converted to mana', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'mag_t22a', name: 'Spell Absorption', type: 'passive', desc: '6% of damage taken is converted to mana', icon: 'P' },
        { id: 'mag_t22c', name: 'Arcane Overload', type: 'passive', desc: 'All damage +15%, take 6% more damage', icon: 'P' },
        { id: 'mag_t22d', name: 'Mana Shield+', type: 'passive', desc: 'Mana Shield now absorbs 17% of damage', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'mag_t23a', name: 'Infinite Power', type: 'passive', desc: 'Skills that cost mana also deal bonus damage equal to mana spent', icon: 'P' },
        { id: 'mag_t23c', name: 'Arcane Perfection', type: 'passive', desc: 'Skills have 10% chance to cost no mana', icon: 'P' },
        { id: 'mag_t23d', name: 'Spellstorm', type: 'passive', desc: 'Each skill used in battle increases next skill damage by 10%', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'mag_t24a', name: 'Astral Form', type: 'passive', desc: 'Mana Shield absorbs 17% of damage (replaces Transcendence)', icon: 'P' },
        { id: 'mag_t24c', name: 'Endless Wisdom', type: 'passive', desc: '+2% ATK per level above 30', icon: 'P' },
        { id: 'mag_t24d', name: 'Supreme Intellect', type: 'passive', desc: '+50% max mana, all skill damage +20%', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'mag_t25a', name: 'Reality Weaver', type: 'passive', desc: 'Each spell you cast permanently increases your ATK by 2 for the rest of the run. Mana costs +15%. Your power grows infinitely but each spell is a gamble.', icon: 'P', milestone: true },
        { id: 'mag_t25c', name: 'Omniscience', type: 'passive', desc: 'All skills deal true damage. All skills cost 21% less. Your max HP is reduced to 1. One hit kills you. Absolute power at absolute risk.', icon: 'P', milestone: true },
        { id: 'mag_t25d', name: 'Spell Weaver Supreme', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 1%. Normal attacks are replaced by free 2.0x true damage spells. You become magic itself.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'mag_t26a', name: 'Arcane Ascendancy', type: 'passive', desc: '+2% skill damage per level above 40', icon: 'P' },
        { id: 'mag_t26c', name: 'Mana Wellspring', type: 'passive', desc: '+60% max mana, restore 10% max mana per turn', icon: 'P' },
        { id: 'mag_t26d', name: 'Spell Amplification', type: 'passive', desc: 'All skill damage +40%', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'mag_t27a', name: 'Arcane Storm', type: 'passive', desc: '13% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t27c', name: 'Mana Shield Supreme', type: 'passive', desc: 'Mana Shield absorbs 20% of damage', icon: 'P' },
        { id: 'mag_t27d', name: 'Spell Efficiency', type: 'passive', desc: 'All skill costs reduced by 35%', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'mag_t28a', name: 'Dimensional Mastery', type: 'passive', desc: 'After using a skill, next skill deals +17% damage', icon: 'P' },
        { id: 'mag_t28c', name: 'Arcane Vitality', type: 'passive', desc: 'Heal 1% max HP when you spend mana, +10% max HP', icon: 'P' },
        { id: 'mag_t28d', name: 'Elemental Supremacy', type: 'passive', desc: 'All skills ignore 16% of enemy DEF', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'mag_t29a', name: 'Spell Cascade+', type: 'passive', desc: 'After using a skill, 13% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t29c', name: 'Living Arcana', type: 'passive', desc: '+3 ATK per 10 current mana, +30% max mana', icon: 'P' },
        { id: 'mag_t29d', name: 'Temporal Mastery', type: 'passive', desc: 'After taking damage, heal 7% of it over 2 turns', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'mag_t30a', name: 'Aspect of the Arcane', type: 'passive', desc: 'All skill damage doubled. Max mana quadrupled. All skill costs +50%. Your max HP is halved. Pure arcane devastation.', icon: 'P', milestone: true },
        { id: 'mag_t30c', name: 'Arcane Singularity', type: 'passive', desc: 'Every spell increases all future spell damage by 5% (stacks infinitely). Mana costs increase by 2 each cast. Limitless potential at limitless cost.', icon: 'P', milestone: true },
        { id: 'mag_t30d', name: 'Mana God', type: 'passive', desc: 'Mana pool +20%. All damage scales with current mana (2% per 5 mana). At 0 mana you deal 0 damage. Mana regeneration doubled.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'mag_t31a', name: 'Spellfire Mastery', type: 'passive', desc: 'Normal attacks deal true damage and deal +17% damage', icon: 'P' },
        { id: 'mag_t31c', name: 'Supreme Intellect+', type: 'passive', desc: '+80% max mana, all skill damage +30%', icon: 'P' },
        { id: 'mag_t31d', name: 'Arcane Regeneration+', type: 'passive', desc: 'Restore 15% max mana each turn, heal 1% max HP per turn', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'mag_t32a', name: 'Legendary Sorcerer', type: 'passive', desc: 'All skill damage +50%, skills have 12% chance to deal double damage', icon: 'P' },
        { id: 'mag_t32c', name: 'Mana Conversion', type: 'passive', desc: '10% of damage taken converted to mana', icon: 'P' },
        { id: 'mag_t32d', name: 'Crystalline Shield', type: 'passive', desc: 'Start each battle with shield equal to 30% max mana', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'mag_t33a', name: 'Arcane Supremacy+', type: 'passive', desc: '+2% skill damage per level above 50', icon: 'P' },
        { id: 'mag_t33c', name: 'Infinite Wisdom', type: 'passive', desc: '+100% max mana, all skill costs -25%', icon: 'P' },
        { id: 'mag_t33d', name: 'Elemental Lord', type: 'passive', desc: 'All damage +16%, immune to all debuffs', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'mag_t34a', name: 'Leyline Master', type: 'passive', desc: 'Restore 20% max mana each turn', icon: 'P' },
        { id: 'mag_t34c', name: 'Arcane Perfection+', type: 'passive', desc: 'Skills have 14% chance to cost no mana', icon: 'P' },
        { id: 'mag_t34d', name: 'Empowered Barrier', type: 'passive', desc: 'Mana Shield absorbs 20% of damage, +40% max mana', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'mag_t35a', name: 'Mythic Archmage', type: 'passive', desc: 'All skills cost 17% less mana. All skill damage tripled. Max HP reduced by 70%. One touch of magic annihilates, but a breeze could kill you.', icon: 'P', milestone: true },
        { id: 'mag_t35c', name: 'Arcane Godhood+', type: 'passive', desc: 'All skill damage tripled. Max mana +20%. Cannot use normal attacks. Defending restores 12% mana. All healing +20%. Supreme spellcaster.', icon: 'P', milestone: true },
        { id: 'mag_t35d', name: 'Living Spell', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 2%. Normal attacks replaced by 3.0x true damage spells. Mana costs +3 per cast. You ARE magic.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'mag_t36a', name: 'Spell Annihilation', type: 'passive', desc: 'All skill damage +60%, skills ignore all DEF', icon: 'P' },
        { id: 'mag_t36c', name: 'Mana Fortress', type: 'passive', desc: '+120% max mana, +12% max HP, +10% DEF', icon: 'P' },
        { id: 'mag_t36d', name: 'Spell Echo Supreme', type: 'passive', desc: '17% chance for skills to deal double damage', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'mag_t37a', name: 'Cosmic Intellect', type: 'passive', desc: '+3 ATK per 10 current mana, +50% max mana', icon: 'P' },
        { id: 'mag_t37c', name: 'Mana Overflow', type: 'passive', desc: 'When mana is above 50%, all damage +40%. When above 80%, all damage +80%', icon: 'P' },
        { id: 'mag_t37d', name: 'Arcane Recovery', type: 'passive', desc: 'Heal 2% max HP per turn, restore 15% max mana per turn', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'mag_t38a', name: 'Celestial Power', type: 'passive', desc: 'All equipment bonuses increased by 40%, +17% skill damage', icon: 'P' },
        { id: 'mag_t38c', name: 'Spell Cascade Supreme', type: 'passive', desc: 'After using a skill, 17% chance to cast it again for free', icon: 'P' },
        { id: 'mag_t38d', name: 'Ethereal Shield', type: 'passive', desc: 'Mana Shield absorbs 23% of damage', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'mag_t39a', name: 'Ascended Mage', type: 'passive', desc: '+3% skill damage per level above 60', icon: 'P' },
        { id: 'mag_t39c', name: 'Infinite Mana+', type: 'passive', desc: '+150% max mana, restore 20% max mana per turn', icon: 'P' },
        { id: 'mag_t39d', name: 'Primordial Wisdom', type: 'passive', desc: 'All damage +20%, all skill costs -40%', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'mag_t40a', name: 'Divine Archmage', type: 'passive', desc: 'All skill damage quadrupled. All skill costs -50%. Max HP reduced by 80%. Max mana +20%. Glass cannon ascended to godhood.', icon: 'P', milestone: true },
        { id: 'mag_t40c', name: 'Spell Singularity+', type: 'passive', desc: 'Every spell increases all future spell damage by 8% (stacks infinitely). Mana costs increase by 3 each cast. Defend restores 13% mana. Infinite escalation.', icon: 'P', milestone: true },
        { id: 'mag_t40d', name: 'Arcane Transcendence', type: 'passive', desc: 'HP and Mana merge. All spells cost HP. Total pool = HP + Mana x2. All healing +20%. Every spell heals 2% of damage as HP. Pure arcane existence.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'mag_t41a', name: 'Godlike Intellect', type: 'passive', desc: '+3 ATK per 10 current mana, +80% max mana', icon: 'P' },
        { id: 'mag_t41c', name: 'Supreme Spellcraft', type: 'passive', desc: 'All skill damage +70%, skills have 13% chance to cost no mana', icon: 'P' },
        { id: 'mag_t41d', name: 'Arcane Immortality', type: 'passive', desc: 'Heal 2% max HP per turn, +13% max HP', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'mag_t42a', name: 'Cosmic Mastery', type: 'passive', desc: '18% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t42c', name: 'Mana Supremacy', type: 'passive', desc: '+200% max mana, restore 25% max mana per turn', icon: 'P' },
        { id: 'mag_t42d', name: 'Spell Fortress', type: 'passive', desc: 'Start each battle with shield equal to 50% max mana', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'mag_t43a', name: 'Mythic Sorcery', type: 'passive', desc: 'All equipment bonuses increased by 50%, +17% skill damage', icon: 'P' },
        { id: 'mag_t43c', name: 'Arcane Resilience+', type: 'passive', desc: 'All damage taken reduced by 30%, immune to all debuffs, +12% max HP', icon: 'P' },
        { id: 'mag_t43d', name: 'Spell God', type: 'passive', desc: 'All skill damage +80%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'mag_t44a', name: 'Primordial Arcana', type: 'passive', desc: '+3% skill damage per level above 70', icon: 'P' },
        { id: 'mag_t44c', name: 'Infinite Arcana', type: 'passive', desc: 'Skills that cost mana deal bonus true damage equal to 38% of mana spent', icon: 'P' },
        { id: 'mag_t44d', name: 'Celestial Regeneration', type: 'passive', desc: 'Heal 3% max HP and restore 20% max mana per turn', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'mag_t45a', name: 'Primordial Archmage', type: 'passive', desc: 'All skill damage +20%. All skill costs -60%. Max HP reduced by 90%. You are a being of pure magic — one hit destroys you, one spell destroys everything.', icon: 'P', milestone: true },
        { id: 'mag_t45c', name: 'Infinite Spellweave', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 3%. Normal attacks replaced by 4.0x true damage spells. Mana costs +5 per cast. Transcendent magic.', icon: 'P', milestone: true },
        { id: 'mag_t45d', name: 'Arcane Eternity', type: 'passive', desc: 'Cannot die while mana > 0. All damage taken drains mana instead of HP. Max mana +20%. Restore 6% mana/turn. Mana is your life.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'mag_t46a', name: 'Godlike Sorcery', type: 'passive', desc: 'All skill damage +100%, 17% chance for skills to deal double damage', icon: 'P' },
        { id: 'mag_t46c', name: 'Supreme Mana', type: 'passive', desc: '+300% max mana, restore 30% max mana per turn', icon: 'P' },
        { id: 'mag_t46d', name: 'Arcane God', type: 'passive', desc: 'All damage +23%, immune to all effects, +17% max HP', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'mag_t47a', name: 'Spell Infinity', type: 'passive', desc: '17% chance for skills to cost no mana, +17% skill damage', icon: 'P' },
        { id: 'mag_t47c', name: 'Arcane Perfection Supreme', type: 'passive', desc: '+4 ATK per 10 current mana, +100% max mana', icon: 'P' },
        { id: 'mag_t47d', name: 'Cosmic Vitality', type: 'passive', desc: 'Heal 2% max HP per turn, +17% max HP, +13% DEF', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'mag_t48a', name: 'Mythic Arcana', type: 'passive', desc: 'All equipment bonuses increased by 60%, +20% skill damage', icon: 'P' },
        { id: 'mag_t48c', name: 'Supreme Spellweave', type: 'passive', desc: '17% chance to cast skills twice for free, all skill damage +50%', icon: 'P' },
        { id: 'mag_t48d', name: 'Astral Immortality', type: 'passive', desc: 'Mana Shield absorbs 24% of damage, +200% max mana', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'mag_t49a', name: 'Cosmic Supremacy', type: 'passive', desc: 'All skill damage +120%, all skill costs -50%', icon: 'P' },
        { id: 'mag_t49c', name: 'Infinite Power+', type: 'passive', desc: 'Skills deal bonus true damage equal to 50% of mana spent', icon: 'P' },
        { id: 'mag_t49d', name: 'Primordial Regeneration', type: 'passive', desc: 'Heal 3% max HP and restore 30% max mana per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'mag_t50a', name: 'God of Magic', type: 'passive', desc: 'All skill damage x10. All skill costs -80%. Max HP reduced by 95%. Max mana x10. You are a god of destruction — fragile as glass, powerful as the sun.', icon: 'P', milestone: true },
        { id: 'mag_t50c', name: 'Eternal Spellweaver', type: 'passive', desc: 'Every spell cast permanently increases ALL stats by 5%. Normal attacks are 5.0x true damage spells. Mana costs +10 per cast. Infinite, unstoppable growth.', icon: 'P', milestone: true },
        { id: 'mag_t50d', name: 'Primordial God of Arcana', type: 'passive', desc: 'Cannot die while mana > 0. All damage drains mana instead. Max mana x10. All skill damage x5. Restore 8% mana/turn. You are magic eternal.', icon: 'P', milestone: true },
      ]},
    ],
  },
  necromancer: {
    tiers: [
      { level: 2, label: 'Tier 1', choices: [
        { id: 'nec_t1a', name: 'Soul Siphon', type: 'passive', desc: 'Attacks have 10% chance to restore 3 mana', icon: 'P' },
        { id: 'nec_t1c', name: 'Dark Vitality', type: 'passive', desc: '+3% max HP, +3% ATK', icon: 'P' },
        { id: 'nec_t1d', name: 'Necrotic Presence', type: 'passive', desc: 'Enemies take 2% max HP damage at start of combat', icon: 'P' },
      ]},
      { level: 4, label: 'Tier 2', choices: [
        { id: 'nec_t2a', name: "Death's Embrace", type: 'passive', desc: 'When below 25% HP, heal 2% max HP (once/battle)', icon: 'P' },
        { id: 'nec_t2c', name: 'Bone Armor', type: 'passive', desc: 'Take 5% less damage from all attacks', icon: 'P' },
        { id: 'nec_t2d', name: 'Soul Leech', type: 'passive', desc: 'Normal attacks heal 2% of damage dealt', icon: 'P' },
      ]},
      { level: 6, label: 'Tier 3', choices: [
        { id: 'nec_t3a', name: 'Vampiric Aura', type: 'passive', desc: 'All attacks heal 3% of damage dealt', icon: 'P' },
        { id: 'nec_t3c', name: 'Corpse Shield', type: 'passive', desc: '+7% DEF permanently', icon: 'P' },
        { id: 'nec_t3d', name: 'Dark Channeling', type: 'passive', desc: 'Restore 2 mana at start of each turn', icon: 'P' },
      ]},
      { level: 8, label: 'Tier 4', choices: [
        { id: 'nec_t4a', name: 'Dark Pact', type: 'passive', desc: 'Sacrifice 3% HP per turn, gain +10% ATK', icon: 'P' },
        { id: 'nec_t4c', name: 'Spectral Grasp', type: 'passive', desc: 'Poison effects you apply also reduce enemy ATK by 10%', icon: 'P' },
        { id: 'nec_t4d', name: 'Unholy Vigor', type: 'passive', desc: '+8% ATK, heal 1% max HP per turn', icon: 'P' },
      ]},
      { level: 10, label: 'Tier 5', choices: [
        { id: 'nec_t5a', name: 'Necrotic Touch', type: 'passive', desc: 'Normal attacks reduce enemy DEF by 1 each hit', icon: 'P' },
        { id: 'nec_t5c', name: 'Decay Aura', type: 'passive', desc: 'Enemies take 1% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t5d', name: 'Soul Well', type: 'passive', desc: '+15% max mana, restore 1 mana when enemy takes DoT damage', icon: 'P' },
      ]},
      { level: 12, label: 'Tier 6', choices: [
        { id: 'nec_t6a', name: 'Life Tap', type: 'passive', desc: 'Spending mana heals 6% of mana spent as HP', icon: 'P' },
        { id: 'nec_t6c', name: 'Cursed Touch', type: 'passive', desc: 'Normal attacks have 8% chance to doom enemy for 2 turns', icon: 'P' },
        { id: 'nec_t6d', name: 'Bone Barrier', type: 'passive', desc: 'Start each battle with a shield equal to 6% max HP', icon: 'P' },
      ]},
      { level: 14, label: 'Tier 7', choices: [
        { id: 'nec_t7a', name: 'Undead Fortitude', type: 'passive', desc: '+6% max HP and +6% DEF', icon: 'P' },
        { id: 'nec_t7c', name: 'Pestilence', type: 'passive', desc: 'Poison effects last 1 extra turn', icon: 'P' },
        { id: 'nec_t7d', name: 'Dark Resilience', type: 'passive', desc: 'Immune to poison, +5% ATK', icon: 'P' },
      ]},
      { level: 16, label: 'Tier 8', choices: [
        { id: 'nec_t8a', name: 'Cursed Blood', type: 'passive', desc: 'When hit, 10% chance to poison the attacker for 2 turns', icon: 'P' },
        { id: 'nec_t8c', name: 'Soul Harvest+', type: 'passive', desc: 'Lifesteal from all sources increased by 25%', icon: 'P' },
        { id: 'nec_t8d', name: 'Blighted Ground', type: 'passive', desc: 'Enemies take +6% damage from poison and doom', icon: 'P' },
      ]},
      { level: 18, label: 'Tier 9', choices: [
        { id: 'nec_t9a', name: 'Eternal Hunger', type: 'passive', desc: 'Lifesteal from all sources increased by 50%', icon: 'P' },
        { id: 'nec_t9c', name: 'Dark Empowerment', type: 'passive', desc: '+10% ATK when enemy is poisoned or doomed', icon: 'P' },
        { id: 'nec_t9d', name: 'Reaper Form', type: 'passive', desc: '+3% ATK per turn in battle (stacks)', icon: 'P' },
      ]},
      { level: 20, label: 'Tier 10', choices: [
        { id: 'nec_t10a', name: 'Lich Form', type: 'passive', desc: 'All healing +10%, +10% ATK, immune to poison', icon: 'P' },
        { id: 'nec_t10c', name: 'Soul Lord', type: 'passive', desc: '+10% ATK, +15% max mana, restore 3 mana on kill', icon: 'P' },
        { id: 'nec_t10d', name: 'Undying', type: 'passive', desc: 'Survive one lethal hit per battle at 20% HP', icon: 'P' },
      ]},
      { level: 22, label: 'Tier 11', choices: [
        { id: 'nec_t11a', name: 'Death Aura', type: 'passive', desc: 'Enemies take 2% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t11c', name: 'Ghoul Strength', type: 'passive', desc: '+10% ATK permanently', icon: 'P' },
        { id: 'nec_t11d', name: 'Miasma', type: 'passive', desc: 'All DoT effects deal 10% more damage', icon: 'P' },
      ]},
      { level: 24, label: 'Tier 12', choices: [
        { id: 'nec_t12a', name: 'Soul Collector', type: 'passive', desc: 'Gain +2% ATK per battle won (resets on rest, max 30%)', icon: 'P' },
        { id: 'nec_t12c', name: 'Vile Contagion', type: 'passive', desc: 'Poison effects also apply doom for 1 turn', icon: 'P' },
        { id: 'nec_t12d', name: 'Drain Essence', type: 'passive', desc: 'Normal attacks restore 2 mana', icon: 'P' },
      ]},
      { level: 26, label: 'Tier 13', choices: [
        { id: 'nec_t13a', name: 'Hungering Void', type: 'passive', desc: 'Lifesteal from all sources now also restores mana equal to 10% of healing done', icon: 'P' },
        { id: 'nec_t13c', name: 'Lich Armor', type: 'passive', desc: '+10% DEF, immune to ATK debuffs', icon: 'P' },
        { id: 'nec_t13d', name: 'Soulfire', type: 'passive', desc: '+8% skill damage, skills ignore 8% DEF', icon: 'P' },
      ]},
      { level: 28, label: 'Tier 14', choices: [
        { id: 'nec_t14a', name: 'Phylactery', type: 'passive', desc: 'On death, revive once at 30% HP (once per battle)', icon: 'P' },
        { id: 'nec_t14c', name: 'Plague Lord', type: 'passive', desc: 'All poison and doom durations +2 turns', icon: 'P' },
        { id: 'nec_t14d', name: 'Death Shroud', type: 'passive', desc: 'Take 8% less damage from all sources', icon: 'P' },
      ]},
      { level: 30, label: '★ Tier 15', milestone: true, choices: [
        { id: 'nec_t15a', name: 'Pact of Undeath', type: 'passive', desc: 'You are undead. Healing is 17% more effective. Potions damage you instead of healing. Your HP slowly drains (1%/turn) but you lifesteal from everything.', icon: 'P', milestone: true },
        { id: 'nec_t15c', name: 'Plague Bearer', type: 'passive', desc: 'All DoT damage tripled. Poison and doom cannot be resisted. Your direct damage is reduced by 40%. Death comes slowly but inevitably.', icon: 'P', milestone: true },
        { id: 'nec_t15d', name: 'Soul Devourer', type: 'passive', desc: 'Every attack steals 2% enemy max HP permanently and adds it to yours. Your base ATK is reduced by 10%. You grow by consuming.', icon: 'P', milestone: true },
      ]},
      { level: 32, label: 'Tier 16', choices: [
        { id: 'nec_t16a', name: 'Grave Chill', type: 'passive', desc: 'Enemies you poison also have ATK reduced by 15%', icon: 'P' },
        { id: 'nec_t16c', name: 'Siphon Life', type: 'passive', desc: 'Heal 1% max HP at start of each turn', icon: 'P' },
        { id: 'nec_t16d', name: 'Dark Power', type: 'passive', desc: '+2% ATK per level above 25', icon: 'P' },
      ]},
      { level: 34, label: 'Tier 17', choices: [
        { id: 'nec_t17a', name: 'Undying Servitude', type: 'passive', desc: 'Dark Pact ATK bonus increased to +50%, sacrifice reduced to 3%', icon: 'P' },
        { id: 'nec_t17c', name: 'Entropic Decay', type: 'passive', desc: 'Enemy DEF reduced by 2% each turn (stacks)', icon: 'P' },
        { id: 'nec_t17d', name: 'Death Knight', type: 'passive', desc: '+10% ATK, +8% DEF, immune to doom', icon: 'P' },
      ]},
      { level: 36, label: 'Tier 18', choices: [
        { id: 'nec_t18a', name: 'Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 15%, heal 1% max HP per turn', icon: 'P' },
        { id: 'nec_t18c', name: 'Necrotic Empowerment', type: 'passive', desc: 'Skills deal +10% damage against poisoned/doomed targets', icon: 'P' },
        { id: 'nec_t18d', name: 'Wraithform', type: 'passive', desc: '+8% dodge chance, +6% ATK', icon: 'P' },
      ]},
      { level: 38, label: 'Tier 19', choices: [
        { id: 'nec_t19a', name: 'Essence Drain', type: 'passive', desc: 'Doom damage also heals you for 25% of damage dealt', icon: 'P' },
        { id: 'nec_t19c', name: 'Eternal Dread', type: 'passive', desc: 'Doom effects last forever (never expire)', icon: 'P' },
        { id: 'nec_t19d', name: 'Abyssal Power', type: 'passive', desc: '+12% ATK when enemy is affected by any DoT', icon: 'P' },
      ]},
      { level: 40, label: '★ Tier 20', milestone: true, choices: [
        { id: 'nec_t20a', name: 'Death Incarnate', type: 'passive', desc: 'All DoT damage (poison/doom/bleed) on enemies is tripled. Your direct attack damage is halved. You become a patient executioner, letting decay do the work.', icon: 'P', milestone: true },
        { id: 'nec_t20c', name: 'Eternal Lich', type: 'passive', desc: 'All healing +10%. Lifesteal +15%. All damage taken increased by 30%. Your DEF becomes 0. You sustain through pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t20d', name: 'Entropy Lord', type: 'passive', desc: 'Every turn, enemy ATK and DEF each drop by 2% permanently. Your ATK also drops by 1%/turn. Everything fades — the question is who fades first.', icon: 'P', milestone: true },
      ]},
      { level: 42, label: 'Tier 21', choices: [
        { id: 'nec_t21a', name: 'Necrotic Mastery', type: 'passive', desc: 'Poison and doom cannot be resisted or cleansed by enemies', icon: 'P' },
        { id: 'nec_t21c', name: 'Soul Storm', type: 'passive', desc: 'All skill damage +25%', icon: 'P' },
        { id: 'nec_t21d', name: 'Undead Army', type: 'passive', desc: '+2% ATK per DoT effect on enemy (stacks)', icon: 'P' },
      ]},
      { level: 44, label: 'Tier 22', choices: [
        { id: 'nec_t22a', name: 'Spectral Armor', type: 'passive', desc: 'Gain +1 DEF for every 3% HP you are missing', icon: 'P' },
        { id: 'nec_t22c', name: 'Death Mark', type: 'passive', desc: '+12% damage to enemies below 40% HP', icon: 'P' },
        { id: 'nec_t22d', name: 'Soul Forge', type: 'passive', desc: 'Lifesteal +15%', icon: 'P' },
      ]},
      { level: 46, label: 'Tier 23', choices: [
        { id: 'nec_t23a', name: 'Blood Magic', type: 'passive', desc: 'When out of mana, spells cost HP instead (at 2x rate)', icon: 'P' },
        { id: 'nec_t23c', name: 'Lich Mastery', type: 'passive', desc: 'All skill costs -30%, all healing +30%', icon: 'P' },
        { id: 'nec_t23d', name: 'Reaper Presence', type: 'passive', desc: 'Enemies take 3% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 48, label: 'Tier 24', choices: [
        { id: 'nec_t24a', name: 'Eternal Undeath', type: 'passive', desc: 'Revive from Phylactery now triggers twice, at 50% HP each time', icon: 'P' },
        { id: 'nec_t24c', name: 'Supreme Drain', type: 'passive', desc: 'Lifesteal +20%, all healing +50%', icon: 'P' },
        { id: 'nec_t24d', name: 'Endless Decay', type: 'passive', desc: 'All DoT effects deal +17% damage and last +2 turns', icon: 'P' },
      ]},
      { level: 50, label: '★ Tier 25', milestone: true, choices: [
        { id: 'nec_t25a', name: 'Harbinger of Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats (ATK, DEF, HP) decay by 2%. Your own ATK decays by 1%/turn. Given enough time, everything dies — including you.', icon: 'P', milestone: true },
        { id: 'nec_t25c', name: 'Undeath Eternal', type: 'passive', desc: 'When HP reaches 0, consume 50% max mana to revive at 25% HP. When mana is also 0, you finally rest. Infinite persistence.', icon: 'P', milestone: true },
        { id: 'nec_t25d', name: 'Lord of the Dead', type: 'passive', desc: 'All attacks apply doom (5 turns) and poison (5 turns). All damage +20%. You take 2% max HP per turn as necrotic decay. Race against your own entropy.', icon: 'P', milestone: true },
      ]},
      // ---- Tiers 26-50 (Levels 52-100) ----
      { level: 52, label: 'Tier 26', choices: [
        { id: 'nec_t26a', name: 'Necrotic Ascendancy', type: 'passive', desc: '+2% ATK and lifesteal per level above 40', icon: 'P' },
        { id: 'nec_t26c', name: 'Eternal Hunger+', type: 'passive', desc: 'Lifesteal +20%', icon: 'P' },
        { id: 'nec_t26d', name: 'Plague Mastery', type: 'passive', desc: 'All DoT effects deal double damage and last 2 extra turns', icon: 'P' },
      ]},
      { level: 54, label: 'Tier 27', choices: [
        { id: 'nec_t27a', name: 'Dark Resurrection', type: 'passive', desc: 'On death, revive at 40% HP (twice per battle)', icon: 'P' },
        { id: 'nec_t27c', name: 'Soul Absorption', type: 'passive', desc: '10% of damage taken converted to mana and healing', icon: 'P' },
        { id: 'nec_t27d', name: 'Death Shroud+', type: 'passive', desc: 'All damage taken reduced by 20%, +10% ATK', icon: 'P' },
      ]},
      { level: 56, label: 'Tier 28', choices: [
        { id: 'nec_t28a', name: 'Necrotic Supremacy', type: 'passive', desc: 'All DoT effects deal triple damage', icon: 'P' },
        { id: 'nec_t28c', name: 'Soul Well+', type: 'passive', desc: '+40% max mana, restore 10% max mana per turn, +10% ATK', icon: 'P' },
        { id: 'nec_t28d', name: 'Vampiric Lord', type: 'passive', desc: 'All healing quadrupled, lifesteal +15%', icon: 'P' },
      ]},
      { level: 58, label: 'Tier 29', choices: [
        { id: 'nec_t29a', name: 'Reaper Supreme', type: 'passive', desc: '+5% ATK per turn in combat (stacks), +10% ATK', icon: 'P' },
        { id: 'nec_t29c', name: 'Entropic Shield', type: 'passive', desc: 'Start each battle with shield equal to 10% max HP, immune to ATK debuffs', icon: 'P' },
        { id: 'nec_t29d', name: 'Death Resonance', type: 'passive', desc: '+13% damage to poisoned or doomed enemies', icon: 'P' },
      ]},
      { level: 60, label: '★ Tier 30', milestone: true, choices: [
        { id: 'nec_t30a', name: 'Aspect of Death', type: 'passive', desc: 'All DoT damage +20%. Every attack applies doom and poison. Your direct damage is halved. Heal 1% max HP per turn. Death is patient.', icon: 'P', milestone: true },
        { id: 'nec_t30c', name: 'Lich God', type: 'passive', desc: 'All healing +20%. Lifesteal +20%. All damage taken +15%. DEF becomes 0. You cannot defend. Pure sustain through pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t30d', name: 'Entropy Incarnate', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 3%. Your ATK also decays by 1%/turn. All DoT damage tripled. The ultimate war of attrition.', icon: 'P', milestone: true },
      ]},
      { level: 62, label: 'Tier 31', choices: [
        { id: 'nec_t31a', name: 'Necrotic Dominion', type: 'passive', desc: 'All attacks apply doom (3 turns) and poison (3 turns)', icon: 'P' },
        { id: 'nec_t31c', name: 'Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 20%, heal 2% max HP per turn', icon: 'P' },
        { id: 'nec_t31d', name: 'Dark Empowerment+', type: 'passive', desc: '+13% ATK when enemy has any DoT effect', icon: 'P' },
      ]},
      { level: 64, label: 'Tier 32', choices: [
        { id: 'nec_t32a', name: 'Legendary Necromancer', type: 'passive', desc: 'All skill damage +50%, all DoT damage +50%', icon: 'P' },
        { id: 'nec_t32c', name: 'Soul Collector+', type: 'passive', desc: 'Gain +3% ATK per battle won (resets on rest, max 50%)', icon: 'P' },
        { id: 'nec_t32d', name: 'Wraithform+', type: 'passive', desc: '+5% dodge chance, +10% ATK, immune to all debuffs', icon: 'P' },
      ]},
      { level: 66, label: 'Tier 33', choices: [
        { id: 'nec_t33a', name: 'Death Aura+', type: 'passive', desc: 'Enemies take 4% max HP damage at start of each turn', icon: 'P' },
        { id: 'nec_t33c', name: 'Supreme Drain', type: 'passive', desc: '+2% ATK and healing per level above 50', icon: 'P' },
        { id: 'nec_t33d', name: 'Bone Lord', type: 'passive', desc: '+12% DEF, +12% ATK, +12% max HP', icon: 'P' },
      ]},
      { level: 68, label: 'Tier 34', choices: [
        { id: 'nec_t34a', name: 'Eternal Plague', type: 'passive', desc: 'All poison and doom effects last forever (never expire)', icon: 'P' },
        { id: 'nec_t34c', name: 'Necrotic Fortitude', type: 'passive', desc: '+17% max HP, +10% DEF, immune to doom and poison', icon: 'P' },
        { id: 'nec_t34d', name: 'Dark Mastery', type: 'passive', desc: 'All equipment bonuses increased by 35%, +12% skill damage', icon: 'P' },
      ]},
      { level: 70, label: '★ Tier 35', milestone: true, choices: [
        { id: 'nec_t35a', name: 'Mythic Lich', type: 'passive', desc: 'All healing +20%. Lifesteal +20%. All damage taken +20%. DEF becomes 0. max HP +11%. An undead juggernaut sustained by pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t35c', name: 'Plague God', type: 'passive', desc: 'All DoT damage x10. All attacks apply doom and poison (forever). Your direct damage is reduced by 60%. Heal 2% max HP/turn. Inevitable decay.', icon: 'P', milestone: true },
        { id: 'nec_t35d', name: 'Soul Devourer+', type: 'passive', desc: 'Every attack steals 3% enemy max HP permanently and adds it to yours. ATK -10%. Every 3 hits, steal 5% enemy ATK too. You consume everything.', icon: 'P', milestone: true },
      ]},
      { level: 72, label: 'Tier 36', choices: [
        { id: 'nec_t36a', name: 'Vampiric God', type: 'passive', desc: 'All lifesteal +25%, heal 2% max HP per turn', icon: 'P' },
        { id: 'nec_t36c', name: 'Necrotic Empowerment+', type: 'passive', desc: '+17% damage against enemies with any DoT effect', icon: 'P' },
        { id: 'nec_t36d', name: 'Spectral Lord', type: 'passive', desc: '+6% dodge, +12% ATK, attacks restore 3 mana', icon: 'P' },
      ]},
      { level: 74, label: 'Tier 37', choices: [
        { id: 'nec_t37a', name: 'Reaper Mastery', type: 'passive', desc: '+6% ATK per turn in combat (stacks infinitely)', icon: 'P' },
        { id: 'nec_t37c', name: 'Undying Lich', type: 'passive', desc: 'On death, revive at 50% HP (3 times per battle)', icon: 'P' },
        { id: 'nec_t37d', name: 'Soul Resonance', type: 'passive', desc: 'All skill damage +50%, all skill costs -30%', icon: 'P' },
      ]},
      { level: 76, label: 'Tier 38', choices: [
        { id: 'nec_t38a', name: 'Entropy Lord', type: 'passive', desc: 'Enemy ATK and DEF each drop by 3% per turn permanently', icon: 'P' },
        { id: 'nec_t38c', name: 'Dark Immortality', type: 'passive', desc: 'All damage taken reduced by 25%, All healing +20%', icon: 'P' },
        { id: 'nec_t38d', name: 'Plague Aura', type: 'passive', desc: 'Enemies take 5% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 78, label: 'Tier 39', choices: [
        { id: 'nec_t39a', name: 'Ascended Necromancer', type: 'passive', desc: '+3% ATK, lifesteal, and healing per level above 60', icon: 'P' },
        { id: 'nec_t39c', name: 'Supreme Undeath', type: 'passive', desc: 'Cannot die while enemy has any DoT effect. +13% ATK when enemy is doomed or poisoned', icon: 'P' },
        { id: 'nec_t39d', name: 'Legendary Drain', type: 'passive', desc: '+20% ATK, all attacks heal 4% of damage dealt', icon: 'P' },
      ]},
      { level: 80, label: '★ Tier 40', milestone: true, choices: [
        { id: 'nec_t40a', name: 'Divine Lich', type: 'passive', desc: 'All healing x10. Lifesteal x10. All damage taken +20%. DEF becomes 0. max HP +15%. An undead god sustained by infinite drain.', icon: 'P', milestone: true },
        { id: 'nec_t40c', name: 'Death Incarnate+', type: 'passive', desc: 'All DoT damage x15. All attacks apply doom, poison, and bleed (forever). Direct damage reduced by 70%. Heal 2% max HP/turn. Everything decays.', icon: 'P', milestone: true },
        { id: 'nec_t40d', name: 'Entropy God', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 5%. Your ATK decays by 2%/turn. All DoT damage +20%. Lifesteal +20%. The slow heat death of combat.', icon: 'P', milestone: true },
      ]},
      { level: 82, label: 'Tier 41', choices: [
        { id: 'nec_t41a', name: 'Godlike Drain', type: 'passive', desc: '+3% lifesteal and ATK per level above 60', icon: 'P' },
        { id: 'nec_t41c', name: 'Necrotic God', type: 'passive', desc: 'All skill damage +60%, all DoT damage +60%', icon: 'P' },
        { id: 'nec_t41d', name: 'Eternal Phylactery', type: 'passive', desc: 'On death, revive at 60% HP (4 times per battle)', icon: 'P' },
      ]},
      { level: 84, label: 'Tier 42', choices: [
        { id: 'nec_t42a', name: 'Supreme Soul Collector', type: 'passive', desc: '+5% ATK per battle won (max 80%), lifesteal +15%', icon: 'P' },
        { id: 'nec_t42c', name: 'Dark Restoration', type: 'passive', desc: 'Heal 2% max HP per turn, All healing +20%', icon: 'P' },
        { id: 'nec_t42d', name: 'Spectral God', type: 'passive', desc: '+7% dodge, +13% ATK, immune to all debuffs', icon: 'P' },
      ]},
      { level: 86, label: 'Tier 43', choices: [
        { id: 'nec_t43a', name: 'Mythic Death Knight', type: 'passive', desc: '+17% ATK, +13% DEF, +13% max HP, immune to doom and poison', icon: 'P' },
        { id: 'nec_t43c', name: 'Soul Dominion', type: 'passive', desc: 'All equipment bonuses increased by 45%, +13% skill damage', icon: 'P' },
        { id: 'nec_t43d', name: 'Reaper Aura', type: 'passive', desc: 'Enemies take 6% max HP damage at start of each turn', icon: 'P' },
      ]},
      { level: 88, label: 'Tier 44', choices: [
        { id: 'nec_t44a', name: 'Primordial Undeath', type: 'passive', desc: '+3% ATK, lifesteal, and healing per level above 70', icon: 'P' },
        { id: 'nec_t44c', name: 'Eternal Lich+', type: 'passive', desc: 'All healing +20%, lifesteal +20%, +17% ATK', icon: 'P' },
        { id: 'nec_t44d', name: 'Death God Aura', type: 'passive', desc: 'Enemies take 7% max HP damage per turn, your DoT damage tripled', icon: 'P' },
      ]},
      { level: 90, label: '★ Tier 45', milestone: true, choices: [
        { id: 'nec_t45a', name: 'Primordial Lich', type: 'passive', desc: 'All healing x15. Lifesteal x15. All damage taken +23%. DEF becomes 0. Max HP quadrupled. The ultimate undead abomination of pure drain.', icon: 'P', milestone: true },
        { id: 'nec_t45c', name: 'Eternal Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 8%. Your ATK decays by 3%/turn. All DoT damage x10. Lifesteal +20%. The universe dies around you.', icon: 'P', milestone: true },
        { id: 'nec_t45d', name: 'Supreme Soul Devourer', type: 'passive', desc: 'Every attack steals 4% enemy max HP and 5% enemy ATK permanently. Your base ATK -10%. Every kill permanently adds +3 ATK for the run. Consume all.', icon: 'P', milestone: true },
      ]},
      { level: 92, label: 'Tier 46', choices: [
        { id: 'nec_t46a', name: 'Godlike Necromancy', type: 'passive', desc: 'All skill damage +80%, all DoT damage x5, All healing +20%', icon: 'P' },
        { id: 'nec_t46c', name: 'Undying God', type: 'passive', desc: 'On death, revive at 70% HP (5 times per battle), +17% ATK each revive', icon: 'P' },
        { id: 'nec_t46d', name: 'Supreme Dark Power', type: 'passive', desc: '+25% ATK, +17% max HP, all attacks heal 3% of damage', icon: 'P' },
      ]},
      { level: 94, label: 'Tier 47', choices: [
        { id: 'nec_t47a', name: 'Eternal Reaper', type: 'passive', desc: '+7% ATK per turn in combat (stacks infinitely), lifesteal +20%', icon: 'P' },
        { id: 'nec_t47c', name: 'Mythic Soul Fortress', type: 'passive', desc: 'All damage taken reduced by 35%, all healing +20%, +17% max HP', icon: 'P' },
        { id: 'nec_t47d', name: 'Plague Emperor', type: 'passive', desc: 'Enemies take 4% max HP per turn, all DoT damage x8', icon: 'P' },
      ]},
      { level: 96, label: 'Tier 48', choices: [
        { id: 'nec_t48a', name: 'Entropy Supreme', type: 'passive', desc: 'Enemy ATK and DEF decay by 5% per turn, all DoT damage x6', icon: 'P' },
        { id: 'nec_t48c', name: 'Supreme Necromancy', type: 'passive', desc: 'All equipment bonuses increased by 60%, +20% skill damage', icon: 'P' },
        { id: 'nec_t48d', name: 'Deathless God', type: 'passive', desc: 'On death, revive at 80% HP (infinite times), +12% ATK each revive', icon: 'P' },
      ]},
      { level: 98, label: 'Tier 49', choices: [
        { id: 'nec_t49a', name: 'Cosmic Necromancer', type: 'passive', desc: '+30% ATK, all attacks heal 4% of damage, all DoT damage x5', icon: 'P' },
        { id: 'nec_t49c', name: 'Primordial Soul', type: 'passive', desc: 'All skill damage +100%, all healing x10, +20% max HP', icon: 'P' },
        { id: 'nec_t49d', name: 'Infinite Entropy', type: 'passive', desc: 'Enemies take 3% max HP per turn, enemy stats decay 6% per turn', icon: 'P' },
      ]},
      { level: 100, label: '★ Tier 50', milestone: true, choices: [
        { id: 'nec_t50a', name: 'God of Death', type: 'passive', desc: 'All healing x20. Lifesteal x20. All damage taken doubled. DEF becomes 0. Max HP +20%. You are death itself — sustained by an ocean of stolen life.', icon: 'P', milestone: true },
        { id: 'nec_t50c', name: 'Primordial Entropy', type: 'passive', desc: 'Every turn, ALL enemy stats decay by 15%. Your ATK decays by 5%/turn. All DoT damage x20. Lifesteal x10. The heat death of all things.', icon: 'P', milestone: true },
        { id: 'nec_t50d', name: 'Primordial God of Undeath', type: 'passive', desc: 'When HP reaches 0, consume 30% max mana to revive at 50% HP (infinite). All attacks steal 3% enemy max HP permanently. You consume eternity.', icon: 'P', milestone: true },
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

// Get all unlocked active skills for a player (class skill only — tree actives removed, now learned via tavern NPCs)
export function getPlayerActiveSkills(player) {
  const cls = player.characterClass ? CHARACTER_CLASSES[player.characterClass] : null;
  if (!cls) return [];
  return [{
    id: 'class_skill',
    name: cls.skillName,
    desc: cls.skillDesc,
    manaCost: cls.skillManaCost,
    multiplier: cls.skillMultiplier,
    effect: cls.skillEffect,
    isClassSkill: true,
  }];
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
