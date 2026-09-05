export interface CanonicalGame {
  title: string;
  slug: string;
  image: string;
}

export const CANONICAL_GAMES: CanonicalGame[] = [
  // RPG / Action / Adventure
  { title: "Elden Ring", slug: "elden-ring", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg" },
  { title: "Cyberpunk 2077", slug: "cyberpunk-2077", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg" },
  { title: "Red Dead Redemption 2", slug: "red-dead-redemption-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg" },
  { title: "Ghost of Tsushima", slug: "ghost-of-tsushima", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/capsule_616x353.jpg" },
  { title: "God of War Ragnarök", slug: "god-of-war-ragnarok", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/capsule_616x353.jpg" },
  { title: "The Witcher 3", slug: "the-witcher-3", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg" },
  { title: "Sekiro", slug: "sekiro", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/capsule_616x353.jpg" },
  { title: "Bloodborne", slug: "bloodborne", image: "https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg" },
  { title: "Hollow Knight", slug: "hollow-knight", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg" },
  { title: "DOOM", slug: "doom", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/379720/capsule_616x353.jpg" },
  { title: "Death Stranding", slug: "death-stranding", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1850570/capsule_616x353.jpg" },
  { title: "Hades", slug: "hades", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_616x353.jpg" },

  // FPS / Multiplayer
  { title: "Counter-Strike 2", slug: "counter-strike-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg" },
  { title: "Valorant", slug: "valorant", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg" },
  { title: "Call of Duty: Modern Warfare", slug: "call-of-duty-modern-warfare", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2000950/capsule_616x353.jpg" },
  { title: "Call of Duty: Black Ops", slug: "call-of-duty-black-ops", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/42700/capsule_616x353.jpg" },
  { title: "Battlefield 1", slug: "battlefield-1", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238840/capsule_616x353.jpg" },
  { title: "Titanfall 2", slug: "titanfall-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1237970/capsule_616x353.jpg" },
  { title: "Halo", slug: "halo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/976730/capsule_616x353.jpg" },
  { title: "Apex Legends", slug: "apex-legends", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/capsule_616x353.jpg" },
  { title: "Overwatch 2", slug: "overwatch-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2356550/capsule_616x353.jpg" },
  { title: "Rainbow Six Siege", slug: "rainbow-six-siege", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/capsule_616x353.jpg" },
  { title: "Half-Life 2", slug: "half-life-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/capsule_616x353.jpg" },

  // Racing / Other
  { title: "Forza Horizon 5", slug: "forza-horizon-5", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg" },
  { title: "The Last of Us", slug: "the-last-of-us", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg" },
  { title: "Alan Wake 2", slug: "alan-wake-2", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg" },
  { title: "Control", slug: "control", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/870780/capsule_616x353.jpg" },
  { title: "Portal 2", slug: "portal-2", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/capsule_616x353.jpg" },
  { title: "Minecraft", slug: "minecraft", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg" }
];
