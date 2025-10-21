const generateRoomId = (): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const segmentLength = 3;
  const segments = 3;

  let roomId = "";
  for (let i = 0; i < segments; i++) {
    let segment = "";
    for (let j = 0; j < segmentLength; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      segment += characters[randomIndex];
    }
    roomId += segment + (i < segments - 1 ? "-" : "");
  }

  return roomId;
};

export default generateRoomId;
