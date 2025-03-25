# Next.js refresh token demo

# Repo Archived !
this repo was just a proof of concept, you should **NOT** use it in a real app.

I don't think this repo is valid anymore, too much boilerplate to put in a real app. specially after next 15.
But as i got more experience in next.js, i found out that the best way to do this is to just create a wrapper function around fetch.

and make your interecpting code there, this is simpler and only one file, instead of modifying a lot of files like in this repo.

You might find [this article](https://medium.com/p/262fc2748158) helpful, It's about auth in next.js with an external backend.
Including refresh token handling.

## why?
in react you can handle the refresh token with axios interceptors, but many next.js developers prefer not using axios and sticking with the default fetch api.

the problem is that you can't intercept all requests and responses in next.js in order to refresh the token or retry the last request after refreshing it.
because any 3rd party api request wont reach the middleware in your next.js app.

this is what this repo solves.

we will proxy our requests so that all requests will reach the middleware file, and see how we can handle cookies, and retrying the last request.

## Important Note

I've only tested this on a small project and it might need some adjustments and further enhancements.
so make sure to not blindly copy/paste and just understand the idea of the code, and apply it yourself.
this is just a POC

## Other Methods

1. axios: one of the methods that solve the problem instantly, is just using axios, with axios interceptors you can handle refrsh token the exact way you do in react. but you lose some features of nextjs's fetch api, which handles caching and more stuff automatically for you.
2. using a fetch wrapper: you can create a wrapper function around the fetch function, and do all your magic there, but i didn't try this method and don't have much information about it

## Interesting files

all files in this repo has comments explaining the flow of this demo
there are 4 main files

1. next.config.mjs
2. login.tsx
3. profile.tsx
4. middleware.ts

by reading through these 4 files, you will understand how you could handle cookies, refresh token, and retrying the latest request from the middleware.ts file

if you found this repo helpful don't forget to star it!
