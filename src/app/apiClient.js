// apiClient.js
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, dataArray, method = "POST") {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataArray),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en apiRequest:", error);
    throw error;
  }
}

export function test(data) {
  console.log("Datos recibidos en test:", data);
  // Aquí puedes agregar lógica adicional para manejar los datos o realizar otras acciones
}