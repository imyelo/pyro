<p align="center"><img src="./_medias/logo.png" width="50%"></p>

# PYRO
> Firmware data burner for Sodalife device.

# Screenshot
[![screenshot](./_medias/screenshots/all.png)](./_medias/screenshots/)

## How to participate in contributing code
### Required Softwares
- Node.js >= 8
- NPM >= 5.6

### Installing dependencies
```bash
npm i
```

### Developing
```bash
npm run dev
```

### Building executable binary file
First, the environment for a win32 platform is required, because we need to build a win32 binary executable (.exe) for our embedded engineer partners, who are used to working on the win32 environment.

If you don't, check [electron-userland/electron-builder : Multi platform build](https://www.electron.build/multi-platform-build).

Build it:

```bash
npm run dist
```

Or if the above method fails:

```bash
npm run dist:retry:win
```

Then check ``dist/pyro x.y.z.exe``.

Good luck.

## FAQ
### How to clear cache?
On the win32 platform, you can clear the Pyro cache by deleting ``~/AppData/Roaming/pyro`` directory. For more information, see [sindresorhus/electron-store](https://github.com/sindresorhus/electron-store).
