# open-up-visualisations

OpenUp Data Visualisations

Place code for each visualisation in a directory under `src/visualisations` and add a link to it under `src/index.html`. It is also good to include embed instructions and an example.

We usually use pym.js to make the iframe respond to the viz height, but this is not needed for visualisations with fixed height, and not supported by sites that don't allow script embeds.

## Development

Run `yarn` to install dependencies.

Run `yarn dev` to start a development server and visit [http://localhost:1234/index.html](http://localhost:1234/index.html)

You have to include the `index.html` in the URL because of how we are using parcel.

## Deployment

Run `yarn build` and publish the `dist` directory. This is currently configured to be deployed by netlify.
