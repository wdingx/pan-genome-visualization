import { NextConfig } from 'next'
import path from 'path'

import { uniq } from 'lodash'

import getWithMDX from '@next/mdx'
import withPlugins from 'next-compose-plugins'
import getWithTranspileModules from 'next-transpile-modules'
import intercept from 'intercept-stdout'

import { findModuleRoot } from '../../lib/findModuleRoot'
import { getGitBranch } from '../../lib/getGitBranch'
import { getBuildNumber } from '../../lib/getBuildNumber'
import { getBuildUrl } from '../../lib/getBuildUrl'
import { getGitCommitHash } from '../../lib/getGitCommitHash'
import { getEnvVars } from './lib/getEnvVars'

import getWithExtraWatch from './withExtraWatch'
import getWithFriendlyConsole from './withFriendlyConsole'
import getWithLodash from './withLodash'
import withRaw from './withRaw'
import { getWithRobotsTxt } from './withRobotsTxt'
import getWithTypeChecking from './withTypeChecking'
import withoutDebugPackage from './withoutDebugPackage'
import withSvg from './withSvg'
import withIgnore from './withIgnore'
import withoutMinification from './withoutMinification'
import withFriendlyChunkNames from './withFriendlyChunkNames'
import withResolve from './withResolve'
import withUrlAsset from './withUrlAsset'
import withWasm from './withWasm'

// Ignore recoil warning messages in stdout
// https://github.com/facebookexperimental/Recoil/issues/733
if (process.env.NODE_ENV === 'development') {
  intercept((text: string) => (text.includes('Duplicate atom key') ? '' : text))
}

const {
  PROFILE,
  PRODUCTION,
  ENABLE_SOURCE_MAPS,
  ENABLE_ESLINT,
  ENABLE_TYPE_CHECKS,
  DOMAIN,
  DOMAIN_STRIPPED,
  DATA_FULL_DOMAIN,
} = getEnvVars()

const BRANCH_NAME = getGitBranch()

const { pkg, moduleRoot } = findModuleRoot()

const clientEnv = {
  BRANCH_NAME: getGitBranch(),
  PACKAGE_VERSION: pkg.version ?? '',
  BUILD_NUMBER: getBuildNumber(),
  TRAVIS_BUILD_WEB_URL: getBuildUrl(),
  COMMIT_HASH: getGitCommitHash(),
  DOMAIN,
  DOMAIN_STRIPPED,
  DATA_FULL_DOMAIN,
}

console.info(`Client-side Environment:\n${JSON.stringify(clientEnv, null, 2)}`)

const nextConfig: NextConfig = {
  distDir: `.build/${process.env.NODE_ENV}/tmp`,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx', 'all-contributorsrc'],
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  modern: false,
  reactStrictMode: false,
  reactRoot: true,
  experimental: {
    reactRoot: true,
    scrollRestoration: true,
  },
  swcMinify: true,
  productionBrowserSourceMaps: ENABLE_SOURCE_MAPS,
  excludeDefaultMomentLocales: true,
  devIndicators: {
    buildActivity: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  env: clientEnv,
  poweredByHeader: false,
}

const withMDX = getWithMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // prettier-ignore
      require('remark-breaks'),
      require('remark-images'),
      require('remark-math'),
      require('remark-slug'),
      [
        require('remark-toc'),
        {
          tight: true,
        },
      ],
    ],
    rehypePlugins: [],
  },
})

const withFriendlyConsole = getWithFriendlyConsole({
  clearConsole: false,
  projectRoot: path.resolve(moduleRoot),
  packageName: pkg.name || 'web',
  progressBarColor: '#38a954',
})

const withExtraWatch = getWithExtraWatch({
  files: [path.join(moduleRoot, 'src/types/**/*.d.ts')],
  dirs: [],
})

const withLodash = getWithLodash({ unicode: false })

const withTypeChecking = getWithTypeChecking({
  typeChecking: ENABLE_TYPE_CHECKS,
  eslint: ENABLE_ESLINT,
  memoryLimit: 2048,
})

const transpilationListDev = [
  // prettier-ignore
  'auspice',
  'd3-scale',
]

const transpilationListProd = uniq([
  // prettier-ignore
  ...transpilationListDev,
  'debug',
  'lodash',
])

const withTranspileModules = getWithTranspileModules(PRODUCTION ? transpilationListProd : transpilationListDev)

const withRobotsTxt = getWithRobotsTxt(`User-agent: *\nDisallow:${BRANCH_NAME === 'release' ? '' : ' *'}\n`)

const config = withPlugins(
  [
    [withIgnore],
    [withExtraWatch],
    [withSvg],
    [withFriendlyConsole],
    [withMDX],
    [withLodash],
    [withTypeChecking],
    [withTranspileModules],
    PROFILE && [withoutMinification],
    [withFriendlyChunkNames],
    [withRaw],
    [withResolve],
    [withRobotsTxt],
    [withUrlAsset],
    PRODUCTION && [withoutDebugPackage],
  ].filter(Boolean),
  nextConfig,
)

export default config
