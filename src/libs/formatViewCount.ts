// view_countのフォーマット関数
const formatViewCount = (views: number) => {
  if (views >= 1000000) {
    const formattedViews = (views / 1000000).toFixed(1) + "M";
    return formattedViews;
  } else if (views >= 1000) {
    const formattedViews = (views / 1000).toFixed(1) + "K";
    return formattedViews;
  } else {
    return views.toString();
  }
};
export default formatViewCount;
