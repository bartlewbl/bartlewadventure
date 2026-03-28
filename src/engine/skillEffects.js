// Data-driven skill effect registry
// Each effect handler receives { dmg, player, monster, battle, battleMaxHp, log, manaCost }
// and returns { player, monster, battle, log } with modifications applied.
//
// To add a new skill effect, simply add a new entry to EFFECT_HANDLERS.
// No need to touch the reducer or battle logic.

import { getBattleMaxMana } from './combat';

const EFFECT_HANDLERS = {
  // ---- Recoil effects (self-damage) ----
  recoil_small: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.03);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Recoil deals ${recoil} to you!`, type: 'dmg-player' });
    return { player, log };
  },
  recoil_heavy: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.12);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Recoil deals ${recoil} to you!`, type: 'dmg-player' });
    return { player, log };
  },
  recoil_extreme: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.18);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Extreme recoil deals ${recoil} to you!`, type: 'dmg-player' });
    return { player, log };
  },
  recoil: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.06);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Recoil deals ${recoil} damage to you!`, type: 'dmg-player' });
    return { player, log };
  },

  // ---- Enemy ATK reduction ----
  war_cry: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.15));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  weaken: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.10));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  weaken_15: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.10));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  freeze: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.12));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Ice Lance! Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  frost_nova: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.18));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Frost Nova! Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  cheap_shot: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.12));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Cheap Shot! Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },

  // ---- Enemy DEF reduction ----
  shred_def: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.25));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Enemy DEF reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  quake: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.18));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Earthquake! Enemy DEF reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  chain_lightning: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.15));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Chain Lightning! Enemy DEF reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },

  // ---- Combined ATK+DEF reduction ----
  blizzard: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.08));
    const defRed = Math.max(1, Math.floor(monster.def * 0.08));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Blizzard! Enemy ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  wither: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.15));
    const defRed = Math.max(1, Math.floor(monster.def * 0.15));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Wither! Enemy ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },

  // ---- Poison/DoT effects ----
  apply_poison: ({ battle, log }) => {
    battle = { ...battle, monsterPoisonTurns: 3 };
    log.push({ text: `Enemy is poisoned!`, type: 'info' });
    return { battle, log };
  },
  apply_poison_short: ({ battle, log }) => {
    battle = { ...battle, monsterPoisonTurns: Math.max(battle.monsterPoisonTurns, 2) };
    log.push({ text: `Enemy is poisoned!`, type: 'info' });
    return { battle, log };
  },
  strong_poison: ({ battle, log }) => {
    battle = { ...battle, monsterPoisonTurns: 4 };
    log.push({ text: `Enemy is plagued!`, type: 'info' });
    return { battle, log };
  },
  strong_poison_3: ({ battle, log }) => {
    battle = { ...battle, monsterPoisonTurns: Math.max(battle.monsterPoisonTurns, 3) };
    log.push({ text: `Enemy is severely poisoned!`, type: 'info' });
    return { battle, log };
  },
  doom: ({ battle, log }) => {
    battle = { ...battle, monsterDoomTurns: 3 };
    log.push({ text: `Doom! Enemy will take damage over time!`, type: 'info' });
    return { battle, log };
  },

  // ---- Dodge effects ----
  shadow_dance: ({ battle, log }) => {
    battle = { ...battle, dodgeNextTurn: true };
    log.push({ text: `You vanish into shadows! Dodge next attack!`, type: 'info' });
    return { battle, log };
  },
  shadow_dance_2: ({ battle, log }) => {
    battle = { ...battle, dodgeCharges: 2 };
    log.push({ text: `You vanish into shadows! Dodge next 2 attacks!`, type: 'info' });
    return { battle, log };
  },
  phantom_blade: ({ battle, log }) => {
    battle = { ...battle, dodgeNextTurn: true };
    log.push({ text: `Phantom Blade! Dodge next attack!`, type: 'info' });
    return { battle, log };
  },

  // ---- Heal-on-hit effects ----
  final_stand: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.18);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Final Stand heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  soul_harvest: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.35);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Soul Harvest heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  drain: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.25);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Drained ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  full_drain: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.50);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Death Coil heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  army_drain: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.25);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Army of the Dead heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  rally_heal: ({ player, battleMaxHp, log }) => {
    const healAmt = Math.floor(battleMaxHp * 0.12);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Rallying Blow heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },

  // ---- Mana effects ----
  heroic_mana: ({ player, log }) => {
    const battleMana = getBattleMaxMana(player);
    player = { ...player, mana: Math.min(battleMana, player.mana + 3) };
    log.push({ text: `Heroic Strike restores 3 mana!`, type: 'heal' });
    return { player, log };
  },
  mana_refund: ({ player, manaCost, log }) => {
    const refund = Math.floor(manaCost * 0.3);
    const battleMana = getBattleMaxMana(player);
    player = { ...player, mana: Math.min(battleMana, player.mana + refund) };
    log.push({ text: `Arcane Torrent refunds ${refund} mana!`, type: 'heal' });
    return { player, log };
  },

  // ---- Armor break / buff ----
  armor_break: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.5));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, armorBreakTurns: 2, monster };
    log.push({ text: `Colossus Smash! Enemy DEF reduced by ${reduction} for 2 turns!`, type: 'info' });
    return { monster, battle, log };
  },
  avatar: ({ battle, log }) => {
    battle = { ...battle, avatarTurns: 2 };
    log.push({ text: `Avatar of War! DEF +30% for 2 turns!`, type: 'info' });
    return { battle, log };
  },

  // ---- Blood Nova: heal + recoil combo ----
  blood_nova: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.15);
    const recoil = Math.floor(player.maxHp * 0.06);
    player = { ...player, hp: Math.min(battleMaxHp, Math.max(1, player.hp + healAmt - recoil)) };
    log.push({ text: `Blood Nova heals ${healAmt}, recoil ${recoil}!`, type: 'info' });
    return { player, log };
  },

  // ---- Conditional bonus damage ----
  corpse_explode: ({ dmg, monster, battle, log }) => {
    if (battle.monsterPoisonTurns > 0) {
      const bonusDmg = Math.floor(dmg * 0.3);
      monster = { ...monster, hp: Math.max(0, monster.hp - bonusDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Corpse Explosion bonus! ${bonusDmg} extra damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },

  // ---- Complex combo effects ----
  nec_apocalypse: ({ dmg, player, battle, battleMaxHp, log }) => {
    battle = { ...battle, monsterDoomTurns: 3 };
    const healAmt = Math.floor(dmg * 0.18);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Apocalypse! Doom for 4 turns, heals ${healAmt} HP!`, type: 'info' });
    return { player, battle, log };
  },

  // ---- No-op effects (handled elsewhere via pierce/execute logic) ----
  shield_slam: ({ log }) => {
    log.push({ text: `Shield Slam! DEF adds to damage!`, type: 'info' });
    return { log };
  },

  // ==== POST-LEVEL-20 EFFECTS ====

  // ---- Bleed/DoT ----
  apply_bleed: ({ battle, log }) => {
    battle = { ...battle, monsterBleedTurns: 3 };
    log.push({ text: `Enemy is bleeding!`, type: 'info' });
    return { battle, log };
  },
  hemorrhage: ({ battle, log }) => {
    battle = { ...battle, monsterBleedTurns: 4 };
    log.push({ text: `Hemorrhage! Enemy bleeds heavily!`, type: 'info' });
    return { battle, log };
  },

  // ---- Berserker post-20 ----
  shred_def_60: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.35));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Crushing Blow! Enemy DEF reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  reckless_charge: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.06);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Reckless Charge! Recoil ${recoil}!`, type: 'dmg-player' });
    return { player, log };
  },
  overkill_50: ({ dmg, monster, battle, log }) => {
    if (monster.hp > battle.monsterMaxHp * 0.5) {
      const bonusDmg = Math.floor(dmg * 0.5); // bonus damage on high HP enemies
      monster = { ...monster, hp: Math.max(0, monster.hp - bonusDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Overkill! ${bonusDmg} bonus damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  worldbreaker: ({ dmg, player, monster, battle, battleMaxHp, log }) => {
    const recoil = Math.floor(player.maxHp * 0.25);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Worldbreaker! ${recoil} recoil!`, type: 'dmg-player' });
    if (monster.hp <= 0) {
      player = { ...player, hp: Math.min(battleMaxHp, battleMaxHp) };
      log.push({ text: `Worldbreaker KILLS! Full heal!`, type: 'heal' });
    } else {
      battle = { ...battle, playerStunTurns: 1 };
      log.push({ text: `Enemy survives! You are stunned!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  triple_strike: ({ dmg, monster, battle, player, log }) => {
    // Two additional hits (first hit already applied by caller)
    for (let i = 0; i < 2; i++) {
      if (monster.hp <= 0) break;
      const extraDmg = Math.floor(dmg * (0.8 + Math.random() * 0.4));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      log.push({ text: `Strike ${i + 2}: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, monster };
    return { monster, battle, log };
  },
  oblivion_strike: ({ player, log }) => {
    const recoil = Math.floor(player.maxHp * 0.15);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    log.push({ text: `Oblivion Strike recoil: ${recoil}!`, type: 'dmg-player' });
    return { player, log };
  },
  ragnarok: ({ player, monster, battle, battleMaxHp, log }) => {
    const hpCost = Math.floor(player.hp * 0.3);
    player = { ...player, hp: Math.max(1, player.hp - hpCost), mana: 0 };
    log.push({ text: `Ragnarök! Sacrificed ${hpCost} HP and all mana!`, type: 'dmg-player' });
    if (monster.hp > 0) {
      battle = { ...battle, playerAtkDebuffTurns: 3, playerAtkDebuffMult: 0.5 };
      log.push({ text: `Enemy survives! Your ATK halved for 3 turns!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  sunder: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.18));
    const defRed = Math.max(1, Math.floor(monster.def * 0.18));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Sunder! Enemy ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  titan_blow: ({ battle, log }) => {
    battle = { ...battle, monsterStunTurns: 1 };
    log.push({ text: `Titan Blow! Enemy stunned!`, type: 'info' });
    return { battle, log };
  },
  double_pierce_30: ({ dmg, monster, battle, log }) => {
    // Second hit (first already applied)
    if (monster.hp > 0) {
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Second strike: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  execute_30_8x: ({ dmg, monster, battle, log }) => {
    if (monster.hp > 0 && monster.hp < battle.monsterMaxHp * 0.3) {
      // The 6.5x becomes effectively 8.0x for the bonus portion
      const bonusDmg = Math.floor(dmg * 0.23);
      monster = { ...monster, hp: Math.max(0, monster.hp - bonusDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Execute! ${bonusDmg} bonus damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  final_cataclysm: ({ player, monster, battle, log }) => {
    player = { ...player, hp: 1 };
    log.push({ text: `Final Cataclysm! HP set to 1!`, type: 'dmg-player' });
    if (monster.hp > 0) {
      player = { ...player, hp: 0 };
      log.push({ text: `Enemy survives! You perish!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  cata_slam: ({ player, monster, battle, log }) => {
    const recoil = Math.floor(player.maxHp * 0.15);
    player = { ...player, hp: Math.max(1, player.hp - recoil) };
    monster = { ...monster, def: 0 };
    battle = { ...battle, monster };
    log.push({ text: `Cataclysmic Slam! Enemy DEF destroyed! Recoil: ${recoil}!`, type: 'info' });
    return { player, monster, battle, log };
  },

  // ---- Warrior post-20 ----
  thunder_clap: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.12));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Thunder Clap! Enemy ATK reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  retribution: ({ dmg, player, battle, log }) => {
    if (battle.defendedLastTurn) {
      // Damage already calculated at 3.0x, add bonus for 4.0x total
      const bonus = Math.floor(dmg * 0.2);
      if (battle.monster.hp > 0) {
        const m = { ...battle.monster, hp: Math.max(0, battle.monster.hp - bonus) };
        battle = { ...battle, monster: m };
        log.push({ text: `Retribution! ${bonus} bonus damage!`, type: 'dmg-monster' });
      }
    }
    return { battle, log };
  },
  seismic_slam: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.3));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Seismic Slam! Enemy DEF -${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  devastate_heal: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.15);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Devastate heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  wrath_ancients: ({ player, monster, battle, battleMaxHp, log }) => {
    const defLost = player.def || 0;
    const bonusDmg = Math.floor(defLost * 1.2);
    if (bonusDmg > 0 && monster.hp > 0) {
      monster = { ...monster, hp: Math.max(0, monster.hp - bonusDmg) };
      log.push({ text: `Wrath of the Ancients! DEF consumed for ${bonusDmg} bonus damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, monster, warDefZeroed: true };
    log.push({ text: `Your DEF is now 0 for this fight!`, type: 'dmg-player' });
    return { player, monster, battle, log };
  },
  warbringer: ({ battle, log }) => {
    battle = { ...battle, playerAtkBuff: (battle.playerAtkBuff || 0) + 0.12 };
    log.push({ text: `Warbringer! ATK +20% for the fight!`, type: 'info' });
    return { battle, log };
  },
  judgment: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.15));
    const defRed = Math.max(1, Math.floor(monster.def * 0.15));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Judgment! Enemy ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  colossal_strike: ({ log }) => {
    log.push({ text: `Colossal Strike! DEF adds to damage!`, type: 'info' });
    return { log };
  },
  titanic_slam: ({ battle, log }) => {
    battle = { ...battle, monsterStunTurns: 1 };
    log.push({ text: `Titanic Slam! Enemy stunned!`, type: 'info' });
    return { battle, log };
  },
  cataclysm_steel: ({ player, monster, battle, battleMaxHp, log }) => {
    if (monster.hp <= 0) {
      log.push({ text: `Cataclysm of Steel! Enemy destroyed! DEF restored!`, type: 'info' });
    } else {
      battle = { ...battle, playerDefHalved: true };
      log.push({ text: `Cataclysm of Steel! Your DEF halved for the fight!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  punishing_strike: ({ player, battleMaxHp, log }) => {
    const healAmt = Math.floor(battleMaxHp * 0.08);
    const battleMana = getBattleMaxMana(player);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt), mana: Math.min(battleMana, player.mana + 4) };
    log.push({ text: `Punishing Strike heals ${healAmt} HP, +4 mana!`, type: 'heal' });
    return { player, log };
  },
  full_armor_break: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.6));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Sundering Cleave! Enemy DEF reduced by ${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  worldsplitter: ({ player, battleMaxHp, log }) => {
    const shield = Math.floor(battleMaxHp * 0.08);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + shield) };
    log.push({ text: `Worldsplitter! Gain ${shield} shield HP!`, type: 'heal' });
    return { player, log };
  },
  final_judgment: ({ player, battle, battleMaxHp, monster, log }) => {
    if (monster.hp > 0) {
      player = { ...player, hp: battleMaxHp };
      log.push({ text: `Enemy survives! Full heal!`, type: 'heal' });
    }
    battle = { ...battle, playerDoubleDamage: true };
    log.push({ text: `Final Judgment! You now take double damage!`, type: 'dmg-player' });
    return { player, battle, log };
  },

  // ---- Thief post-20 ----
  stun_1: ({ battle, log }) => {
    battle = { ...battle, monsterStunTurns: 1 };
    log.push({ text: `Kidney Shot! Enemy stunned!`, type: 'info' });
    return { battle, log };
  },
  backstab: ({ dmg, monster, battle, log }) => {
    if (battle.dodgedLastTurn) {
      const bonus = Math.floor(dmg * 0.5); // 50% bonus from shadows
      monster = { ...monster, hp: Math.max(0, monster.hp - bonus) };
      battle = { ...battle, monster };
      log.push({ text: `Backstab from shadows! ${bonus} bonus damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  toxic_barrage: ({ dmg, monster, battle, log }) => {
    // Two additional hits + stacking poison
    for (let i = 0; i < 2; i++) {
      if (monster.hp <= 0) break;
      const extraDmg = Math.floor(dmg * (0.8 + Math.random() * 0.4));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      log.push({ text: `Barrage hit ${i + 2}: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, monster, monsterPoisonTurns: Math.max(battle.monsterPoisonTurns || 0, 3) };
    log.push({ text: `Toxic Barrage! Enemy poisoned!`, type: 'info' });
    return { monster, battle, log };
  },
  mark_death: ({ battle, log }) => {
    battle = { ...battle, monsterMarkTurns: 2 };
    log.push({ text: `Marked for Death! Enemy takes +15% damage for 2 turns!`, type: 'info' });
    return { battle, log };
  },
  death_sentence: ({ monster, battle, log }) => {
    if (monster.hp > 0) {
      const atkBonus = Math.max(1, Math.floor(monster.atk * 0.5));
      monster = { ...monster, atk: monster.atk + atkBonus };
      battle = { ...battle, monster, deathSentenceUsed: true };
      log.push({ text: `Enemy survives Death Sentence! Enemy ATK +${atkBonus}!`, type: 'dmg-player' });
    }
    return { monster, battle, log };
  },
  shadow_assault: ({ battle, log }) => {
    battle = { ...battle, dodgeCharges: 2 };
    log.push({ text: `Shadow Assault! Dodge next 2 attacks!`, type: 'info' });
    return { battle, log };
  },
  assassin_creed: ({ monster, battle, log }) => {
    if (!battle.isBoss && monster.hp > 0 && monster.hp < battle.monsterMaxHp * 0.15) {
      monster = { ...monster, hp: 0 };
      battle = { ...battle, monster };
      log.push({ text: `Assassin's Creed! Instant kill!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  phantom_storm: ({ dmg, monster, battle, log }) => {
    // Second hit + dodge
    if (monster.hp > 0) {
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Phantom Storm hit 2: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, dodgeNextTurn: true };
    log.push({ text: `Vanish into shadows!`, type: 'info' });
    return { monster, battle, log };
  },
  coup_de_grace: ({ player, monster, battle, log }) => {
    // Only usable below 30% (checked in UI ideally, but enforce here)
    if (monster.hp > battle.monsterMaxHp * 0.3) {
      log.push({ text: `Coup de Grâce missed! Enemy above 30% HP!`, type: 'dmg-player' });
      player = { ...player, hp: 0 };
      log.push({ text: `The miss is fatal!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  execution_chain: ({ monster, battle, player, manaCost, log }) => {
    if (monster.hp <= 0) {
      const battleMana = getBattleMaxMana(player);
      player = { ...player, mana: Math.min(battleMana, player.mana + manaCost) };
      log.push({ text: `Kill! Mana fully refunded!`, type: 'heal' });
    }
    return { player, monster, battle, log };
  },
  viper_strike: ({ battle, log }) => {
    battle = { ...battle, monsterPoisonTurns: 3, monsterLethalPoison: true };
    log.push({ text: `Viper Strike! Lethal poison for 3 turns!`, type: 'info' });
    return { battle, log };
  },
  shadow_barrage: ({ dmg, monster, battle, log }) => {
    for (let i = 0; i < 2; i++) {
      if (monster.hp <= 0) break;
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      log.push({ text: `Shadow hit ${i + 2}: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, monster };
    return { monster, battle, log };
  },
  dance_death: ({ battle, log }) => {
    battle = { ...battle, dodgeCharges: 2 };
    log.push({ text: `Dance of Death! Dodge next 2 attacks!`, type: 'info' });
    return { battle, log };
  },
  perfect_assassination: ({ player, log }) => {
    player = { ...player, hp: 1 };
    log.push({ text: `Perfect Assassination! HP set to 1!`, type: 'dmg-player' });
    return { player, log };
  },

  // ---- Mage post-20 ----
  inferno: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.atk * 0.12));
    monster = { ...monster, atk: Math.max(1, monster.atk - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Inferno! Enemy ATK -${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  arcane_missiles: ({ dmg, monster, battle, log }) => {
    for (let i = 0; i < 2; i++) {
      if (monster.hp <= 0) break;
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      log.push({ text: `Arcane Missile ${i + 2}: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    battle = { ...battle, monster };
    return { monster, battle, log };
  },
  comet: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.25));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Comet! Enemy DEF -${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  void_bolt: ({ monster, player, battle, log }) => {
    const manaDrain = Math.floor(battle.monsterMaxHp * 0.1);
    const battleMana = getBattleMaxMana(player);
    player = { ...player, mana: Math.min(battleMana, player.mana + Math.floor(manaDrain * 0.5)) };
    log.push({ text: `Void Bolt drains ${Math.floor(manaDrain * 0.5)} mana from the void!`, type: 'heal' });
    return { player, monster, battle, log };
  },
  supernova: ({ player, battle, log }) => {
    // Drains all remaining mana for bonus damage (bonus applied as extra hits)
    const remainingMana = player.mana;
    const bonusDmg = Math.floor(remainingMana * 1.2);
    player = { ...player, mana: 0 };
    if (bonusDmg > 0 && battle.monster.hp > 0) {
      const m = { ...battle.monster, hp: Math.max(0, battle.monster.hp - bonusDmg) };
      battle = { ...battle, monster: m };
      log.push({ text: `Supernova! All mana consumed for ${bonusDmg} bonus damage!`, type: 'dmg-monster' });
    }
    return { player, battle, log };
  },
  apoc_fire: ({ battle, log }) => {
    battle = { ...battle, monsterBurnTurns: 3 };
    log.push({ text: `Apocalyptic Fire! Enemy burns for 3 turns!`, type: 'info' });
    return { battle, log };
  },
  gravity_well: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.12));
    const defRed = Math.max(1, Math.floor(monster.def * 0.12));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster, monsterStunTurns: 1 };
    log.push({ text: `Gravity Well! Stunned! ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  double_true: ({ dmg, monster, battle, log }) => {
    if (monster.hp > 0) {
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Starfall hit 2: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  singularity: ({ battle, log }) => {
    battle = { ...battle, playerSpellCooldown: 2 };
    log.push({ text: `Singularity! Cannot cast spells for 2 turns!`, type: 'dmg-player' });
    return { battle, log };
  },
  chain_destruction: ({ monster, battle, log }) => {
    const reduction = Math.max(1, Math.floor(monster.def * 0.3));
    monster = { ...monster, def: Math.max(0, monster.def - reduction) };
    battle = { ...battle, monster };
    log.push({ text: `Chain Destruction! Enemy DEF -${reduction}!`, type: 'info' });
    return { monster, battle, log };
  },
  dim_rift: ({ battle, log }) => {
    battle = { ...battle, dodgeNextTurn: true };
    log.push({ text: `Dimensional Rift! Dodge next attack!`, type: 'info' });
    return { battle, log };
  },
  oblivion_beam: ({ player, log }) => {
    const hpCost = Math.floor(player.hp * 0.2);
    player = { ...player, hp: Math.max(1, player.hp - hpCost) };
    log.push({ text: `Oblivion Beam! ${hpCost} HP consumed!`, type: 'dmg-player' });
    return { player, log };
  },
  big_bang: ({ player, battle, log }) => {
    const manaCost = player.mana;
    const hpCost = Math.floor(player.hp * 0.5);
    player = { ...player, mana: 0, hp: Math.max(1, player.hp - hpCost) };
    battle = { ...battle, bigBangUsed: true };
    log.push({ text: `BIG BANG! ${manaCost} mana and ${hpCost} HP consumed!`, type: 'dmg-player' });
    return { player, battle, log };
  },

  // ---- Necromancer post-20 ----
  spirit_lance: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.30);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Spirit Lance heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  bone_storm: ({ dmg, monster, battle, log }) => {
    if (monster.hp > 0) {
      const extraDmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
      monster = { ...monster, hp: Math.max(0, monster.hp - extraDmg) };
      battle = { ...battle, monster };
      log.push({ text: `Bone Storm hit 2: ${extraDmg} damage!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  devouring_plague: ({ dmg, player, battle, battleMaxHp, log }) => {
    battle = { ...battle, monsterDoomTurns: 3 };
    const healAmt = Math.floor(dmg * 0.12);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Devouring Plague! Doom 4 turns, heal ${healAmt}!`, type: 'info' });
    return { player, battle, log };
  },
  soul_rend: ({ monster, battle, log }) => {
    const stolen = Math.max(1, Math.floor(monster.atk * 0.1));
    monster = { ...monster, atk: Math.max(1, monster.atk - stolen) };
    battle = { ...battle, monster, playerAtkBuff: (battle.playerAtkBuff || 0) + stolen * 0.01 };
    log.push({ text: `Soul Rend! Stole ${stolen} ATK from enemy!`, type: 'info' });
    return { monster, battle, log };
  },
  soul_apocalypse: ({ dmg, player, monster, battle, battleMaxHp, log }) => {
    const hpCost = Math.floor(player.maxHp * 0.15);
    player = { ...player, hp: Math.max(1, player.hp - hpCost) };
    const healAmt = Math.min(battleMaxHp, Math.floor(dmg * 0.5));
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    battle = { ...battle, monsterDoomTurns: 3 };
    log.push({ text: `Soul Apocalypse! Doom 5 turns! Healed ${healAmt}, cost ${hpCost} HP!`, type: 'info' });
    if (monster.hp > 0) {
      battle = { ...battle, soulApocMaxHpReduction: (battle.soulApocMaxHpReduction || 0) + 0.10 };
      log.push({ text: `Enemy survives! Max HP reduced 10% this fight!`, type: 'dmg-player' });
    }
    return { player, monster, battle, log };
  },
  necrotic_burst: ({ dmg, monster, battle, log }) => {
    if ((battle.monsterDoomTurns > 0 || battle.monsterPoisonTurns > 0) && monster.hp > 0) {
      const bonus = Math.floor(dmg * 0.5); // 50% bonus vs afflicted
      monster = { ...monster, hp: Math.max(0, monster.hp - bonus) };
      battle = { ...battle, monster };
      log.push({ text: `Necrotic Burst! +${bonus} bonus damage vs afflicted!`, type: 'dmg-monster' });
    }
    return { monster, battle, log };
  },
  abyssal_strike: ({ dmg, player, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.18);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Abyssal Strike heals ${healAmt} HP!`, type: 'heal' });
    return { player, log };
  },
  mass_wither: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.25));
    const defRed = Math.max(1, Math.floor(monster.def * 0.25));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed), def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Mass Wither! Enemy ATK -${atkRed}, DEF -${defRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  death_wave: ({ battle, log }) => {
    battle = { ...battle, monsterDoomTurns: Math.max(battle.monsterDoomTurns || 0, 2), monsterPoisonTurns: Math.max(battle.monsterPoisonTurns || 0, 2) };
    log.push({ text: `Death Wave! Doom 2 turns + Poison 2 turns!`, type: 'info' });
    return { battle, log };
  },
  extinction_event: ({ dmg, player, battle, battleMaxHp, log }) => {
    const hpCost = Math.floor(player.hp * 0.2);
    player = { ...player, hp: Math.max(1, player.hp - hpCost) };
    const healAmt = Math.floor(dmg * 0.3);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    battle = { ...battle, monsterDoomTurns: 3, extinctionMaxHpPenalty: (battle.extinctionMaxHpPenalty || 0) + 0.03 };
    log.push({ text: `Extinction Event! Doom 5 turns! Healed ${healAmt}! Max HP -5%!`, type: 'info' });
    return { player, battle, log };
  },
  siphon_soul: ({ dmg, player, battle, battleMaxHp, log }) => {
    const healAmt = Math.floor(battle.monsterMaxHp * 0.08);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Siphon Soul heals ${healAmt} HP!`, type: 'heal' });
    return { player, battle, log };
  },
  banshee_wail: ({ monster, battle, log }) => {
    const atkRed = Math.max(1, Math.floor(monster.atk * 0.18));
    monster = { ...monster, atk: Math.max(1, monster.atk - atkRed) };
    battle = { ...battle, monster, monsterStunTurns: 1 };
    log.push({ text: `Banshee Wail! Stunned! ATK -${atkRed}!`, type: 'info' });
    return { monster, battle, log };
  },
  death_grip: ({ dmg, player, monster, battle, battleMaxHp, log }) => {
    const healAmt = Math.floor(dmg * 0.25);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    const defRed = Math.max(1, Math.floor(monster.def * 0.30));
    monster = { ...monster, def: Math.max(0, monster.def - defRed) };
    battle = { ...battle, monster };
    log.push({ text: `Death Grip! Healed ${healAmt}, enemy DEF -${defRed}!`, type: 'info' });
    return { player, monster, battle, log };
  },
  annihilation: ({ dmg, player, battle, battleMaxHp, log }) => {
    battle = { ...battle, monsterDoomTurns: 3 };
    const healAmt = Math.floor(dmg * 0.30);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    log.push({ text: `Annihilation! Doom 4 turns, healed ${healAmt}!`, type: 'info' });
    return { player, battle, log };
  },
  requiem: ({ dmg, player, monster, battle, battleMaxHp, log }) => {
    const hpCost = Math.floor(player.hp * 0.3);
    player = { ...player, hp: Math.max(1, player.hp - hpCost) };
    const healAmt = Math.floor(dmg * 0.5);
    player = { ...player, hp: Math.min(battleMaxHp, player.hp + healAmt) };
    battle = { ...battle, monsterDoomTurns: 4 };
    log.push({ text: `REQUIEM! The final song plays! Doom 6 turns! Cost ${hpCost} HP, healed ${healAmt}!`, type: 'info' });
    if (monster.hp > 0 && monster.hp < battle.monsterMaxHp * 0.1) {
      monster = { ...monster, hp: 0 };
      battle = { ...battle, monster };
      log.push({ text: `Enemy at death's door — INSTANT KILL!`, type: 'dmg-monster' });
    }
    return { player, monster, battle, log };
  },
};

// Pierce and execute effects are handled in combat.js (getEffectiveDef / getExecuteMultiplier)
// so they don't need handlers here. But we register them as no-ops so lookups don't fail.
for (const key of ['true_damage', 'pierce', 'pierce_20', 'pierce_25', 'pierce_30', 'pierce_40', 'pierce_50',
                    'pierce_60', 'execute', 'execute_25', 'counter']) {
  if (!EFFECT_HANDLERS[key]) {
    EFFECT_HANDLERS[key] = () => ({});
  }
}

/**
 * Apply a skill effect by name. Returns partial state updates to merge.
 * Unknown effects are silently ignored (returns empty object).
 */
export function applySkillEffect(effectName, context) {
  const handler = EFFECT_HANDLERS[effectName];
  if (!handler) return {};
  return handler(context);
}

/**
 * Check if an effect name has a registered handler.
 */
export function hasEffect(effectName) {
  return !!EFFECT_HANDLERS[effectName];
}
