# version-bump-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Bot that bumps your app&#x27;s version on every push to a branch

## Config
In your `.github/config.yml` you can add:
```
version-bump-bot:
  path: "path/to/package.json"
  branch:
    - master:
      bump: "patch"
    - release:
      bump: "minor"
    - "stable"
      bump: "major"
```
Default config is:
```
version-bump-bot:
  path: "package.json"  
  branch:
    - master:
      bump: "patch"
```
Every branch not mentioned in this list will not be touched.


## Setup

0. Clone the Repo
1. Create a [new Github App](https://github.com/settings/apps/new) enter gibberish for the WebhookURL and replace them later
2. Create and Download a new Private Key for the App in the App's settings
3. Download it and save it as `private-key.pem` in the root of the project
4. Build a new Docker Image using `docker build --build-arg APP_ID=YOUR_APPS_APP_ID --build-arg WEBHOOK_SECRET=YOUR_APPS_WEBHOOK_SECRET -t my-version-bump-bot .` and replace the templates
5. Deploy the Image, DO NOT PUBLISH THE IMAGE, IT CONTAINS SECRETS
6. Replace the URL in the Github App's settings
7. Install the App to one or more Repos
8. Profit

## Contributing

If you have suggestions for how version-bump-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 FoseFx <fosefx@pm.me>
