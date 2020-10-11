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

src = ARGV.shift || 'words.txt'

WORD = '_'.freeze

MINIMUM_LETTER_COUNT = 4
WORDS_AND_UNIQUE_LETTERS = Pathname(src).readlines.map do |word|
  word.chomp!
  next unless word.length >= MINIMUM_LETTER_COUNT

  word.freeze
  [word, word.chars.uniq]
end.compact.freeze
WORDS = Set.new(WORDS_AND_UNIQUE_LETTERS.map(&:first)).freeze

# AKA board size
target_unique_letter_count = 7

ROOT_FILTER = nil
# ROOT_FILTER = /^[starline]*$/.freeze
# ROOT_FILTER = /[jqxz]/.freeze
ROOT_REJECTS = /(ed)$/.freeze

ROOTS = WORDS_AND_UNIQUE_LETTERS.select do |(word, uniq)|
  next unless uniq.length == target_unique_letter_count
  next unless !ROOT_FILTER || ROOT_FILTER =~ word
  next if ROOT_REJECTS && ROOT_REJECTS =~ word

  true
end.freeze

$stderr.puts(words: WORDS_AND_UNIQUE_LETTERS.length, roots: ROOTS.length)

MINIMUM_WORD_COUNT = 40
MAXIMUM_WORD_COUNT = 100

$counts = Set.new

def tries_for_root(word, uniq)
  anagram_matcher = /^(#{uniq.join('|')}){#{MINIMUM_LETTER_COUNT},}$/
  anagrams = WORDS.select { |other_word| anagram_matcher =~ other_word }
  word.chars.uniq.map do |island|
    result = { island: island }
    words_including_island = anagrams.select(&island.method(:in?))

    wc = words_including_island.count
    next if wc > MAXIMUM_WORD_COUNT
    #   $stderr.puts("  #{island} + #{(uniq - [island]).sort.join}: #{words_including_island.length} words#{($counts.add?(wc) && wc == $counts.min) && ' lowest so far'}")
    #   next
    # end
    next if wc < MINIMUM_WORD_COUNT

    result[:count] = words_including_island.length
    result[:words] = words_including_island
    result[:board] = (uniq - [island]).sort
    # result[:trie] = t = Trie.new
    # words_including_island.each do |_sub_word|
    #   word.chomp.each_char do |c|
    #     t = t[c]
    #   end
    #   t[WORD] = 1
    # end
    result
  end.compact
end
limit = 100;
puzzles = {}

ROOTS.shuffle.each do |(word, uniq)|
  unless (data = tries_for_root(word, uniq)).present?
    $stderr.print('.')
    $stdout.flush
    next
  end

  $stderr.puts
  $stderr.puts(word)
  data.each do |result|
    $stderr.puts("  #{result[:island]}/#{result[:board].join}: #{result[:count]} words")
  end
  puzzles[word] = data
  break if limit && (limit -= 1) <= 0
end

puts JSON.pretty_generate(puzzles)
