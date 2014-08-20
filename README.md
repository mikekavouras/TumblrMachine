TumblrMachine
=============

Easy interface for any Tumblr blog

### Initializer: 

```javascript
/*
 * @params
 
 * name: Name of the Tumblr blog
 * apiKey: The API key (https://www.tumblr.com/oauth/apps)
 * fetch (optional): Whether or not you want to fetch posts immediately
 * onReady (optional): Success callback after posts have been fetched
*/

var machine = new TumblrMachine(name, apiKey, fetch, onReady);

```

### Fetching Posts
```javascript
/*
 * @params
 * success (optional): Success callback. Recieves the new posts as a first argument
 * error (optional): Error callback
 * url (optional): Internal use for pagination
*/

machine.fetchPosts(success, error, url)
```
