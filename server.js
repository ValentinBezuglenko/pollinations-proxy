bool sendPart(String part, String &response) {
  WiFiClientSecure client;
  client.setInsecure(); // отключаем проверку сертификата
  // client.setBufferSizes(1024, 1024); // <- убрали, потому что нет в вашей версии

  HTTPClient https;

  if (https.begin(client, proxyURL)) {
    https.addHeader("Content-Type", "text/plain; charset=utf-8");
    int httpCode = https.POST(part);

    if (httpCode > 0) {
      response = https.getString();
      https.end();
      return true;
    } else {
      Serial.print("Ошибка HTTP запроса: ");
      Serial.println(httpCode);
    }

    https.end();
  } else {
    Serial.println("Ошибка подключения к серверу");
  }

  return false;
}
