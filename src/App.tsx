import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Puzzles, { getPuzzles } from "./Puzzles";
import Puzzle from "./Puzzle";
import "./App.css";
import useSessionState from "./useSessionState";
import _, { isArray } from "lodash";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {FiCopy, FiRefreshCw, FiShuffle, FiDelete} from "react-icons/fi";

type Order = "found" | "alpha" | "length";
const ORDERS: Order[] = ["found", "alpha", "length"];

type Progress = "overall" | "length" | "distance";
const PROGRESS: Progress[] = ["overall", "length", "distance"];

function App() {
  const [puzzles, setPuzzles] = React.useState<Puzzles>({});
  const [puzzle, setPuzzle] = useSessionState<Puzzle | undefined>("puzzle", undefined);
  const [board, setBoard] = useSessionState<string[]>("board", []);
  const [rack, setRack] = useSessionState<string[]>("rack", []);
  const [shuffle, setShuffle] = React.useState(0);
  const [words, setWords] = useSessionState<string[]>("words", []);
  const [order, setOrder] = useSessionState<Order>("order", "found");
  const [progressView, setProgressView] = useSessionState<Progress>("progressView", "overall");

  const getPuzzlesOnce = React.useRef({ done: false });

  function onKeyPress(event: KeyboardEvent) {
    const { key, code } = event;
    console.log(event);
    switch (code) {
      case "Escape":
        setRack([]);
        break;

      case "Delete":
      case "Backspace":
        backspace();
        break;

      case "Return":
      case "Enter":
        submit();
        break;

      case "Space":
        shuffleBoard();
        break;

      // case "Space":
      //   shuffleBoard();
      //   break;
      
      default:
        play(key);
        break;
    }
  }
  
  function backspace() {
    const newRack = [...rack];
    newRack.pop();
    setRack(newRack);
  }
  
  function ditto() {
    const newRack = [..._.last(words)!];
    setRack(newRack);
  }

  React.useEffect(() => {
    const handler = { handleEvent: onKeyPress };
    window.addEventListener("keyup", handler);
    return window.removeEventListener.bind(window, "keyup", handler);
  })

  if (!getPuzzlesOnce.current.done) {
    getPuzzlesOnce.current.done = true;
    getPuzzles().then(setPuzzles);
  }

  function shuffleBoard() {
    if (!puzzle) {
      setBoard([]);
      return;
    }
    const result: string[] = [];
    const src = [...puzzle.board];
    while (src.length > 0) {
      const i = Math.floor(Math.random() * src.length);
      const ex = src.splice(i, 1)[0];
      result.push(ex);
      if (result.length === 3) {
        result.push(puzzle.island);
      }
    }
    setBoard(result);
  }

  React.useEffect(shuffleBoard, [puzzle, shuffle]);

  const skipResetOnRestore = React.useRef({ done: false });
  React.useEffect(() => {
    if (!skipResetOnRestore.current.done) {
      skipResetOnRestore.current.done = true;
      return;
    }
    setWords([]);
  }, [puzzle, setWords]);

  const orderedWords = React.useCallback(() => {
    switch (order) {
      case "found":
        return words;
      case "alpha":
        return [...words].sort();
      // case "length":
      //   const groups = Object.entries(_.groupBy([...words].sort(), "length"));
      //   return _.map(groups.sort(), "", 
    }
  }, [words, order]);

  function play(letter: string) {
    if (board.includes(letter)) {
      setRack([...rack, letter]);
      return;
    }
  }
  const submit = () => {
    const word = rack.join("");
    if (words.includes(word)) {
      alert("Already found!");
    } else if (puzzle?.words.includes(word)) {
      setWords([...words, word]);
    } else {
      alert("Not a word!");
    }
    setRack([]);
  }

  let noPlayReason: string | undefined;
  if (!puzzle) {
    noPlayReason = "No Puzzle";
  } else {
    if (rack.length < 4) {
      noPlayReason = "Too Short";
    } else if (!rack.includes(puzzle.island)) {
      noPlayReason = `No ${puzzle.island.toUpperCase()}`;
    } else if (words.includes(rack.join(""))) {
      noPlayReason = "Already Played";
    }
  }

  return <Container>
    <Row>
      <DropdownButton title="Choose a Puzzle">
        {Object.entries(puzzles).map(([, group], groupIndex) =>
          group.map((e) => {
            const { board, island, words } = e;
            return <Dropdown.Item
              key={`${groupIndex}.${island}`}
              onSelect={setPuzzle.bind(null, e)}>
              {island.toUpperCase()}+{board.join("").toUpperCase()} ({words.length} words)
          </Dropdown.Item>;
          }))}
      </DropdownButton>
    </Row>
    <Row className="mb-2">
      <Col xs={"auto"} className="flex-fill" />
      <Col xs={"auto"}>
        <Row>
          <span className="rack-letter">&nbsp;</span>
          {rack.map((letter) => <span className="rack-letter">{letter}</span>)}
          <span className="rack-letter">&nbsp;</span>
        </Row>
      </Col>
      <Col xs={"auto"} className="flex-fill" />
    </Row>
    {puzzle && <Row className="mb-2">
      <Col xs={6}>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <ButtonGroup size="sm">
              {PROGRESS.map((progressVal) => <Button key={progressVal} variant={progressView === progressVal ? "primary" : "outline-primary"} onClick={setProgressView.bind(null, progressVal)}>{progressVal}</Button>)}
            </ButtonGroup>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            {progressView === "length" ? <LengthProgress /> : progressView === "overall" ? <OverallProgress /> : <GlobetrotterProgress />}
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
      </Col>
      <Col>
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Board board={board} play={play} />
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <Row className="mb-2 justify-content-center">
              <Button variant="primary" disabled={noPlayReason !== undefined} onClick={submit}>
                {noPlayReason ?? "Play"}
              </Button>
            </Row>
            <Row>
              <Col xs="auto" className="flex-fill">
              <Button variant="light" onClick={setShuffle.bind(null, shuffle + 1)}>
                <FiShuffle title="Shuffle"/>
              </Button>
              </Col>
              <ButtonGroup as={Col} xs="auto">
                <Button variant="light" disabled={rack.length === 0} onClick={setRack.bind(null, [])}>
                  <FiRefreshCw title="Reset"/>
                </Button>
                <Button variant="light" disabled={rack.length === 0} onClick={backspace}>
                  <FiDelete title="Delete"/>
                </Button>
                <Button variant="light" disabled={words.length === 0} onClick={ditto}>
                  <FiCopy title="Ditto"/>
                </Button>
              </ButtonGroup>
              <Col xs="auto" className="flex-fill" style={{opacity:0}}>
              <Button disabled={true}>
                <FiShuffle/>
              </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
      </Col>
      <Col xs={"auto"}>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <ButtonGroup size="sm">
              {ORDERS.map((orderVal) => <Button key={orderVal} variant={order === orderVal ? "primary" : "outline-primary"} onClick={setOrder.bind(null, orderVal)}>{orderVal}</Button>)}
            </ButtonGroup>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        {/* plain score display
         <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"} className="score">
            {score(words)} points
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row> 
        */}
        <Row>
          {orderedWords?.()?.map((word) => {
            let className = globetrotter(word) ? "globetrotter" : undefined;
            if (rack.length > 0) {
              const rackWord = rack.join("");
              if (word.startsWith(rackWord)) {
                if (word === rackWord) {
                  className = "already-played";
                } else {
                  className = "matches-prefix";
                }
              } else {
                className = "does-not-match-prefix";
              }
            }
            return <Col md={1} key={word} className={className}>{word}</Col>;
          })}
        </Row>
      </Col>
    </Row>}
  </Container>;

  function OverallProgress() {
    if (!puzzle) {
      return null;
    }
    const ranks = [
      "Matey",
      "Swabby",
      "Ensign",
      "Coxwain",
      "First Mate",
      "Captain",
      "Commodore",
      "Admiral",
      "Enlightened",
    ];
    const highScore = score(puzzle.words);
    const playerScore = score(words);
    // const basicScore = <>{playerScore} / {highScore}</>;

    let remain = highScore;
    return <>
      {ranks.reverse().map((rank, index) => {
        const to = remain;
        const from = Math.floor(remain * (2 / 3));
        remain = from - 1;
        const playerRank = (from <= playerScore && playerScore <= to);
        const achieved = from < playerScore;
        return <Row className={playerRank ? "rank-current" : achieved ? "rank-past" : "rank-future"}>
          <Col>{from}</Col>
          <Col>{playerRank ? playerScore : ""}</Col>
          <Col>{to}</Col>
          <Col>{rank}</Col>
        </Row>
      })}
      {/* <Row className="score" style={{textAlign: "center"}}>
      {basicScore}
    </Row> */}
    </>;
  }

  function GlobetrotterProgress() {
    return puzzle ? <>{words.filter(globetrotter).length} / {puzzle.words.filter(globetrotter).length}</> : null;
  }

  function LengthProgress() {
    const lengthProgress: Array<{ total: number, found: number, length: number }> = [];
    puzzle?.words.forEach((word) => {
      const length = word.length;
      if (!(length in lengthProgress)) {
        lengthProgress[length] = { total: 0, found: 0, length };
      }
      lengthProgress[length].total += 1;
    });
    words.forEach((word) => {
      const length = word.length;
      lengthProgress[length].found += 1;
    });

    const mostWords = _.max(_.map(lengthProgress, "total")) ?? 0;
    const cols: number[] = [];
    for (let index = 0; index < mostWords; index++) {
      cols[index] = index;
    }

    return <>{lengthProgress.sort().map(({ total, found, length }, index) => <Row key={index}>
      <Col xs={1}>{length}</Col>
      {cols.map((index) => <Col key={index} className={index < found ? "marker-found" : index < total ? "marker-unfound" : "marker-blank"} />)}
    </Row>)}</>;
  }
}

