SRC := src
DIST := dist
STATIC := $(SRC)/static

BIN := node_modules/.bin
POSTCSS_OPTIONS := --use autoprefixer --autoprefixer.browsers ">5%"

# List of files needed to be built
JS_FILES := $(DIST)/index.js
CSS_FILES := $(DIST)/styles.css
STATIC_FILES := $(subst $(STATIC),$(DIST),$(wildcard $(STATIC)/*))
.PHONY = all clean watch

rand-str = $(shell bash -c 'printf "%$$1s" | sed "s/ /$$0/g"' $(1) $$(shuf -i2-6 -n1))
ECHO_DONE = @echo $@ done && echo $(call rand-str,"👌 👀 ")good shit good sHit\
	$(call rand-str,"👌 ")thats some $(call rand-str,"✔ ") good\
	$(call rand-str,"👌 ")shit right$(call rand-str,"👌 ")th \
	$(call rand-str,"👌 ")ere$(call rand-str,"👌 ")right\
	 $(call rand-str,"✔ ")there $(call rand-str,"✔ ")if i do ƽaү so my self\
	$(call rand-str,"💯 ")i say so$(call rand-str,"💯 ")thats what im talking\
	about $(call rand-str, "right there ")\(chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ\) mMMMMᎷМ

all: js css static

js: $(JS_FILES)
$(DIST)/%.js: $(shell find $(SRC) -type f -name "*.js")
	@mkdir -p $(@D)
	@$(BIN)/browserify $(SRC)/$*.js -o $@ -t [babelify]
	@$(ECHO_DONE)

css: $(CSS_FILES)
$(DIST)/%.css: $(shell find $(SRC) -type f -name "*.scss")
	@mkdir -p $(@D)
	@$(BIN)/node-sass $(SRC)/$*.scss > $@
	@$(BIN)/postcss $(POSTCSS_OPTIONS) -o $@ $@
	@$(ECHO_DONE)

static: $(STATIC_FILES)
$(STATIC_FILES): $(DIST)/% : $(STATIC)/%
	@rsync -ad $(STATIC)/ $(DIST)
	@$(ECHO_DONE)

doc: $(SRC)/*.js
	@$(BIN)/jsdoc $^ $(JSDOC_OPTIONS)

clean:
	rm -rf $(JS_FILES) $(CSS_FILES) $(STATIC_FILES)
	@$(ECHO_DONE)

watch:
	@$(BIN)/wr "make $(filter-out $@,$(MAKECMDGOALS))" $(SRC)
