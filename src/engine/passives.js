// Centralized passive skill application
// Handles all passive triggers during: attacks, skill use, defense, potions, monster turns

import { playerHasSkill, getBattleMaxHp, getBattleMaxMana } from './combat';
import { prob } from '../data/probabilityStore';

/**
 * Apply post-attack passives (after a normal attack deals damage).
 * Returns updated { player, monster, battle, log }.
 */
export function applyAttackPassives({ player, monster, battle, log, dmg, cls }) {
  const battleMaxHp = getBattleMaxHp(player);
  let p = player;
  let m = monster;
  let b = battle;

  // Necromancer Lifetap: heal % of damage dealt on normal attacks
  if (cls?.passive === 'Lifetap') {
    const healAmt = Math.floor(dmg * prob('passive.lifetapHeal'));
    if (healAmt > 0 && p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Lifetap heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Vampiric Aura: all attacks heal % of damage dealt
  if (playerHasSkill(p, 'nec_t3a')) {
    const healAmt = Math.floor(dmg * prob('passive.vampiricAura'));
    if (healAmt > 0 && p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Vampiric Aura heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Soul Siphon: chance to restore 5 mana
  if (playerHasSkill(p, 'nec_t1a') && Math.random() < prob('passive.soulSiphonChance')) {
    const battleMana = getBattleMaxMana(p);
    p = { ...p, mana: Math.min(battleMana, p.mana + 5) };
    log.push({ text: `Soul Siphon restores 5 mana!`, type: 'heal' });
  }
  // Bloodlust: heal % of damage dealt when below 30% HP
  if (playerHasSkill(p, 'brs_t3a') && p.hp < battleMaxHp * 0.3) {
    let healAmt = Math.floor(dmg * prob('passive.bloodlustHeal'));
    if (playerHasSkill(p, 'nec_t9a')) healAmt = Math.floor(healAmt * 1.25); // Eternal Hunger
    if (playerHasSkill(p, 'nec_t10a')) healAmt = Math.floor(healAmt * 1.5); // Lich Form
    if (healAmt > 0 && p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Bloodlust heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Adrenaline Rush: restore 2 mana on attack
  if (playerHasSkill(p, 'brs_t6a')) {
    const battleMana = getBattleMaxMana(p);
    p = { ...p, mana: Math.min(battleMana, p.mana + 2) };
  }
  // Necrotic Touch: reduce enemy DEF by 1
  if (playerHasSkill(p, 'nec_t5a') && m.def > 0) {
    m = { ...m, def: Math.max(0, m.def - 1) };
    b = { ...b, monster: m };
  }
  // Opportunist: +10% damage against poisoned enemies
  if (playerHasSkill(p, 'thf_t6a') && b.monsterPoisonTurns > 0) {
    const bonus = Math.floor(dmg * 0.10);
    m = { ...m, hp: Math.max(0, m.hp - bonus) };
    b = { ...b, monster: m };
    if (bonus > 0) log.push({ text: `Opportunist bonus: ${bonus} damage!`, type: 'dmg-monster' });
  }
  // Spellweaver: clear after normal attack
  if (b.spellweaverActive) {
    b = { ...b, spellweaverActive: false };
  }

  return { player: p, monster: m, battle: b, log };
}

/**
 * Apply post-skill passives (after a class skill or tree skill deals damage).
 * Returns updated { player, log }.
 */
export function applySkillPassives({ player, log, dmg }) {
  const battleMaxHp = getBattleMaxHp(player);
  let p = player;

  // Vampiric Aura on skill
  if (playerHasSkill(p, 'nec_t3a')) {
    const healAmt = Math.floor(dmg * prob('passive.vampiricAura'));
    if (healAmt > 0 && p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Vampiric Aura heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Bloodlust
  if (playerHasSkill(p, 'brs_t3a') && p.hp < battleMaxHp * 0.3) {
    const healAmt = Math.floor(dmg * prob('passive.bloodlustHeal'));
    if (healAmt > 0 && p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Bloodlust heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Soul Siphon
  if (playerHasSkill(p, 'nec_t1a') && Math.random() < prob('passive.soulSiphonChance')) {
    const battleMana = getBattleMaxMana(p);
    p = { ...p, mana: Math.min(battleMana, p.mana + 5) };
    log.push({ text: `Soul Siphon restores 5 mana!`, type: 'heal' });
  }

  return { player: p, log };
}

/**
 * Apply Life Tap: spending mana heals 50% as HP.
 */
export function applyLifeTap(player, manaCost) {
  if (!playerHasSkill(player, 'nec_t6a') || manaCost <= 0) return player;
  const ltHeal = Math.floor(manaCost * 0.3);
  return { ...player, hp: Math.min(getBattleMaxHp(player), player.hp + ltHeal) };
}

/**
 * Apply Blade Dance: 10% chance to attack twice.
 * Returns { attacked, dmg } where attacked is true if a second attack was made.
 */
export function tryBladeDance(player, battle, calcDamageFn, getPlayerAtkFn) {
  let chance = 0;
  if (playerHasSkill(player, 'thf_t9a')) chance += prob('passive.bladeDance');
  if (playerHasSkill(player, 'thf_t13a')) chance += prob('passive.swiftStrikes');
  if (chance <= 0) return { attacked: false, dmg: 0 };
  if (Math.random() >= chance) return { attacked: false, dmg: 0 };
  if (battle.monster.hp <= 0) return { attacked: false, dmg: 0 };
  const dmg = calcDamageFn(getPlayerAtkFn(player, battle), battle.monster.def);
  return { attacked: true, dmg };
}

/**
 * Apply Lucky Strike: 20% chance to deal double damage.
 */
export function tryLuckyStrike(player, dmg) {
  if (!playerHasSkill(player, 'thf_t4a')) return { procced: false, dmg };
  const chance = playerHasSkill(player, 'thf_t22a') ? prob('passive.opportunityStrikes') : prob('passive.luckyStrike');
  if (Math.random() >= chance) return { procced: false, dmg };
  const mult = playerHasSkill(player, 'thf_t24a') ? 2.0 : 1.5; // Lethal Precision upgrade
  return { procced: true, dmg: dmg * mult };
}

/**
 * Apply start-of-turn passives (regeneration, meditation, dark pact).
 * Returns updated { player, log }.
 */
export function applyTurnStartPassives({ player, battle, log }) {
  const battleMaxHp = getBattleMaxHp(player);
  let p = player;
  let b = battle;

  // Regeneration: heal % max HP
  if (playerHasSkill(p, 'war_t6a')) {
    const healAmt = Math.floor(battleMaxHp * prob('passive.regeneration'));
    if (p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Regeneration heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Endurance (war_t14a): heal % max HP
  if (playerHasSkill(p, 'war_t14a')) {
    const healAmt = Math.floor(battleMaxHp * prob('passive.endurance'));
    if (p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Endurance heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Indestructible (war_t24a): heal % max HP
  if (playerHasSkill(p, 'war_t24a')) {
    const healAmt = Math.floor(battleMaxHp * prob('passive.indestructible'));
    if (p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Indestructible heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Soul Fortress (nec_t18a): heal % max HP
  if (playerHasSkill(p, 'nec_t18a')) {
    const healAmt = Math.floor(battleMaxHp * prob('passive.soulFortressHeal'));
    if (p.hp < battleMaxHp) {
      p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
      log.push({ text: `Soul Fortress heals ${healAmt} HP!`, type: 'heal' });
    }
  }
  // Meditation: restore 2 mana
  if (playerHasSkill(p, 'mag_t5a')) {
    const battleMana = getBattleMaxMana(p);
    p = { ...p, mana: Math.min(battleMana, p.mana + 2) };
    log.push({ text: `Meditation restores 2 mana!`, type: 'heal' });
  }
  // Mana Regeneration: restore % max mana (uses wisdom-boosted max)
  if (playerHasSkill(p, 'mag_t9a')) {
    const battleMana = getBattleMaxMana(p);
    const manaAmt = Math.floor(battleMana * prob('passive.manaRegen'));
    p = { ...p, mana: Math.min(battleMana, p.mana + manaAmt) };
    log.push({ text: `Mana Regen restores ${manaAmt} mana!`, type: 'heal' });
  }
  // Leyline Tap (mag_t17a): restore % max mana
  if (playerHasSkill(p, 'mag_t17a')) {
    const battleMana = getBattleMaxMana(p);
    const manaAmt = Math.floor(battleMana * prob('passive.leylineTap'));
    p = { ...p, mana: Math.min(battleMana, p.mana + manaAmt) };
    log.push({ text: `Leyline Tap restores ${manaAmt} mana!`, type: 'heal' });
  }
  // Dark Pact: sacrifice HP per turn
  if (playerHasSkill(p, 'nec_t4a')) {
    const rate = playerHasSkill(p, 'nec_t17a') ? prob('passive.darkPactUpgradedDrain') : prob('passive.darkPactDrain');
    const sacrifice = Math.floor(p.maxHp * rate);
    p = { ...p, hp: Math.max(1, p.hp - sacrifice) };
    log.push({ text: `Dark Pact drains ${sacrifice} HP!`, type: 'dmg-player' });
  }
  // Pact of Undeath (nec_t15a): HP slowly drains per turn
  if (playerHasSkill(p, 'nec_t15a')) {
    const drain = Math.floor(battleMaxHp * prob('passive.pactOfUndeath'));
    p = { ...p, hp: Math.max(1, p.hp - drain) };
    log.push({ text: `Pact of Undeath drains ${drain} HP!`, type: 'dmg-player' });
  }
  // Frenzy (brs_t14a): track attack streak
  if (playerHasSkill(p, 'brs_t14a')) {
    b = { ...b, frenzyStacks: Math.min((b.frenzyStacks || 0) + 1, 10) };
  }
  // Endless Rage (brs_t23a): reduce mana costs by 1 each turn
  if (playerHasSkill(p, 'brs_t23a')) {
    b = { ...b, endlessRageStacks: (b.endlessRageStacks || 0) + 1 };
  }
  // Death Aura (nec_t11a): enemies take 1% max HP damage at start of turn
  if (playerHasSkill(p, 'nec_t11a') && b.monster && b.monster.hp > 0) {
    const auraDmg = Math.floor((b.monsterMaxHp || b.monster.maxHp || b.monster.hp) * 0.01);
    if (auraDmg > 0) {
      const m = { ...b.monster, hp: Math.max(0, b.monster.hp - auraDmg) };
      b = { ...b, monster: m };
      log.push({ text: `Death Aura deals ${auraDmg} damage!`, type: 'dmg-monster' });
    }
  }
  // Harbinger of Entropy (nec_t25a): enemy stats decay 0.5%, your ATK decays 0.3%
  if (playerHasSkill(p, 'nec_t25a') && b.monster && b.monster.hp > 0) {
    const m = { ...b.monster };
    const atkDecay = Math.max(1, Math.floor(m.atk * 0.005));
    const defDecay = Math.max(0, Math.floor(m.def * 0.005));
    m.atk = Math.max(1, m.atk - atkDecay);
    m.def = Math.max(0, m.def - defDecay);
    const hpDecay = Math.floor((b.monsterMaxHp || m.hp) * 0.005);
    m.hp = Math.max(1, m.hp - hpDecay);
    b = { ...b, monster: m };
    log.push({ text: `Entropy! Enemy decays: ATK -${atkDecay}, DEF -${defDecay}, HP -${hpDecay}`, type: 'dmg-monster' });
    // Player ATK also decays
    b = { ...b, entropyAtkDecay: (b.entropyAtkDecay || 0) + 0.003 };
  }
  // Battle Hardened (war_t19a): track turns for damage reduction
  if (playerHasSkill(p, 'war_t19a')) {
    b = { ...b, battleHardenedTurns: (b.battleHardenedTurns || 0) + 1 };
  }
  // Predator (thf_t19a): track turns for damage bonus
  if (playerHasSkill(p, 'thf_t19a')) {
    b = { ...b, predatorTurns: (b.predatorTurns || 0) + 1 };
  }
  // Ghost Walk (thf_t23a): every 3rd turn auto-dodge
  if (playerHasSkill(p, 'thf_t23a')) {
    const ghostTurn = (b.ghostWalkCounter || 0) + 1;
    b = { ...b, ghostWalkCounter: ghostTurn };
    if (ghostTurn % 3 === 0) {
      b = { ...b, dodgeNextTurn: true };
      log.push({ text: `Ghost Walk! Auto-dodge this turn!`, type: 'info' });
    }
  }
  // Monster bleed ticks
  if ((b.monsterBleedTurns || 0) > 0 && b.monster && b.monster.hp > 0) {
    const bleedDmg = Math.floor((b.monsterMaxHp || b.monster.hp) * 0.02);
    const m = { ...b.monster, hp: Math.max(0, b.monster.hp - bleedDmg) };
    b = { ...b, monster: m, monsterBleedTurns: b.monsterBleedTurns - 1 };
    log.push({ text: `Bleed deals ${bleedDmg} damage!`, type: 'dmg-monster' });
  }
  // Monster burn ticks (mag_t17b apoc_fire)
  if ((b.monsterBurnTurns || 0) > 0 && b.monster && b.monster.hp > 0) {
    const burnDmg = Math.floor((b.monsterMaxHp || b.monster.hp) * 0.015);
    const m = { ...b.monster, hp: Math.max(0, b.monster.hp - burnDmg) };
    b = { ...b, monster: m, monsterBurnTurns: b.monsterBurnTurns - 1 };
    log.push({ text: `Burn deals ${burnDmg} damage!`, type: 'dmg-monster' });
  }
  // Monster stun countdown
  if ((b.monsterStunTurns || 0) > 0) {
    b = { ...b, monsterStunTurns: b.monsterStunTurns - 1 };
  }
  // Player stun countdown
  if ((b.playerStunTurns || 0) > 0) {
    b = { ...b, playerStunTurns: b.playerStunTurns - 1 };
  }
  // Player spell cooldown countdown
  if ((b.playerSpellCooldown || 0) > 0) {
    b = { ...b, playerSpellCooldown: b.playerSpellCooldown - 1 };
  }
  // Monster mark countdown
  if ((b.monsterMarkTurns || 0) > 0) {
    b = { ...b, monsterMarkTurns: b.monsterMarkTurns - 1 };
  }
  // Immortal Bastion (war_t15a): track turns for invulnerability
  if (playerHasSkill(p, 'war_t15a')) {
    b = { ...b, immortalBastionTurns: (b.immortalBastionTurns || 0) + 1 };
  }

  return { player: p, battle: b, log };
}

/**
 * Apply damage reduction passives to incoming monster damage.
 * Returns the modified damage value.
 */
export function applyDamageReduction(dmg, player, battle, cls) {
  let d = dmg;

  // Defend block
  if (battle.defending) {
    let blockMult = prob('passive.defendBlock');
    if (cls?.passive === 'Fortify') blockMult = prob('passive.fortifyBlock');
    if (playerHasSkill(player, 'war_t2a')) blockMult = prob('passive.bulwarkBlock');
    if (playerHasSkill(player, 'war_t12a')) blockMult = prob('passive.phalanxBlock');
    d = Math.floor(d * blockMult);
  }
  // Iron Skin
  if (playerHasSkill(player, 'war_t1a')) {
    d = Math.floor(d * prob('passive.ironSkin'));
  }
  // Thick Skin
  if (playerHasSkill(player, 'brs_t5a')) {
    d = Math.floor(d * prob('passive.thickSkin'));
  }
  // Fortress
  if (playerHasSkill(player, 'war_t10a')) {
    d = Math.floor(d * prob('passive.fortress'));
  }
  // Soul Fortress (nec_t18a)
  if (playerHasSkill(player, 'nec_t18a')) {
    d = Math.floor(d * prob('passive.soulFortressDR'));
  }
  // Berserker Stance (brs_t12a): +15% damage taken
  if (playerHasSkill(player, 'brs_t12a')) {
    d = Math.floor(d * 1.15);
  }
  // Immortal Bastion (war_t15a): take 50% less damage first 3 turns, then +20% damage
  if (playerHasSkill(player, 'war_t15a')) {
    if ((battle.immortalBastionTurns || 0) <= 3) {
      d = Math.floor(d * 0.5);
    } else {
      d = Math.floor(d * 1.20);
    }
  }
  // Eternal Guardian (war_t20a)
  if (playerHasSkill(player, 'war_t20a')) {
    d = Math.floor(d * prob('passive.eternalGuardian'));
  }
  // Battle Hardened (war_t19a)
  if (playerHasSkill(player, 'war_t19a') && (battle.battleHardenedTurns || 0) > 0) {
    const reduction = Math.min(prob('passive.battleHardenedCap'), (battle.battleHardenedTurns || 0) * prob('passive.battleHardenedRate'));
    d = Math.floor(d * (1 - reduction));
  }
  // Scarred Veteran (brs_t21a): 0.5% reduction per 5% HP missing
  if (playerHasSkill(player, 'brs_t21a')) {
    const battleMaxHp = getBattleMaxHp(player);
    const hpPctMissing = Math.floor((1 - player.hp / battleMaxHp) * 100);
    const reduction = Math.min(0.12, Math.floor(hpPctMissing / 5) * 0.005);
    if (reduction > 0) d = Math.floor(d * (1 - reduction));
  }
  // Phantom Existence (thf_t15a): 30% less damage dealt (by player), but this is damage TAKEN reduction
  // Player takes double damage: Final Judgment (war_t25b effect)
  if (battle.playerDoubleDamage) {
    d = d * 2;
  }
  // Mana Shield: 20% absorbed by mana (handled separately for mana deduction)
  return Math.max(1, d);
}

/**
 * Apply Mana Shield absorption. Returns { dmg, manaUsed }.
 */
export function applyManaShield(dmg, player) {
  if (!playerHasSkill(player, 'mag_t1a') || player.mana <= 0) return { dmg, manaUsed: 0 };
  const absorbRate = playerHasSkill(player, 'mag_t24a') ? 0.25 : (playerHasSkill(player, 'mag_t10a') ? 0.15 : 0.10);
  const manaAbsorb = Math.floor(dmg * absorbRate);
  const actualAbsorb = Math.min(manaAbsorb, player.mana);
  return { dmg: dmg - actualAbsorb, manaUsed: actualAbsorb };
}

/**
 * Check dodge (Shadow Step, Evasion Mastery, Shadow Dance, dodge charges).
 * Returns { dodged, battle, log }.
 */
export function checkDodge(player, battle, log) {
  let b = { ...battle };

  if (b.dodgeNextTurn) {
    b.dodgeNextTurn = false;
    log.push({ text: 'You dodge the attack from the shadows!', type: 'info' });
    return { dodged: true, battle: b, log };
  }
  if (b.dodgeCharges > 0) {
    b.dodgeCharges--;
    log.push({ text: 'You dodge the attack from the shadows!', type: 'info' });
    return { dodged: true, battle: b, log };
  }
  const dodgeChance = (() => {
    let chance = 0;
    // Athletics: each point gives +0.5% dodge chance
    const athletics = player.athletics || 0;
    chance += athletics * 0.005;
    if (playerHasSkill(player, 'thf_t1a')) chance += prob('passive.shadowStep');
    if (playerHasSkill(player, 'thf_t3a')) chance += prob('passive.evasionMastery');
    if (playerHasSkill(player, 'thf_t12a')) chance += prob('passive.cloakOfShadows');
    if (playerHasSkill(player, 'thf_t15a')) chance += prob('passive.phantomExistence');
    if (playerHasSkill(player, 'thf_t20a')) chance += prob('passive.livingShadow');
    return Math.min(chance, prob('passive.dodgeCap'));
  })();
  if (dodgeChance > 0 && Math.random() < dodgeChance) {
    log.push({ text: 'You dodge the attack!', type: 'info' });
    b = { ...b, dodgedLastTurn: true };
    return { dodged: true, battle: b, log };
  }
  // Smoke Bomb (thf_t21a): 25% chance to gain dodge after being hit
  // (handled after damage, not here)
  // Aegis
  const aegisChance = playerHasSkill(player, 'war_t17a') ? prob('passive.aegisUpgraded') : (playerHasSkill(player, 'war_t4a') ? prob('passive.aegisChance') : 0);
  if (aegisChance > 0 && Math.random() < aegisChance) {
    log.push({ text: 'Aegis fully blocks the attack!', type: 'info' });
    return { dodged: true, battle: b, log };
  }

  return { dodged: false, battle: b, log };
}

/**
 * Apply survival passives after taking damage (Undying Will, Death's Embrace).
 * Returns updated { player, battle, log }.
 */
export function applySurvivalPassives({ player, battle, log }) {
  const battleMaxHp = getBattleMaxHp(player);
  let p = player;
  let b = battle;

  // Undying Fury (brs_t18a): survive lethal twice at 1 HP (upgrades Undying Will)
  if (p.hp <= 0 && playerHasSkill(p, 'brs_t18a')) {
    const uses = b.undyingFuryUses || 0;
    if (uses < 2) {
      p = { ...p, hp: 1 };
      b = { ...b, undyingFuryUses: uses + 1, undyingWillUsed: true };
      log.push({ text: `Undying Fury! Survive at 1 HP! (${2 - uses - 1} left)`, type: 'heal' });
      // Deathless bonus (brs_t22a)
      if (playerHasSkill(p, 'brs_t22a')) {
        b = { ...b, deathlessActive: true };
        log.push({ text: `Deathless! +25% ATK!`, type: 'info' });
      }
    }
  }
  // Undying Will: survive lethal at 1 HP (only if Undying Fury not present)
  else if (p.hp <= 0 && playerHasSkill(p, 'brs_t2a') && !b.undyingWillUsed) {
    p = { ...p, hp: 1 };
    b = { ...b, undyingWillUsed: true };
    log.push({ text: `Undying Will! You survive at 1 HP!`, type: 'heal' });
    // Deathless bonus (brs_t22a)
    if (playerHasSkill(p, 'brs_t22a')) {
      b = { ...b, deathlessActive: true };
      log.push({ text: `Deathless! +25% ATK!`, type: 'info' });
    }
  }
  // Undying Resolve (war_t18a): survive lethal at 12% HP
  if (p.hp <= 0 && playerHasSkill(p, 'war_t18a') && !b.undyingResolveUsed) {
    p = { ...p, hp: Math.floor(battleMaxHp * 0.12) };
    b = { ...b, undyingResolveUsed: true };
    log.push({ text: `Undying Resolve! Survive at 20% HP!`, type: 'heal' });
  }
  // Phylactery (nec_t14a): revive at 30% HP on death
  if (p.hp <= 0 && playerHasSkill(p, 'nec_t14a')) {
    const maxRevives = playerHasSkill(p, 'nec_t24a') ? 2 : 1;
    const reviveHp = playerHasSkill(p, 'nec_t24a') ? 0.3 : 0.2;
    const uses = b.phylacteryUses || 0;
    if (uses < maxRevives) {
      p = { ...p, hp: Math.floor(battleMaxHp * reviveHp) };
      b = { ...b, phylacteryUses: uses + 1 };
      log.push({ text: `Phylactery revives you at ${Math.floor(reviveHp * 100)}% HP! (${maxRevives - uses - 1} left)`, type: 'heal' });
    }
  }
  // Second Wind (brs_t13a): heal 12% at 25% HP once per battle
  if (playerHasSkill(p, 'brs_t13a') && !b.secondWindUsed && p.hp > 0 && p.hp < battleMaxHp * 0.25) {
    const healAmt = Math.floor(battleMaxHp * 0.12);
    p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
    b = { ...b, secondWindUsed: true };
    log.push({ text: `Second Wind heals ${healAmt} HP!`, type: 'heal' });
  }
  // Juggernaut (brs_t16a): cannot be reduced below 10% by single hit
  if (playerHasSkill(p, 'brs_t16a') && p.hp > 0) {
    const minHp = Math.floor(battleMaxHp * 0.10);
    if (p.hp < minHp) {
      p = { ...p, hp: minHp };
      log.push({ text: `Juggernaut! Cannot drop below 15% from one hit!`, type: 'info' });
    }
  }
  // Death's Embrace: heal when below 25% HP (once/battle)
  if (playerHasSkill(p, 'nec_t2a') && !b.deathsEmbraceUsed && p.hp > 0 && p.hp < battleMaxHp * 0.25) {
    const healAmt = Math.floor(battleMaxHp * 0.10);
    p = { ...p, hp: Math.min(battleMaxHp, p.hp + healAmt) };
    b = { ...b, deathsEmbraceUsed: true };
    log.push({ text: `Death's Embrace heals ${healAmt} HP!`, type: 'heal' });
  }
  // Smoke Bomb (thf_t21a): chance to gain dodge after being hit
  if (playerHasSkill(p, 'thf_t21a') && Math.random() < prob('passive.smokeBomb')) {
    b = { ...b, dodgeNextTurn: true };
    log.push({ text: `Smoke Bomb! Dodge next attack!`, type: 'info' });
  }

  return { player: p, battle: b, log };
}

/**
 * Apply Cursed Blood passive (20% chance to poison attacker when hit).
 */
export function applyCursedBlood(player, battle, log) {
  if (!playerHasSkill(player, 'nec_t8a') || Math.random() >= prob('passive.cursedBlood')) return { battle, log };
  const b = { ...battle, monsterPoisonTurns: Math.max(battle.monsterPoisonTurns, 2) };
  log.push({ text: `Cursed Blood poisons ${battle.monster.name}!`, type: 'info' });
  return { battle: b, log };
}
