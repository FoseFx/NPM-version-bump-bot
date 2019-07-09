import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { shouldCare, getConfig } from './util'

export = (app: Application) => {
  app.on('push', async (context: Context) => {
    if (shouldCare(context)) {
      return
    };

    const config = await getConfig(context)
    const PATH = config.path

    const branch = context.payload.ref.split('/')[2]
    let bump = 'none'
    config.branch.forEach((obj: any) => {
      if (obj[branch] === null && typeof obj[branch] !== 'undefined') {
        bump = obj.bump
      }
    })

    if (bump === 'none' || (bump !== 'major' && bump !== 'minor' && bump !== 'patch')) {
      return
    }
    console.log({
      owner: context.repo().owner,
      repo: context.repo().repo,
      path: PATH,
      ref: context.payload.ref
    })
    const fileData = await context.github.repos.getContents({
      owner: context.repo().owner,
      repo: context.repo().repo,
      path: PATH,
      ref: context.payload.ref
    })

    const sha = fileData.data.sha
    const contentBase = fileData.data.content
    const content = Buffer.from(contentBase, 'base64').toString('utf-8')

    const versionMatch = content.match(/"version": "(\d+\.\d+\.\d+)",/)
    if (versionMatch === null) {
      return
    }

    const version = versionMatch[1].split('.')
    let major = +version[0]
    let minor = +version[1]
    let patch = +version[2]

    if (bump === 'major') {
      major++
      minor = 0
      patch = 0
    } else if (bump === 'minor') {
      minor++
      patch = 0
    } else {
      patch++
    }

    const newVersion = `${major}.${minor}.${patch}`

    const newContent = content.replace(/"version": "(\d+\.\d+\.\d+)",/, `"version": "${newVersion}",`)

    const newContentBase = Buffer.from(newContent).toString('base64')

    const obj = {
      message: '[skip travis] Bumped Version to ' + newVersion,
      committer: { name: 'Version Bumb Bot', email: 'vbb@fosefx.com' },
      repo: context.repo().repo,
      content: newContentBase,
      path: PATH,
      sha: sha,
      owner: context.repo().owner
    }
    await context.github.repos.updateFile(obj)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
