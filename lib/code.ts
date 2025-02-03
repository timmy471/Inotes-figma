/// <reference types="@figma/plugin-typings" />

import moment from "moment";

// Get current user and format the date
const currentUser = figma.currentUser;
const formattedDate = moment().format("ddd, D MMM YYYY");

// Retrieve saved note from Figma's shared plugin data
const savedNote = figma.root.getSharedPluginData("notePlugin", "documentNote");

// Load the plugin UI
figma.showUI(__html__, {
  width: 280,
  height: 200,
  // themeColors: true,
});

// Send the saved note to the UI
figma.ui.postMessage({
  type: "load-note",
  payload: savedNote
    ? JSON.parse(savedNote)
    : { title: "", body: "", user: currentUser },
});

// Listen for messages from the UI
figma.ui.onmessage = (message) => {
  const { type, payload } = message;
  // const newPayload = payload.userName
  //   ? payload
  //   : { ...payload, userName: currentUser };

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

// Send user info to the UI
figma.ui.postMessage({
  type: "set-user-info",
  payload: currentUser ? currentUser.name : "N/A",
});
