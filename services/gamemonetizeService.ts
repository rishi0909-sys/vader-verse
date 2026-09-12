export interface GameMonetizeGame {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
}

const CURATED_GAMES: GameMonetizeGame[] = [
  {
    id: "slow-roads",
    title: "Slow Roads",
    description: "A procedurally generated 3D driving game. Take a relaxing drive through endless landscapes without any limits. Completely ad-free.",
    instructions: "W/S or Up/Down to accelerate/brake. A/D or Left/Right to steer. Shift to boost.",
    url: "https://slowroads.io/",
    category: "Racing",
    tags: "3d, driving, relaxing, procedural",
    thumb: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80",
    width: "100%",
    height: "100%"
  },
  {
    id: "hextris",
    title: "Hextris",
    description: "An addictive puzzle game inspired by Tetris. Rotate the hexagon to prevent the blocks from stacking outside the grey hexagon.",
    instructions: "Left/Right arrow keys to rotate the hexagon.",
    url: "https://hextris.io/",
    category: "Puzzle",
    tags: "puzzle, tetris, hexagon, addictive",
    thumb: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
    width: "100%",
    height: "100%"
  },
  {
    id: "2048",
    title: "2048",
    description: "Join the numbers and get to the 2048 tile! A classic sliding block puzzle game that requires deep strategy.",
    instructions: "Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch.",
    url: "https://play2048.co/",
    category: "Puzzle",
    tags: "puzzle, math, numbers, strategy",
    thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    width: "100%",
    height: "100%"
  },
  {
    id: "pacman-canvas",
    title: "Pac-Man Canvas",
    description: "A faithful HTML5 recreation of the classic arcade game Pac-Man. Ad-free retro goodness.",
    instructions: "Use arrow keys to navigate the maze, eat all dots, and avoid the ghosts.",
    url: "https://pacman.platzh1rsch.ch/",
    category: "Arcade",
    tags: "arcade, classic, retro, pacman",
    thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    width: "100%",
    height: "100%"
  },
  {
    id: "breaklock",
    title: "Breaklock",
    description: "A hybrid of Mastermind and the Android pattern lock. Find the secret pattern to unlock the game.",
    instructions: "Draw patterns to guess the secret lock. The game will tell you if points are correct.",
    url: "https://maxwellito.github.io/breaklock/",
    category: "Puzzle",
    tags: "puzzle, logic, brain, mastermind",
    thumb: "https://images.unsplash.com/photo-1614036417651-1d0529e5a6bf?w=800&q=80",
    width: "100%",
    height: "100%"
  },
  {
    id: "astray",
    title: "Astray",
    description: "A WebGL maze game. Navigate through complex 3D mazes using your keyboard. Beautiful and minimal.",
    instructions: "Arrow keys or WASD to move. Mouse to look around.",
    url: "https://www.astray.cc/",
    category: "Action",
    tags: "3d, maze, webgl, exploration",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    width: "100%",
    height: "100%"
  }
];

export async function getGameMonetizeGames(limit: number = 60, genre?: string): Promise<GameMonetizeGame[]> {
  try {
    let data = [...CURATED_GAMES];
    
    if (genre) {
      const searchGenre = genre.toLowerCase();
      data = data.filter((g) => 
        (g.category && g.category.toLowerCase().includes(searchGenre)) || 
        (g.tags && g.tags.toLowerCase().includes(searchGenre))
      );
    }
    
    // If they ask for more than we have, just return what we have (or duplicate them if needed, but let's just return what we have)
    return data.slice(0, limit);
  } catch (error) {
    console.error("Curated Games Service Error:", error);
    return [];
  }
}
