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
