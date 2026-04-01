// // Zorg voor dynamische database URL via VITE_DATABASE_URL
// const dbUrl = import.meta.env.VITE_DATABASE_URL;

// export async function createAppointment({ date, time_of_day, notes, created_by_name }) {
//   const response = await fetch(dbUrl, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       action: 'create',
//       date,
//       time_of_day,
//       notes,
//       created_by_name,
//     }),
//   });
//   return response.json();
// }

// export async function deleteAppointment(id) {
//   const response = await fetch(dbUrl, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       action: 'delete',
//       id,
//     }),
//   });
//   return response.json();
// }
