// apiClient.js
export async function apiRequest(endpoint, dataArray, method = "POST") {
  try {
    const response = await fetch(`http://localhost:3100/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: dataArray }),
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
