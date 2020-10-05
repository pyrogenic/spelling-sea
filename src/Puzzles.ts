import Puzzle from "./Puzzle";

export async function getPuzzles(): Promise<Puzzles> {
    const response = await fetch("puzzles.json");
    return await response.json();
} 

export default interface Puzzles {
    [root: string]: Puzzle[];
}
