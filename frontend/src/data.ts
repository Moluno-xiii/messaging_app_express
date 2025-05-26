import type { ChatTypes, Message } from "./types";

const chats: ChatTypes[] = [
  {
    userImage: "/profile-pic.jpeg",
    message: "Have you seen my keys?",
    numberOfUnreadMessages: 1,
    time: "08:16 AM",
    name: "Dad",
    id: "1",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "My Facebook is down again, please fix it.",
    numberOfUnreadMessages: 3,
    time: "9:46 PM",
    name: "Mom",
    id: "2",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "When i grow up, you know what i wanna be?",
    numberOfUnreadMessages: 1,
    time: "10:27 AM",
    name: "NF",
    id: "3",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "I think my dad's gone crazy.",
    numberOfUnreadMessages: 1,
    time: "11:22 PM",
    name: "Hailey Jade",
    id: "4",
  },

  {
    userImage: "/profile-pic.jpeg",
    message: "I got ninety nine problems, but a b**ch ain't one!",
    numberOfUnreadMessages: 2,
    time: "4:44 AM",
    name: "Jay Z",
    id: "5",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "Dear, Slim, i wrote you but you still ain't calling",
    numberOfUnreadMessages: 1,
    time: "00:00 AM",
    name: "Stan",
    id: "6",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "I need a Doctor.",
    numberOfUnreadMessages: 1,
    time: "08:45 PM",
    name: "Dr Dre",
    id: "7",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "Where did you keep my airpods??!!",
    numberOfUnreadMessages: 6,
    time: "12:24 pM",
    name: "Big brother",
    id: "8",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "Where are you going to?",
    numberOfUnreadMessages: 1,
    time: "10:27 pM",
    name: "Arthur Fleck",
    id: "9",
  },
  {
    userImage: "/profile-pic.jpeg",
    message: "Say you won't let go.",
    numberOfUnreadMessages: 4,
    time: "09:35 AM",
    name: "James Arthur",
    id: "10",
  },
  {
    userImage: "/profile-pic.jpeg",
    message:
      "      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta accusantium maxime molestiae obcaecati nisi est accusamus eligendi nulla necessitatibus sint nemo minima voluptates sit repellendus, alias porro officiis illum architecto debitis eveniet doloremque saepe fugit tempora. Vero, dolores cum corrupti ipsa itaque dolorum quia at earum. Quasi numquam ex nostrum qui harum possimus vel, aspernatur sed repellendus aliquam consequuntur dolor mollitia officiis voluptate. Nulla rerum explicabo temporibus nam non sunt enim, molestiae commodi est rem distinctio odio nobis ut optio ex cupiditate error veniam itaque repellat expedita labore eius dolorum. Repellendus atque modi, cumque voluptates id doloremque adipisci cupiditate amet.",
    numberOfUnreadMessages: 4,
    time: "09:35 AM",
    name: "lorem",
    id: "11",
  },
  {
    userImage: "/profile-pic.jpeg",
    message:
      "You better lose yourself in the music, the moment, you own it, you better never let it go.",
    numberOfUnreadMessages: 0,
    time: "05:00 AM",
    name: "Eminem",
    id: "12",
  },
];

const messages: Message[] = [
  {
    senderId: "myId",
    body: "Have you gone to the market?",
    timeSent: "5:12 PM",
    id: "1",
  },
  {
    senderId: "notMine",
    body: "How are you doing?",
    timeSent: "5:18 PM",
    id: "2",
  },
  {
    senderId: "myId",
    body: "I'm alright, how have you been?   Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum reiciendis cumque consequatur, sed placeat repellendus dignissimos distinctio libero natus! Vero, voluptatem? Debitis aliquam voluptatibus corrupti voluptas magnam reprehenderit veritatis eaque eos nesciunt sapiente? ",
    timeSent: "5:22 PM",
    id: "3",
  },
  {
    senderId: "notmyId",
    body: "  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum reiciendis cumque consequatur, sed placeat repellendus dignissimos distinctio libero natus! Vero, voluptatem? Debitis aliquam voluptatibus corrupti voluptas magnam reprehenderit veritatis eaque eos nesciunt sapiente?",
    timeSent: "5:28 PM",
    id: "4",
  },
];

export { chats, messages };
