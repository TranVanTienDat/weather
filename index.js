const API_WEATHER = "http://api.weatherapi.com/v1";
const KEY = "7a19f77b214041f8a29123748233007";

const fetchData = async (name) => {
  try {
    const responsive = await axios.get(
      `${API_WEATHER}/forecast.json?key=${KEY}&q=${name}&days=1&aqi=no&alerts=no`
    );
    console.log(responsive.data);
    return responsive.data;
  } catch (error) {
    console.log(error);
  }
};
//

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// className
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
//  handle logic

// Handle get days
const handleDate = () => {
  const date = new Date();

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
    return `<div class="elemet__item" data-index=${index}>
      <span class="item__temperature">${item.temp_c}</span>
      <img class="item__img" src="${item.condition.icon}"/>
      <span class="item__time">${item.time.slice(-5)}</span>
    </div>`;
  });
  return htmls;
};

SearchLocation.addEventListener("click", async function () {
  try {
    const valueSearch = valueInput.value;
    valueInput.value = "";
    const value = valueSearch === "" ? "hanoi" : valueSearch;
    const result = await fetchData(value);
    const current = result.current;
    const forecast = result.forecast.forecastday[0].hour;
    locationName.innerHTML = result.location.name;
    infoTemperature.innerHTML = current.temp_c;
    infoType.innerHTML = current.condition.text;
    image.setAttribute("src", current.condition.icon);
    infoOther[0].innerHTML = `${current.cloud}%`;
    infoOther[1].innerHTML = current.feelslike_c;
    infoOther[2].innerHTML = `${current.wind_mph}mph`;

    //  today
    const date = handleDate();
    day.innerHTML = date[0];
    month.innerHTML = `${date[1]}, ${date[2]}`;

    const html = handleMapHour(forecast);
    console.log(html);
    innerHour.innerHTML = html.join("");
  } catch (error) {
    console.log(error);
  }
});
