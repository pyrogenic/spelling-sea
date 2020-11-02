require 'amazing_print'
require 'csv'
require 'json'
require 'active_support/core_ext/array'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/object'

islands = []

CSV.open('islands.csv', 'r', headers: %i[
           ranking name country etc etc2
         ]) do |csv|
  csv.each do |row|
    next if row[:name].nil?

    if row[:ranking].present?
      next if row[:ranking].to_i.to_s != row[:ranking]
    end

    row = row.to_h.slice(:name, :country, :etc, :etc2)
    if /^[0-9,]+$/ =~ row[:etc]
        row[:population] = row.delete(:etc).gsub(',', '').to_i
    end
    row[:etc] = [
        row[:etc],
        row.delete(:etc2),
    ].compact.join('|')
    row.each do |k, v|
        row.delete(k) unless v.present?
    end
    row.values.each do |s|
        s.try(:gsub!, /\s+/, ' ')
        s.try(:gsub!, /\(\s+/, '(')
        s.try(:gsub!, /\s+\)/, ')')
    end
    if /^(?<country>[^()]+?)\s*\((?<region>[^)]+)\)$/ =~ row[:country]
        row[:country] = country
        row[:region] = region
    end
    islands << row
  end
end

File.open('../../public/islands.json', 'w') do |file|
  file.write(JSON.pretty_generate(islands))
end
