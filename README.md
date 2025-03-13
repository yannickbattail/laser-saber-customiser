# Laser saber customiser

## prod

```bash
docker-compose up --build
```

## dev

if you have nvm installed

```bash
nvm use
```

```bash
npm i
npm run build:watch
```

in another shell

```bash
npm run start
```

build only the server

```bash
npm run -w srv build
```

## code formating

```bash
npm run format:all
```

```bash
npm run --workspaces build
npm run --workspaces build
```

`--workspaces` means: execute the command in all workspaces (commons, srv, src)
