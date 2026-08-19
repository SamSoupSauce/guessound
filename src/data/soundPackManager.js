import { SOUND_CATEGORIES, SOUND_DATABASE } from './soundDatabase.js';

export const PACK_SCHEMA_VERSION = '1.1.0';
export const DEFAULT_PACK_REVISION = 3;
export const CACHE_VERSION_KEY = 'guessound_cache_version_v1_1_2';

const STORAGE_PACKS_KEY = 'guessound_sound_packs_v2';
const STORAGE_ACTIVE_PACK_KEY = 'guessound_active_pack_id_v2';
const LEGACY_STORAGE_PACKS_KEY = 'sexercise_sound_packs_v1';
const LEGACY_STORAGE_ACTIVE_KEY = 'sexercise_active_pack_id_v1';

export const BUILTIN_PACKS = [
  {
    id: 'default_sexercise',
    name: 'Sexercise & Everyday Foley (Original)',
    description: 'The iconic deceptive sounds: workout grunts vs pool floats, flip-flops, stubbed toes, and rubber ducks.',
    author: 'Sexercise Team',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '🎧',
    timerSeconds: 15,
    isBuiltIn: true,
    categories: SOUND_CATEGORIES,
    sounds: SOUND_DATABASE.map(s => ({ ...s, timerSeconds: 15 })),
  },
  {
    id: 'kitchen_asmr_pack',
    name: 'Kitchen, Food & ASMR Illusions',
    description: 'Sizzling bacon vs rainstorms, cheesy mac churn, soda can fizz, and mouth-watering acoustic tricks.',
    author: 'Chef Sonic',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '🍳',
    timerSeconds: 14,
    isBuiltIn: true,
    categories: {
      kitchenFood: SOUND_CATEGORIES.kitchenFood,
      unexpectedMystery: SOUND_CATEGORIES.unexpectedMystery,
    },
    sounds: [
      {
        id: 'kasmr_01',
        title: 'Crispy Crackle & Rapid Popping',
        soundHint: 'Intense hissing, popping crackles, and sizzle wave...',
        category: 'kitchenFood',
        synthPreset: 'bacon_sizzle',
        timerSeconds: 14,
        options: [
          'Thick Bacon on Cast-Iron Skillet',
          'Heavy Torrential Rain on Tin Roof',
          'Campfire Pine Log Exploding',
          'Giant Roll of Bubble Wrap',
        ],
        correctIndex: 0,
        revealTitle: 'Crispy Bacon in Cast-Iron Pan!',
        revealExplanation:
          'Skillet bacon sizzle shares an acoustic frequency spectrum nearly identical to heavy rain on a metal roof!',
        funFact: 'Foley sound artists often record sizzling bacon when films need rainstorm soundscapes.',
        sceneModel: 'sizzling_bacon',
        difficulty: 1,
      },
      {
        id: 'kasmr_02',
        title: 'Wet Squish & Sticky Suction',
        soundHint: 'Unsettling squishy churn and bubbling suction...',
        category: 'kitchenFood',
        synthPreset: 'mac_cheese',
        timerSeconds: 14,
        options: [
          'Trekking Through Deep Mud Swamp',
          'Toilet Plunger in Action',
          'Stirring Ultra-Cheesy Macaroni',
          'Kneading Wet Sourdough Bread',
        ],
        correctIndex: 2,
        revealTitle: 'Stirring a Giant Pot of Mac & Cheese!',
        revealExplanation:
          'Nothing scandalous—just melted cheddar and heavy cream folded vigorously into hot elbow pasta.',
        funFact: 'Mac and cheese audio ranks as one of the most polarizing ASMR triggers worldwide.',
        sceneModel: 'mac_and_cheese',
        difficulty: 1,
      },
      {
        id: 'kasmr_03',
        title: 'Sharp Pop & Carbonated Fizz Wave',
        soundHint: 'Metallic snap followed by pressurized bubbling hiss...',
        category: 'kitchenFood',
        synthPreset: 'soda_pop',
        timerSeconds: 12,
        options: [
          'Popping Cold Soda Can on Hot Day',
          'Spaceship Air Lock Depressurizing',
          'Opening Vacuum-Sealed Tennis Balls',
          'Bursting a Party Balloon',
        ],
        correctIndex: 0,
        revealTitle: 'Cracking Open an Ice-Cold Soda Can!',
        revealExplanation:
          'Aluminum pull-tab release venting 45 PSI of carbon dioxide micro-bubbles.',
        funFact: 'The audible pop comes from the sudden speed-of-sound pressure equalization inside the can.',
        sceneModel: 'soda_can',
        difficulty: 1,
      },
      {
        id: 'kasmr_04',
        title: 'High Pressure Steam Hiss & Gurgle',
        soundHint: 'Rising acoustic pressure, high-pitched hiss, then milk vortex gurgle...',
        category: 'kitchenFood',
        synthPreset: 'bike_pump',
        timerSeconds: 14,
        options: [
          'Commercial Espresso Machine Steam Wand',
          'Hot Air Balloon Burner Ignite',
          'Car Radiator Overheating',
          'Dry Ice Sublimating in Warm Water',
        ],
        correctIndex: 0,
        revealTitle: 'Commercial Espresso Steam Wand!',
        revealExplanation:
          'Injecting dry steam at 1.5 bars of pressure into cold whole milk to create microfoam for a latte.',
        funFact: 'Steam wands heat milk from 4°C to 65°C in under 12 seconds.',
        sceneModel: 'bike_pump',
        difficulty: 2,
      },
      {
        id: 'kasmr_05',
        title: 'Rapid Clattering Slices',
        soundHint: 'Super-fast rhythmic chopping knife taps against wood...',
        category: 'kitchenFood',
        synthPreset: 'dog_taps',
        timerSeconds: 14,
        options: [
          'Tap Dancer Doing Flash Footwork',
          'Sushi Chef Finely Slicing Scallions',
          'Mechanical Keyboard Speedtest 160 WPM',
          'Shuffling Blackjack Decks',
        ],
        correctIndex: 1,
        revealTitle: 'Master Chef Slicing Scallions!',
        revealExplanation:
          'A Japanese santoku knife slicing a bundle of green onions at 300 cuts per minute.',
        funFact: 'Professional sushi chefs practice blindfolded chopping rhythm to maintain perfect slice widths.',
        sceneModel: 'dog_tippytaps',
        difficulty: 2,
      },
    ],
  },
  {
    id: 'gym_mayhem_pack',
    name: 'Gym & Extreme Action Mayhem',
    description: 'High-intensity athletic blunders, snapping resistance bands, heavy kettlebell drops, and PR screams.',
    author: 'Iron Foley',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '💪',
    timerSeconds: 12,
    isBuiltIn: true,
    categories: {
      workoutVsDaily: SOUND_CATEGORIES.workoutVsDaily,
      fitnessComedy: SOUND_CATEGORIES.fitnessComedy,
    },
    sounds: [
      {
        id: 'gym_01',
        title: 'High-Tension Snap & Whoosh',
        soundHint: 'Tension building, subtle stretching hum, then BAM!',
        category: 'workoutVsDaily',
        synthPreset: 'band_snap',
        timerSeconds: 12,
        options: [
          'Heavy Latex Resistance Band Snapping',
          'Archery Longbow Release',
          'Bass Guitar Slap Solo',
          'Leather Belt Whack',
        ],
        correctIndex: 0,
        revealTitle: 'Resistance Band Snap Catastrophe!',
        revealExplanation:
          'The treacherous gym rubber band slipped off the sneaker sole and catapulted into the living room blinds!',
        funFact: 'Snapping elastic bands can reach exit velocities of over 60 mph (96 km/h).',
        sceneModel: 'resistance_band',
        difficulty: 1,
      },
      {
        id: 'gym_02',
        title: 'Deep Rhythmic Buzz & Vibration',
        soundHint: 'Low frequency mechanical thrum with pulsing velocity...',
        category: 'fitnessComedy',
        synthPreset: 'massage_gun',
        timerSeconds: 12,
        options: [
          'Deep Tissue Massage Gun on Quads',
          'Modified Turbo V8 Muscle Car',
          'Commercial Espresso Steamer',
          'Electric Lawn Trimmer in Thick Grass',
        ],
        correctIndex: 0,
        revealTitle: 'Massage Gun on Tight Muscles!',
        revealExplanation:
          'Operating at 3200 percussions per minute, this handheld recovery beast shakes everything in a 5-meter radius.',
        funFact: 'Percussive therapy was popularized in 2008 by a chiropractor recovering from a motorcycle injury.',
        sceneModel: 'massage_gun',
        difficulty: 1,
      },
      {
        id: 'gym_03',
        title: 'Primal Roar & Heavy Thud',
        soundHint: 'A sudden deep warrior roar followed by a catastrophic thud...',
        category: 'fitnessComedy',
        synthPreset: 'stubbed_toe',
        timerSeconds: 14,
        options: [
          '500lb Deadlift New Personal Record',
          'Stubbing Pinky Toe on Coffee Table',
          'Lumberjack Chopping Ancient Redwood',
          'Wrestler Body-Slamming Mat',
        ],
        correctIndex: 1,
        revealTitle: 'Stubbed Pinky Toe on Coffee Table!',
        revealExplanation:
          'The decibel level matched a world-record powerlifter, but it was just a wooden coffee table corner meeting an innocent toe.',
        funFact: 'Stubbing your toe triggers rapid pain signals along A-delta nerve fibers at over 40 mph!',
        sceneModel: 'stubbed_toe',
        difficulty: 2,
      },
      {
        id: 'gym_04',
        title: 'Earth-Shaking Sub-Bass Thump',
        soundHint: 'Low rumble, catastrophic floor reverberation...',
        category: 'workoutVsDaily',
        synthPreset: 'heavy_thud',
        timerSeconds: 12,
        options: [
          'Dropping 70lb Cast-Iron Kettlebell on Floor',
          'Exploding Firecracker in Trash Can',
          'Bowling Strike Impact',
          'Slamming Heavy Vault Door',
        ],
        correctIndex: 0,
        revealTitle: 'Dropping Heavy Kettlebell on Floor!',
        revealExplanation:
          'Grip fatigue set in on rep 20 of kettlebell swings, creating a mini seismic event in the downstairs apartment.',
        funFact: 'Gym rubber flooring absorbs only about 40% of peak kinetic impact energy.',
        sceneModel: 'kettlebell_thud',
        difficulty: 2,
      },
    ],
  },
  {
    id: 'wild_creatures_pack',
    name: 'Wild Creatures & Pet Shenanigans',
    description: 'Excited puppy tap dances, angry cat hissing, frantic woodpecker drumming, and animal comedy.',
    author: 'Dr. Beast',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '🐾',
    timerSeconds: 15,
    isBuiltIn: true,
    categories: {
      animalsNature: SOUND_CATEGORIES.animalsNature,
      unexpectedMystery: SOUND_CATEGORIES.unexpectedMystery,
    },
    sounds: [
      {
        id: 'pet_01',
        title: 'Rapid Midnight Tippy-Taps',
        soundHint: 'High-frequency rhythmic clicks skipping across hard floor...',
        category: 'animalsNature',
        synthPreset: 'dog_taps',
        timerSeconds: 15,
        options: [
          'Excited Dog Tap-Dancing for Dinner',
          'Riverdance Tap Troupe Practice',
          'Hailstorm on Skylight Window',
          'Office Worker Typing 140 WPM',
        ],
        correctIndex: 0,
        revealTitle: 'Happy Golden Retriever Tippy-Taps!',
        revealExplanation:
          'The exact acoustic signature of a dog who just saw the treat canister open.',
        funFact: 'Canine claw clicks on wood average 1400 Hz acoustic resonance.',
        sceneModel: 'dog_tippytaps',
        difficulty: 1,
      },
      {
        id: 'pet_02',
        title: 'Fierce Air Leak & Warning Sibilance',
        soundHint: 'High-pitched pressurized hiss with sharp aggressive timbre...',
        category: 'animalsNature',
        synthPreset: 'cat_angry_hiss',
        timerSeconds: 14,
        options: [
          'Angry Cat Spotting a Cucumber',
          'Pneumatic Bus Air Brake Release',
          'Steaming Espresso Wand Flush',
          'Blowtorch Ignition',
        ],
        correctIndex: 0,
        revealTitle: 'Cat Arching Back & Hissing!',
        revealExplanation:
          'A feline defending the couch against the terrifying threat of an innocent robotic vacuum cleaner.',
        funFact: 'Cats mimic snake hissing acoustics as an evolutionary defense mechanism against predators.',
        sceneModel: 'cat_hiss',
        difficulty: 2,
      },
      {
        id: 'pet_03',
        title: 'High-Speed Jackhammer Taps',
        soundHint: 'Rapid bursts of wooden impacts at machine-gun tempo...',
        category: 'animalsNature',
        synthPreset: 'woodpecker_peck',
        timerSeconds: 15,
        options: [
          'Woodpecker Drumming on Hollow Tree',
          'Construction Impact Wrench on Steel',
          'Pneumatic Nail Gun on Rooftop',
          'Speed Bag Boxing Champion',
        ],
        correctIndex: 0,
        revealTitle: 'Woodpecker Drumming on Tree Trunk!',
        revealExplanation:
          'Pecking at up to 20 strikes per second to establish territory and hunt for wood-boring insects.',
        funFact: 'Woodpecker skulls experience up to 1,200 Gs of deceleration with each strike unharmed.',
        sceneModel: 'woodpecker_tree',
        difficulty: 2,
      },
      {
        id: 'pet_04',
        title: 'High-Pitched Rubber Squeaks',
        soundHint: 'High-frequency chirp with sudden rubber rebound...',
        category: 'animalsNature',
        synthPreset: 'squeaky_duck',
        timerSeconds: 14,
        options: [
          'Dog Frantically Chewing Squeaky Duck Toy',
          'Window Cleaner Squeegee on Glass',
          'Sneakers Squeaking on Basketball Court',
          'Dolphin Echolocation Whistle',
        ],
        correctIndex: 0,
        revealTitle: 'Dog Chewing Squeaky Duck!',
        revealExplanation:
          'Pure canine obsession testing the durability of a 99-cent yellow squeaker toy.',
        funFact: 'Dogs love squeaky toys because the sound mimics small prey in ancestral hunting instincts.',
        sceneModel: 'squeaky_dog',
        difficulty: 1,
      },
    ],
  },
  {
    id: 'garage_machines_pack',
    name: 'Garage, Machines & Workshop Chaos',
    description: 'High-RPM chainsaw revs, tire pump sprints, pneumatic hiss, and workbench accidents.',
    author: 'Gearhead Foley',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '🚗',
    timerSeconds: 14,
    isBuiltIn: true,
    categories: {
      fitnessComedy: SOUND_CATEGORIES.fitnessComedy,
      unexpectedMystery: SOUND_CATEGORIES.unexpectedMystery,
    },
    sounds: [
      {
        id: 'gar_01',
        title: 'High-RPM Screaming Buzz & Growl',
        soundHint: 'Loud 2-stroke engine revving and vibrating with aggressive rasp...',
        category: 'unexpectedMystery',
        synthPreset: 'chainsaw_rev',
        timerSeconds: 14,
        options: [
          'Gas-Powered Chainsaw Revving Up',
          'Kitchen Blender Crushing Ice & Frozen Berries',
          'Dentist High-Speed Drill',
          'Radio-Controlled Nitro RC Car',
        ],
        correctIndex: 0,
        revealTitle: 'Gas Chainsaw in the Backyard!',
        revealExplanation:
          'A two-stroke 50cc engine revving up to 13,000 RPM to trim an overgrown hedge branch.',
        funFact: 'Chainsaw chain teeth travel at over 45 miles per hour.',
        sceneModel: 'chainsaw_engine',
        difficulty: 1,
      },
      {
        id: 'gar_02',
        title: 'Rhythmic Air Compression Strokes',
        soundHint: 'Heavy pneumatic downstroke, valve click, and panting...',
        category: 'fitnessComedy',
        synthPreset: 'bike_pump',
        timerSeconds: 15,
        options: [
          'Emergency Bike Tire Pumping Panic',
          'CrossFit Rowing Machine 500m Sprint',
          'Pneumatic Garage Car Lift',
          'Cardiopulmonary Resuscitation (CPR) Training',
        ],
        correctIndex: 0,
        revealTitle: 'Emergency Bike Pump on Flat Tire!',
        revealExplanation:
          'Racing against time to pump 110 PSI before the group weekend bicycle ride departs.',
        funFact: 'Hand pumps generate up to 160 PSI of chamber pressure using human arm power alone.',
        sceneModel: 'bike_pump',
        difficulty: 2,
      },
      {
        id: 'gar_03',
        title: 'Catastrophic Metal Clatter & Thud',
        soundHint: 'Violent metal impact and heavy reverberation...',
        category: 'unexpectedMystery',
        synthPreset: 'heavy_thud',
        timerSeconds: 13,
        options: [
          'Dropping Heavy Metal Toolbox on Concrete',
          'Rolling Iron Keg Down Cellar Stairs',
          'Thunderstrike Hitting Metal Silo',
          'Slamming Steel Shipping Container',
        ],
        correctIndex: 0,
        revealTitle: 'Dropping Full Metal Toolbox on Garage Floor!',
        revealExplanation:
          'Fumbling the handle and spilling 48 wrenches and sockets across the entire garage.',
        funFact: 'The sound of scattering wrenches produces over 30 distinct resonant harmonic frequencies.',
        sceneModel: 'kettlebell_thud',
        difficulty: 2,
      },
    ],
  },
  {
    id: 'retro_arcade_pack',
    name: '8-Bit Arcade & Sci-Fi Illusions',
    description: 'Vintage laser blasters, space jump pads, warp drive engines, and retro synthesizer mysteries.',
    author: 'Pixel Foley Lab',
    version: '1.1.0',
    revision: 3,
    updatedAt: 1771500000000,
    icon: '👾',
    timerSeconds: 12,
    isBuiltIn: true,
    categories: {
      unexpectedMystery: SOUND_CATEGORIES.unexpectedMystery,
    },
    sounds: [
      {
        id: 'sci_01',
        title: 'Futuristic Laser Blast Pitch Sweep',
        soundHint: 'High-to-low laser pew sweep and energy discharge...',
        category: 'unexpectedMystery',
        synthPreset: 'laser_pew',
        timerSeconds: 12,
        options: [
          'Classic Sci-Fi Raygun / Laser Blaster',
          'Tapping Metal Slinky with a Spoon',
          'Radio Tower Guy-Wire Struck by Hammer',
          'High Voltage Electric Arc Discharge',
        ],
        correctIndex: 0,
        revealTitle: 'Vintage Sci-Fi Laser Blaster!',
        revealExplanation:
          'Sound designers originally created the Star Wars blaster sound by striking metal radio tower guy-wires!',
        funFact: 'High frequencies travel faster along metal wires than low frequencies, creating the iconic "pew" sweep.',
        sceneModel: 'laser_blaster',
        difficulty: 1,
      },
      {
        id: 'sci_02',
        title: 'Deep Oscillating 50Hz Warp Hum',
        soundHint: 'Sub-bass drone with pulsing mechanical oscillation...',
        category: 'unexpectedMystery',
        synthPreset: 'massage_gun',
        timerSeconds: 14,
        options: [
          'Spaceship Warp Drive Engine Idling',
          'Deep Tissue Percussion Gun on Max Power',
          'Substation High-Voltage Transformer',
          'Cathedral Pipe Organ Low C Note',
        ],
        correctIndex: 0,
        revealTitle: 'Spaceship Intergalactic Warp Core!',
        revealExplanation:
          'Continuous sub-harmonic hum of anti-matter magnetic containment drives.',
        funFact: 'Sci-fi spaceship engine hums are often tuned to 50 Hz or 60 Hz to match electrical grid hums.',
        sceneModel: 'warp_core',
        difficulty: 2,
      },
      {
        id: 'sci_03',
        title: 'Bouncy Elastic Kinetic Spring',
        soundHint: 'Tension stretch and rapid spring snap...',
        category: 'unexpectedMystery',
        synthPreset: 'band_snap',
        timerSeconds: 12,
        options: [
          '8-Bit Arcade Spring Jump Pad',
          'Latex Resistance Band Snap',
          'Pinball Machine Ball Plunger Release',
          'Old Spring Mattress Bounce',
        ],
        correctIndex: 0,
        revealTitle: 'Arcade Spring Jump Pad!',
        revealExplanation:
          'The classic platformer sound effect of launching a pixel hero across floating platforms.',
        funFact: 'Early video game sound chips were limited to just 4 simultaneous audio channels.',
        sceneModel: 'spring_pad',
        difficulty: 1,
      },
    ],
  },
  {
    id: 'summer_vacation_pack',
    name: 'Summer Vacation & Pool Party',
    description: 'Water slide splashes, hot deck flip-flops, inflatable pool toys, and beachside acoustic tricks.',
    author: 'Aqua Soundworks',
    version: '1.1.0',
    revision: 2,
    updatedAt: 1771500000000,
    icon: '🏖️',
    timerSeconds: 15,
    isBuiltIn: true,
    categories: {
      workoutVsDaily: SOUND_CATEGORIES.workoutVsDaily,
      kitchenFood: SOUND_CATEGORIES.kitchenFood,
    },
    sounds: [
      {
        id: 'sum_01',
        title: 'Rushing Water Vortex & Giant Splash',
        soundHint: 'Rushing flume turbulence followed by a massive tidal crash...',
        category: 'workoutVsDaily',
        synthPreset: 'water_splash',
        timerSeconds: 15,
        options: [
          'Zooming Down Steep Water Park Tube Slide',
          'Olympic High-Dive Cannonball Splash',
          'Washing Machine Fast Drain Cycle',
          'Torrential Wave Crashing on Pier',
        ],
        correctIndex: 0,
        revealTitle: 'Speeding Down Giant Water Park Slide!',
        revealExplanation:
          'Rocketing down a 60-foot enclosed tube flume at 25 mph straight into the splash pool.',
        funFact: 'Water park slide flumes pump over 1,000 gallons of water per minute to reduce friction.',
        sceneModel: 'water_slide',
        difficulty: 1,
      },
      {
        id: 'sum_02',
        title: 'Rhythmic Wet Rubber Slaps on Pavers',
        soundHint: 'Rapid wet slap-slap-slap sprint cadence...',
        category: 'workoutVsDaily',
        synthPreset: 'flip_flops',
        timerSeconds: 14,
        options: [
          'Dashing Across Hot Pool Deck in Wet Flip-Flops',
          'Olympic 100m Sprint on Track',
          'Dribbling Basketball in Downpour',
          'Horse Trotting on Wet Cobblestones',
        ],
        correctIndex: 0,
        revealTitle: 'Sprinting in Wet Flip-Flops Across Hot Deck!',
        revealExplanation:
          'Desperately hurrying across blistering hot pool patio stone before burning the soles of your feet.',
        funFact: 'Hot poolside concrete in summer can reach surface temperatures over 140°F (60°C).',
        sceneModel: 'flip_flops',
        difficulty: 1,
      },
      {
        id: 'sum_03',
        title: 'Heavy Inhalation & Inflatable Squeak',
        soundHint: 'Deep rhythmic breath cycles and squeaky vinyl plastic...',
        category: 'workoutVsDaily',
        synthPreset: 'panting_groan',
        timerSeconds: 15,
        options: [
          'Manually Blowing Up Giant Pool Flamingo',
          'HIIT CrossFit Workout Exhaustion',
          'Blowing Up 50 Birthday Balloons',
          'Heavy Snoring in Deep Sleep',
        ],
        correctIndex: 0,
        revealTitle: 'Blowing Up Giant Inflatable Flamingo!',
        revealExplanation:
          'Taking 15 minutes of pure lung power to inflate a 6-foot pink flamingo float on the beach.',
        funFact: 'A human lung exhales approximately 0.5 liters of air per normal breath.',
        sceneModel: 'pool_flamingo',
        difficulty: 1,
      },
    ],
  },
];

