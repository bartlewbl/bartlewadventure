// Combat calculations - damage formulas, stat modifiers, dodge/HP
// All functions are pure (no side effects), taking player/battle state as arguments.

import { CHARACTER_CLASSES } from '../data/gameData';
import { getTreeSkill } from '../data/skillTrees';

export function calcDamage(atk, def) {
  const base = Math.max(1, atk - def * 0.5);
  const variance = 0.85 + Math.random() * 0.3;
  return Math.max(1, Math.floor(base * variance));
}

export function getClassData(player) {
  return player.characterClass ? CHARACTER_CLASSES[player.characterClass] : null;
}

export function playerHasSkill(player, skillId) {
  return (player.skillTree || []).includes(skillId);
}

export function getEffectiveManaCost(player, baseCost, battle) {
  let cost = baseCost;
  // Mage Mana Surge: skills cost 25% less
  if (playerHasSkill(player, 'mag_t4a')) {
    cost = Math.floor(cost * 0.75);
  }
  // Archmage (mag_t15a): skills cost 50% less
  if (playerHasSkill(player, 'mag_t15a')) {
    cost = Math.floor(cost * 0.5);
  }
  // Blood Oath (brs_t15a): skills cost 50% less mana
  if (playerHasSkill(player, 'brs_t15a')) {
    cost = Math.floor(cost * 0.5);
  }
  // Endless Rage stacks: reduce by 1 per turn
  if (battle && (battle.endlessRageStacks || 0) > 0) {
    cost = Math.max(1, cost - (battle.endlessRageStacks || 0));
  }
  // Reality Weaver (mag_t25a): mana costs doubled
  if (playerHasSkill(player, 'mag_t25a')) {
    cost = cost * 2;
  }
  return Math.max(1, cost);
}

