# Goodreads

Using the [Goodreads API](https://www.goodreads.com/api/index) and a [Slash Command](https://api.slack.com/slash-commands) in [Slack](https://slack.com/), you can have Slackbot reference a book in the current channel.

## Install Webtask

[Webtask](https://webtask.io) is a backendless server, it is rather neat. Read the docs to get setup on [your machine](https://webtask.io/docs/101).

## Run from GitHub

You can configure this to run from GitHub, as long as the [Slash Command](https://{team}.slack.com/apps/manage/custom-integrations) is setup in your Slack. Just generate the Slack Token, and run the following command from your CLI.

    wt create https://raw.githubusercontent.com/frodosghost/slack-goodreads-webtask/master/goodreads.js --name goodreads --secret SLACK_TOKEN={token}
