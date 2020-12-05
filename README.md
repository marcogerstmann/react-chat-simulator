# React Chat Simulator

A chat simulating app built with React, Typescript, SCSS and Bootstrap.

## Get started
- Run `npm install`
- Run `npm start`
- App is available at `http://localhost:8080` 

## Folder structure

- `/assets` - Can contain images, fonts, ...
- `/components` - Contains "dumb" function components which only receive props and display them in the correct way
- `/containers` - Contains "smart" class components which hold a state
- `/hoc` - Higher-order components
- `/models` - General classes that serve as business models
- `/styles` - Files related to styling (could later also contain theming for example)

## Special files

- `constants.ts` - Central place to define some constants: Parts of it could later be outsourced to config / environment variables

## Third party packages

- **sass-loader** and **node-sass**: Ability to use sass for adding styles
- **bootstrap**: Responsive CSS framework (only imported `bootstrap.min.css` into index.tsx - no need for its JS modules and jquery)
- **lodash**: Good set of utility functions
- **react-scrollable-feed**: Used to easily keep the scrollbar at the bottom if already at bottom (within an offset of 20px)
- **react-youtube**: Embed a YouTube player by YouTube video ID

## Next steps

- Connect to a real backend server
- Use sass/css modules to bind the styles explicitly to the components
- When the app becomes more complex: Consider using Redux/MobX for more centralized state management
- Add unit tests and enforce a certain code coverage