export function getPlayerAtk(player, battle) {
  let atk = player.baseAtk;
  let equipAtk = 0;
  for (const item of Object.values(player.equipment)) {
    if (item) {
      atk += (item.atk || 0);
      equipAtk += (item.atk || 0);
    }
  }
  // Titan's Grip (war_t13a): equipment ATK +20%
  if (playerHasSkill(player, 'war_t13a')) {
    atk += Math.floor(equipAtk * 0.20);
  }
  const cls = getClassData(player);
  // Berserker Rage: +30% ATK when below 40% HP
  if (cls?.passive === 'Rage' && player.hp < player.maxHp * 0.4) {
    atk = Math.floor(atk * 1.3);
  }
  // Blood Frenzy: +3% ATK per 10% HP missing
  if (playerHasSkill(player, 'brs_t1a')) {
    const missingPct = Math.floor((1 - player.hp / player.maxHp) * 10);
    atk = Math.floor(atk * (1 + missingPct * 0.03));
  }
  // War Machine: +15% ATK, +25% when below 50% HP
  if (playerHasSkill(player, 'brs_t4a')) {
    atk = Math.floor(atk * 1.15);
    if (player.hp < player.maxHp * 0.5) {
      atk = Math.floor(atk * 1.25);
    }
  }
  // Relentless: +20% ATK when above 80% HP
  if (playerHasSkill(player, 'brs_t9a') && player.hp > player.maxHp * 0.8) {
    atk = Math.floor(atk * 1.2);
  }
  // Immortal Rage: ATK doubled when below 10% HP
  if (playerHasSkill(player, 'brs_t10a') && player.hp < player.maxHp * 0.1) {
    atk = atk * 2;
  }
  // Dark Pact: +25% ATK
  if (playerHasSkill(player, 'nec_t4a')) {
    atk = Math.floor(atk * 1.25);
  }
  // Lich Form: +20% ATK
  if (playerHasSkill(player, 'nec_t10a')) {
    atk = Math.floor(atk * 1.2);
  }
  // Arcane Overflow: +1 ATK per 10 current mana
  if (playerHasSkill(player, 'mag_t3a')) {
    atk += Math.floor(player.mana / 10);
  }
  // Arcane Intellect (mag_t11a): +2 ATK per 10 max mana
  if (playerHasSkill(player, 'mag_t11a')) {
    const battleMana = getBattleMaxMana(player);
    atk += Math.floor(battleMana / 10) * 2;
  }
  // Spellweaver bonus tracked via battle.spellweaverActive
  if (battle?.spellweaverActive && playerHasSkill(player, 'mag_t8a')) {
    atk = Math.floor(atk * 1.5);
  }
  // Berserker Stance (brs_t12a): +30% ATK
  if (playerHasSkill(player, 'brs_t12a')) {
    atk = Math.floor(atk * 1.3);
  }
  // Blood Oath (brs_t15a): +60% ATK
  if (playerHasSkill(player, 'brs_t15a')) {
    atk = Math.floor(atk * 1.6);
  }
  // Frenzy stacks (brs_t14a): +5% per stack
  if (battle?.frenzyStacks > 0 && playerHasSkill(player, 'brs_t14a')) {
    atk = Math.floor(atk * (1 + battle.frenzyStacks * 0.05));
  }
  // Warlord (brs_t17a): +2% ATK per level above 30
  if (playerHasSkill(player, 'brs_t17a') && player.level > 30) {
    atk = Math.floor(atk * (1 + (player.level - 30) * 0.02));
  }
  // Deathless active (brs_t22a): +50% ATK after revive
  if (battle?.deathlessActive) {
    atk = Math.floor(atk * 1.5);
  }
  // Avatar of Carnage (brs_t20a): all damage +100%
  if (playerHasSkill(player, 'brs_t20a')) {
    atk = atk * 2;
  }
  // Godslayer (brs_t25a): +5% per 1% HP missing
  if (playerHasSkill(player, 'brs_t25a')) {
    const maxHp = getBattleMaxHp(player);
    const hpPctMissing = Math.max(0, Math.floor((1 - player.hp / maxHp) * 100));
    atk = Math.floor(atk * (1 + hpPctMissing * 0.05));
  }
  // Undying Servitude upgrades Dark Pact to +50%
  if (playerHasSkill(player, 'nec_t17a') && playerHasSkill(player, 'nec_t4a')) {
    atk = Math.floor(atk * 1.2); // Extra 20% on top of Dark Pact's 25%
  }
  // Phantom Existence (thf_t15a): 30% less damage
  if (playerHasSkill(player, 'thf_t15a')) {
    atk = Math.floor(atk * 0.7);
  }
  // Living Shadow (thf_t20a): ATK halved
  if (playerHasSkill(player, 'thf_t20a')) {
    atk = Math.floor(atk * 0.5);
  }
  // Eternal Guardian (war_t20a): ATK -35%
  if (playerHasSkill(player, 'war_t20a')) {
    atk = Math.floor(atk * 0.65);
  }
  // Cutthroat (thf_t14a): +30% vs enemies below 40% HP
  if (playerHasSkill(player, 'thf_t14a') && battle?.monster && battle.monster.hp < (battle.monsterMaxHp || battle.monster.hp) * 0.4) {
    atk = Math.floor(atk * 1.3);
  }
  // Elusive (thf_t16a): +40% after dodge
  if (playerHasSkill(player, 'thf_t16a') && battle?.dodgedLastTurn) {
    atk = Math.floor(atk * 1.4);
  }
  // Predator (thf_t19a): +3% per turn
  if (playerHasSkill(player, 'thf_t19a') && (battle?.predatorTurns || 0) > 0) {
    atk = Math.floor(atk * (1 + battle.predatorTurns * 0.03));
  }
  // Shadowmeld first attack crit (thf_t18a) - tracked via battle.firstAttack
  if (playerHasSkill(player, 'thf_t18a') && battle && !battle.firstAttackDone) {
    atk = atk * 3;
  }
  // Overcharge (mag_t19a): +25% when mana above 75%
  if (playerHasSkill(player, 'mag_t19a')) {
    const battleMana = getBattleMaxMana(player);
    if (player.mana > battleMana * 0.75) {
      atk = Math.floor(atk * 1.25);
    }
  }
  // Warpath (brs_t24a): tracked via battle.warpathActive
  if (battle?.warpathActive && playerHasSkill(player, 'brs_t24a')) {
    atk = Math.floor(atk * 1.3);
  }
  // Player ATK buff from battle effects
  if (battle?.playerAtkBuff) {
    atk = Math.floor(atk * (1 + battle.playerAtkBuff));
  }
  // Player ATK debuff from Ragnarök
  if (battle?.playerAtkDebuffTurns > 0 && battle?.playerAtkDebuffMult) {
    atk = Math.floor(atk * battle.playerAtkDebuffMult);
  }
  // Entropy ATK decay
  if (battle?.entropyAtkDecay) {
    atk = Math.floor(atk * (1 - battle.entropyAtkDecay));
  }
  // Marked for Death bonus damage on enemy
  if (battle?.monsterMarkTurns > 0) {
    atk = Math.floor(atk * 1.25);
  }
  return Math.max(1, atk - (battle?.atkDebuff || 0));
}

