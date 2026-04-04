// Tavern NPC data — dialogue trees, relationships, and quest hints

export const TAVERN_NPCS = [
  {
    id: 'bartender',
    name: 'Grog Ironflask',
    role: 'Tavern Keep',
    color: '#d4956a',
    greeting: "Welcome to the Dusty Flagon! Pull up a stool. I hear everything that goes on in this town — and beyond.",
    topics: [
      {
        id: 'quests',
        label: 'Any work going?',
        lines: [
          "There's always trouble brewing out in the wilds. Rats in the sewers, wolves on the roads... the usual.",
          "If you're looking for real coin, head to the quest villages. Traders there always need capable hands.",
          "I heard something stirring deep in the Neon District. Byte the Fixer was asking about adventurers.",
        ],
      },
      {
        id: 'relationships',
        label: 'Tell me about the regulars',
        lines: [
          "See that hooded woman in the corner? That's Whisper. She knows things — dangerous things. Don't cross her.",
          "Old Fenwick's been coming here since before I took over. Harmless, mostly. Just don't get him started on dragons.",
          "Mira over there is a wandering merchant. Sharp eye for rare goods. She and Whisper don't get along — some old rivalry.",
          "Captain Thorne stops by when he's off duty. Good man, but haunted by something he won't talk about.",
        ],
      },
      {
        id: 'rumors',
        label: 'Heard any rumors?',
        lines: [
          "They say there's a hidden dungeon beneath the old ruins. Nobody who's gone in has come back... yet.",
          "A trader came through last week babbling about dragon sightings in the northern peaks.",
          "The market's been volatile lately. Someone's been hoarding rare materials — driving prices up.",
          "Word is, the Arena's getting a new champion soon. Some foreigner with strange magic.",
        ],
      },
    ],
  },
  {
    id: 'whisper',
    name: 'Whisper',
    role: 'Information Broker',
    color: '#9b59b6',
    greeting: "...You want information? Everything has a price. But I'll give you a taste, since Grog seems to trust you.",
    topics: [
      {
        id: 'quests',
        label: 'Know about any jobs?',
        lines: [
          "Jobs? I deal in secrets, not errands. But... there are things in the shadows that need dealing with.",
          "The quest villages hide more than they show. Complete enough tasks and you'll find the real opportunities.",
          "There's a bounty on certain rare monsters. The payout is substantial — if you survive.",
        ],
      },
      {
        id: 'relationships',
        label: 'Who do you know?',
        lines: [
          "Grog thinks he runs this place. He does — but only because I let him. We have an... arrangement.",
          "Mira and I worked together once. She betrayed my trust over a shipment of enchanted ore. I don't forget.",
          "Fenwick knows more about the old world than he lets on. His 'senile old man' act doesn't fool me.",
          "Captain Thorne owes me a favor. A big one. He knows I'll collect when the time is right.",
        ],
      },
      {
        id: 'secrets',
        label: 'Tell me a secret',
        lines: [
          "The shopkeepers rotate their best stock. Visit at different times and you'll find different deals.",
          "Certain monsters only appear in specific weather. Pay attention to the sky.",
          "Your base holds more potential than you think. The deeper you upgrade, the more you unlock.",
          "There's a pattern to the extraordinary traders. Learn it, and you'll never miss a rare deal again.",
        ],
      },
    ],
  },
  {
    id: 'fenwick',
    name: 'Old Fenwick',
    role: 'Retired Adventurer',
    color: '#e67e22',
    greeting: "Eh? Another young adventurer! Sit down, sit down. Let old Fenwick tell you a thing or two about the world.",
    topics: [
      {
        id: 'quests',
        label: 'Any advice for quests?',
        lines: [
          "Back in my day, we didn't have fancy quest boards. We just walked into the wilderness and hoped for the best!",
          "Always check your potions before a big fight. I once faced a dragon with nothing but a bread roll and courage.",
          "The bosses in each region guard something valuable. Don't skip them — the rewards are worth the bruises.",
        ],
      },
      {
        id: 'relationships',
        label: 'Who were you back in the day?',
        lines: [
          "I was the best swordsman in three regions! ...Or was it two? The memory's not what it used to be.",
          "Grog's father ran this tavern before him. Good man. I taught him everything he knows about adventuring.",
          "Whisper thinks I'm a fool. Let her. I've survived things she can't imagine because I know when to play dumb.",
          "Mira reminds me of my old partner — always chasing the next treasure. I hope she fares better than he did.",
        ],
      },
      {
        id: 'stories',
        label: 'Tell me a story',
        lines: [
          "Did I ever tell you about the Ghost of Greyhollow? Twelve rows of teeth and a wail that'd freeze your blood!",
          "Once found a chest in a dungeon that screamed when you opened it. Still had great loot though!",
          "The dragon of the northern peaks? I've seen it. Beautiful and terrifying. It spoke to me — said the world was changing.",
          "There used to be more quest villages. Some vanished overnight. Nobody knows why... or nobody's willing to say.",
        ],
      },
    ],
  },
  {
    id: 'mira',
    name: 'Mira Goldspark',
    role: 'Wandering Merchant',
    color: '#f1c40f',
    greeting: "Ah, a fellow traveler! I've been to every corner of this land. Looking to trade stories — or something more valuable?",
    topics: [
      {
        id: 'quests',
        label: 'Where should I explore?',
        lines: [
          "The lower-level regions might seem boring, but they're loaded with materials you'll need later. Trust me.",
          "Quest villages reward loyalty. Keep coming back and the traders start offering their best stuff.",
          "If you're strong enough, the Arena is where the real prizes are. Risk and reward, my friend.",
        ],
      },
      {
        id: 'relationships',
        label: 'Who do you trade with?',
        lines: [
          "Grog buys my surplus stock sometimes. He waters down the ale, but he's honest where it counts.",
          "Whisper and I had a falling out. She says I betrayed her — I say I survived. There's a difference.",
          "Old Fenwick once sold me a 'magic' sword that turned out to be a rusty heirloom. I still made a profit reselling it!",
          "Captain Thorne has connections in the military supply chain. Very useful for rare equipment.",
        ],
      },
      {
        id: 'trading',
        label: 'Trading tips?',
        lines: [
          "Buy low in the market, sell high at the shop. Patience is the merchant's greatest weapon.",
          "Building materials are always in demand. Stockpile them when prices dip.",
          "The featured shop rotates daily. Some days the deals are incredible — check it every day.",
          "Pet items are a niche market, but the margins are fantastic if you find the right buyer.",
        ],
      },
    ],
  },
  {
    id: 'thorne',
    name: 'Captain Thorne',
    role: 'Off-Duty Guard',
    color: '#3498db',
    greeting: "At ease, adventurer. I'm off the clock. But if you've got questions about the dangers out there, I'm your man.",
    topics: [
      {
        id: 'quests',
        label: 'What threats are out there?',
        lines: [
          "The monster population has been surging. We're stretched thin — that's why we rely on adventurers like you.",
          "Boss monsters are getting stronger. My scouts report new ones appearing in regions we thought were cleared.",
          "If you're heading into dangerous territory, make sure your gear is up to par. No shame in retreating to restock.",
        ],
      },
      {
        id: 'relationships',
        label: 'How do you know the others?',
        lines: [
          "Grog and I go way back. He's saved my hide more than once with a well-timed drink and a listening ear.",
          "Whisper... she has information I need. But dealing with her is like handling a venomous snake — carefully.",
          "Old Fenwick trained half the adventurers in this town, including me. He won't admit it, but he misses the action.",
          "Mira supplies my off-duty squad with equipment. Fair prices, but always haggle — it's what she expects.",
        ],
      },
      {
        id: 'combat',
        label: 'Combat advice?',
        lines: [
          "Know your class strengths. A warrior who tries to be a mage is a dead warrior.",
          "Skills can turn the tide of any battle. Invest in them early and practice the timing.",
          "Don't neglect defense. I've seen too many adventurers go full attack and get one-shot by a boss.",
          "Pets aren't just cute companions. A well-trained pet can mean the difference between victory and defeat.",
        ],
      },
    ],
  },
];
