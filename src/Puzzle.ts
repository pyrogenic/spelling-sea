// export type TrieEntry = Trie | 1 | undefined;
// export type Word = Array<{ letter: string }>;

// interface Trie {
//   [key: string]: TrieEntry,
// }

export default interface Puzzle {
    island: string;
    board: string[];
    count: number;
    words: string[];
}