export function getPlayerDef(player, battle) {
  let def = player.baseDef;
  for (const item of Object.values(player.equipment)) {
    if (item) def += (item.def || 0);
  }
  // Armor Mastery: equipment DEF +15%
  if (playerHasSkill(player, 'war_t7a')) {
    let equipDef = 0;
    for (const item of Object.values(player.equipment)) {
      if (item) equipDef += (item.def || 0);
    }
    def += Math.floor(equipDef * 0.15);
  }
  // Titan's Grip (war_t13a): equipment ATK +20% (DEF function but for ATK - handled in getPlayerAtk)
  // Stalwart: +5 DEF in battle
  if (playerHasSkill(player, 'war_t5a')) {
    def += 5;
  }
  // Undead Fortitude: +10% DEF
  if (playerHasSkill(player, 'nec_t7a')) {
    def = Math.floor(def * 1.1);
  }
  // Last Stand: +30% DEF when below 40% HP
  if (playerHasSkill(player, 'war_t8a') && player.hp < player.maxHp * 0.4) {
    def = Math.floor(def * 1.3);
  }
  // Ironclad (war_t16a): +25% DEF from all sources
  if (playerHasSkill(player, 'war_t16a')) {
    def = Math.floor(def * 1.25);
  }
  // Living Fortress (war_t25a): DEF doubled
  if (playerHasSkill(player, 'war_t25a')) {
    def = def * 2;
  }
  // Spectral Armor (nec_t22a): +1 DEF per 5% HP missing
  if (playerHasSkill(player, 'nec_t22a')) {
    const maxHp = getBattleMaxHp(player);
    const pctMissing = Math.floor((1 - player.hp / maxHp) * 100);
    def += Math.floor(pctMissing / 5);
  }
  // Avatar of War buff
  if (battle?.avatarTurns > 0) {
    def = Math.floor(def * 1.5);
  }
  // Wrath of Ancients zeroed DEF
  if (battle?.warDefZeroed) {
    def = 0;
  }
  // Cataclysm of Steel halved DEF
  if (battle?.playerDefHalved) {
    def = Math.floor(def * 0.5);
  }
  return Math.max(0, def - (battle?.defDebuff || 0));
}

export function getPlayerDodgeChance(player) {
  let chance = 0;
  // Athletics: each point gives +0.5% dodge chance
  const athletics = player.athletics || 0;
  chance += athletics * 0.005;
  if (playerHasSkill(player, 'thf_t1a')) chance += 0.15;
  if (playerHasSkill(player, 'thf_t3a')) chance += 0.10;
  return chance;
}

export function getBattleMaxHp(player) {
  let maxHp = player.maxHp;
  if (playerHasSkill(player, 'war_t3a')) maxHp = Math.floor(maxHp * 1.15);
  if (playerHasSkill(player, 'nec_t7a')) maxHp = Math.floor(maxHp * 1.1);
  // Blood Oath (brs_t15a): -30% max HP permanently
  if (playerHasSkill(player, 'brs_t15a')) maxHp = Math.floor(maxHp * 0.7);
  // Archmage (mag_t15a): max HP halved
  if (playerHasSkill(player, 'mag_t15a')) maxHp = Math.floor(maxHp * 0.5);
  return maxHp;
}

// Wisdom bonus: each point gives +2% max mana
export function getBattleMaxMana(player) {
  const wisdom = player.wisdom || 0;
  const wisdomBonus = 1 + wisdom * 0.02;
  let maxMana = Math.floor(player.maxMana * wisdomBonus);
  // Mana Well (mag_t12a): +30% max mana
  if (playerHasSkill(player, 'mag_t12a')) maxMana = Math.floor(maxMana * 1.3);
  return maxMana;
}

