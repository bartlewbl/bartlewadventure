// ============================================================
// COMPANION NPCS — Escort and Expedition Quests
// ============================================================
// Companion NPCs invite the player to special, finite-size zones.
// They either:
//   - Helper mode: fight alongside the player (heal + atk buff each stage)
//   - Escort mode: the player must protect them (companion has its own HP
//     that ticks down each stage; if it hits 0 the quest fails)
//
// Each zone is a fixed sequence of stages. Clearing the final stage grants
// a reward (gold + guaranteed item) on top of normal battle loot.
// ============================================================

export const COMPANION_NPCS = [
  {
    id: 'cnpc-lira',
    name: 'Lira the Cartographer',
    title: 'Ley-Line Mapper',
    mode: 'escort',
    color: '#64b5f6',
    spriteKey: 'cartographer',
    greeting:
      '"Please — I need a guard. I\'ve charted a forgotten vault beneath the ley lines, but the path there crawls with creatures. Escort me and the find is half yours."',
    lore:
      'Lira maps the invisible currents of the wasteland — ley lines, dead zones, old power grids still faintly humming. Her notebooks are worth a fortune, but she needs muscle to reach the best archives.',
    companion: {
      maxHp: 80,
      atk: 0, // escort: does not fight
    },
    quest: {
      id: 'cq-liras-vault',
      name: "Lira's Lost Vault",
      description:
        'Escort Lira through the Sunken Ledger. Keep her alive until the vault is reached.',
      rewardGold: 600,
      rewardItem: 'amulet',
      giverLine:
        '"Stay close. I\'ll move when you say it\'s safe. Don\'t let them flank me."',
      completeLine:
        '"The vault! Look at these records — centuries of lost routes. Your share — as promised."',
      failLine: '"No... the maps... we were so close..."',
    },
    location: {
      id: 'sunken-ledger',
      name: 'The Sunken Ledger',
      description:
        'A collapsed archive threaded with pulsing ley lines. The air hums with residual spellwork and old data.',
      stages: 3,
      stageNames: ['Flooded Atrium', 'Glyph Stacks', 'Vault Antechamber'],
    },
    minLevel: 3,
  },
  {
    id: 'cnpc-brand',
    name: 'Brand the Oathbound',
    title: 'Sellsword',
    mode: 'helper',
    color: '#ef5350',
    spriteKey: 'sellsword',
    greeting:
      '"Hire me? Simple deal. You take me to the old bunker. I fight at your side. We split whatever\'s in the vault. Deal?"',
    lore:
      'Brand was a legion enforcer before his unit went dark. Now he sells his blade to anyone with a credible lead on pre-collapse munitions. Takes his cut in weapons, not coin.',
    companion: {
      maxHp: 140,
      atk: 14,
    },
    quest: {
      id: 'cq-bunker-run',
      name: 'The Bunker Run',
      description:
        'Brand has intel on a derelict bunker. Fight through the outer defenses with him at your side.',
      rewardGold: 850,
      rewardItem: 'sword',
      giverLine: '"Point me at the first one. I hit hard, I don\'t miss."',
      completeLine:
        '"That\'s the vault seal. Stand back." *crack* "Told you I don\'t miss. Your cut — earned it."',
      failLine:
        '"Damn... I\'m done... take what you can from me and finish it..."',
    },
    location: {
      id: 'derelict-bunker',
      name: 'The Derelict Bunker',
      description:
        'A pre-war hardpoint, half-swallowed by the earth. Something inside is still powered.',
      stages: 3,
      stageNames: ['Outer Perimeter', 'Inner Corridor', 'Vault Door'],
    },
    minLevel: 6,
  },
  {
    id: 'cnpc-nyx',
    name: 'Nyx the Wyrd-Seer',
    title: 'Veilwalker',
    mode: 'escort',
    color: '#ba68c8',
    spriteKey: 'wyrdseer',
    greeting:
      '"The Veil thins at a crossing only I can find. Guide me there — and what waits beyond will change us both. But I cannot fight. The Veil would unravel me."',
    lore:
      'Nyx drifts between the waking world and the dreamspace that lies beneath it. She seeks a specific echo — a door that only opens for her, only once.',
    companion: {
      maxHp: 70,
      atk: 0,
    },
    quest: {
      id: 'cq-veil-crossing',
      name: 'The Veil Crossing',
      description:
        'Guide Nyx through the Veil Crossing. Echoes of the dreamspace will assault you — she must survive to open the gate.',
      rewardGold: 1400,
      rewardItem: 'ring',
      giverLine:
        '"The echoes will come for me first. They know what I am. Protect me — I\'ll open the gate when we arrive."',
      completeLine:
        '"The gate opens... and closes. Take this. It\'s a piece of the space between. You\'ll know what to do with it."',
      failLine: '"The Veil... it\'s taking me... I\'m sorry, warden..."',
    },
    location: {
      id: 'veil-crossing',
      name: 'The Veil Crossing',
      description:
        'A corridor of fading geometry — walls that loop, sounds that arrive before they\'re made. Echoes of things that almost were.',
      stages: 4,
      stageNames: ['Outer Thin', 'Echo Hall', 'Mirror Corridor', 'Gate Threshold'],
    },
    minLevel: 10,
  },
  {
    id: 'cnpc-torvin',
    name: 'Torvin the Reclaimer',
    title: 'Scrap Captain',
    mode: 'helper',
    color: '#ffb74d',
    spriteKey: 'reclaimer',
    greeting:
      '"You look capable. I\'ve got a fix on a scavenger caravan — went silent in the Iron Wake last week. I go, you go, we split the haul. Simple."',
    lore:
      'Torvin captained a salvage crew for fifteen years without a single death on his ledger. The Iron Wake broke that streak. Now he\'s going back to recover his crew\'s gear — or their bones.',
    companion: {
      maxHp: 180,
      atk: 18,
    },
    quest: {
      id: 'cq-iron-wake',
      name: 'The Iron Wake Salvage',
      description:
        'Join Torvin in recovering his crew\'s lost haul. He fights beside you through the wreck.',
      rewardGold: 1800,
      rewardItem: 'armor',
      giverLine:
        '"On my mark, we push. Don\'t leave wounded behind — they come back worse."',
      completeLine:
        '"There they are... my crew\'s marks. I\'ll take their tags home. You — take this. It was the captain\'s own set."',
      failLine: '"Go... don\'t let me come back like the rest of them..."',
    },
    location: {
      id: 'iron-wake',
      name: 'The Iron Wake',
      description:
        'A graveyard of capsized freighters and rusted-out cargo haulers. Something moves between the wrecks.',
      stages: 4,
      stageNames: ['Outer Hulls', 'Cargo Deck', 'Engine Bay', 'Captain\'s Hold'],
    },
    minLevel: 14,
  },
];

