# Dino Game

A simple browser-based game where you control a dinosaur to catch falling cakes while avoiding comets.

## How to Play

- Use **LEFT** and **RIGHT** arrow keys to move the dinosaur
- Catch **cakes** to increase your score
- Avoid **comets** to preserve your lives
- You start with 3 lives
- Game ends when all lives are lost

## Features

- Smooth keyboard controls
- Increasing difficulty as score rises
- Dynamic comet spawn rates
- Responsive design
- Score tracking system

## Technologies Used

- React
- JavaScript
- HTML5
- CSS3

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dino-game.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Deployment

This project can be easily deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## Game Rules

- Each cake caught: +1 score
- Each comet hit: -1 life
- Game gets harder as your score increases
- Comets fall faster at higher scores

## Development

To modify the game, you can adjust:

- Game speed in the game loop
- Spawn rates in the useEffect hooks
- Difficulty scaling in getDifficultyMultiplier()

## License

MIT License - feel free to use this project for learning purposes.
