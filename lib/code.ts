import moment from "moment";

const formattedDate = moment().format("ddd, D MMM YYYY");

figma.showUI(__html__, {
  width: 350,
  height: 300,
  title: formattedDate,
  // themeColors: true,
});

figma.ui.onmessage = () => {
  figma.closePlugin();
};

const currentUser = figma.currentUser;

if (currentUser) {
  figma.ui.postMessage({
    type: "set-user-info",
    userName: currentUser.name,
    userHandle: currentUser.handle,
  });
} else {
  figma.ui.postMessage({
    type: "set-user-info",
    userName: "Unknown User",
    userHandle: "N/A",
  });
}
