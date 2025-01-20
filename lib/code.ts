/// <reference types="@figma/plugin-typings" />

import moment from "moment";

// Get current user and format the date
const currentUser = figma.currentUser;
const formattedDate = moment().format("ddd, D MMM YYYY");

// Retrieve saved note from Figma's shared plugin data
const savedNote = figma.root.getSharedPluginData(
  "notePlugin", // The plugin namespace
  "documentNote", // The key for storing the note
);

const parsedSavedNote = JSON.parse(savedNote);

// Load the plugin UI
figma.showUI(__html__, {
  width: 350,
  height: 300,
  title: formattedDate,
  // themeColors: true,
});

// Send the saved note to the UI
figma.ui.postMessage({
  type: "load-note",
  body: savedNote ? parsedSavedNote : { title: "", note: "" },
});

// Listen for messages from the UI
figma.ui.onmessage = (message) => {
  const { type, payload } = message;
  const newPayload = { ...payload, userName: payload.userName || currentUser };

  if (type === "save-note") {
    figma.root.setSharedPluginData(
      "notePlugin",
      "documentNote",
      JSON.stringify(newPayload),
    );
  }

  if (type === "close-plugin") {
    figma.closePlugin();
  }
};

// Send user info to the UI
figma.ui.postMessage({
  type: "set-user-info",
  body: parsedSavedNote?.userName
    ? parsedSavedNote?.userName
    : currentUser
      ? currentUser.name
      : "N/A",
});
