var https = require('https');
var parser = require('xml2js@0.2.8').Parser({ignoreAttrs: true, mergeAttrs: true});
var url = require('url');
var util = require('util');
var request = require('request');


/**
 * Takes a Book title from Slack and returns the closest match from the
 * Goodreads API.
 *
 * The Goodreads API returns matches based on the string sent through, and is
 * influenced by an Amazon deal, so results will not always return what
 * has been searched for.
 */
module.exports = function (context, callback) {
    'use strict';

    if (context.data.SLACK_TOKEN !== context.data.token) {
        callback('Slack token does not match');
    }

    // Passed from Slack Command
    var title = context.data.text;
    var user = context.data.user_name;
    var responseUrl = context.data.response_url;

    parser.addListener('end', function (result) {
        var response = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0];
        var found_title = response.title[0];
        var title_url = url.parse(found_title).href;
        var data = {};

        if (typeof response !== 'undefined') {
            data = {
                'response_type': 'in_channel',
                'text': util.format('*Goodreads*: %s attempted to reference *%s* from Goodreads. This was the closest match we could find.', user, title),
                'attachments': [
                    {
                        'title': found_title,
                        'title_link': 'https://www.goodreads.com/book/title?id=' + title_url,
                        'thumb_url': response.small_image_url[0]
                    }
                ]
            };
        } else {
            data = {
                'response_type': 'ephemeral',
                'text': 'The book you were looking for cannot be found.'
            };
        }

        request.post({url: responseUrl, method: 'POST', json: true, body: data});
    });

    var req = https.get('https://www.goodreads.com/search/index.xml?key=' + context.data.GOODREADS_TOKEN + '&q=' + title, function (res) {
        res.on('data', function (data) {
            parser.parseString(data);
        });

        callback(null, 'Fetching Data...');
    });
    req.end();

    req.on('error', function (e) {
        callback(e);
    });
};
