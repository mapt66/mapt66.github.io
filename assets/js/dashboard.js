async function fetchDataAndUpdate() {
  try {
    const res = await fetch('https://wunderground-api-extremes-nep6xe7po-marcos-projects-5c8f93fe.vercel.app/data/current');
    const data = await res.json();

    const tempText = document.getElementById('temp-value');
    const rainText = document.getElementById('rain-value');
    const humidityText = document.getElementById('humidity-value');
    const windText = document.getElementById('wind-value');

    const updateTimeDiv = document.getElementById('update-time');

    if (tempText && data.temp !== undefined) {
      tempText.textContent = data.temp + ' °C'
      humidityText.textContent = data.humidity + ' %'
      rainText.textContent = data.precipTotal + ' mm'
      windText.textContent = data.windSpeed + ' km/h'

      updateTimeDiv.textContent = 'Última atualização : ' + new Date().toTimeString().split(' ')[0]
    }
  } catch (err) {
    console.error('Erro a buscar dados:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDataAndUpdate();
  setInterval(fetchDataAndUpdate, 0.5 * 60 * 1000);
});
