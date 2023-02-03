import { useState } from "react";

const useLogic = () => {
  const filterArray = (arr) => {
    const newArr = arr.filter((val, idx) => {
      return idx === arr.findIndex((v) => val === v);
    });
    return newArr;
  };
  return {
    filterArray: filterArray,
  };
};

export default useLogic;
