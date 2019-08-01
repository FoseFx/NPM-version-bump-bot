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


## Deploy

### Using Docker

0. Clone the Repo
1. Create a [new Github App](https://github.com/settings/apps/new) enter gibberish for the WebhookURL and replace them later
2. Create and Download a new Private Key for the App in the App's settings
3. Download it and save it as `private-key.pem` in a `secrets` folder in this project (run `mkdir secrets` first)
4. run `cp .env.example ./secrets/.env` and edit the .env file accordingly
5. Build a new Docker Image using `docker build -t my-version-bump-bot .`
6. run the image on your server using `docker run --env-file ./secrets/.env -v ./private-key.pem:private-key.pem:ro -d -p 3000:3000 my-version-bump-bot`
7. Replace the URL in the Github App's settings
8. Install the App to one or more Repos
9. Profit

### Using Kubernetes

0. Clone the Repo
1. Create a [new Github App](https://github.com/settings/apps/new) enter gibberish for the WebhookURL and replace them later
2. Create and Download a new Private Key for the App in the App's settings
3. Download it and save it as `private-key.pem` in a `secrets` folder in this project (run `mkdir secrets` first)
4. run `cp .env.example ./secrets/.env` and edit the .env file accordingly
5. Build a new Docker Image using `docker build -t my-version-bump-bot .`
6. Push your image and replace `fosefx/version-bump-bot` in `k8s.yml`
7. Make further changes in `k8s.yml`
8. run `kubectl create secret generic version-bump-bot-pem --from-file=secrets/private-key.pem`
9. run `kubectl create configmap version-bump-bot-env --from-env-file=secrets/.env`
10. run `kubectl apply -f k8s.yml`

## Contributing

If you have suggestions for how version-bump-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 FoseFx <fosefx@pm.me>
