# small-client-wiki
We explore a read-only client written in react.

We will share only json schema with current fedwiki. 
We will write conventional react code and give up if we can't make that work.
We will build this into a single js file that includes all available plugins also rewritten in react.

See our [work in progress](http://read.wiki.org) served from github pages.

See also our [vertical lineup](c2.com/wiki/vertical-lineup.pdf) design for narrow touch screens.

# build

```
git clone ...
npm install
npm start
```

# deploy

We render wiki json served from gh-pages.
We face some limitations but hope to find configurations that are useful.
Some concerns we know about.
- gh-pages must be https, unless accessed as some other domain.
- gh-pages don't support cors so javascript must come from gh-pages too.

To deploy in gh-page of this repo
```
npm run deploy
```
Reconfigure CNAME in /public and "homepage" in package.json for
other deployments.

# contribute

We're happy to have issues or pull-requests.

- collaborators can be pushed to master if pair-programming and reviewed before post.
- collaborators working solo should push to a branch and pull-request for a review and merge.
- contributors should fork and pull-request from their own repo.

