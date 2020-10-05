require 'active_support/core_ext/object'
require 'json'
require 'pathname'
require 'set'
require 'awesome_print'

class Trie < Hash
  def initialize
    super { |hash, key| hash[key] = Trie.new }
  end
end

WORD = '_'.freeze

WORDS = Set.new
MINIMUM_LETTER_COUNT = 4
Pathname('words.txt').readlines.map do |l|
  l.chomp!
  next unless l.length >= MINIMUM_LETTER_COUNT

  WORDS << l
end

games = {}

target_unique_letter_count = 7

ROOTS = WORDS.select { |word| word.chars.uniq.length == target_unique_letter_count }

$stderr.puts(words: WORDS.length, roots: ROOTS.length)

MAXIMUM_WORD_COUNT = 200
def tries_for_root(word)
  anagrams = WORDS.select(&/^(#{word.chars.uniq.join('|')}){#{MINIMUM_LETTER_COUNT},}$/.method(:===))
  word.chars.uniq.map do |island|
    result = { island: island }
    words_including_island = anagrams.select(&island.method(:in?))
    next if words_including_island.count > MAXIMUM_WORD_COUNT

    result[:word_count] = words_including_island.length
    # result[:words] = words_including_island
    result[:trie] = t = Trie.new
    words_including_island.each do |_sub_word|
      word.chomp.each_char do |c|
        t = t[c]
      end
      t[WORD] = 1
    end
    result
  end.compact
end
limit = 10
puzzles = {}
ROOTS.each do |word|
  next unless (data = tries_for_root(word)).present?

  $stderr.puts(word)
  data.each do |result|
    $stderr.puts("  [#{result[:island]}]: #{result[:word_count]} words")
  end
  puzzles[word] = data
  break if limit && (limit -= 1) <= 0
end

JSON.dump(puzzles)
