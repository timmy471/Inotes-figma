/// <reference types="@figma/plugin-typings" />
import { formatDate } from '../src/helpers'

// Get current user and format the date
const currentUser = figma.currentUser;

// Retrieve saved note from Figma's shared plugin data
const savedNote = figma.root.getSharedPluginData("notePlugin", "documentNote");
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
