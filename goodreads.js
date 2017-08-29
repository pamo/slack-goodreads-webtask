var request = require('request');
var parser = require('xml2js@0.2.8').Parser({ignoreAttrs: true, mergeAttrs: true});
var url = require('url');
var util = require('util');


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
// Removing the slack token check for testing
//    if (context.data.SLACK_TOKEN !== context.data.token) {
//        return(callback(`Slack token ${context.data.SLACK_TOKEN} does not match ${context.data.token}`));
//    }

    // Passed from Slack Command
    var title = context.data.text;
    var user = context.data.user_name;
    var responseUrl = context.data.response_url;

    parser.addListener('end', function (result) {
        var response = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0];
        var found_title = response.title[0];
        var title_url = url.parse(found_title).href;

        if (typeof response !== 'undefined') {
            request.post({url: responseUrl, method: 'POST', json: true, body: {
                'response_type': 'in_channel',
                'text': util.format('*Goodreads*: %s attempted to reference *%s* from Goodreads. This was the closest match we could find.', user, title),
                'attachments': [
                    {
                        'title': found_title,
                        'title_link': 'https://www.goodreads.com/book/title?id=' + title_url,
                        'thumb_url': response.small_image_url[0]
                    }
                ]
            }});
        } else {
            request.post({url: responseUrl, method: 'POST', json: true, body: {
                'response_type': 'ephemeral',
                'text': 'The book you were looking for cannot be found.'
            }});
        }
    });

    var req = request.get('https://www.goodreads.com/search/index.xml?key=V0xMCsWPQx5V8S1TXoEw&q=' + title, function (res) {
        res.on('data', function (data) {
            parser.parseString(data);
        });

        return( callback(null, 'Fetching Data...') );
    });
    req.end();

    req.on('error', function (e) {
        return( callback(e) );
    });
};
