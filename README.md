# Laser saber customiser

### prod
```bash
npm ci
npm run --workspaces build
docker-compose up --build
```

### dev
```bash
npm i
npm run build:watch
```
in another shell
```bash
npm run -w srv start
```
