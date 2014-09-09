/*
 * TumblrMachine: by Mike Kavouras
 *
 * Version: 0.3
 * Tumblr API Version: 2.0
*/

function TumblrMachine(name, apiKey, fetch, onReady) {
  this._blogName = name;
  this._apiKey = apiKey;
  this._posts = [];
  this._limit = 100;
  this._totalPostsCount;

  this.fetchPosts = function(a, b, c) {

    // if no params
    if ( ! a) {
      this.__fetchPosts();
    }

    // if params && isFunction
    else if (a && Object.isFunction(a)) {
      this.__fetchPosts(a, b);
    }

    else if (a && Object.isNumber(a)) {
      // this.__fetchNumberOfPosts(a, b, c);
    }

  };

  this.fetchMorePosts = function(success, error) {
    if (this._posts.length === this._totalPostsCount) {
      console.error("TumblrMachine: No more posts.");
      if (success) {
        success(this._posts);
      } 
    } else {
      this.fetchPosts(success, error);
    }
  };

  this.imageForPost = function(post) {
    if (Object.isNumber(post)) {
      post = this.__getPostById(postOrPostId);
    }

    if (typeof(post) === "undefined") {
      console.error("TumblrMachine: The post requested does not exist");
      return null;
    }

    return post.type === "photo" ? post.photos[0].original_size.url : post.thumbnail_url;
  };

  this.imagesForPosts = function(arg) {
    var posts = this._posts;
    var photos = [];

    if (Object.isNumber(arg)) {
      posts = this._posts.slice(0, Math.min(arg, this._posts.length));
    } else if (Object.isArray(arg)) {

      // empty array
      if ( ! arg.length) {
        console.error("TumblrMachine: imagesForPosts - invalid argument");
        return [];
      }

      var arr = arg;
      if (Object.isNumber(arr[0]) && arr.length === 2) {
        posts = this._posts.slice(arr[0], Math.min(arr[1], this._posts.length));
      } else if (Object.isObject(arr[0])) {
        posts = arr;
      } else {
        consle.error("TumblrMachine: imagesForPosts - invalid argument");
        return [];
      }
    }

    if ( ! posts.length) {
      return [];
    }

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      photos.push(this.imageForPost(post));
    }

    return photos;
  };

  this.tagsForPost = function(post) {
    return post.tags.map(function(tag) { return tag.toLowerCase(); });
  };

  this.postsForTag = function(t) {
    var posts = [];
    for (var i = 0; i < this._posts.length; i++) {
      var tags = this.tagsForPost(this._posts[i]);
      if (tags.indexOf(t) >= 0) {
        posts.push(this._posts[i]);
      }
    }
    return posts;
  };

  this.postsForTags = function(ts) {
    var posts = [];
    for (var i = 0; i < ts.length; i++) {
      var tag = ts[i].toLowerCase();
      posts = posts.concat(this.postsForTag(tag));
    }
    return posts;
  };


  if (fetch) {
    this.fetchPosts(onReady, null);
  }
}

TumblrMachine.prototype = {

  __getPostById: function(id) {
    var post;
    for (var i = 0; i < this._posts.length; i++) {
      if (this._posts[i].id === id) {
        post = this._posts[i];
        break;
      }
    }
    return post;
  },

  __fetchPosts: function(success, error) {
    this.__fetchPostsWithUrl(success, error, this.__postsUrl());
  },

  __fetchNextPageOfPosts: function(success, error) {
    this.__fetchPostsWithUrl(success, error, this.__nextPageUrl());
  },

  __fetchNumberOfPosts: function(n, success, error) {

  },

  __fetchAllPosts: function(success, error) {

  },

  __fetchPostsWithUrl: function(success, error, url) {
    var self = this;
    $.getJSON(url, function(r) {
      self._posts = self._posts.concat(r.response.posts);
      self._totalPostsCount = r.response.total_posts;
      if (r.meta.status === 200) {
        if (success) {
          success(self._posts);
        }
      } else {
        console.error("TumblrMachine: There was an error fetching posts.");
      }
    });
  },

  __apiUrl: function() {
    return this.__urlRoot() + "/" + this.__apiVersion() + "/blog/" + this._blogName + ".tumblr.com";
  },

  __postsUrl: function() {
    return this.__apiUrl() + "/posts?api_key=" + this._apiKey + "&callback=?";
  },

  __apiVersion: function() {
    return "v2";
  },

  __urlRoot: function() {
    return "https://api.tumblr.com";
  },

  __nextPageUrl: function() {
    return this.__postsUrl() + "&before_id=" + this._posts[this._posts.length - 1].id;
  },

  __haveAllPosts: function() {
    return this._posts.length === this._totalPostsCount;
  }
}

// Convenience
Object.prototype.isArray = function(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}
Object.prototype.isObject = function(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
Object.prototype.isString = function(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}
Object.prototype.isNumber = function(x) {
  return Object.prototype.toString.call(x) === "[object Number]";
}
Object.prototype.isFunction = function(x) {
  return Object.prototype.toString.call(x) === "[object Function]";
}
