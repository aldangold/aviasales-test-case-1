<h2 align="center"> Aviasales test task </h2>

<div align="center">
    <a href="https://github.com/meloshnikov/aviasales-test-task/actions">
		<img src="https://github.com/meloshnikov/aviasales-test-task/workflows/linter-check/badge.svg" />
	</a>
    <a href="https://codeclimate.com/github/meloshnikov/aviasales-test-task/maintainability">
        <img src="https://api.codeclimate.com/v1/badges/116da556208626e1d451/maintainability" />
    </a>
</div>

## Description

The main frontend project of our team is a ticketing page with a lot of filters, settings and the tickets themselves.
The project is written in React, so the test task is close to the daily tasks.

In front of you is a simplified layout of our project - list of tickets, filters and sorting. We also have a small server for the test job, which works similarly to our main backend engine and implements a long polling technique for passing batches of tickets. You need to implement a client, which will receive randomly generated tickets from the server and draw the interface according to the layout in Figma. It will be enough to render the first 5 tickets according to the selected filters and sorting.

## Terms

- Use React
- Use TS or JS
- Work in a current version of Google Chrome
- The rest is up to you
- Documentation on how to work with the server: [here](https://github.com/KosyanMedia/test-tasks/blob/master/aviasales_frontend/server.md)
- Layout [Figma](https://github.com/KosyanMedia/test-tasks/raw/f0f60244b045928746188a86ba4f76ddb5515111/aviasales_frontend/Aviasales%20Test%20Task.fig)

*The original test assignment can be found [here](https://github.com/KosyanMedia/test-tasks/tree/master/aviasales_frontend)*

**Click [here](https://frontend-chat-ru.herokuapp.com/) to try Ticketing page**

## :package: Installation and launch guide
* Installation
```sh
$ git clone https://github.com/meloshnikov/aviasales-test-task.git
$ cd aviasales-test-task
$ make install
```

* Launch and demo
```sh
$ make start
# open http://localhost:3000
```
