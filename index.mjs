import axios from 'axios';

export const handler = async (event) => {
  try {
    let body = event.body;
    if (body && typeof body === 'string') {
      body = JSON.parse(body); // Parsen des Körpers, wenn er ein String ist
    }

    // Extrahiere die relevanten Felder aus dem Body
    const { event_name, user_data, event_id, pixel_id, access_token } = body;

    if (!pixel_id || !access_token) {
      throw new Error('Pixel ID or Access Token is missing from the request body.');
    }

    // Facebook API URL
    const FACEBOOK_API_URL = `https://graph.facebook.com/v21.0/${pixel_id}/events?access_token=${access_token}`;

    // Daten, die an Facebook gesendet werden sollen
    const facebookData = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000), // Zeitstempel in Sekunden
          user_data,
          event_id, // Optional, falls es verwendet werden soll
        },
      ],
    };

    // Sende die Anfrage an Facebook
    const facebookResponse = await axios.post(FACEBOOK_API_URL, facebookData);
    console.log('Facebook Response:', facebookResponse.data);

    // Erfolgreiche Antwort
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event processed and sent to Facebook successfully!',
        facebookResponse: facebookResponse.data,
      }),
    };
  } catch (error) {
    console.error('Error processing event or sending to Facebook:', error);
  
    // Logge die komplette Antwort, falls Axios sie enthält
    if (error.response) {
      console.error('Facebook API Response:', error.response.data);
    }
  
    // Fehlerhafte Antwort
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.response ? error.response.data : error.message,
      }),
    };
  }
};
