/*
 * TumblrMachine: by Mike Kavouras
 *
 * Version: 0.2
 * Tumblr API Version: 2.0
*/

// Convenience
Object.prototype.isArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
}
Object.prototype.isObject = function(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
Object.prototype.isString = function(o) {
  return Object.prototype.toString.call(o) === "[object String]";
}
Object.prototype.isNumber = function(o) {
  return Object.prototype.toString.call(o) === "[object Number]";
}


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
    if (Object.isNumber(post)) {
      post = this.getPostById(postOrPostId);
    }

    if (typeof(post) === "undefined") {
      console.error("TumblrMachine: The post requested does not exist");
      return null;
    }

    return post.type === "photo" ? post.photos[0].original_size.url : post.thumbnail_url;
  },

  photosForPosts: function(arg) {
    var posts = this.posts;
    var photos = [];

    if (Object.isNumber(arg)) {
      posts = this.posts.slice(0, Math.min(arg, this.posts.length));
    } else if (Object.isArray(arg)) {

      // empty array
      if ( ! arg.length) {
        console.error("TumblrMachine: photosForPosts - invalid arguments");
        return [];
      }

      var arr = arg;
      if (Object.isNumber(arr[0]) && arr.length === 2) {
        posts = this.posts.slice(arr[0], Math.min(arr[1], this.posts.length));
      } else if (Object.isObject(arr[0])) {
        posts = arr;
      } else {
        consle.error("TumblrMachine: photosForPosts - invalid arguments");
        return [];
      }
    }

    if ( ! posts.length) {
      return [];
    }

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      photos.push(this.photoForPost(post));
    }

    return photos;
  },

  tagsForPost: function(post) {
    return post.tags.map(function(tag) { return tag.toLowerCase(); });
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
  }
}


var name = "dolphinhood";
var apiKey = "B9enqZ1SESmqJ6NNbRuUcdj7nMDm9Vu8HI4zBhzsc7OLI5yZTz";

var tumblr = new TumblrMachine(name, apiKey, true);
