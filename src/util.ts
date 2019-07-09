import { Context } from 'probot'

export function shouldCare (context: Context): boolean {
  const { payload } = context
  const message: string = payload.head_commit.message
  console.log(message)
  return /^.*Bumped Version to.*$/.test(message)
}

export interface VBBConfig {
    path: string,
    branch: {
        [key: string]: any,
        bump: 'patch'|'minor'|'major'
    }[]
}

export async function getConfig (context: Context): Promise<VBBConfig> {
  const config: VBBConfig = (await context.config('config.yml', {
    'version-bump-bot': {
      path: 'package.json',
      branch: [{ 'master': null, 'bump': 'patch' }]
    }
  }))['version-bump-bot']

  config.path = config.path || 'package.json'
  config.branch = config.branch || [{ 'master': null, 'bump': 'patch' }]
  return config
}
