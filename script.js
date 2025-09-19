function getTimeInZone(offset) {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (offset * 3600000));
}

function setClock(zonePrefix, date) {
  const hour = date.getHours() % 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const hourAngle = (hour + minute / 60) * 30; // 360/12
  const minuteAngle = (minute + second / 60) * 6; // 360/60
  const secondAngle = second * 6;
  document.getElementById(zonePrefix + '-hour').style.transform = `rotate(${hourAngle}deg)`;
  document.getElementById(zonePrefix + '-minute').style.transform = `rotate(${minuteAngle}deg)`;
  document.getElementById(zonePrefix + '-second').style.transform = `rotate(${secondAngle}deg)`;
}

function format12Hour(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return (
    hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0') + ' ' + ampm
  );
}

function formatDateDMY(date) {
  const day = date.getDate();
  const suffix = (d => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  })(day);
  const monthAbbrev = date.toLocaleString('en-US', { month: 'short' });
  return `${monthAbbrev} ${day}${suffix}`;
}

function getDayLabel(zoneDate, localDate) {
  const zoneDay = zoneDate.getDate();
  const zoneMonth = zoneDate.getMonth();
  const zoneYear = zoneDate.getFullYear();
  const localDay = localDate.getDate();
  const localMonth = localDate.getMonth();
  const localYear = localDate.getFullYear();
  if (zoneDay === localDay && zoneMonth === localMonth && zoneYear === localYear) {
    return '(Today)';
  } else if (
    zoneYear === localYear && zoneMonth === localMonth && zoneDay === localDay - 1
  ) {
    return '(Yesterday)';
  } else {
    return '';
  }
}

// Add hour numbers 1–12 to each clock face
function addHourNumbers() {
  const faces = document.querySelectorAll('.clock-face');
  faces.forEach(face => {
    // Remove existing numbers if refreshing
    face.querySelectorAll('.number').forEach(num => num.remove());

    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180; // start from top
      const x = 50 + 40 * Math.cos(angle);
      const y = 50 + 40 * Math.sin(angle);
      const number = document.createElement('div');
      number.className = 'number';
      number.textContent = i;
      number.style.left = `${x}%`;
      number.style.top = `${y}%`;
      face.appendChild(number);
    }
  });
}

function updateClocks() {
  const now = new Date();

  // IST
  let ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  document.getElementById('ist-date').textContent = formatDateDMY(ist);
  document.getElementById('ist-time').textContent = format12Hour(ist);
  document.querySelector('.timezone .utc-label').innerHTML = 'UTC+5:30 ' + getDayLabel(ist, now);

  // EST
  let est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  document.getElementById('est-date').textContent = formatDateDMY(est);
  document.getElementById('est-time').textContent = format12Hour(est);
  document.querySelectorAll('.timezone .utc-label')[1].innerHTML = 'UTC-5:00 ' + getDayLabel(est, now);

  // MDT
  let mdt = new Date(now.toLocaleString("en-US", { timeZone: "America/Denver" }));
  document.getElementById('mdt-date').textContent = formatDateDMY(mdt);
  document.getElementById('mdt-time').textContent = format12Hour(mdt);
  document.querySelectorAll('.timezone .utc-label')[2].innerHTML = 'UTC-6:00 ' + getDayLabel(mdt, now);

  // PHT
  let pht = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  document.getElementById('pht-date').textContent = formatDateDMY(pht);
  document.getElementById('pht-time').textContent = format12Hour(pht);
  document.querySelectorAll('.timezone .utc-label')[3].innerHTML = 'UTC+8:00 ' + getDayLabel(pht, now);

  setClock('ist', ist);
  setClock('est', est);
  setClock('mdt', mdt);
  setClock('pht', pht);
}

// Initialize numbers and start clocks
addHourNumbers();
updateClocks();
setInterval(updateClocks, 1000);
