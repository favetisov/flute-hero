export const classNames = (...classes) => {
  return classes.reduce((res, c) => {
    if (typeof c == "string") {
      res += " " + c + " ";
    }
    return res;
  }, "");
};
