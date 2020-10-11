import Puzzle from "./Puzzle";

export async function getPuzzles(): Promise<Puzzles> {
    const response = await fetch("puzzles.json");
    try {
        return await response.json();
    } catch (error) {
        console.error(error, await (await fetch("puzzles.json")).text());
        return {};
    }
} 

export default interface Puzzles {
    [root: string]: Puzzle[];
}
