var Polaroid = require('../models/Polaroid');

module.exports = function (stream, socketServer) {

    stream.on('data', function (data) {

      if (!data.entities || !data.entities.media || data.entities.media.length === 0){
        return;
      }

        var tweet = {
            twid: data['id'],
            author: (data.user && data.user.name) ? data['user']['name'] : null,
            avatar: (data.user && data.user.profile_image_url) ? data['user']['profile_image_url'] : null,
            body: data['text'],
            date: data['created_at'],
            screenname: (data.user && data.user.screen_name) ? data['user']['screen_name'] : null,
            image_url: data['entities']['media'][0].media_url,
        };

        var tweet = new Polaroid(tweet);

        tweet.save(function (err) {
            if (!err) {
              console.log(tweet);

              socketServer.connections.forEach(function (conn) {
                  if (conn.readyState == conn.OPEN) {
                      conn.sendText("0" + JSON.stringify(tweet));
                  }
              });
            }
        });
    });
};
