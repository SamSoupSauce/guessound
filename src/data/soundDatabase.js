export const SOUND_CATEGORIES = {
  workoutVsDaily: {
    id: 'workoutVsDaily',
    name: 'Workout vs Daily Life',
    color: '#FF2E93',
    icon: '💪',
  },
  fitnessComedy: {
    id: 'fitnessComedy',
    name: 'Gym & Comedy',
    color: '#FFBE0B',
    icon: '😂',
  },
  kitchenFood: {
    id: 'kitchenFood',
    name: 'Kitchen & ASMR',
    color: '#00F0FF',
    icon: '🍳',
  },
  animalsNature: {
    id: 'animalsNature',
    name: 'Creatures & Nature',
    color: '#00E676',
    icon: '🐾',
  },
  unexpectedMystery: {
    id: 'unexpectedMystery',
    name: 'Mystery Wildcard',
    color: '#9D4EDD',
    icon: '❓',
  },
};

export const SOUND_DATABASE = [
  {
    id: 'sq_01',
    title: 'Heavy Panting & Sudden Groan',
    soundHint: 'Sounds like intense stamina output and agonizing breath control...',
    category: 'workoutVsDaily',
    synthPreset: 'panting_groan',
    options: [
      'High-Intensity Crossfit Burpees',
      'Blowing up a Giant Pool Flamingo',
      'Running Away from a Tiny Chihuahua',
      'Trying to Open a Jammed Pickle Jar',
    ],
    correctIndex: 1,
    revealTitle: 'Inflating a Giant Pool Flamingo!',
    revealExplanation:
      'No gym required! Just pure lung power trying to manually inflate a 6-foot inflatable pink flamingo before pool party guests arrive.',
    funFact:
      'Blowing up a pool float burns roughly 15 calories and 100% of your remaining dignity.',
    sceneGlb: '/models/pool_flamingo.glb',
    sceneModel: 'pool_flamingo',
    difficulty: 1,
  },
  {
    id: 'sq_02',
    title: 'Rapid Slapping & Squeaking',
    soundHint: 'Rhythmic, high-frequency wet impact sounds with squeaks...',
    category: 'workoutVsDaily',
    synthPreset: 'flip_flops',
    options: [
      'Professional Boxing Speedbag',
      'Running with Wet Flip-Flops',
      'Squeegeeing a High-Rise Window',
      'Intense Ping Pong Rally',
    ],
    correctIndex: 1,
    revealTitle: 'Sprinting with Wet Flip-Flops!',
    revealExplanation:
      'That lightning-fast cadence wasn\'t Muhammad Ali on the speedbag—it was someone in soaked flip-flops rushing across tiled flooring!',
    funFact:
      'The iconic "flip-flop" sound produces acoustic frequencies between 300Hz and 1200Hz upon heel impact.',
    sceneGlb: '/models/flip_flops.glb',
    sceneModel: 'flip_flops',
    difficulty: 1,
  },
  {
    id: 'sq_03',
    title: 'Primal Roar & Heavy Thud',
    soundHint: 'A sudden deep warrior roar followed by a catastrophic thud...',
    category: 'fitnessComedy',
    synthPreset: 'stubbed_toe',
    options: [
      '500lb Deadlift New Personal Record',
      'Stubbing Pinky Toe on Coffee Table',
      'Lumberjack Chopping Ancient Redwood',
      'Wrestler Body-Slamming Mat',
    ],
    correctIndex: 1,
    revealTitle: 'Stubbed Pinky Toe on Coffee Table!',
    revealExplanation:
      'The decibel level matched a world-record powerlifter, but it was just a wooden coffee table corner meeting an innocent toe in the dark.',
    funFact:
      'Stubbing your toe triggers rapid pain signals along A-delta nerve fibers at over 40 mph!',
    sceneGlb: '/models/stubbed_toe.glb',
    sceneModel: 'stubbed_toe',
    difficulty: 2,
  },
  {
    id: 'sq_04',
    title: 'Rhythmic Squeak & Spring Bounce',
    soundHint: 'Repetitive high-pitched squeaks on a bouncy rhythm...',
    category: 'fitnessComedy',
    synthPreset: 'squeaky_duck',
    options: [
      'Olympic Trampoline Routine',
      'Rusty Motel Bed Spring',
      'Dog Chomping a Rubber Squeaky Duck',
      'New Basketball Shoes on Fresh Polish',
    ],
    correctIndex: 2,
    revealTitle: 'Overjoyed Dog with Rubber Duck!',
    revealExplanation:
      'An excited golden retriever discovering a fresh squeaky toy and testing its structural integrity at 180 squeaks per minute.',
    funFact:
      'Dogs love squeaky toys because the sound mimics small game instincts in their ancestral biology.',
    sceneGlb: '/models/squeaky_dog.glb',
    sceneModel: 'squeaky_dog',
    difficulty: 1,
  },
  {
    id: 'sq_05',
    title: 'Crispy Crackle & Rapid Popping',
    soundHint: 'Intense hissing, popping crackles, and sizzle wave...',
    category: 'kitchenFood',
    synthPreset: 'bacon_sizzle',
    options: [
      'Thick Bacon on Cast-Iron Skillet',
      'Heavy Torrential Rain on Tin Roof',
      'Campfire Pine Log Exploding',
      'Giant Roll of Bubble Wrap',
    ],
    correctIndex: 0,
    revealTitle: 'Crispy Bacon in Cast-Iron Pan!',
    revealExplanation:
      'The ultimate audio illusion: skillet bacon sizzle shares an acoustic sound spectrum nearly identical to heavy rain on a rooftop!',
    funFact:
      'Foley sound designers in Hollywood frequently use sizzling bacon audio to simulate rainstorms and forest fires.',
    sceneGlb: '/models/sizzling_bacon.glb',
    sceneModel: 'sizzling_bacon',
    difficulty: 2,
  },
  {
    id: 'sq_06',
    title: 'Deep Rhythmic Buzz & Vibration',
    soundHint: 'Low frequency mechanical thrum with pulsing velocity...',
    category: 'fitnessComedy',
    synthPreset: 'massage_gun',
    options: [
      'Deep Tissue Massage Gun on Quads',
      'Modified Turbo V8 Muscle Car',
      'Commercial Espresso Milk Steamer',
      'Electric Lawn Trimmer in Thick Grass',
    ],
    correctIndex: 0,
    revealTitle: 'Massage Gun on Tight Muscles!',
    revealExplanation:
      'Operating at 3200 percussions per minute, this handheld recovery beast shakes everything in a 5-meter radius.',
    funFact:
      'Percussive therapy was popularized in 2008 by a chiropractor recovering from a motorcycle injury.',
    sceneGlb: '/models/massage_gun.glb',
    sceneModel: 'massage_gun',
    difficulty: 2,
  },
  {
    id: 'sq_07',
    title: 'Rhythmic Pumping Whoosh',
    soundHint: 'Repetitive air compression stroke and release...',
    category: 'workoutVsDaily',
    synthPreset: 'bike_pump',
    options: [
      'Olympic Rowing Machine (Ergometer)',
      'Emergency Bicycle Tire Hand Pump',
      'Blacksmith Accordion Bellows',
      'Darth Vader Breathing Replica',
    ],
    correctIndex: 1,
    revealTitle: 'Panic-Pumping a Flat Bike Tire!',
    revealExplanation:
      'Racing against time with a miniature 6-inch hand pump before the morning commute bus arrives.',
    funFact:
      'Pumping a standard mountain bike tire with a mini hand pump takes between 300 to 500 hand strokes!',
    sceneGlb: '/models/bike_pump.glb',
    sceneModel: 'bike_pump',
    difficulty: 2,
  },
  {
    id: 'sq_08',
    title: 'High-Tension Snap & Whoosh',
    soundHint: 'Tension building, subtle stretching hum, then BAM!',
    category: 'workoutVsDaily',
    synthPreset: 'band_snap',
    options: [
      'Heavy Latex Resistance Band Snapping',
      'Archery Longbow Release',
      'Bass Guitar Slap Solo',
      'Leather Belt Whack',
    ],
    correctIndex: 0,
    revealTitle: 'Resistance Band Snap Catastrophe!',
    revealExplanation:
      'The treacherous gym rubber band slipped off the sneaker sole and catapulted straight into the living room blinds!',
    funFact:
      'Snapping elastic bands can reach exit velocities of over 60 mph (96 km/h).',
    sceneGlb: '/models/resistance_band.glb',
    sceneModel: 'resistance_band',
    difficulty: 1,
  },
  {
    id: 'sq_09',
    title: 'Wet Squish & Sticky Suction',
    soundHint: 'Unsettling squishy churn and rhythmic bubbling...',
    category: 'kitchenFood',
    synthPreset: 'mac_cheese',
    options: [
      'Trekking Through Deep Mud Swamp',
      'Heavy Duty Toilet Plunger in Action',
      'Stirring Ultra-Cheesy Macaroni',
      'Kneading Wet Sourdough Bread',
    ],
    correctIndex: 2,
    revealTitle: 'Stirring a Giant Pot of Mac & Cheese!',
    revealExplanation:
      'Nothing scandalous here—just 4 cups of melted cheddar and heavy cream being energetically folded into hot elbow pasta.',
    funFact:
      'Mac and cheese audio is commonly ranked as one of the most polarizing ASMR triggers in sound testing studies.',
    sceneGlb: '/models/mac_and_cheese.glb',
    sceneModel: 'mac_and_cheese',
    difficulty: 1,
  },
  {
    id: 'sq_10',
    title: 'Rapid Clickety-Clack Gallop',
    soundHint: 'Dozens of tiny rhythmic tap clicks on hardwood...',
    category: 'animalsNature',
    synthPreset: 'dog_taps',
    options: [
      'Professional Irish Step Dancers',
      'Dog Doing Happy Dinner Tap Dance',
      'Speed Typist on Mechanical Keyboard',
      'Shuffling Plastic Poker Chips',
    ],
    correctIndex: 1,
    revealTitle: 'Excited Dog Waiting for Dinner!',
    revealExplanation:
      'When the kibble bowl clinks, those doggie toenails ignite into an Olympic-level tap dance celebration.',
    funFact:
      'Dogs tap dance their front paws (known as "happy feet") when dopamine rushes through their anticipation receptors.',
    sceneGlb: '/models/dog_tippytaps.glb',
    sceneModel: 'dog_tippytaps',
    difficulty: 1,
  },
];

export function getRandomQuestions(count = 5, category = null) {
  let pool = category && category !== 'unexpectedMystery'
    ? SOUND_DATABASE.filter((q) => q.category === category)
    : [...SOUND_DATABASE];
  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}
