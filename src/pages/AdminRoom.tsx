import Logo from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import "../styles/room.scss";
import { useHistory, useParams } from "react-router-dom";
import { Question } from "../components/Question";
import "../styles/question.scss";
import { useRoom } from "../hooks/useRoom";
import deleteImg from '../assets/images/delete.svg';
import { database } from "../services/firebase";
import check from '../assets/images/check.svg';
import answer from '../assets/images/answer.svg';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const history = useHistory();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    } 
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });

  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }


  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={Logo} alt="letmeask" />
          <div>
          <RoomCode code={roomId} />
          <Button onClick={handleEndRoom} isOutlined>Encerra sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
              {!question.isAnswered && (
                <>
                  <button type='button' onClick={() => handleHighlightQuestion(question.id)}>
                  <img src={check} alt='Marcar pergunta como respondida' />
                </button>

                <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                  <img src={answer} alt='Dar destaque a pergunta' />
                </button>
                </>
              ) }

                <button type='button' onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt='remover pergunta' />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
