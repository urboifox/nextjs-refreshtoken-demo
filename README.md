# Next.js refresh token demo

in react you can handle the refresh token with axios interceptors, but many next.js developers prefer not using axios and sticking with the default fetch api
the problem is that you can intercept all requests and responses in order to refresh the token or retry the last request after refreshing.

this is what this repo demonestrated.

## structure

all files in this repo has comments explaining the flow of this demo
there are 4 main files

1. next.config.mjs
2. login.tsx
3. profile.tsx
4. middleware.ts

by reading through these 4 files, you will understand how you could handle cookies, refresh token, and retrying the latest request from the middleware.ts file

if you found this repo helpful don't forget to star it!
