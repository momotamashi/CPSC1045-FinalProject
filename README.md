# CPSC1045-FinalProject
Canvas JS Final Project


# [Character] Running Game:

Key Focus Ideas: 
-Score
-Instructions & Title (HTML File)
-Character (boundaries, collision, speed)
-UI

Focus on coding:
Character continuously running right
Score counter going up by the minute, after certain score is reached, add in obstacle
Implement obstacles going left

Controls:
Up and space bar = Jump
Down arrow = Duck 

Ava's edits @ sunday 11:10 pm
- added canvas + functions for background, character (green box), and obstacle (red box)

- added obstacle movement onclick Start button

- added Start/Stop buttons for obstacle movement at the moment, right now the obstacle can move across the page but i don't have it regenerating again + if you click SPACE or Start
button again, the timer speeds up




@momotamashi @tuesday 3:54 am
- STYLE IN CSS:
- Made the game look like it's floating in the middle of the screen
- Added some nice shadows and rounded corners to make it look less boring
- Made buttons that actually look clickable with a cool hover effect
- Used flexbox to make everything line up perfectly
- Picked some nice colors that are easy on the eyes (subject to change)
- Made sure it looks good on different screen sizes (can check it on ipad, phone, tablets, etc)
- Added some polish so it doesn't look like a basic student project


- HTML CHANGES:
- Cleaned up indentation and structure
- Made sure the layout looks cleaner and more organized
- Added a proper title so it looks more professional
- Made sure the script and stylesheet are linked correctly
- Basically just made everything look a bit more tidy and modern


- JS CHANGES:
Core Game Mechanics:
- Added a lives system (you start with 3 lives now)
- Created a proper "game over" state
- Made the jumping and ducking way more smooth
- Improved how the game detects when you hit an obstacle
- Made the score actually meaningful - you get points for dodging obstacles
- Added keyboard controls so you can play more naturally
- Created a way to restart the game

User Experience Improvements:
- Added keyboard event listeners for controls
- You can actually lose and restart
- Jumping and ducking feel more natural
- Added lives display on canvas
- Created smooth jump and duck animations

Button and UI Interactions:
- Modified start/stop button behavior
- Added game state management
- Implemented alert for game over scenario
- Created dynamic button text changes to look more beautiful

ava's edits @ monday 12pm
- fixed bug where start button won't start
    - changed js start/stopButton variable input values to "Start Game" and "Stop Game" from "Start" and "Stop"

ava's edits @ monday 12:50 pm
- to JS: added intervalSpeed variable and clearInterval(timer) to "restart game" function @ line 107

ava @ monday 1:40pm
- lives reset on game over

allison @ friday 3:22am
- fixed obstacle collision error
- changed positioning of red obstacle
- changed jump height of character (mc) to be higher
- fixed space bar restart error
- changed obstacle positioning to middle of screen

ava @ tuesday 12:55
- patched controls on gameOver

momo @ wednesday 12:35am
- improved the look with some fresh fonts in css/html
- cleaned up constructors for Character and Obstacle, got rid of unnecessary functions outside and made everything more readable and easier to fix (if needed)
- grouped some lone variables inside the renderGame() function
- switched to setInterval for the game loop
- added event listeners for game controls
- tweaked collision detection, feels snappier now (let me know if it’s just me or if i’m being delusional ;-; )
- moved jump and duck mechanics to an event listener and adjusted the boolean output using a switch with a default event
- created two obstacles and used Math.random to make them come at you, hot and fast!
- had to fix the startGame and pauseGame buttons, they weren’t letting me redraw the game each time i pressed them, causing a bunch of issues. should be good now
- moved score and lives variables to the gameOver function instead of startGame and pauseGame for the same reason (button issue)