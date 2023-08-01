const API_WEATHER = "http://api.weatherapi.com/v1";
const KEY = "7a19f77b214041f8a29123748233007";

const fetchData = async (name) => {
  try {
    const responsive = await axios.get(
      `${API_WEATHER}/forecast.json?key=${KEY}&q=${name}&days=7&aqi=no&alerts=no`
    );
    return responsive.data;
  } catch (error) {
    console.log(error);
  }
};
//

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// className
const mainInner = $(".main__inner");
const page = $(".page");
const noResult = $(".no-results");
const nameCountry = $(".location__name");
const openSearch = $(".location__icon-right");
const closeSearch = $(".search__close");
const search = $(".search");
const valueInput = $(".search__input");
const locationName = $(".location__name");
const SearchLocation = $(".search__icon");
const infoTemperature = $(".info__temperature");
const infoType = $(".info__type");
const image = $(".img");
const infoOther = $$(".element__text");
const day = $(".day");
const month = $(".month");
const HourTemperature = $(".item__temperature");
const HourImage = $(".item__img");
const hour = $(".item__time");
const innerHour = $(".inner__element");
const elementItem = $(".elemet__item");
const min = $(".min");
const max = $(".max");
const inner = $(".inner");
// next days
const weatherNextDay = $(".weather__day");
const innerContent = $(".inner__content");

//  handle logic
// Handle get days and months
const handleDate = (arg) => {
  const date = arg ? new Date(arg) : new Date();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsAbbreviation = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return [
    daysOfWeek[date.getDay()],
    monthsAbbreviation[date.getMonth()],
    date.getDate(),
  ];
};

const handleMapHour = (id) => {
  const htmls = id.map((item, index) => {
    const hour = item.time.slice(-5);
    return `<div class="elemet__item ${
      hour === getCurrentHour() ? "active" : null
    }" data-index=${index}>
      <span class="item__temperature">${item.temp_c}</span>
      <img class="item__img" src="${item.condition.icon}"/>
      <span class="item__time">${hour}</span>
    </div>`;
  });
  return htmls;
};

// handle  get current hour
const getCurrentHour = () => {
  const date = new Date();
  const hour = date.getHours();
  const check = 4 < hour && hour < 19;
  if (!check) {
    inner.classList.remove("app__background1");
    inner.classList.add("app__background2");
  }
  const log = hour < 10 ? `0${hour}:00` : `${hour}:00`;
  return log;
};

// handle next day
const handleNextDay = (id) => {
  let html = "";
  for (let i = 1; i < 7; i++) {
    const forecastNextDay = id.forecastday[i]; // lấy dữ liệu
    const info = forecastNextDay.day;
    // console.log(info);
    const date = handleDate(forecastNextDay.date); // chuyển đổi thời gian
    html += `<div class="content">
      <div class="content__weather">
        <span class="weather__day">${date[0]}</span>
        <img
          class="weather__status"
          src="${info.condition.icon}"
        />
        <span class="weather__min-max">
          <span>${info.mintemp_c}</span>
          <span>${info.maxtemp_c}</span>
        </span>
      </div>
    </div>`;
  }
  innerContent.innerHTML = html;
};

// handle search
SearchLocation.addEventListener("click", async function () {
  try {
    const valueSearch = valueInput.value;
    valueInput.value = "";
    const result = await fetchData(valueSearch);
    //  info weather to day
    const current = result.current;
    const forecast = result.forecast.forecastday[0];
    locationName.innerHTML = result.location.name; // địa điểm
    infoTemperature.innerHTML = current.temp_c; // nhiệt độ hiện tại
    infoType.innerHTML = forecast.day.condition.text; //  miêu tả trạng thái thời tiết
    image.setAttribute("src", forecast.day.condition.icon); // hình ảnh minh họa thời tiết
    infoOther[0].innerHTML = `${forecast.day.daily_chance_of_rain}%`; // khả năng mưa
    infoOther[1].innerHTML = forecast.day.avgtemp_c; // nhiệt độ trung bình
    infoOther[2].innerHTML = `${forecast.day.maxwind_mph}mph`; // tốc độ gió tối đa
    min.innerHTML = `Min: ${forecast.day.mintemp_c}`; // nhiệt độ cao nhất
    max.innerHTML = `Max: ${forecast.day.maxtemp_c}`; //  nhiệt độ thấp nhất

    const date = handleDate(); // lấy ra thời gian từ handleDate() (array)
    day.innerHTML = date[0];
    month.innerHTML = `${date[1]}, ${date[2]}`;
    const html = handleMapHour(forecast.hour);
    innerHour.innerHTML = html.join("");

    //  next days
    handleNextDay(result.forecast);

    noResult.classList.remove("block");
    mainInner.classList.remove("none");
    noResult.classList.add("none");
    mainInner.classList.add("block");
    page.classList.add("none");
  } catch (error) {
    console.log(error);
    page.classList.remove("block");
    noResult.classList.remove("none");
    page.classList.add("none");
    noResult.classList.add("block");
  }
});
