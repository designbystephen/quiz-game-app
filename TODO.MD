# TODO
> Known areas of improvement application wide

## Configuration

### Controls
- Document controls
- Add configurations and setup instructions for Wii Remotes

### Webpack
- Shared config for server/client/dev
- Named bundle to match application/package name
- Package version available in code
- Configure production build and deployment

### Styles
- ~~Use HMR ready styles for development~~
- Package styles as files for production

---

## Client

- Refactor data storage and usage across the game to allow for API endpoints instead of manipulating store of data 
- HMR is active but does not trigger re-renders in the application

## Server

### API
- Create API controllers / end-points for various events during game
- Restructure data to be more consistent with RESTful approach

### Views
- Common view for dev/production usages

### Data Storage
- Manipulating JSON files on server mongoDB of file in/out

---
