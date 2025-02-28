
const usernames = [
  "alphafox23", "stormrider77", "nightshadowx", "firehawk99", "silverfalcon12",
  "blazingcomet7", "darkwhisperer", "frostbyte_omega", "shadowstrike92", "venomfangx33",
  "quantumwolf", "neonrider99", "phantomblade57", "roguespecter22", "voidwalkerx",
  "cyberninja900", "ghostrecon87", "vortexjumper01", "pyrosniper55", "stormchasertx",
  "lunarshadow21", "solarflare88", "eclipsehunter33", "warpdrive99", "silentspecter67",
  "zephyrblade44", "infernodragon77", "nova_rider55", "hypernova27", "darknova77",
  "cosmicwhale", "galacticphantom", "plasmaticwolf", "cometshifter", "supernova_god",
  "nebula_archer", "quantumwizard12", "stellarvoid", "warpstorm_king", "exobot9",
  "robo_falcon27", "cybervortex44", "hackerx99", "firewall_phantom", "codebreaker77",
  "darkmatrix23", "bioshifter90", "dataphantom13", "glitch_ranger", "bitcrusher22",
  "cryptomancer99", "datavoid_knight", "ethernetghost", "packetstorm23", "lagspike_x",
  "serverwizard77", "titan_shredder", "byteknight21", "netrunnerx66", "darkcypher99",
  "zero_point99", "horizon_shade", "shadow_networker", "proton_striker", "chronoforge99",
  "timeweaver77", "paradox_owl", "dimensionalrider", "galaxytamer44", "riftmancer13",
  "timebender99", "spacepirate77", "cosmoshifter", "hyperdrive_wraith", "photon_knight",
  "tachyon_runner", "subspacedragon", "quantumphantom", "gravirider22", "antimattervoid",
  "eventhorizon_99", "wormhole_warrior", "blackhole_knight", "stellar_hawk88", "solaris_specter",
  "meteorslayer23", "asteroid_dragon", "orbitsniper_x", "deepvoid_omega", "gammaburst_99",
  "ultraviolet_knight", "infrared_slayer", "darknebula99", "cosmicreaver77", "voidtempestx",
  "interstellarwolf", "supervoid_knight", "graviton_ninja", "singularity_shade", "wormholeshifter99"
];

/**
 * Returns a random username from the predefined list.
 */
export function getRandomUsername() {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  return usernames[randomIndex];
}

// Example usage
console.log(getRandomUsername());

