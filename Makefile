# Directories
TARGET_DIR = dist
SOURCE_DIR = src

# Binaries
BROWSERIFY = ./node_modules/.bin/browserify
WATCHIFY = ./node_modules/.bin/watchify
SASS = ./node_modules/.bin/node-sass
NODEMON = ./node_modules/.bin/nodemon
BROWSER_SYNC = ./node_modules/.bin/browser-sync
STANDARD = ./node_modules/.bin/standard
NPM = npm

.PHONY: dist clean watch node_modules

build: $(TARGET_DIR)

clean:
	rm -rf $(TARGET_DIR)

static: forge
	cp -r $(SOURCE_DIR)/* $(TARGET_DIR)

forge:
	mkdir -p $(TARGET_DIR)/forge
	cp ./node_modules/mtos/node_modules/node-forge/js/forge.min.js $(TARGET_DIR)/forge
	cp ./node_modules/mtos/node_modules/node-forge/js/prime.worker.js $(TARGET_DIR)/forge
	cp ./node_modules/mtos/node_modules/node-forge/js/jsbn.js $(TARGET_DIR)/forge

index:
	mkdir -p $(TARGET_DIR)/app
	cp ./$(SOURCE_DIR)/index.html $(TARGET_DIR)

lint: node_modules
	$(STANDARD)

css:
	mkdir -p $(TARGET_DIR)/css
	$(SASS) --omit-source-map-url --output-style compressed $(SOURCE_DIR)/scss/style.scss --output $(TARGET_DIR)/css

watch: clean static css
	$(NODEMON) --watch $(SOURCE_DIR)/index.html --exec "make index" &
	$(SASS) --watch --source-map-embed $(SOURCE_DIR)/scss/style.scss --output $(TARGET_DIR)/css &
	$(WATCHIFY) --debug $(SOURCE_DIR)/app/index.js -o $(TARGET_DIR)/app/mtos-client-angular.js &
	$(BROWSER_SYNC) start --files "$(TARGET_DIR)/**/*" --server $(TARGET_DIR)

$(TARGET_DIR): lint clean static css
	$(BROWSERIFY) $(SOURCE_DIR)/app/index.js > $(TARGET_DIR)/app/mtos-client-angular.js &

node_modules:
	$(NPM) install
