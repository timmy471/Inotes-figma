/// <reference types="@figma/plugin-typings" />


// Get current user and format the date
const currentUser = figma.currentUser;


// Retrieve saved note from Figma's shared plugin data
const savedNote = figma.root.getSharedPluginData("notePlugin", "documentNote");
// const savedNoteToObj = JSON.parse(savedNote);
// if (!savedNoteToObj.user) {
//   figma.root.setSharedPluginData("notePlugin", "documentNote", "");
// }

const formatDate = (date: Date) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${day} ${month} ${year}, ${hours}:${minutes}${ampm}`;
};

const formattedDate = formatDate(new Date());

// Load the plugin UI
figma.showUI(__html__, {
  width: 300,
  height: 250,
  themeColors: true,
});

// Send the saved note to the UI
figma.ui.postMessage({
  type: "load-note",
  payload: savedNote
    ? JSON.parse(savedNote)
    : {
      title: "",
      body: "",
      createdAt: formattedDate,
      user: { name: currentUser!.name, photoUrl: currentUser!.photoUrl },
    },
});
// Listen for messages from the UI
figma.ui.onmessage = (message) => {
  const { type, payload } = message;

  if (type === "save-note") {
    figma.root.setSharedPluginData(
      "notePlugin",
      "documentNote",
      JSON.stringify(payload),
    );
  }

  if (type === "close-plugin") {
    figma.closePlugin();
  }
};
