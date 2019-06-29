import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

const NAME = "version-bump-bot[bot]";
const PATH = "package.json";

export = (app: Application) => {
  app.on('push', async (context: Context) => {

    if (context.payload.pusher.name === NAME) {
      return;
    };

    const config = await context.config('config.yml', {
      "version-bump-bot": {
        branch: [{"master": null, "bump": "patch"}]
      }
    });
    
    const branch = context.payload.ref.split("/")[2];
    let bump = "none";
    config["version-bump-bot"].branch.forEach((obj: any) => {
      if (obj[branch] === null && typeof obj[branch] !== "undefined") {
        bump = obj.bump;
        return;
      } 
    });

    if (bump === "none" || (bump !== "major" && bump !== "minor" && bump !== "patch")) {
      return;
    }

    const file_data = await context.github.repos.getContents({
      owner: context.repo().owner,
      repo: context.repo().repo,
      path: PATH,
      ref: context.payload.ref
    });
    const sha = file_data.data.sha;
    const content_base = file_data.data.content;
    const content = Buffer.from(content_base, 'base64').toString('utf-8');
    
    const version_match = content.match(/"version": "(\d+\.\d+\.\d+)",/);
    if (version_match === null) {
      return;
    }

    const version = version_match[1].split(".");
    let major = +version[0];
    let minor = +version[1];
    let patch = +version[2];

    if (bump === "major") {
      major++;
      minor = 0;
      patch = 0;
    } else if (bump === "minor") {
      minor++;
      patch = 0;
    } else {
      patch++;
    }

    const new_version = `${major}.${minor}.${patch}`;

    const new_content = content.replace(/"version": "(\d+\.\d+\.\d+)",/, `"version": "${new_version}",`);

    const new_content_base = Buffer.from(new_content).toString('base64');

    
    const obj = {
      message: "[skip travis] Bumped Version to " + new_version,
      committer: {name: 'Version Bumb Bot', email: 'vbb@fosefx.com'},
      repo: context.repo().repo,
      content: new_content_base,
      path: PATH,
      sha: sha,
      owner: context.repo().owner
    };
    await context.github.repos.updateFile(obj);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
