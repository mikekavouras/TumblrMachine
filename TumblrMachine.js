/*
 * TumblrMachine: by Mike Kavouras
 *
 * Version: 0.2
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

  getPhotoForPost: function(postOrPostId) {
    var post = postOrPostId;
    if (typeof(post) === "number") {
      post = this.getPostById(postOrPostId);
    }

    if (typeof(post) === "undefined") {
      console.error("TumblrMachine: The post requested does not exist");
      return null;
    }

    return post.type === "photo" ? post.photos[0].original_size.url : post.thumbnail_url;
  },

  getPhotosForPosts: function(numberOrRange) {
    var photos = [];

    var range = this.rangePointsFromNumberOrRange(numberOrRange);

    if ( ! range) {
      return null;
    }

    for (var i = range.start; i < range.end; i++) {
      var post = this.posts[i];
      photos.push(this.getPhotoForPost(post));
    }

    return photos;
  },

  getTagsForPost: function(post) {
    return post.tags.map(function(tag) { return tag.toLowerCase(); });
  },

  getPostsForTag: function(t) {
    var posts = [];
    for (var i = 0; i < this.posts.length; i++) {
      var tags = this.getTagsForPost(this.posts[i]);
      if (tags.indexOf(t) >= 0) {
        posts.push(this.posts[i]);
      }
    }
    return posts;
  },

  getPostsForTags: function(ts) {
    var posts = [];
    for (var i = 0; i < ts.length; i++) {
      var tag = ts[i].toLowerCase();
      posts = posts.concat(this.getPostsForTag(tag));
    }
    return posts;
  },

  getPostById: function(id) {
    var post;
    for (var i = 0; i < this.posts.length; i++) {
      if (this.posts[i].id === id) {
        post = this.posts[i];
        break;
      }
    }
    return post;
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


var name = "dolphinhood";
var apiKey = "B9enqZ1SESmqJ6NNbRuUcdj7nMDm9Vu8HI4zBhzsc7OLI5yZTz";

var tumblr = new TumblrMachine(name, apiKey, true);