// Compute passive skill damage bonus for class skills and tree skills
export function getSkillPassiveBonus(player) {
  const cls = getClassData(player);
  let bonus = (cls?.passive === 'Arcane Mind') ? 1.4 : 1.0;
  if (playerHasSkill(player, 'mag_t6a')) bonus *= 1.2; // Elemental Mastery
  if (playerHasSkill(player, 'mag_t14a')) bonus *= 1.3; // Spell Mastery
  // Arcane Attunement (mag_t21a): +1% per level
  if (playerHasSkill(player, 'mag_t21a')) bonus *= (1 + player.level * 0.01);
  return bonus;
}

// Check Spell Echo proc (20% chance for double damage, 35% with Spell Echo+)
export function rollSpellEcho(player) {
  const chance = playerHasSkill(player, 'mag_t18a') ? 0.35 : 0.2;
  if (playerHasSkill(player, 'mag_t2a') && Math.random() < chance) return true;
  return false;
}

// Compute the effective DEF multiplier based on a skill's pierce/true_damage effect
export function getEffectiveDef(monsterDef, effect) {
  if (effect === 'true_damage' || effect === 'phantom_blade') return 0;
  // Many post-20 skills also use true_damage effect for their base, handled above
  if (effect === 'oblivion_strike') return 0; // true damage
  if (effect === 'pierce_20') return Math.floor(monsterDef * 0.8);
  if (effect === 'pierce_25') return Math.floor(monsterDef * 0.75);
  if (effect === 'pierce_30' || effect === 'double_pierce_30' || effect === 'reckless_charge') return Math.floor(monsterDef * 0.7);
  if (effect === 'pierce_40') return Math.floor(monsterDef * 0.6);
  if (effect === 'pierce_50' || effect === 'abyssal_strike') return Math.floor(monsterDef * 0.5);
  if (effect === 'pierce_60') return Math.floor(monsterDef * 0.4);
  if (effect === 'pierce') return Math.floor(monsterDef * 0.5);
  // Thief true damage skills
  if (effect === 'backstab' || effect === 'toxic_barrage' || effect === 'shadow_assault' ||
      effect === 'phantom_storm' || effect === 'shadow_barrage' || effect === 'dance_death' ||
      effect === 'viper_strike' || effect === 'death_sentence' || effect === 'coup_de_grace' ||
      effect === 'perfect_assassination' || effect === 'assassin_creed') return 0;
  // Mage true damage skills (post-20)
  if (effect === 'inferno' || effect === 'arcane_missiles' || effect === 'comet' ||
      effect === 'void_bolt' || effect === 'supernova' || effect === 'apoc_fire' ||
      effect === 'gravity_well' || effect === 'double_true' || effect === 'singularity' ||
      effect === 'chain_destruction' || effect === 'dim_rift' || effect === 'oblivion_beam' ||
      effect === 'big_bang') return 0;
  // Bone storm pierces
  if (effect === 'bone_storm') return Math.floor(monsterDef * 0.7);
  return monsterDef;
}

// Critical hit chance for player: base 3%, modified by athletics and luck
export function getPlayerCritChance(player) {
  let chance = 0.03; // 3% base crit chance
  // Athletics adds crit chance: +0.2% per point
  chance += (player.athletics || 0) * 0.002;
  // Wisdom adds minor crit chance: +0.1% per point
  chance += (player.wisdom || 0) * 0.001;
  return Math.min(0.20, chance); // cap at 20%
}

// Critical hit multiplier for player
export function getPlayerCritMultiplier(player) {
  let mult = 1.5; // 150% base crit damage
  return mult;
}

// Monster critical hit chance: base 3%, scales with level
export function getMonsterCritChance(monster) {
  let chance = 0.03; // 3% base
  // Higher level monsters crit slightly more often
  chance += Math.min(0.05, (monster.level || 1) * 0.0005);
  return Math.min(0.08, chance); // cap at 8%
}

// Monster critical hit multiplier
export function getMonsterCritMultiplier() {
  return 1.5; // 150% damage on crit
}

// Charisma price modifier: each point gives 1% better prices (capped at 25%)
export function getCharismaPriceBonus(player) {
  const charisma = player.charisma || 0;
  return Math.min(0.25, charisma * 0.01);
}

// Check execute multiplier for conditional damage skills
export function getExecuteMultiplier(effect, monsterHp, monsterMaxHp) {
  if (effect === 'execute' && monsterHp < monsterMaxHp * 0.3) return 2;
  if (effect === 'execute_25' && monsterHp < monsterMaxHp * 0.25) return 2.67;
  if (effect === 'counter') return 1; // handled separately with defendedLastTurn
  return 1;
}
