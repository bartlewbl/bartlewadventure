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
- **Monster HP scaling:** `baseHp * (1 + (level-1) * 0.08) * 0.5`
- **Boss HP scaling:** `baseHp * (1 + (level-1) * 0.12) * 0.5`
- **Item rarity multipliers:** Common 0.7, Uncommon 1.0, Rare 1.7, Epic 2.5, Legendary 3.5

## Damage Modifier Stacking

ATK modifiers are **multiplicative**. Key ones by power:
- Godslayer (brs_t25a): +5% per 1% HP missing (strongest scaling)
- Avatar of Carnage: ×2 damage
- Shadowmeld: ×3 on first attack
- Berserker Rage: +30% below 40% HP
- War Machine: +15% base, +25% below 50% HP

DEF reductions are also multiplicative:
- Iron Skin: ×0.90 → Thick Skin: ×0.85 → Fortress: ×0.80 → Soul Fortress: ×0.75
- Berserker Stance *increases* damage taken: ×1.15

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

10 faction-specific effects tied to tavern NPC reputation (defined in `data/tavernData.js`):

| Effect | Faction | Description |
|--------|---------|-------------|
| faction_molten_slam | Ironforge Covenant (Grog) | Burn DoT 3 turns (5% maxHP/turn) |
| faction_forge_shield | Ironforge Covenant (Grog) | -25% dmg taken + 15% thorns for 3 turns |
| faction_venomstrike | Shadow Syndicate (Whisper) | Poison 4 turns |
| faction_shadowstep | Shadow Syndicate (Whisper) | +2 dodge charges |
| faction_guardian_smite | Old Guard Order (Fenwick) | Heal 30% of damage dealt |
| faction_ancestral_ward | Old Guard Order (Fenwick) | +20% ATK & DEF for 4 turns |
| faction_fortunes_gambit | Golden Cartel (Mira) | Random 0.5x-2.5x damage + gold on kill |
| faction_gilded_barrage | Golden Cartel (Mira) | 2 extra hits at 0.7x, 25% stun each |
| faction_disciplined_strike | Steel Legion (Thorne) | -15% enemy ATK for 3 turns |
| faction_commanders_charge | Steel Legion (Thorne) | 40% chance stun 1 turn |

Battle state keys added: `monsterBurnTurns`, `forgeShieldTurns`, `forgeShieldReduction`, `forgeShieldThorns`, `ancestralWardTurns`, `ancestralWardBonus`, `goldenGambitActive`

## Fire Ritual & Wave Defense System

New mechanic in `data/fireRitualData.js` + `hooks/useGameState.js`:

- **Discovery:** ~4% chance per exploration step to find a ritual site (campfire, ritual circle, signal pyre)
- **Lighting:** Consumes fuel materials (Scrap Wood, Charcoal, Coal Chunk, Oil Canister, Plasma Core)
- **Wave Defense:** Optional defend-the-fire mode spawns sequential monster waves
  - Tiers: easy (2 waves), medium (3), hard (4), brutal (5)
  - Tier based on location level: Lv1=easy, Lv3+=medium, Lv10+=hard, Lv18+=brutal
  - Monsters scale +10% per wave; player heals between waves (25%/20%/15%/10% by tier)
  - Completion bonus: 1.5x/2x/2.5x/3x gold+exp on final wave
  - Cannot run during wave defense
- **Stats tracked:** `fireRitualsLit`, `fireRitualsDefended`, `fireRitualMonstersKilled`, `wavesSurvived`
- **Quest chains:** Fire Keeper (Lv3, 7 quests) and Flame Sentinel (Lv14, 7 quests) in `data/tasks.js`
- **State keys:** `state.activeRitualSite`, `state.waveDefense`, `battleResult.isWaveDefense`
- **Screen:** `fire-ritual` → `FireRitualScreen.jsx`

## Common Pitfalls

- Stat getters in combat.js check 30+ skill flags — always verify skill IDs match data/skills
- Scaling formulas have a hardcoded 0.5 multiplier on HP — don't remove it thinking it's a bug
- Item generation uses Gaussian weighting (σ=4 above, σ=6 below player level) — items far above level are intentionally rare
- Rarity multipliers affect both ATK and DEF on gear
