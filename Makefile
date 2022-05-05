install: 
	npm ci

start:
	npm start

lint:
	npx eslint . --ext js,jsx

deploy:
	git push heroku

test:
	npm test -s

.PHONY: test
