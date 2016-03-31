import invariant from 'invariant'

export const getGames = (viewer, redis) => {
  invariant(viewer.id, 'Invalid viewer, missing `id` property')
  invariant(viewer.games, 'Invalid viewer, missing `games` property')
  
  const viewerId = viewer.id
  const pipeline = viewer.games.reduce(
    (previousValue, currentValue) => [
      ...previousValue,
      ['hgetall', `game:${currentValue}`],
    ],
    []
  )
  return redis.multi(pipeline).exec().then(results => {
    let i = 0
    return results.reduce((previousValue, currentValue, currentIndex) => {
        const game = currentValue[1]
        try {
          const [players, boards, turns] = JSON.parse(game.state)
          previousValue[i++] = {
            id: currentValue[1].id,
            players,
            boards,
            turns
          }
        } catch(e) {
          console.error(e)
        }
        return previousValue
      }, []
    )
  })
}