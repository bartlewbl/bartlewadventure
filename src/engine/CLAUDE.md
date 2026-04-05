# Engine - Game Logic

Pure game logic, no UI. All files are imported by components and the main game loop.

## File Map

| File | Purpose |
|------|---------|
| combat.js | Damage formulas, stat getters, dodge/crit/resistance, turn order |
| skillEffects.js | 70+ skill effect handlers (recoil, healing, debuffs, DoTs, faction attacks) |
| passives.js | Passive triggers at 5 battle phases (turn start, after attack, after skill, taking damage, post-defense) |
| elements.js | Elemental damage triangles (Fire>Ice>Lightning>Fire, Shadow>Nature>Arcane>Shadow) + weather system |
| scaling.js | Monster/boss stat scaling by area level |
| loot.js | Item generation, rarity rolls, drop tables, shop filtering |
| arena.js | NPC opponent generation with simulated stats/equipment |
| utils.js | uid(), pickWeighted(), seededRandom() |

## Key Formulas

- **Base damage:** `max(1, atk - def * 0.5)` with ±10-40% variance
- **Crit chance:** `3% + 0.5% * athletics + 0.25% * wisdom` (cap 30%)
- **Dodge chance:** `min(0.6, max(0, evasion - accuracy) * 0.015)`
- **Resistance:** `min(0.5, resistance * 0.01)` per point = 1% reduction
- **Tenacity:** Reduces debuff duration by ~3%/point (cap 60%)
- **Monster HP scaling:** `baseHp * (1 + (level-1) * 0.3) * 1.65`
- **Boss HP scaling:** `baseHp * (1 + (level-1) * 0.32) * 1.65`
- **Monster ATK scaling:** `baseAtk * (1 + (level-1) * 0.3) * 1.45`
- **Monster DEF scaling:** `baseDef * (1 + (level-1) * 0.3) * 1.35`
- **Monster combat stat scaling:** `+7% per level` (bosses: `+6% per level`)
- **Monster crit:** `5% base + 0.1%/level` (cap 12%), `1.6x` multiplier
- **Monster skill chance:** `40%`
- **Item rarity multipliers:** Common 0.7, Uncommon 1.0, Rare 1.7, Epic 2.5, Legendary 3.5

## Item Passives

Uncommon+ gear rolls one random passive bonus from a slot-specific pool. Passives scale with rarity:
- **Uncommon:** 1-2% / 1-2 flat
- **Rare:** 2-4% / 2-4 flat
- **Epic:** 3-6% / 3-6 flat
- **Legendary:** 5-8% / 5-9 flat

**Passive types by slot:**
| Slot | Possible Passives |
|------|------------------|
| Weapon | Crit Chance%, Life Steal%, ATK%, Aggression |
| Shield | DEF%, Max HP, Fortitude, Resistance |
| Helmet | EXP Bonus%, DEF%, Max HP, Resistance |
| Armor | DEF%, Max HP, Tenacity, Fortitude |
| Boots | Gold Bonus%, Speed, Dodge Chance%, Evasion |
| Gloves | Crit Chance%, ATK%, Accuracy, Life Steal% |
| Belt | Max HP, Gold Bonus%, DEF%, Tenacity |
| Cape | Dodge Chance%, ATK%, Evasion, Speed |
| Amulet | EXP Bonus%, Mana Regen, Resistance, Luck |
| Ring | Crit Chance%, Gold Bonus%, Luck, Dodge Chance%, Mana Regen |

**Where passives apply:**
- Combat stats (atkPct, defPct, critChance, dodgeChance, speed, evasion, accuracy, resistance, tenacity, aggression, luck, fortitude, hpFlat): `combat.js` stat getters via `getEquipPassiveTotal()`
- Life Steal, Mana Regen: `passives.js` (attack passives / turn-start)
- Gold Bonus, EXP Bonus: `useGameState.js` battle reward calculation

**Item data shape:** `item.passive = { id, label, format: 'pct'|'flat', value }` (undefined for Common items)

## Damage Modifier Stacking

ATK modifiers are **multiplicative**. Key ones by power (post-balance pass):
- Godslayer (brs_t25a): +1% per 1% HP missing (strongest scaling, was +5%)
- Avatar of Carnage: ×1.25 damage (was ×2)
- Shadowmeld: ×1.5 on first attack (was ×3)
- Berserker Rage: +10% below 40% HP (was +30%)
- War Machine: +5% base, +8% below 50% HP (was +15%/+25%)
- Blood Oath: +15% ATK (was +60%)
- Berserker Stance: +10% ATK (was +30%)

DEF reductions are also multiplicative:
- Iron Skin: ×0.97 → Thick Skin: ×0.98 → Fortress: ×0.95 → Soul Fortress: ×0.97
- Berserker Stance *increases* damage taken: ×1.05 (was ×1.15)

**Balance philosophy**: Passives are minor incremental upgrades (+2-8% per tier).
Milestone skills are slightly enhanced versions, not game-changing transformations.

## Elemental Weather Bonuses

