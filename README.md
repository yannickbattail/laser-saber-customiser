# Laser saber customizer

## prod

Run by docker
```bash
docker build . -t laser-saber-customiser
docker compose up --build
```

## Dev

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

# Developer doc

```
Frontend (src) --> Backend (srv) --> OpenScad + model.scad
```

```
Frontend init
    |
    v
Backend /parameter
    |
    v
OpenScad model.scad get parameters
    |
    V
Backend returns parameters
    |
    v
Frontend generate form
```
```
Frontend send preset (parameter's values)
    |
    v
Backend /preview or /3DModel
    |
    v
OpenScad model.scad generate preview image or 3D model
    |
    V
Backend returns preview image or 3D model file name
    |
    v
Frontend reloads preview image or 3D model
```
