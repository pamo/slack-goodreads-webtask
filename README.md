# Goodreads

Using the [Goodreads API](https://www.goodreads.com/api/index) and a [Slash Command](https://api.slack.com/slash-commands) in [Slack](https://slack.com/), you can have Slackbot reference a book in the current channel.

## SETUP Webtask
 
### 1: Install Webtask

[Webtask](https://webtask.io) is a backendless server, it is rather neat. Read the docs to get setup on [your machine](https://webtask.io/docs/101).

### 2: Clone repository

    git clone git@github.com:frodosghost/slack-goodreads-webtask.git

### 3: Setup Slack

First you will need to create a new [Slash Command](https://{team}.slack.com/apps/manage/custom-integrations) in Slack. You will need the _Token_ on the setup page to use as the `SLACK_TOKEN` when running the *Webtask*.

This will post to the URL created once the command in step 3 is run. We use `/goodreads` as the command and `POST` for the method, other choices are all yours.

### 4: Generate a Goodreads API Key

You will need an [API key](https://www.goodreads.com/api/keys) to get started.

### 5: Run Webtask

    $ wt create goodreads.js --name goodreads --secret SLACK_TOKEN={token} --secret GOODREADS_TOKEN={token}