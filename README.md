# synesthesia

A music visualiser.

The frontend was created using [React](https://react.dev/).

## Resources Used
- [My first draft of the project in p5](https://github.com/Susu-spec/synesthesia-v0)
- A little more Google searching for design inspiration.

## Future Development
- Instructions for users.
- Add an input button for audio.
- Reduce lag.
- A lot more styling.

### General Notes
I made this site for two reasons. One was because I thought it would be cool to see music visualisations before I realised I could just build mine and two because I wanted to learn React. I'm mostly excited about the first reason.

- Weird situation 1. Sketch instance didn't need the reactP5wrapper jsx to render because p5.js operates independently of React's virtual DOM. p5.js directly manipulates the HTML canvas element without relying on React's rendering mechanism. That's interesting.
