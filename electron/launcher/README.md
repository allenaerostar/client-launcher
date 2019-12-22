## Installation
```
git clone https://github.com/allenaerostar/client-launcher.git
cd ./electron/launcher
npm install
```

## Usage
```npm run start```

## Required Configurations
A few things must be configured before things will work, they are left out for security reasons.

1. Make a new file `config.json` in the`/main-process`directory, copy the content from `content_template.json`.
2. Configure `HOST` and `PORT` for your server. And use [this tool](https://catonmat.net/tools/generate-random-bytes) to generate random bytes for your `SECRET.key` and `SECRET.iv`, make sure to remove the space separators.

## Optional Configurations
If you will be using GitHub to host your releases, you must set an environmental variable for `electron-builder` to make draft release and upload to your repository.

1. Go to your GitHub settings page, click on "Developer Settings" near the bottom of the menu. Then click on "Personal access tokens".
2. Create a new personal access token, making sure to select the "repo" scope.
3. Create an environmental variable `GH_TOKEN` with the value of your personal access token.

## Build Instructions
Currently only building for Window platform is supported. Build for other operating systems at your own peril!

### Building From Window
1. Run `npm run react-build-win` command and wait for it to complete. NPM may throw error `ELIFECYCLE` and exits 1. But ignore this, as it's just Windows being Windows.
- Run `npm run package` if you wish to package app locally, and not push to GitHub as a release.
- Run `npm run release` if you do wish to release a new version on GitHub. By doing this, the optional `GH_TOKEN` environment variable from above is no longer optional.

### Building From MacOS or Linux
1. Run `npm run react-build` command and wait for it to complete.
- Run `npm run package` if you wish to package app locally, and not push to GitHub as a release.
- Run `npm run release` if you do wish to release a new version on GitHub. By doing this, the optional `GH_TOKEN` environment variable from above is no longer optional.

## Building Dependencies
Some of our dependency modules includes some C++ code, for example [node-keytar](https://github.com/atom/node-keytar). While the developers try their best to provide prebuilt binaries, sometimes the wrong version is installed by node package manager. If this is the case, you must compile the dependencies for your specific OS and architecture.

1. Run `npm install` to download all the dependencies.
2. We will use [node-gyp](https://github.com/nodejs/node-gyp#installation) to compile C++. Click the link and follow the provided installation instruction for your operating system.
3. Type `npm run rebuild` into your local repository console. This will invoke [electron-rebuild](https://github.com/electron/electron-rebuild) to recompile for your specific operating system.

## Other scripts

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
