TumblrMachine
=============

Easy interface for any Tumblr blog

### Initializer

```javascript
/* Creates a new instance of TumblrMachine
 *
 * @params
 
 * name: Name of the Tumblr blog
 * apiKey: The API key (https://www.tumblr.com/oauth/apps)
 * fetch (optional): Whether or not you want to fetch posts immediately
 * onReady (optional): Success callback after posts have been fetched
*/

var machine = new TumblrMachine(name, apiKey, fetch, onReady);

```

### Fetching Posts  

##### fetchPosts(success, error)  

```javascript
/*
 * Fetch the first set of posts
 * 
 * @params
 *
 * success (optional): Success callback. Recieves the new posts as a first parameter
 * error (optional): Error callback
 * url (optional): Internal use. Leave blank unless you know what you're doing
*/

var success = function(newPosts) {
 console.log(newPosts);
}
var error = function() {
 console.log("Something went wrong");
}

machine.fetchPosts(success, error);

/* 
 * Fetches subsequent sets of posts
 *
 * @params
 *
 * success (optional): Success callback. Receives the new posts (Array) as a first parameter
 * error (optional): Error callback
*/

var success = function(newPosts) {
 console.log(newPosts);
}
var error = function() {
 console.log("Something went wrong");
}

machine.fetchMorePosts(success, error);
```
