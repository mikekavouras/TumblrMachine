/*
 * TumblrMachine: by Mike Kavouras
 *
 * Version: 0.1
 * Tumblr API Version: 2.0
*/

function TumblrMachine(name, apiKey, fetch, onReady) {
  this.urlRoot = "https://api.tumblr.com/v2/blog/" + name + ".tumblr.com"
  this.postsUrl = this.urlRoot + "/posts?api_key=" + apiKey + "&callback=?";
  this.posts = [];
  this.totalPosts = 0;

  if (fetch) {
    this.fetchPosts(onReady, null);
  }
}

TumblrMachine.prototype = {
  fetchPosts: function(success, error, url) {
    var self = this;
    $.getJSON(url || this.postsUrl, function(r) {
      self.posts =  self.posts.concat(r.response.posts);
      self.totalPosts = r.response.total_posts;
      if (r.meta.status === 200) {
        if (success) {
          success(self.posts);
        }
      } else {
        console.error("TumblrMachine: There was an error fetching posts.");
      }
    });
  },

  fetchMorePosts: function(success, error) {
    if (this.posts.length === this.totalPosts) {
      console.error("TumblrMachine: No more posts.");
    }
    this.fetchPosts(success, error, this.nextPageUrl());
  },

  photoForPost: function(post) {
    return post.type === "photo" ? post.photos[0].original_size.url : post.thumbnail_url;
  },

  photosForPosts: function(numberOrRange) {
    var photos = [];

    var range = this.rangePointsFromNumberOrRange(numberOrRange);

    if ( ! range) {
      return null;
    }

    for (var i = range.start; i < range.end; i++) {
      var post = this.posts[i];
      photos.push(this.photoForPost(post));
    }

    return photos;
  },

  tagsForPost: function(post) {
    return post.tags;
  },

  postsForTag: function(t) {
    var posts = [];
    for (var i = 0; i < this.posts.length; i++) {
      var tags = this.tagsForPost(this.posts[i]);
      if (tags.indexOf(t) >= 0) {
        posts.push(this.posts[i]);
      }
    }
    return posts;
  },

  postsForTags: function(ts) {
    var posts = [];
    for (var i = 0; i < ts.length; i++) {
      var tag = ts[i];

      for (var j = 0; j < this.posts.length; j++) {
        var tags = this.tagsForPost(this.posts[j]);
        if (tags.indexOf(tag) >= 0) {
          posts.push(this.posts[j]);
        }
      }
    }
    return posts;
  },

  nextPageUrl: function() {
    return this.postsUrl + "&before_id=" + this.posts[this.posts.length - 1].id;
  },

  rangePointsFromNumberOrRange: function(numberOrRange) {
    var start;
    var end;

    if (numberOrRange) {
      start = this.startFromNumberOrRange(numberOrRange);
      end = this.endFromNumberOrRange(numberOrRange);
    } else {
      start = 0;
      end = this.posts.length;
    }

    if ( ! end ) {
      return null;
    }

    return {
      start: start,
      end: end
    }

  },

  startFromNumberOrRange: function(numberOrRange) {
    if (Object.prototype.toString.call(numberOrRange) === "[object Array]" && numberOrRange.length === 2) {
      return numberOrRange[0];
    }
    return 0;
  },

  endFromNumberOrRange: function(numberOrRange) {
    // If numberOrRange is a number we want to use it as the limit
    if (typeof(numberOrRange) === "number") {
      return Math.min(numberOrRange, this.posts.length);
    }

    // If numberOrRange is an array we want to use numberOrRange[1] and the limit
    else if (Object.prototype.toString.call(numberOrRange) === "[object Array]" && numberOrRange.length === 2) {
      return Math.min(numberOrRange[1], this.posts.length);
    }

    else {
      console.error("TumblrMachine: Invalid argument");
      return null;
    }
  }
}

