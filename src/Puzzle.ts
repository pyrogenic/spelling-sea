// export type TrieEntry = Trie | 1 | undefined;
// export type Word = Array<{ letter: string }>;

// interface Trie {
//   [key: string]: TrieEntry,
// }

export default interface Puzzle {
    root: string;
    island: string;
    board: string[];
    words: string[];
    // trie: Trie;
}