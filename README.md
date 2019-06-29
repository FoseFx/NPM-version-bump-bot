# version-bump-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Bot that bumps your app&#x27;s version on every push to a branch

This is not tested at all.

## Config
In your `.github/config.yml` you can add:
```
version-bump-bot:
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
  branch:
    - master:
      bump: "patch"
```
Every branch not mentioned in this list will not be touched.


## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Contributing

If you have suggestions for how version-bump-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 FoseFx <fosefx@pm.me>