// Rate for random companion NPC encounter during exploration
export const COMPANION_ENCOUNTER_RATE = 0.01; // ~1% per explore step

// Escort mode: fraction of damage the player took in a stage that the companion also takes
// (represents them dodging poorly, getting clipped, etc.)
export const ESCORT_DAMAGE_SHARE = 0.25;
// Escort mode: flat minimum damage the companion takes per stage (so fights can't shield them 100%)
export const ESCORT_MIN_STAGE_DAMAGE = 4;

// Helper mode: % of max HP the companion heals the player by between stages
export const HELPER_STAGE_HEAL_PCT = 0.18;
// Helper mode: flat atk bonus the companion adds to the player's effective atk during battles
export const HELPER_ATK_BONUS_MULT = 1.0; // applied as additive (companion.atk * mult)

// Stage reward multipliers on final stage (applied on top of normal battle gold/exp)
export const COMPANION_FINAL_STAGE_BONUS = {
  goldMult: 1.5,
  expMult: 1.5,
};

// Helper: look up a companion NPC by id
export function findCompanionNpc(npcId) {
  return COMPANION_NPCS.find(n => n.id === npcId) || null;
}

// Helper: look up the quest for an NPC
export function findCompanionQuest(npcId) {
  const npc = findCompanionNpc(npcId);
  return npc?.quest || null;
}
