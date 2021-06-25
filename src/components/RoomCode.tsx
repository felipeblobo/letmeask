import copy from "../assets/images/copy.svg";
import '../styles/roomcode.scss';

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
  }


  return (
    <button className="room-code">
      <div>
        <img src={copy} alt="copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
