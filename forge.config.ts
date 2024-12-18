import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import MakerDMG from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';


const iconFile = "sources/assets/favicon";
const genericName = "Opalo";
const name = "Opalo";
const productName = "Opalo";
const categories = ["Office"] as any;

const defaultOptions = {
  genericName,
  name,
  productName,
  categories 
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: iconFile,
    osxSign: {
      identity: `Developer ID Application: ${process.env.MAC_DEVELOPER_ID}`,
      'hardened-runtime': true,
      entitlements: 'build/entitlements.plist',
      'entitlements-inherit': 'build/entitlements.plist',
      'signature-flags': 'library',
    } as any,
    osxNotarize: {
      appleId: process.env.MAC_APPLE_ID,
      appleIdPassword: process.env.MAC_APPLE_ID_PWD,
      teamId: process.env.MAC_APPLE_TEAM_ID,
    },
  },
  makers: [
    new MakerSquirrel({
      ...defaultOptions,
      setupIcon: `${iconFile}.ico`,
      loadingGif: 'src/assets/installer.gif',
    }),
    new MakerZIP({}),
    new MakerRpm({options: {
      ...defaultOptions,
      icon: `${iconFile}.png`,
      license: "Apache-2.0 license",
    }}),
    new MakerDeb({options: {
      ...defaultOptions,
      icon: `${iconFile}.png`,
      section: "doc",
    }}),

    new MakerDMG({ 
      ...defaultOptions,
      icon: `${iconFile}.icns`, 
      appPath: "" 
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'opalocc',
          name: 'opalo-app',
        },
        draft: false,
        prerelease: false,
      },
    },
  ],
};

export default config;