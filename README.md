# Laser saber customizer

## prod

```bash
docker compose up --build
```

## dev

if you have nvm installed

```bash
nvm use
```

```bash
cd src
npm i
npm run build:watch
```

in another shell

```bash
cd srv
npm i
npm run build
npm run start
```

## code formating

Format lint etc ...
```bash
cd src # cd srv
npm run check
```

Update packages
```bash
cd src # cd srv
npm run check-update
```
