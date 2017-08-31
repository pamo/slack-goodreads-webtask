const request = require('request');
const parser = require('xml2js@0.2.8').Parser({ ignoreAttrs: true, mergeAttrs: true });
const url = require('url');
const util = require('util');

/**
 * Takes a Book title from Slack and returns the closest match from the
 * Goodreads API.
 *
 * The Goodreads API returns matches based on the string sent through, and is
 * influenced by an Amazon deal, so results will not always return what
 * has been searched for.
 */
module.exports = function ({ data }, callback) {
    'use strict';

    // Passed from Slack Command
    const { title, user_name: user, response_url: responseUrl } = data;

    parser.addListener('end', (result) => {
        const response = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0];
        const foundTitle = response.title[0];
        const titleUrl = url.parse(foundTitle).href;

        if (typeof response !== 'undefined') {
            request.post({
                url: responseUrl, method: 'POST', json: true, 
                body: {
                    response_type: 'in_channel',
                    text: util.format('*Goodreads*: %s attempted to reference *%s* from Goodreads. This was the closest match we could find.', user, title),
                    attachments: [{
                        title: foundTitle,
                        title_link: `https://www.goodreads.com/book/title?id=${titleUrl}`,
                        thumb_url: response.small_image_url[0]
                    }]
                }
            });
        } else {
            request.post({
                url: responseUrl, method: 'POST', json: true,
                body: {
                    response_type: 'ephemeral',
                    text: 'The book you were looking for cannot be found.'
                }
            });
        }
    });

    const req = request.get(`https://www.goodreads.com/search/index.xml?key=V0xMCsWPQx5V8S1TXoEw&q=${title}`, (res) => {
        res.on('data', (data) => {
            parser.parseString(data);
        });

        return(callback(null, 'Fetching Data...'));
    });
    
    req.end();
    req.on('error', (e) => {
        return(callback(e));
    });
};