function Board({ board, play }: { board: string[], play: (letter: string) => void }) {
  return <Col xs={"auto"} className="board">
    <Row className="board-row-1">
      <Cell type="sea" letter={board[0]} play={play} />
      <Cell type="sea" letter={board[1]} play={play} />
      <Cell type="sea" letter={board[2]} play={play} />
    </Row>
    <Row className="board-row-2">
      <Col className="sea">
      </Col>
      <Cell type="island" letter={board[3]} play={play} />
      <Col className="sea">
      </Col>
    </Row>
    <Row className="board-row-3">
      <Cell type="sea" letter={board[4]} play={play} />
      <Cell type="sea" letter={board[5]} play={play} />
      <Cell type="sea" letter={board[6]} play={play} />
    </Row>
  </Col>;
}

function Cell({ type, play, letter }: { type: "sea" | "island", play(letter: string): void, letter: string }) {
  return <Col className={type} key={letter} onClick={play.bind(null, letter)} onKeyUp={console.log}>
    {letter}
  </Col>;

}

function score(words: string | string[]): number {
  if (isArray(words)) {
    return _.sumBy(words, score);
  }
  if (words.length <= 4) {
    return 1;
  }
  return words.length - 3 + (globetrotter(words) ? 7 : 0);
}

function globetrotter(words: string) {
  const letters = _.uniq(words);
  return letters.length === 7;
}

export default App;

