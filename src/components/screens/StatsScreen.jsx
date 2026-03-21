import { REGIONS } from '../../data/gameData';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function StatRow({ label, value }) {
  return (
    <div className="stats-screen-row">
      <span className="stats-screen-label">{label}</span>
      <span className="stats-screen-value">{formatNumber(value)}</span>
    </div>
  );
}

function StatGroup({ title, items }) {
  return (
    <div className="stats-screen-group">
      <div className="stats-screen-group-title">{title}</div>
      {items.map(item => (
        <StatRow key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

export default function StatsScreen({ stats, player, discoveredItemLocations, onBack }) {
  const s = stats || {};

  // Count unique monsters killed (keys like killed_rat, killed_slime, etc.)
  const uniqueMonsters = Object.keys(s).filter(k => k.startsWith('killed_') && s[k] > 0).length;

  // Count unique item locations discovered
  const discoveredItems = Object.keys(discoveredItemLocations || {}).length;
  const totalDiscoveredLocations = new Set(
    Object.values(discoveredItemLocations || {}).flat()
  ).size;

  // All locations across all regions
  const totalLocations = REGIONS.reduce((sum, r) => sum + (r.locations?.length || 0), 0);
  const totalRegions = REGIONS.length;

  // Win rate
  const totalBattles = (s.battlesWon || 0) + (s.battlesLost || 0) + (s.battlesRun || 0);
  const winRate = totalBattles > 0 ? Math.round((s.battlesWon || 0) / totalBattles * 100) : 0;

  // Kill/death ratio
  const kdr = (s.deaths || 0) > 0
    ? ((s.monstersKilled || 0) / s.deaths).toFixed(1)
    : (s.monstersKilled || 0) > 0 ? '\u221E' : '0';

  // Average damage per turn
  const avgDmgPerTurn = (s.totalTurns || 0) > 0
    ? Math.round((s.damageDealt || 0) / s.totalTurns)
    : 0;

  // Net gold (earned - spent)
  const netGold = (s.goldEarned || 0) - (s.goldSpent || 0);

  // Equipment count
  const equippedCount = Object.values(player?.equipment || {}).filter(Boolean).length;
  const inventoryCount = player?.inventory?.length || 0;

  const groups = [
    {
      title: 'Combat',
      items: [
        { label: 'Monsters Killed', value: s.monstersKilled || 0 },
        { label: 'Unique Monsters Slain', value: uniqueMonsters },
        { label: 'Bosses Killed', value: s.bossesKilled || 0 },
        { label: 'Battles Won', value: s.battlesWon || 0 },
        { label: 'Battles Lost', value: s.battlesLost || 0 },
        { label: 'Battles Fled', value: s.battlesRun || 0 },
        { label: 'Win Rate', value: winRate + '%' },
        { label: 'Deaths', value: s.deaths || 0 },
        { label: 'K/D Ratio', value: kdr },
        { label: 'Total Battle Turns', value: s.totalTurns || 0 },
      ],
    },
    {
      title: 'Damage',
      items: [
        { label: 'Damage Dealt', value: s.damageDealt || 0 },
        { label: 'Damage Taken', value: s.damageTaken || 0 },
        { label: 'Highest Single Hit', value: s.highestDamage || 0 },
        { label: 'Avg Damage/Turn', value: avgDmgPerTurn },
        { label: 'Total Healing', value: s.totalHealing || 0 },
        { label: 'Critical Hits', value: s.criticalHits || 0 },
        { label: 'Dodges Performed', value: s.dodgesPerformed || 0 },
        { label: 'Combos Triggered', value: s.comboTriggered || 0 },
      ],
    },
    {
      title: 'Skills & Abilities',
      items: [
        { label: 'Class Skills Used', value: s.skillsUsed || 0 },
        { label: 'Universal Skills Used', value: s.universalSkillsUsed || 0 },
        { label: 'Skills Unlocked', value: s.skillsUnlocked || 0 },
        { label: 'Potions Used', value: s.potionsUsed || 0 },
      ],
    },
    {
      title: 'Economy',
      items: [
        { label: 'Gold Earned (Total)', value: s.goldEarned || 0 },
        { label: 'Gold Spent (Total)', value: s.goldSpent || 0 },
        { label: 'Net Gold', value: netGold },
        { label: 'Gold from Monsters', value: s.goldFromMonsters || 0 },
        { label: 'Gold from Chests', value: s.goldFromChests || 0 },
        { label: 'Gold from Quests', value: s.goldFromQuests || 0 },
        { label: 'Current Gold', value: player?.gold || 0 },
      ],
    },
    {
      title: 'Items',
      items: [
        { label: 'Items Looted', value: s.itemsLooted || 0 },
        { label: 'Items Sold', value: s.itemsSold || 0 },
        { label: 'Items Bought', value: s.itemsBought || 0 },
        { label: 'Chests Opened', value: s.chestsOpened || 0 },
        { label: 'Swords Found', value: s.swordsLooted || 0 },
        { label: 'Armor Found', value: s.armorsLooted || 0 },
        { label: 'Shields Found', value: s.shieldsLooted || 0 },
        { label: 'Helmets Found', value: s.helmetsLooted || 0 },
        { label: 'Rings Found', value: s.ringsLooted || 0 },
        { label: 'Potions Found', value: s.potionsLooted || 0 },
        { label: 'Boots Found', value: s.bootsLooted || 0 },
        { label: 'Gloves Found', value: s.glovesLooted || 0 },
        { label: 'Capes Found', value: s.capesLooted || 0 },
        { label: 'Belts Found', value: s.beltsLooted || 0 },
        { label: 'Amulets Found', value: s.amuletsLooted || 0 },
        { label: 'Accessories Found', value: s.accessoriesLooted || 0 },
        { label: 'Energy Drinks Found', value: s.energyDrinksLooted || 0 },
        { label: 'Currently Equipped', value: equippedCount },
        { label: 'Inventory Items', value: inventoryCount },
      ],
    },
    {
      title: 'Exploration',
      items: [
        { label: 'Explorations Completed', value: s.explorationsCompleted || 0 },
        { label: 'Regions Visited', value: s.regionsVisited || 0 },
        { label: 'Locations Entered', value: s.locationsExplored || 0 },
        { label: 'Total Regions', value: totalRegions },
        { label: 'Total Locations', value: totalLocations },
        { label: 'Unique Items Discovered', value: discoveredItems },
        { label: 'Item Source Locations', value: totalDiscoveredLocations },
      ],
    },
    {
      title: 'Progression',
      items: [
        { label: 'Current Level', value: player?.level || 1 },
        { label: 'Levels Gained', value: s.levelsGained || 0 },
        { label: 'Quests Claimed', value: s.questsClaimed || 0 },
        { label: 'Times Rested', value: s.timesRested || 0 },
        { label: 'Pets Found', value: s.petsFound || 0 },
      ],
    },
  ];

  return (
    <div className="screen screen-stats">
      <div className="screen-header">Player Stats</div>
      <div className="stats-screen-grid">
        {groups.map(group => (
          <StatGroup key={group.title} title={group.title} items={group.items} />
        ))}
      </div>
      <button className="btn btn-back" onClick={onBack}>Back</button>
    </div>
  );
}
