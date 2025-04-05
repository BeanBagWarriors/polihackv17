#include <WiFi.h>
#include <HTTPClient.h>

// Replace with your WiFi credentials
const char* ssid     = "cloudflight-guest";
const char* password = "digitalfuture";

// Replace with your server endpoint
const char* serverUrl = "https://webhook.site/ccdf3171-44c8-4d15-b47a-c4cae9ce6444";

struct Button {
  int pin;
  bool lastState;
};

Button  buttons[] = {
  {27,HIGH},
  {26,HIGH},
  {25,HIGH}
};

const int buttonCount = sizeof(buttons)/sizeof(buttons[0]);

void setup() {
  Serial.begin(115200);

  for (int i = 0; i < buttonCount; i++) {
    pinMode(buttons[i].pin, INPUT_PULLUP);
  }

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
}

void loop() {
  for (int i = 0; i < buttonCount; i++) {
    bool currentState = digitalRead(buttons[i].pin);
    
    // Detect button press (active LOW)
    if (buttons[i].lastState == HIGH && currentState == LOW) {
      Serial.printf("Button %d pressed!\n", i);
      sendHttpRequest(i);
    }

    buttons[i].lastState = currentState;
  }
  delay(50); // Debounce delay
}

void sendHttpRequest(int buttonId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Example payload (customize as needed)
    String payload = "{\"event\":\"button_press\",\"button_id\":\"" + String(buttonId) + "\"}";

    int httpResponseCode = http.POST(payload);
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }
}