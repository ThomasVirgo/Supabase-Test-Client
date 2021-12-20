# Gandalf Refactor with SupaBase backend, React frontend

## To do list
- add small pop ups for user feedback
- add user profile image and use supabase storage
- change storing room name in redux to persisting something in db so users can refresh page / disconnect and rejoin


### Priority
- update messages on each move
- create end game after three rounds
- show elo increasing on end of game
- implement slapping cards
- create leave game button
- dont let extra players join past 4 players or if game has started

## Future features
- create user stats page
- integrate gifs into messages
- have elo system and rankings
- add game rules page
- create matchmaking system so can play against anyone
- make mobile friendly


## Elo System
- players get points for winning a game, or coming second if three or four players
- players lose points for coming last
- gain/lose more points if 'skill' gap is higher
- divisions are wood, bronze, sapphire, ruby, diamond
- upon getting 50 points, promoted to next division. Once at top can accumulate as many points as possible
- lose points if leave a game
- lose more points for a worse score


