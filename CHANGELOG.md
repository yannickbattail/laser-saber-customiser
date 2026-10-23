# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.1.2] - 2026-10-23

### Added

### Changed

- direct 3D preview (no more image)
- refactor model: split emitters, handles and pommels in separated files, use object as config

### Deprecated

### Removed

### Fixed

### Security

## [1.1.1] - 2026-10-20

### Added

### Changed

- move the "gen" dir to the root folder
- move the model dir to the root folder
- increase the model resolution, set $fn=100

### Deprecated

### Removed

- remove old lib, now use three

### Fixed

- typo "honey" in the model

### Security

## [1.1.0] - 2026-10-19

### Added

### Changed

- new 3d viewer

### Deprecated

### Removed

### Fixed

### Security

## [1.0.5] - 2026-10-15

### Added

### Changed

- new design for boolean values
- cool new loading animation

### Deprecated

### Removed

### Fixed

### Security

- update openscad-cli-wrapper
- update npm packages

## [1.0.4] - 2026-09-29

### Added

### Changed

- new design

### Deprecated

### Removed

### Fixed

### Security

## [1.0.3] - 2026-09-28

### Added

### Changed

- do not export form values of hidden fields
- hide from groups that are not used

### Deprecated

### Removed

### Fixed

### Security

## [1.0.2] - 2026-09-27

### Added

- set HTML metas to have preview in social media and chats

### Changed

- change endpoint to directly output image or model

### Deprecated

### Removed

### Fixed

- generate image or model in a separate folder to prevent overriding the previous generation

### Security

## [1.0.1] - 2026-09-25

### Added

- export as URL

### Changed

- change browser URL when updating the form

### Removed

- import, because export is a url

### Fixed

## [1.0.0] - 2026-09-22

### Added

- model: add round pommel and sphere pommel with ornament
- front: display version

### Changed

- model: give pommels real names
- front: humanize variables display

### Removed

- back: disable persistence endpoints because it is not (yet) used in the frontend
