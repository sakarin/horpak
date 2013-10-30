module PrettyParam
	class << self
		# This method does the actual permalink escaping.
		def escape(string)
			result = string
			#result.gsub!(/[^\x00-\x7F]+/, '') # Remove anything non-ASCII entirely (e.g. diacritics).
			#result.gsub!(/[^\w_ \-]+/i, '') # Remove unwanted chars.
			result.gsub!(/[ \-]+/i, '-') # No more than one of the separator in a row.
			result.gsub!(/^\-|\-$/i, '') # Remove leading/trailing separator.
      result.gsub!(/\./, '-')


      # Remove non chars.
      result.gsub!(/[\x20-\x2F]+/, '-')
      result.gsub!(/[\x3A-\x40]+/, '-')
      result.gsub!(/[\x5B-\x60]+/, '-')
      result.gsub!(/[\x7B-\x7F]+/, '-')
      #result.gsub!(/\%/, '')

			#result.downcase.parameterize
			result.downcase
		end
	end

	module ClassMethods
		# Takes 1 or more symbols and stores them in class.pretty_params,
		# and then overrides to_param
		def has_pretty_param(*fields)
			define_singleton_method :pretty_params, -> { fields }
			define_method :to_param do
				PrettyParam.escape("#{self.id}-#{self.class.pretty_params.map{|a| self.send(a.to_sym) }.join('-')}")
			end
		end
	end
end

ActiveRecord::Base.extend PrettyParam::ClassMethods