class SoundPackManager {
  constructor() {
    this.packs = [];
    this.activePackId = null;
    this.listeners = [];
    this.load();
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const cacheVersion = localStorage.getItem(CACHE_VERSION_KEY);
        let storedPacks = localStorage.getItem(STORAGE_PACKS_KEY);

        // 1. Check for legacy migration from sexercise_sound_packs_v1
        if (!storedPacks) {
          const legacyPacks = localStorage.getItem(LEGACY_STORAGE_PACKS_KEY);
          if (legacyPacks) {
            try {
              const parsedLegacy = JSON.parse(legacyPacks);
              // Extract any user-created custom packs under legacy storage
              const customPacks = Array.isArray(parsedLegacy) ? parsedLegacy.filter(p => !p.isBuiltIn) : [];
              this.packs = [...JSON.parse(JSON.stringify(BUILTIN_PACKS)), ...customPacks];
              localStorage.setItem(CACHE_VERSION_KEY, PACK_SCHEMA_VERSION);
              this.save();
              // Clean legacy keys
              localStorage.removeItem(LEGACY_STORAGE_PACKS_KEY);
              localStorage.removeItem(LEGACY_STORAGE_ACTIVE_KEY);
            } catch (err) {
              console.warn('Failed migrating legacy packs:', err);
            }
          }
        }

        // Re-read storage
        storedPacks = localStorage.getItem(STORAGE_PACKS_KEY);

        if (storedPacks && cacheVersion === PACK_SCHEMA_VERSION) {
          const parsed = JSON.parse(storedPacks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let needsSave = false;
            // Synchronize built-ins with latest revisions
            BUILTIN_PACKS.forEach((bp) => {
              const existingIdx = parsed.findIndex((p) => p.id === bp.id);
              if (existingIdx === -1) {
                parsed.push(JSON.parse(JSON.stringify(bp)));
                needsSave = true;
              } else {
                const existing = parsed[existingIdx];
                if (!existing.revision || existing.revision < bp.revision) {
                  parsed[existingIdx] = JSON.parse(JSON.stringify(bp));
                  needsSave = true;
                }
              }
            });
            this.packs = parsed;
            if (needsSave) {
              this.save();
            }
          } else {
            this.packs = JSON.parse(JSON.stringify(BUILTIN_PACKS));
            this.save();
          }
        } else {
          // New version or cache version mismatch: Synchronize fresh built-ins, preserving custom packs
          let existingCustom = [];
          if (storedPacks) {
            try {
              const existing = JSON.parse(storedPacks);
              if (Array.isArray(existing)) {
                existingCustom = existing.filter(p => !p.isBuiltIn);
              }
            } catch {}
          }
          this.packs = [...JSON.parse(JSON.stringify(BUILTIN_PACKS)), ...existingCustom];
          localStorage.setItem(CACHE_VERSION_KEY, PACK_SCHEMA_VERSION);
          this.save();
        }

        const activeId = localStorage.getItem(STORAGE_ACTIVE_PACK_KEY);
        if (activeId && this.packs.some((p) => p.id === activeId)) {
          this.activePackId = activeId;
        } else {
          this.activePackId = this.packs[0].id;
          localStorage.setItem(STORAGE_ACTIVE_PACK_KEY, this.activePackId);
        }
      } else {
        this.packs = JSON.parse(JSON.stringify(BUILTIN_PACKS));
        this.activePackId = this.packs[0].id;
      }
    } catch (e) {
      console.warn('Error loading sound packs from localStorage, using built-ins:', e);
      this.packs = JSON.parse(JSON.stringify(BUILTIN_PACKS));
      this.activePackId = this.packs[0].id;
    }
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_PACKS_KEY, JSON.stringify(this.packs));
        localStorage.setItem(STORAGE_ACTIVE_PACK_KEY, this.activePackId);
      }
      this._notifyListeners();
    } catch (e) {
      console.error('Failed to save sound packs to localStorage:', e);
    }
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  removeListener(fn) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }

  _notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.getActivePack(), this.packs);
      } catch (err) {
        console.error(err);
      }
    });
  }

  getAllPacks() {
    return this.packs;
  }

  getActivePack() {
    return this.packs.find((p) => p.id === this.activePackId) || this.packs[0];
  }

  setActivePack(packId) {
    if (this.packs.some((p) => p.id === packId)) {
      this.activePackId = packId;
      localStorage.setItem(STORAGE_ACTIVE_PACK_KEY, packId);
      this._notifyListeners();
      return true;
    }
    return false;
  }

  bumpRevision(packId) {
    const pack = this.packs.find((p) => p.id === packId);
    if (!pack) return null;
    pack.revision = (pack.revision || 1) + 1;
    pack.updatedAt = Date.now();
    this.save();
    return pack.revision;
  }

  updatePack(packId, updates = {}) {
    const pack = this.packs.find((p) => p.id === packId);
    if (!pack) throw new Error(`Pack not found: ${packId}`);

    Object.assign(pack, updates);
    pack.revision = (pack.revision || 1) + 1;
    pack.updatedAt = Date.now();
    this.save();
    return pack;
  }

  updatePack3DScene(packId, questionId, sceneUpdates = {}) {
    const pack = this.packs.find((p) => p.id === packId);
    if (!pack) throw new Error(`Pack not found: ${packId}`);

    const q = pack.sounds.find((s) => s.id === questionId);
    if (!q) throw new Error(`Question not found: ${questionId}`);

    if (sceneUpdates.sceneModel !== undefined) q.sceneModel = sceneUpdates.sceneModel;
    if (sceneUpdates.sceneScript !== undefined) q.sceneScript = sceneUpdates.sceneScript;
    if (sceneUpdates.scene3D !== undefined) q.scene3D = sceneUpdates.scene3D;
    if (sceneUpdates.theme3D !== undefined) pack.theme3D = sceneUpdates.theme3D;

    pack.revision = (pack.revision || 1) + 1;
    pack.updatedAt = Date.now();
    this.save();
    return { pack, question: q };
  }

  createPack({ name, description, author = 'User', icon = '📦', timerSeconds = 15, sounds = [], categories = SOUND_CATEGORIES, theme3D = null }) {
    const newPack = {
      id: `pack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || 'Untitled Sound Pack',
      description: description || 'Custom user created sound pack',
      author,
      version: '1.1.0',
      revision: 1,
      updatedAt: Date.now(),
      icon,
      timerSeconds: timerSeconds || 15,
      isBuiltIn: false,
      categories,
      theme3D,
      sounds,
    };

    this.packs.push(newPack);
    this.activePackId = newPack.id;
    this.save();
    return newPack;
  }

  addSoundToPack(packId, soundItem) {
    const pack = this.packs.find((p) => p.id === packId);
    if (!pack) return false;

    const item = {
      id: soundItem.id || `sq_${Date.now()}`,
      title: soundItem.title || 'Untitled Sound',
      soundHint: soundItem.soundHint || 'Listen closely...',
      category: soundItem.category || 'unexpectedMystery',
      synthPreset: soundItem.synthPreset || 'panting_groan',
      audioUrl: soundItem.audioUrl || null,
      timerSeconds: soundItem.timerSeconds || pack.timerSeconds || 15,
      options: soundItem.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: typeof soundItem.correctIndex === 'number' ? soundItem.correctIndex : 0,
      revealTitle: soundItem.revealTitle || 'True Source',
      revealExplanation: soundItem.revealExplanation || 'Explanation',
      funFact: soundItem.funFact || 'Trivia',
      sceneModel: soundItem.sceneModel || 'pool_flamingo',
      sceneScript: soundItem.sceneScript || null,
      scene3D: soundItem.scene3D || null,
      difficulty: soundItem.difficulty || 2,
    };

    pack.sounds.push(item);
    pack.revision = (pack.revision || 1) + 1;
    pack.updatedAt = Date.now();
    this.save();
    return true;
  }

  deletePack(packId) {
    if (this.packs.length <= 1) {
      throw new Error('Cannot delete the only remaining sound pack.');
    }

    const index = this.packs.findIndex((p) => p.id === packId);
    if (index === -1) return false;

    this.packs.splice(index, 1);
    if (this.activePackId === packId) {
      this.activePackId = this.packs[0].id;
    }
    this.save();
    return true;
  }

  createCustomPack(packData) {
    if (!packData || !packData.name) {
      throw new Error('Sound pack name is required.');
    }
    if (!Array.isArray(packData.sounds) || packData.sounds.length === 0) {
      throw new Error('Sound pack must contain at least 1 sound riddle.');
    }

    const newPack = {
      id: `pack_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: packData.name.trim(),
      description: packData.description?.trim() || 'Custom Steampunk Sound Pack',
      author: packData.author?.trim() || 'Sound Master',
      version: packData.version || '1.1.0',
      revision: packData.revision || 1,
      updatedAt: Date.now(),
      icon: packData.icon || '📦',
      timerSeconds: packData.timerSeconds || 15,
      isBuiltIn: false,
      categories: packData.categories || SOUND_CATEGORIES,
      theme3D: packData.theme3D || null,
      sounds: packData.sounds,
    };

    this.packs.push(newPack);
    this.activePackId = newPack.id;
    this.save();
    return newPack;
  }

  importPackFromJSON(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      throw new Error('Invalid JSON format: ' + err.message);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Sound pack must be a valid JSON object.');
    }

    const packsToImport = Array.isArray(parsed) ? parsed : [parsed];
    const importedList = [];

    packsToImport.forEach((p, idx) => {
      if (!p.name) {
        throw new Error(`Pack #${idx + 1} is missing required 'name' field.`);
      }
      if (!Array.isArray(p.sounds) || p.sounds.length === 0) {
        throw new Error(`Pack "${p.name}" must contain a non-empty 'sounds' array.`);
      }

      const packTimer = p.timerSeconds || 15;

      const sanitizedSounds = p.sounds.map((s, sIdx) => {
        if (!s.title || !Array.isArray(s.options) || s.options.length < 2) {
          throw new Error(`Sound #${sIdx + 1} in "${p.name}" has invalid title or options.`);
        }
        return {
          id: s.id || `s_${Date.now()}_${sIdx}`,
          title: s.title,
          soundHint: s.soundHint || 'Listen closely to the audio...',
          category: s.category || 'unexpectedMystery',
          synthPreset: s.synthPreset || 'panting_groan',
          audioUrl: s.audioUrl || null,
          timerSeconds: s.timerSeconds || packTimer,
          options: s.options,
          correctIndex: typeof s.correctIndex === 'number' && s.correctIndex < s.options.length ? s.correctIndex : 0,
          revealTitle: s.revealTitle || s.title,
          revealExplanation: s.revealExplanation || 'No explanation provided.',
          funFact: s.funFact || 'Audio foley trivia.',
          sceneGlb: s.sceneGlb || null,
          sceneModel: s.sceneModel || 'pool_flamingo',
          sceneScript: s.sceneScript || null,
          scene3D: s.scene3D || null,
          difficulty: s.difficulty || 2,
        };
      });

      const newPack = {
        id: `pack_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: p.name,
        description: p.description || 'Imported Sound Pack',
        author: p.author || 'Community',
        version: p.version || '1.1.0',
        revision: p.revision || 1,
        updatedAt: p.updatedAt || Date.now(),
        icon: p.icon || '📦',
        timerSeconds: packTimer,
        isBuiltIn: false,
        categories: p.categories || SOUND_CATEGORIES,
        theme3D: p.theme3D || null,
        sounds: sanitizedSounds,
      };

      this.packs.push(newPack);
      importedList.push(newPack);
    });

    if (importedList.length > 0) {
      this.activePackId = importedList[0].id;
      this.save();
    }

    return importedList;
  }

  /**
   * Bakes all procedural or scripted 3D models in a pack into portable Base64 GLB binaries.
   * @param {string} packId
   * @returns {Promise<Object>}
   */
  async bakePackGlbs(packId) {
    const pack = this.packs.find((p) => p.id === packId) || this.getActivePack();
    if (!pack) return null;

    const { ThemeSceneEngine } = await import('../three/themeSceneEngine.js');
    for (const sound of pack.sounds) {
      if (!sound.sceneGlb || sound.sceneGlb.length < 50) {
        try {
          sound.sceneGlb = await ThemeSceneEngine.exportQuestionToGlb(sound);
        } catch (err) {
          console.warn(`[SoundPackManager] Failed baking GLB for sound "${sound.id}":`, err);
        }
      }
    }

    pack.revision = (pack.revision || 1) + 1;
    pack.updatedAt = Date.now();
    this.save();
    return pack;
  }

  exportPackToJSON(packId) {
    const pack = this.packs.find((p) => p.id === packId) || this.getActivePack();
    return JSON.stringify(pack, null, 2);
  }

  resetToDefaults() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LEGACY_STORAGE_PACKS_KEY);
      localStorage.removeItem(LEGACY_STORAGE_ACTIVE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, PACK_SCHEMA_VERSION);
    }
    this.packs = JSON.parse(JSON.stringify(BUILTIN_PACKS));
    this.activePackId = this.packs[0].id;
    this.save();
    return this.packs;
  }

  getRandomQuestionsFromActive(count = 6, category = null) {
    const pack = this.getActivePack();
    let pool = category && category !== 'unexpectedMystery'
      ? pack.sounds.filter((q) => q.category === category)
      : [...pack.sounds];

    if (pool.length === 0) pool = [...pack.sounds];
    pool.sort(() => Math.random() - 0.5);
    return pool.slice(0, count);
  }
}

export const soundPackManager = new SoundPackManager();
