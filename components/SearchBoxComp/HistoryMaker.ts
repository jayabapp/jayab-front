import moment from "moment-jalaali";

const HistoryMaker = (search: string) => {
  const localHistory = localStorage?.getItem("search_history");
  const history = localHistory ? JSON.parse(localHistory || "[]") : [];
  if (search !== "") {
    if (
      history?.length == 0 ||
      (history?.length > 0 && history?.findIndex((e: { title: string }) => e?.title == search) == -1)
    ) {
      const newArray = [...history, { title: search, id: moment().format("x") }];
      if (newArray?.length > 5) {
        newArray?.shift();
      }

      localStorage.setItem("search_history", JSON.stringify(newArray));
    }
  }
};

export default HistoryMaker;