Weather modifies elemental damage additively:
- Rain: Ice +20%, Fire -25%, Lightning +10%
- Storm: Lightning +30%, Fire -15%
- Heatwave: Fire +30%, Ice -25%
- Fog: Shadow +25%, Nature +15%

## Skill Effect Pattern

All effects in skillEffects.js follow the same signature:
```js
effectName: ({ dmg, player, monster, battle, battleMaxHp, log, manaCost }) => ({ /* partial state updates */ })
```

## Dependencies Between Files

```
combat.js ← passives.js, skillEffects.js, elements.js
loot.js ← utils.js
arena.js ← loot.js, CHARACTER_CLASSES from data/
scaling.js ← standalone (used by encounter spawning)
```

## Faction Combat Skills (skillEffects.js)

125 class-specific faction skills tied to tavern NPC reputation (defined in `data/tavernData.js`).

**Structure:** `FACTION_SKILLS[npcId][classId]` = array of 5 skills, gated at rep levels 1-5.

Each NPC offers different skills per class, blending the faction gimmick with class identity:

| Faction (NPC) | Gimmick | Berserker | Warrior | Thief | Mage | Necromancer |
|---------------|---------|-----------|---------|-------|------|-------------|
| Ironforge (Grog) | Fire/burn/forge | Fire + recoil | Fire + shields | Fire + evasion | Fire + true damage | Fire + lifesteal |
| Shadow Syndicate (Whisper) | Poison/stealth | Poison + rage | Poison + defense | Poison + dodge | Shadow + DEF ignore | Shadow + drain |
| Old Guard (Fenwick) | Healing/buffs | Heal + rage | Heal + defense | Heal + dodge | Holy + mana regen | Heal + drain |
| Golden Cartel (Mira) | Chaos/gold/random | Random + recoil | Random + DEF | Gold + dodge | Random + true damage | Random + lifesteal |
| Steel Legion (Thorne) | Military/debuffs | Debuff + rage | Debuff + DEF | Debuff + dodge | Debuff + true damage | Debuff + drain |

**Skill trees no longer have active skills** — tiers are 3 passives (pick 1). Active skills come only from:
1. Class innate skill (always available)
2. Tavern faction skills (learned via NPC reputation)

Helper: `getUnlockedFactionSkills(tavern, characterClass)` returns learned skills for the player's class.

Battle state keys: `monsterBurnTurns`, `forgeShieldTurns`, `forgeShieldReduction`, `forgeShieldThorns`, `ancestralWardTurns`, `ancestralWardBonus`, `goldenGambitActive`

## Fire Ritual & Wave Defense System

Quest-driven mechanic in `data/fireRitualData.js` + `hooks/useGameState.js`:

- **Discovery:** Base 4% chance per step; **25% when a fire quest chain is active**; **40% in the quest's target location**
- **Quest-connected:** Quests have `fireRitual: { locationId, requiresDefense }` metadata
  - Quests direct players to specific locations (e.g. "Light a fire in Shadow Alley")
  - Some quests force wave defense (can't just light and leave)
  - `activeRitualSite` carries `activeQuest`, `activeQuestChainId`, `questRequiresDefense`
  - FireRitualScreen shows quest info and forces defense when required
- **Lighting:** Consumes fuel materials (Scrap Wood, Charcoal, Coal Chunk, Oil Canister, Plasma Core)
- **Wave Defense:** Defend-the-fire mode spawns sequential monster waves
  - Tiers: easy (2 waves), medium (3), hard (4), brutal (5)
  - Tier based on location level: Lv1=easy, Lv3+=medium, Lv10+=hard, Lv18+=brutal
  - Monsters scale +10% per wave; player heals between waves (25%/20%/15%/10% by tier)
  - Completion bonus: 1.5x/2x/2.5x/3x gold+exp on final wave
  - Cannot run during wave defense
- **Stats tracked:** Global: `fireRitualsLit`, `fireRitualsDefended`, `fireRitualMonstersKilled`, `wavesSurvived`
  Per-location (dynamic keys): `fireRitualLit_<locationId>`, `fireRitualDefended_<locationId>`
- **Quest chains:** Fire Keeper (Lv3, 7 quests) and Flame Sentinel (Lv14, 7 quests) in `data/tasks.js`
  - `FIRE_RITUAL_CHAIN_IDS` in fireRitualData.js lists which chains are fire-ritual chains
- **State keys:** `state.activeRitualSite`, `state.waveDefense`, `battleResult.isWaveDefense`
- **Screen:** `fire-ritual` → `FireRitualScreen.jsx`

## Common Pitfalls

- Stat getters in combat.js check 30+ skill flags — always verify skill IDs match data/skills
- Scaling formulas have a hardcoded 0.5 multiplier on HP — don't remove it thinking it's a bug
- Item generation uses Gaussian weighting (σ=4 above, σ=6 below player level) with a hard cap of +5 levels above target — items cannot exceed targetLevel + 5
- Armourer shop and crafted items use template level as the equip requirement (not `Math.max(template.level, playerLevel)`)
- Loot chest and daily reward fallbacks also cap item level at playerLevel + 5
- Rarity multipliers affect both ATK and DEF on gear
