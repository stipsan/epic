
const Scoreboard = ({
  players
}) => {
  const list = players[0].score >= players[1].score ? players : [players[1], players[0]]
  return (
    <div className="tm-scoreboard">
      <ul className="uk-list uk-list-line uk-margin-bottom-remove">
        {list.map((player, i) => (
          <li key={player.id}>
            <span className="tm-scoreboard-position">
              {!i ? <span><strong>1</strong><sup>st</sup></span> : <span><strong>2</strong><sup>nd</sup></span>}
            </span>
            <span className="tm-scoreboard-username">{player.username}</span>
            <span className="tm-scoreboard-score">{Math.floor((player.score / 21) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Scoreboard
